// Third-party modules
import {Subscription} from 'rxjs';
// @ts-ignore
import SwipeListener from 'swipe-listener';

// Internal modules
import {Player} from '../../Player';

// Internal models
import {SDKResponse} from '../../models/SDKResponse';
import {ISequenceFile} from '../../models/sequence';
import {ISlide} from '../../models/slide';
import {oceSecuredConfig} from '../../models/oceSecuredConfig';

// Internal services
import {EventsService, SDKEvent} from '../../shared/events.service';
import {BowserService} from '../../shared/bowser-service';
import {PlayerControls} from './components/PlayerControls/PlayerControls';
import {IPresentation, IPresentationData} from "../../models/presentation";
import {EventTypes} from '../../constant/event-types';
import {isIPad, uuidv4} from "../../shared/helpers.service";
import {SlideShow} from "./components/SlideShow/SlideShow";
import StorageSvc from '../../shared/storage.service';
import ModalMessage from "./components/ModalMessage/ModalMessage";
import Api from "../../shared/api.service";
import {sendInitMessageWithMockPresentationData} from "./components/presentationMockData";
import {ParticipantService} from "../../shared/participant.service";
import TYPES from "../../constant/types";
import {container} from "../../Bootstrap";
import {Participant} from "../../models/participantsData";
import {ICLMData} from "../../models/clmData";

export class Presentation {

    /*
     * Dependencies
     * */
    private _participantService: ParticipantService;

    /**
     * Data members
     */
    private _initStatus: boolean;
    private _clmFolder: string = 'clm';
    private _sequenceNameRegex = RegExp('^(.+)(\\d{13})(_?\\d?){2}\\.(zip|pdf)$');
    private _bottomSlidePickerClickAreaHeight: number;
    private _bottomSlidePickerClickAreaPercent: number = 6;
    private _state: any;
    private _requestId: string;
    private _SlideShow: SlideShow;
    private _modalRequired: ModalMessage;
    private _StorageSvc = StorageSvc;
    private _iFrame: any;
    private _CLMPath: string;

    private _actions: any = {
        init: 'init',
        refreshWebCLMPlayer: 'refreshWebCLMPlayer',
        attendeesAdded: 'attendeesAdded',
        modalClosed: 'modalClosed',
        gotoSlide: 'gotoSlide',
        save: 'save',
        startTrackingPage: 'startTrackingPage',
        stopTrackingPage: 'stopTrackingPage',
        saveState: 'saveState',
        alert: 'alert',
        addAction: 'addAction',
        goNextSequence: 'goNextSequence',
        goPreviousSequence: 'goPreviousSequence',
        updateFeedback: 'updateFeedback',
        getContentOffset: 'getContentOffset',
        remoteParticipantsUpdated: 'remoteParticipantsUpdated'
    };

    private _SDK_ACTIONS = {
        cancelButtonPress: 'cancelbuttonpress',
        endButtonPress: 'endbuttonpress',
        pauseButtonPress: 'pausebuttonpress',
        playButtonPress: 'playbuttonpress',
        callButtonPress: 'returntocallbuttonpress',
        slideAppearing: 'viewappearing',
        slideDisappearing: 'viewdisappearing',
    }

    private readonly CLM_DATA = 'clmData';
    private readonly DEFAULT_PRESENTATION_NAME = 'CLM Presentation';

    public subscriptions: Subscription[] = [];
    public oceSecuredConfig: oceSecuredConfig;

    public get playerContainerId(): string {
        return `#${this._player.htmlContainerId}`;
    };

    constructor(
        private _eventService: EventsService,
        private _bowserService: BowserService,
        private _player: Player
    ) {
        this._participantService = container.get<ParticipantService>(TYPES.ParticipantService);
        this._clearSubscriptions();
        this.subscriptions.push(
            this._eventService.actionRequestsReplay.subscribe((action: SDKResponse) => {
                switch (action.event) {
                    case SDKEvent.PresentationLoadPdf:
                        break;

                    case SDKEvent.LaunchEventOnContent:
                        break;

                    case SDKEvent.isInteractiveMode:
                        break;

                    case SDKEvent.LaunchEventNotification:
                        break;

                    case SDKEvent.PresentationLoadSlide:
                        // StorageSvc.debug && console.log('PresentationLoadSlide', action.data);
                        break;

                    case SDKEvent.PresentationSlideLoaded:
                        this.SDK_SlideAppearing();
                        break;

                    case SDKEvent.PresentationLoaded:
                        this.changeSlide(0);
                        break;

                    case SDKEvent.PresentationChange:
                        break;

                    case SDKEvent.PresentationGotoPrevSlide:
                        this._gotoPrevSlide();
                        break;

                    case SDKEvent.PresentationGotoNextSlide:
                        this._gotoNextSlide();
                        break;
                    case SDKEvent.ShareCSSEvent:
                        this._setBottomSlidePickerClickAreaHeight();
                        break;
                    default:
                        break
                }
            })
        );
        if (StorageSvc.isDev) {
            console.log('[SDK] Presentation initialized');
            StorageSvc.isDev && sendInitMessageWithMockPresentationData();
        }
    }

    public init(): void {
        window.addEventListener('message', (event) => {
            console.log(event);
            this.onMessage(event);
        });
        this._requestId = uuidv4();
        Api.sendToParent({request: 'init', info: {requestId: this._requestId}});
        this._initStatus = true;
    };

    private _clearSubscriptions(): void {
        this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    }

    public _IsJsonString(str: any): boolean {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };

    public onMessage(event: MessageEvent): void {
        if (!this._initStatus) {
            console.log('Retrieving message failed. App doesn\'t init.');
            return;
        }

        if (!event.data) {
            console.log('Retrieving message failed. No input data');
            return;
        }

        let result = event.data;
        if (this._IsJsonString(result)) {
            result = JSON.parse(result);
        }

        let request = null;

        if (result.actionName !== undefined && result.actionName.length > 0) {
            request = result.actionName;
        }
        if (result.request !== undefined && result.request.length > 0) {
            request = result.request;
        }

        if (result.player !== undefined && result.player.length > 0) {
            Api.sendToParent(result);
            return;
        }

        try {
            // To call first to initialize SDK
            this.initialization();
            StorageSvc.isDev && console.log('onMessage request',request, 'result', result);
            switch (request) {
                case this._actions.init:
                    this._checkMessageResultStatus(result);
                    this.loadPresentation(result.response);
                    break;
                case this._actions.refreshWebCLMPlayer:
                    this._checkMessageResultStatus(result);
                    this._refreshWebCLMPlayer(result.response);
                    this._SlideShow.restoreTrackingMode();
                    break;
                case this._actions.attendeesAdded:
                    this._checkMessageResultStatus(result);
                    this._attendeesAddedHandler(result.response);
                    this._SlideShow.restoreTrackingMode();
                    break;
                case this._actions.modalClosed:
                    this._SlideShow.restoreTrackingMode();
                    break;
                case this._actions.gotoSlide:
                    this._gotoSlideName(result.params);
                    break;
                case this._actions.goNextSequence:
                    this._gotoNextSlide();
                    break;
                case this._actions.goPreviousSequence:
                    this._gotoPrevSlide();
                    break;
                case this._actions.startTrackingPage:
                    this._SlideShow.setTrackingStart();
                    break;
                case this._actions.stopTrackingPage:
                    this._SlideShow.setTrackingPause();
                    break;
                case this._actions.alert:
                    this._alert(result.params);
                    break;
                case this._actions.getContentOffset:
                    Api.sendToParent({request: 'ClmContentOffset', player: true, params: this.getPLayerOffset()});
                    break;
                case this._actions.remoteParticipantsUpdated:
                    this._participantService.onUpdate(result.response);
                    break;

            }
        } catch (e) {
            console.error(e);
        }
    };

    private _checkMessageResultStatus(result: any) {
        if (!result.status || result.status !== 'success') {
            throw `${result.actionName}: Retrieving message failed. Wrong request status.`;
        }
    }

    private _gotoSlideName(data: { slideName: string, sequenceId?: string, animation?: string }) {
        const {sequenceId, slideName} = data;
        if (!slideName) throw 'Wrong slide name';
        const slide = StorageSvc.getSlideBySequenceAndName({sequenceId, slideName});
        if (slide) {
            this.changeSlide(slide.id);
        } else {
            throw 'Slide not found';
        }
    }

    private _refreshWebCLMPlayer(data: any) {
        if (!this._checkClmDataFormat(data)) return;
        this.loadPresentation(data);
    }

    private _attendeesAddedHandler(data: any){
        if (!this._checkClmDataFormat(data)) return;
        if (!StorageSvc.isViewerData() && !StorageSvc.isRemoteMode()) {
            this._participantService.onUpdate(this._preparedAttendeesData(data[this.CLM_DATA]));
        }
        StorageSvc.setCLMData(data[this.CLM_DATA]);
    }

    private _preparedAttendeesData(data: ICLMData): Participant[] {
        const {account, attendees} = data;
        const resultAttendeesList = [];
        if (account) resultAttendeesList.push(account);
        if (attendees && attendees.length) resultAttendeesList.push(...attendees);
        return resultAttendeesList.map(attendee => ({
            sid: attendee.id,
            identity: `${attendee.firstname || ''} ${attendee.middle_name || ''} ${attendee.lastname || ''}`,
            accountId: attendee.id || '',
            device: {
                type: '',
                os: '',
                browser: ''
            }
        }))
    }

    private _checkClmDataFormat(data: any): boolean {
        if (!data || !data[this.CLM_DATA] || !data[this.CLM_DATA].presentations || !data[this.CLM_DATA].presentations.length) {
            console.error('Wrong request data', this._actions.refreshWebCLMPlayer);
            return false;
        }
        return true;
    }

    private loadPresentation(result: any) {
        const clmData = result[this.CLM_DATA];
        try {
            if (!clmData || !clmData.presentations) {
                throw 'Invalid response';
            }
            StorageSvc.setPresentations(this._preparePresentationsData(clmData.presentations));
            if (!StorageSvc.getPresentations().length) throw 'Invalid presentations data';
            StorageSvc.setCLMData(clmData);
            StorageSvc.setLabels(clmData.labels);
            StorageSvc.setCurrentPresentation(0);
            if (!StorageSvc.isViewerData() && !StorageSvc.isRemoteMode() && (clmData.account || clmData.attendees)) {
                this._participantService.setParticipantList(this._preparedAttendeesData(clmData));
            }
            this.oceSecuredConfig = result.oceSecuredConfig || this.oceSecuredConfig;
            StorageSvc.setCloudFrontURL(this.oceSecuredConfig.cloudFrontURL);
            this._iFrame = <HTMLIFrameElement>document.getElementById('IFrame-content');
            this.loadPresentationByType().then(() => {
                StorageSvc.setListSlides(this.prepareListSlides(StorageSvc.getCurrentPresentation()));
                // Initializing slideshow
                if (!this._SlideShow) {
                    this._initSlideShow();
                } else {
                    this._SlideShow.refreshSlideShow();
                }
                this._eventService.PresentationLoaded(StorageSvc.getPresentations()[StorageSvc.getCurrentPresentation()]);
            }).catch((e) => {
                console.error('Loading presentation error:', e);
            });
        } catch (e) {
            console.error('Can\'t load presentations:' , e);
        }
    }

    private _preparePresentationsData(data: IPresentationData[]): IPresentation[] {
        if (!data || !data.length) throw 'Invalid data structure';
        return data.map((presentationData: any, index) => {
            //@ts-ignore
            const presentation: IPresentation = {};
            presentation.id = presentationData.id;
            presentation.index = index;
            presentation.name = presentationData.name || this.DEFAULT_PRESENTATION_NAME;
            presentation.sequences = presentationData.sequences.map((sequence: any) => {
                return {
                    file: this.getSequenceFilenameInfo(sequence.key),
                    fileId: sequence.fileId,
                    key: sequence.key,
                    id: sequence.id,
                    externalId: sequence.externalId || sequence.externalid,
                    isMandatory: !!sequence.is_mandatory
                }
            });
            presentation.type = presentation.sequences[0].file.extension.toLowerCase();
            return presentation;
        })
    }

    public loadPresentationByType() {
        switch (StorageSvc.getPresentations()[StorageSvc.getCurrentPresentation()].type) {
            case 'zip':
                return this.loadZipPresentation();
            case 'pdf':
                // return this.loadPdfPresentation(this.sequences[0]);
            default:
                return Promise.reject('unsupported presentation\'s type');
        }
    }

    public initSlideShowControls() {
        this._SlideShow = new SlideShow({
            container: this.playerContainerId,
        }, this._eventService, this);

        new PlayerControls({
            container: this.playerContainerId,
            clickLeft: () => {
                this._gotoPrevSlide();
            },
            clickRight: () => {
                this._gotoNextSlide();
            }
        });
    }

    private _gotoPrevSlide() {
        if (StorageSvc.getListSlides()[StorageSvc.getCurrentSlide() - 1]) {
            this.changeSlide(StorageSvc.getCurrentSlide() - 1);
            return;
        }
    };

    private _gotoNextSlide() {
        if (StorageSvc.getListSlides()[StorageSvc.getCurrentSlide() + 1]) {
            this.changeSlide(StorageSvc.getCurrentSlide() + 1);
            return;
        }
    };

    private _setBottomSlidePickerClickAreaHeight(){
        const player = <HTMLIFrameElement>document.getElementById(this._player.htmlContainerId);
        if (!this._bottomSlidePickerClickAreaHeight) {
            this._bottomSlidePickerClickAreaHeight = player.offsetHeight * this._bottomSlidePickerClickAreaPercent / 100;
        }
    }

    public initSlideShowControlsEvents(): void {
// IFrame-content element exists only after having loaded a first slide from the SDK
        const player = <HTMLIFrameElement>document.getElementById(this._player.htmlContainerId);
        player.addEventListener('click', (event: any) => {
            if (event.target.id === this._player.htmlContainerId) {
                toggleSlideShow(event.y);
            }
        })
        this._iFrame.addEventListener('load', () => {
            this._iFrame.contentWindow.addEventListener('click', (event: any) => {
                console.log('event', event)
                toggleSlideShow(event.y);
            });
            if (isIPad()) {
                const listener = SwipeListener(this._iFrame.contentWindow);
                const _this = this;
                this._iFrame.contentWindow.addEventListener('swipe', function (e: any) {
                    StorageSvc.isDev && console.log('swipe', e);
                    const {directions} = e.detail;
                    switch (true) {
                        case directions.left:
                            _this._gotoNextSlide();
                            break;
                        case directions.right:
                            _this._gotoPrevSlide();
                            break;
                        case directions.top:
                            StorageSvc.isDev && console.log('top');
                            break;
                        case directions.bottom:
                            StorageSvc.isDev && console.log('bottom');
                            break;
                    }
                });
            }
        });
        const toggleSlideShow = (coordinateY: number) => {
            if (coordinateY > this._iFrame.offsetHeight - this._bottomSlidePickerClickAreaHeight) {
                this._SlideShow.show();
            } else {
                this._SlideShow.hide();
            }
        }
    }

    public getSequenceFilenameInfo(key: string): ISequenceFile {
        if (!this._sequenceNameRegex.test(key)) {
            throw new Error('Wrong sequences filename.');
        }
        const filePathArray = this._sequenceNameRegex.exec(key);
        let sequenceName = filePathArray[1];
        if (sequenceName.slice(-1) === '_') sequenceName = sequenceName.slice(0, -1);
        return {
            name: sequenceName,
            extension: filePathArray[4],
            fileName: filePathArray[0].split('.').slice(0, -1).join('.'),
            timestamp: +filePathArray[2],
        };
    };

    private async _fetchPresentationSlidesInfo() {
        for (let i = 0; i < StorageSvc.getPresentations().length; i++) {
            await this._fetchSlidesInfo(StorageSvc.getPresentations()[i]);
        }
    }

    private async _fetchSlidesInfo(presentation: IPresentation) {
        return Promise.all(presentation.sequences.map(sequence => {
            return this._initSlideList(sequence.file.fileName)
        })).then((presentationSlides) => {
                StorageSvc.addPresentationSlides(presentation.index, presentationSlides);
        }).catch((err) => {
            const iFrameWrapper = <HTMLIFrameElement>document.getElementById('iFrame-wrapper');
            const loader = document.getElementById('slide-loader');
            if (loader) {
                loader.style.display = 'none';
            }
            const errorContent = document.createElement('div');
            errorContent.innerHTML = 'Error: Presentation isn\'t ready yet.';
            iFrameWrapper.innerHTML = '';
            iFrameWrapper.classList.add('error');
            iFrameWrapper.appendChild(errorContent);
            console.error('initSlideList', err);
        });
    };

    private _initSlideShow(): void {
        this.initSlideShowControls()
        this.initSlideShowControlsEvents();
    }

    private _initSlideList(sequenceName: string): any {
        console.log('sequenceName', sequenceName);
        console.log('this.getCLMPath()',[this.getCLMPath(), sequenceName, 'content.json?v=' + this._player._version].join('/'));
        return fetch([this.getCLMPath(), sequenceName, 'content.json?v=' + this._player._version].join('/'))
            .then(res => {
                console.log('res',res); return res.json()})
    };

    public showRequiredSlideMessage() {
        if (this._modalRequired) return;
        const msgSlideRequired = StorageSvc.getLabel('SlideRequired');
        const msgSlideMustBeShown = StorageSvc.getLabel('SlideMustBeShown', StorageSvc.getMandatoryNotShowedSlide());
        const message = `${msgSlideRequired}: ${msgSlideMustBeShown}`;
        this._modalRequired = new ModalMessage({
            container: this.playerContainerId,
            classes: 'modal__required',
            message: message
        });
        setTimeout(() => {
            this._modalRequired.destroy();
            this._modalRequired = null;
        }, 5000);
    }

    private _alert(params: { msg: string }): void {
        const message = params && params.msg || '';
        alert(message);
    }

    public prepareListSlides(currentPresentation: number): ISlide[] {
        const slides: ISlide[] = [];
        StorageSvc.getPresentations()[currentPresentation].sequences.forEach(seq => {
            slides.push(...seq.slides.map(slide => ({...slide, isViewed: false})));
        });
        return slides;
    }

    public loadZipPresentation() {
        StorageSvc.setListSlides([]);
        // To call then to allow user interactions with future contents
        this.enableContentInteractions();

        // For demo purpose only
        // Firefox needs a not empty iframe for listening to load event, used to initialized the slideshow
        this._iFrame.contentWindow.document.write('<html></html>');
        return this._fetchPresentationSlidesInfo();
    }

    /**
     * @function SDK_enableContentInteractions
     * @public
     * @description Enable direct user interactions with contents
     * @returns {void}
     */
    public enableContentInteractions(): void {
        this._player.eventDispatcher({type: 'interactive-mode', status: true});
    }

    public SDK_CancelButtonPress(): void {
        const iFrame = this._player.getPresentationZip().getIFrame();
        iFrame?.contentWindow?.CLMPlayer?.executeEvent(this._SDK_ACTIONS.cancelButtonPress);
    }

    public SDK_EndButtonPress(): void {
        const iFrame = this._player.getPresentationZip().getIFrame();
        iFrame?.contentWindow?.CLMPlayer?.executeEvent(this._SDK_ACTIONS.endButtonPress);
    }

    public SDK_PauseButtonPress(): void {
        const iFrame = this._player.getPresentationZip().getIFrame();
        iFrame?.contentWindow?.CLMPlayer?.executeEvent(this._SDK_ACTIONS.pauseButtonPress);
    }

    public SDK_PlayButtonPress(): void {
        const iFrame = this._player.getPresentationZip().getIFrame();
        iFrame?.contentWindow?.CLMPlayer?.executeEvent(this._SDK_ACTIONS.playButtonPress);
    }

    public SDK_CallButtonPress(): void {
        const iFrame = this._player.getPresentationZip().getIFrame();
        iFrame?.contentWindow?.CLMPlayer?.executeEvent(this._SDK_ACTIONS.callButtonPress);
    }

    public SDK_SlideAppearing(): void {
        this._iFrame?.contentWindow?.CLMPlayer?.executeEvent(this._SDK_ACTIONS.slideAppearing);
    }

    public SDK_SlideDisappearing(): void {
        this._iFrame?.contentWindow?.CLMPlayer?.executeEvent(this._SDK_ACTIONS.slideDisappearing);
    }

    public changeSlide(indexSlide: number): void {
        this._loadSlide(StorageSvc.getListSlides()[indexSlide])
    }

    /**
     * @function SDK_loadSlide
     * @public
     * @description Load a remote URL. It must have the same origin (domain name) as the application hosting the
     * Remote Content Player, otherwise it will lead to a cross-origin issue within the iframe (web browsers security rules)
     * @param {string} sequenceName
     * @param {string} slideName
     * @returns {void}
     */
    private _loadSlide(slide: ISlide): void {
        if (!(slide.path !== undefined && slide.path.length > 0)) {
            throw 'Slide error';
        }
        if (StorageSvc.getCurrentSlide() !== undefined) {
            this.SDK_SlideDisappearing();
        }
        StorageSvc.setCurrentSlide(slide.id);

        const clmData = StorageSvc.getCLMData();

        const slideData = {
            type: EventTypes.LOAD_SLIDE,
            presentationIdentifier: slide.presentationId,
            presentationName: slide.presentationName,
            accountIdentifier: clmData.account?.id || '',
            sequenceIdentifier: slide.sequenceId,
            sequenceName: slide.sequencePath,
            slideId: slide.id,
            slide: slide,
            size: {width: 1024, height: 768},
            url: [this.getCLMPath(), slide.sequencePath, slide.path].join('/'),
            clmData: clmData,
            dynamicContent: JSON.stringify({
                customers: clmData.account,
                currentMode: 'PlayMode',
                state: this._state,
                sequenceIndex: slide.sequenceIndex,
                presentationIndex: slide.presentationIndex,
                slideIndex: slide.id,
                presentations: clmData.presentations,
                parameters: {
                    employee_name: clmData.account?.user_name || '',
                    employee_firstname: clmData.account?.firstname || '',
                    employee_lastname: clmData.account?.lastname || '',
                }
            })
        };
        this._eventService.PresentationLoadSlide(slideData);
    }

    /**
     * @function SDK_initialization
     * @public
     * @description Remote Content Player initialization
     * @returns {void}
     */
    public initialization(): void {
        // Fill in the SDK.Bootstrap function the "id" attribute of the HTML tag
        // to be bootstrapped by the Remote Content Player (here "player")
        this._player.initModulesHTML();
    }

    public getCLMPath() {
        if (!this.oceSecuredConfig) {
            return '';
        }
        if (this._CLMPath) return this._CLMPath;
        let
            cloudFrontURL: string = this.oceSecuredConfig.cloudFrontURL,
            url1: string = '',
            url2: string = '';
        const urlArr: string[] = cloudFrontURL.match(/(.*)(\/\/.*)(\/.*)/);
        if (!urlArr || urlArr.length < 2) {
            url1 = cloudFrontURL;
        } else {
            url1 = urlArr[1];
            url2 = urlArr[2];
        }
        this._CLMPath = `${url1}${url2}/${this._clmFolder}`;
        return this._CLMPath;
    }

    private getPLayerOffset(): {top: number, left: number, width: number, height: number} {
        const player = document.getElementById('player');
        return {
            top: player.offsetTop,
            left: player.offsetLeft,
            width: player.offsetWidth,
            height: player.offsetHeight
        }
    }
}
