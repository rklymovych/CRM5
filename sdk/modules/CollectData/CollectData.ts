// Third-party modules
import {Subscription} from 'rxjs';

// Internal modules
import {Player} from '../../Player';

// Internal models
import {SDKResponse} from '../../models/SDKResponse';

// Internal services
import {EventsService, SDKEvent} from '../../shared/events.service';
import {BowserService} from '../../shared/bowser-service';
import StorageSvc from './../../shared/storage.service';
import Api from "../../shared/api.service";
import {ICollectData} from '../../models/collectData';
import {ParticipantService} from "../../shared/participant.service";
import {container} from "../../Bootstrap";
import TYPES from "../../constant/types";
import {Participant} from "../../models/participantsData";

type CollectDataResult = ICollectData | null;
type CollectDataStopFunction = (stopTime: Date, handler: (result: CollectDataResult) => void, forceStopList?: Participant[]) => void


/**
 * Collects the click-stream metrics
 * The collector is updated on every slide change
 * The data is collected for every attendee on the call OR for the host if nobody else is present
 * The algorithm:
 * 1. On presentation load - start tracker
 * 2. On slide change - collect data and push it into {_collectedData} array
 * 3. If attendee joins the call - start a separate tracker
 * 4. If attendee leaves the call - force stop the tracker for them and remove from the attendee list who are in tracker
 */
export class CollectData {

    /*
     * Dependencies
     * */
    private _participantService: ParticipantService;

    private _subscriptions: Subscription[] = [];
    private _isTrackingEnabled: boolean;
    private _collectedData: ICollectData[] = [];
    private _loadedSlideData: any;
    private _timers: {[id: string]: CollectDataStopFunction} = {};

    constructor(
        private _eventService: EventsService,
        private _bowserService: BowserService,
        private _player: Player
    ) {
        this._clearSubscriptions();
        this._participantService = container.get<ParticipantService>(TYPES.ParticipantService);
        this._subscriptions.push(
            this._eventService.actionRequestsReplay.subscribe((action: SDKResponse) => {
                switch (action.event) {
                    case SDKEvent.exitNotification:
                        break;
                    case SDKEvent.PresentationLoadSlide:
                        this._loadedSlideData = action.data;
                        if (this._isTrackingEnabled || StorageSvc.isViewerData()) {
                            this._stopTracking();
                            this._startTracking();
                        } else {
                            StorageSvc.isDev && console.log('clickStream tracking is disable');
                        }
                        break;
                    case SDKEvent.PresentationLoaded:
                        break;
                    case SDKEvent.PresentationTracking:
                        this._isTrackingEnabled = action.data;
                        if (!this._isTrackingEnabled) {
                            this._stopTracking();
                        } else {
                            this._startTracking();
                        }
                        break;
                    case SDKEvent.ParticipantsUpdated:
                        const {left, joined} = action.data as {left: Participant[], joined: Participant[]};

                        // stop tracking time for the attendees who left the call
                        this._stopAttendeeMetric(left);

                        // start collecting data for the attendee who joined the call
                        if (joined.length > 0) {
                            joined.forEach(p => {
                                this._timers[p.sid] = this._collectData(this._loadedSlideData, p);
                            });
                        }
                        break;
                }
            })
        );
    }

    private static _collectDataResult({data, startTime, stopTime, participant}: { data: any, startTime: Date, stopTime: Date, participant?: Participant }): CollectDataResult {
        const duration = CollectData._getDuration(startTime, stopTime);
        if (StorageSvc.isViewerData()) {
            return CollectData._selfDetailingMetricTemplate({data, duration, startTime, stopTime});
        }
        if (duration < 3) { return null; }

        // collect data only for the call host
        if (!participant) {
            return CollectData._metricTemplate({data, duration, startTime, stopTime}, null);
        }
        return CollectData._metricTemplate({data, duration, startTime, stopTime}, participant);
    }

    public sendCollectViewerData() {
        if (StorageSvc.isViewerData() && this._collectedData[0]) {
            Api.sendToParent({request: 'create', player: true, 'params': this._collectedData[0]});
        }
    }

    /**
     * Creates a starting point of click-metric data
     * Returns the method to stop data collection
     *
     * @param {Object} data - call info such as callId, slideInfo etc.
     * @param {Participant} participant - the attendee who is present on the call
     *
     * Returned function accepts:
     * 1. The end point in time that indicates the moment when data collection is stopped
     * 2. Handler method that is being called with collected data
     */
    private _collectData(data: any, participant?: Participant): CollectDataStopFunction {
        const startTime = new Date();

        return (stopTime: Date, handler: (result: CollectDataResult) => void) => {
            const result = CollectData._collectDataResult({
                data,
                startTime,
                stopTime,
                participant
            });

            if (handler && typeof handler === 'function') {
                handler(result);
            } else {
                throw new Error('No data collect handler provided');
            }
        }
    }

    private _saveDataSet(result: CollectDataResult): void {
        if (StorageSvc.isViewerData()) {
            this._collectedData[0] = result;
        } else if (result) {
            this._collectedData.push(result);
        }
    }

    private _startTracking(): void {
        if (!this._loadedSlideData) return;
        this._timers.host = this._collectData(this._loadedSlideData);
        if (this._participantService.participantList && this._participantService.participantList.length > 0) {
            this._participantService.participantList.forEach(p => {
                this._timers[p.sid] = this._collectData(this._loadedSlideData, p);
            });
        }
    }

    private _stopTracking(): void {
        if (this._timers) {
            for(const timer of Object.values(this._timers)) {
                timer(new Date(), this._saveDataSet.bind(this));
            }
            StorageSvc.setClickStreamData(this._collectedData);
            StorageSvc.isDev && console.table(this._collectedData);
            this._timers = {};
            this.sendCollectViewerData();
        }
    }

    private _stopAttendeeMetric(participants: Participant[]): void {
        if (participants && participants.length > 0) {
            participants.forEach(p => {
                this._timers[p.sid] && this._timers[p.sid].call(this, new Date, this._saveDataSet.bind(this));
                delete this._timers[p.sid];
            })
        }
    }

    private static _getDuration(startTime: Date, stopTime: Date): number {
        return Math.round((stopTime.getTime() - startTime.getTime()) / 1000);
    }

    private _clearSubscriptions(): void {
        this._subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    }

    private static _metricTemplate(params: any, participant: Participant | null): ICollectData {
        const {data, duration, startTime, stopTime} = params;
        const accountId = participant?.accountId;

        return {
            accountId: participant?.accountId ?? null,
            callId: data.clmData?.call?.id || '',
            deviceType: participant?.device?.type ?? null,
            deviceOS: participant?.device?.os ?? null,
            deviceBrowser: participant?.device?.browser ?? null,
            guestAccountName: !!accountId ? null : participant?.identity,
            presentationId: data.slide.presentationId || '',
            presentationName: data.slide.presentationName || '',
            sequenceId: data.slide.sequenceId || '',
            sequenceName: data.slide.sequenceName || '',
            slide: data.slide.path || '',
            usageDuration: duration.toString(),
            usageStartTime: startTime.toJSON(),
            usageEndTime: stopTime.toJSON(),
            numberOfSlide: data.numberOfSlides
        }
    }

    private static _selfDetailingMetricTemplate(params: any) {
        const {data, duration, startTime, stopTime} = params;

        return {
            callPresentation: {
                Presentation__c: data.slide.presentationId || '',
                Account__c: data.clmData.account?.id || ''
            },
            clickStreamMetrics: [{
                CallPresentation__c: '',
                Slide__c: data.slide.path || '',
                Account__c: data.clmData.account?.id || '',
                Presentation__c: data.slide.presentationId || '',
                Presentationname__c: data.slide.presentationName || '',
                Sequence__c: data.slide.sequenceId || '',
                Sequencename__c: data.slide.sequenceName || '',
                Thumbnailimage__c: '',
                Usagestarttime__c: startTime.toJSON(),
                Usageendtime__c: stopTime.toJSON(),
                Usageduration__c: duration,
                Call__c: '',
                Meeting__c: '',
                Productmessage__c: '',
                Calldetail__c: '',
                Callmessage__c: ''
            }]
        }
    }
}
