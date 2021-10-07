// Third-party modules
import {inject, injectable} from 'inversify';
import {Subject, Subscription} from 'rxjs';

// Internal modules
import {Config} from './config';
import TYPES from './constant/types';
import {EventTypes} from './constant/event-types';
import {BowserService} from './shared/bowser-service';

// Internal models
import {SDKResponse} from './models/SDKResponse';

// Internal services
import {EventsService, SDKEvent} from './shared/events.service';
import {PresentationZip} from './modules/Presentation/PresentationZip';
import {PresentationPdf} from './modules/Presentation/PresentationPdf';
import { Presentation } from './modules/Presentation/Presentation';
import {CollectData} from './modules/CollectData/CollectData';
import StorageSvc from './shared/storage.service';

@injectable()
export class Player {

    /**
     * Data members
     */
    public eventObservable: Subject<any> = new Subject<any>();
    private subscriptions: Subscription[] = [];
    private _html_container_id: string = Config.html_container;
    private _presentationZip: PresentationZip;
    private _presentationPdf: PresentationPdf;
    private _presentation: Presentation;
    public collectData: CollectData;
    public StorageSvc = StorageSvc;
    public _version = '0.6.12';
    public get htmlContainerId():string {
        return this._html_container_id
    };

    /**
     * @function constructor
     * @param {EventsService} _eventService
     * @param {BowserService} _bowserService
     */
    constructor(
        @inject(TYPES.EventsService) private _eventService: EventsService,
        @inject(TYPES.BowserService) private _bowserService: BowserService
    ) {
        // Required to build eventSimulator.js & customVideoPlayer.js into dist/ folder
        const eventSimulator = require('./assets/js/eventSimulator.js');
        const customVideoPlayer = require('./assets/js/customVideoPlayer.js');
        const clmCommon = require('./assets/js/clm_common.js');

        this._clearSubscriptions();

        // Loading modules
        this._presentationZip = new PresentationZip(_eventService, _bowserService, this);
        // this._presentationPdf = new PresentationPdf(_eventService, _bowserService, this);
        this._presentation = new Presentation(_eventService, _bowserService, this);
        this.collectData = new CollectData(_eventService, _bowserService, this);

        this.StorageSvc = StorageSvc;

        this.subscriptions.push(
            this._eventService.actionRequestsReplay.subscribe((action: SDKResponse) => {
                switch (action.event) {
                    case SDKEvent.exitNotification:
                        this._presentationZip = new PresentationZip(this._eventService, this._bowserService, this);
                        break;
                }
            })
        );
        console.log('[SDK] Player initialized, version', this._version);
    }

    /**
     * @function initModulesHTML
     * @description
     * @public
     * @returns {void}
     */
    public initModulesHTML(): void {
        if (document.querySelector('#' + this._html_container_id + '')) {
            this._presentationZip.injectIFrameAction();
            // this._presentationPdf.injectCanvas();
        }
    }

    /**
     * @function initModulesHTML
     * @description
     * @public
     * @returns {void}
     */
    public loadSFPresentation(): void {
        if (document.querySelector('#' + this._html_container_id + '')) {
            this._presentation.init();
        } else {
            console.error('wrong html_container_id', this._html_container_id);
        }
    }

    /**
     * @function isIFrameUrl
     * @description
     * @public
     * @returns {boolean}
     */
    public isIFrameUrl(): boolean {
        return this._presentationZip.isIFrameURL();
    }

    /**
     * @function eventDispatcher
     * @public
     * @param {any} data
     * @return {void}
     */
    public eventDispatcher(data: any): void {
        // this._StorageSvc.debug && console.info('[SDK] Event received: ', data);
        switch (data.type) {
            case EventTypes.LOAD_PRESENTATION:
                this._eventService.PresentationLoad(data);
                break;
            case EventTypes.INITIAL_CONTROLS:
                this._eventService.InitialControls(data);
                break;
            case EventTypes.LOAD_SLIDE:
                this._eventService.PresentationLoadSlide(data);
                break;
            case EventTypes.SLIDE_LOADED:
                this._eventService.PresentationSlideLoaded(data);
                break;
            case EventTypes.LOAD_PDF:
                this._eventService.PresentationLoadPdf(data);
                break;

            case EventTypes.NOTIFICATION:
                this._eventService.launchEventNotification(data);
                break;

            case EventTypes.TOUCH_EVENT:
                this._eventService.launchEventMessage(data);
                break;

            case EventTypes.DRAWING_ACTION:
                this._eventService.launchDrawingAction(data);
                break;

            case EventTypes.PRESENTER_MODE:
                this._eventService.presenterModeNotification(data);
                break;

            case EventTypes.DRAWING_MODE:
                this._eventService.launchDrawingMode(data);
                break;

            case EventTypes.INTERACTIVE_MODE:
                this._eventService.isInteractiveMode(data);
                break;

            case EventTypes.VIDEO_ACTION:
                this._eventService.launchVideoEvent(data);
                break;

            case EventTypes.COLORPICKER_ACTION:
                this._eventService.colorpickerAction(data.show);
                break;

            case EventTypes.EXIT_NOTIFICATION:
                this._eventService.exitNotificationAction();
                break;

            case EventTypes.RESET_PRESENTATION_MODULE:
                this._eventService.resetPresentationModule();
                break;

            default:
                console.warn('[SDK] Unknown event received: ', data);
        }
    }

    /**
     * @function eventSubscriber
     * @description
     * @public
     * @param {any} data
     * @return {void}
     */
    public eventSubscriber(data: any): void {
        this.eventObservable.next(data);
    }

    /**
     * @function _initEventObservable
     * @description
     * @public
     * @return {void}
     */
    public initEventObservable(): void {
        this.eventObservable = new Subject<any>();
    }

    public getPresentationZip() {
        return this._presentationZip;
    }

    /**
     * @function _clearSubscriptions
     * @private
     * @returns {void}
     */
    private _clearSubscriptions() {
        this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    }

    /**
     * @function interactiveModeActivation
     * @private
     * @param isInteractive {boolean}
     * @return {void}
     */
    private _interactiveModeAction(isInteractive: boolean): void {
    }

}
