import {BaseElement, IBaseElement} from "../BaseElement";
import {EventsService, SDKEvent} from "../../../../shared/events.service";

import './SlideShow.css';
import {Presentation} from "../../Presentation";
import {PresentationThumbs} from "../PresentationThumbs/PresentationThumbs";
import {SlidesThumbs} from "../SlidesThumbs/SlidesThumbs";
import {ButtonSlideShow, StartSlideShow} from "../ButtonSlideShow/ButtonSlideShow";
import {TitleCountPresentation} from "../TitleCountPresentation/TitleCountPresentation";
import StorageSvc from "../../../../shared/storage.service";
import ModalMessage from "../ModalMessage/ModalMessage";
import Api from "../../../../shared/api.service";
import ModalWindow from "../ModalWindow/ModalWindow";
import {SDKResponse} from "../../../../models/SDKResponse";
import {Subscription} from "rxjs";

interface ISlideShow extends IBaseElement {
}

export class SlideShow extends BaseElement {
    private _presentationThumbs: PresentationThumbs;
    private _slidesThumbs: SlidesThumbs;
    private _slideShowBtns: ButtonSlideShow[] = [];
    private _titleCountPresentation: TitleCountPresentation;
    private _modalTrackingMessage: ModalMessage;
    private _trackingBtn: ButtonSlideShow;
    private _isTrackingPaused: boolean;
    private _isShow: boolean = false;
    public subscriptions: Subscription[] = [];
    public isPausedScreenSharing: boolean = false;
    public slideShowBtn: StartSlideShow;

    constructor(
        params: ISlideShow,
        private _eventService: EventsService,
        private _presentation: Presentation
    ) {
        super({...params, id: 'slideshow'});
        this.init();

        this._clearSubscriptions();
        this.subscriptions.push(
            this._eventService.actionRequestsReplay.subscribe((action: SDKResponse) => {
                switch (action.event) {
                    case SDKEvent.PresentationChange:
                        this.checkMandatorySlidesViewed() && this.presentationChange(action.data);
                        break;
                    default:
                        break
                }
            })
        );
    }

    private _clearSubscriptions(): void {
        this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    }

    onInit() {
        this._initSlideshowInner();
        this._initPresentationThumbs();
        this._initSlidesThumbs();
    }

    afterRender() {
        this._fixHeight();
    }

    private _initSlideshowInner() {
        const slideshowInner = document.createElement('div');
        slideshowInner.classList.add('slideshow-inner');

        this._initTitleCountPresentation(slideshowInner);
        this._initSlideshowTypesSwitcher(slideshowInner);
        this._initExtraButtons(slideshowInner);
        this.element.appendChild(slideshowInner);
        if (StorageSvc.isTrainingModeEnabled()) {
            this.setTrackingPause({isShowModal:true});
        } else {
            this.setTrackingStart();
        }
    }


    private _initExtraButtons(container: HTMLDivElement) {
        if (StorageSvc.isViewerData()) return;
        const extraButtons = document.createElement('div');
        extraButtons.setAttribute('id', 'extra-buttons');

        if (!StorageSvc.isRemoteMode()) {
            new ButtonSlideShow({
                name: 'openAttendeesModal',
                classes: 'slide-show-btn__attendee',
                container: extraButtons,
                clickFn: (e, el) => {
                    this._setTrackingPause();
                    Api.sendToParent({
                        request: 'openAttendeesModal',
                        clmData: StorageSvc.getCLMData()
                    });
                }
            });
        }

        new ButtonSlideShow({
            name: 'openWebCLMGridModal',
            classes: 'slide-show-btn__presentations',
            container: extraButtons,
            clickFn: (e, el) => {
                if (!this.checkMandatorySlidesViewed()) return;
                this._setTrackingPause();
                Api.sendToParent({
                    request: 'openWebCLMGridModal',
                    clmData: StorageSvc.getCLMData()
                });
            }
        });

        this._trackingBtn = new ButtonSlideShow({
            text: '',
            name: 'startTrackingBtn',
            container: extraButtons,
            classes: 'slide-show-btn__tracking',
            clickFn: (e, el) => {
                el.toggleActive();
                if (!el.isActive) {
                    this.setTrackingPause({isShowModal:true});
                    this._presentation.SDK_PauseButtonPress();
                } else {
                    this.setTrackingStart();
                    this._presentation.SDK_PlayButtonPress();
                }
            }
        });

        new ButtonSlideShow({
            text: StorageSvc.getLabel('Call'),
            name: 'toggleToCall',
            classes: 'slide-show-btn__call',
            container: extraButtons,
            clickFn: (e, el) => {
                if (!this.checkMandatorySlidesViewed()) return;
                if (StorageSvc.isRemoteMode()) {
                    const callURL = StorageSvc.getClmDataSettingValue('callURL');
                    if (callURL) {
                        window.open(callURL.toString(), '_blank');
                    } else {
                        console.error('Can\'t open Call, "callURL" setting is not found');
                    }
                } else {
                    this._setTrackingPause();
                    Api.sendToParent({
                        request: 'toggleToCall',
                        clmData: StorageSvc.getCLMData(),
                        clickStreamMetrics: StorageSvc.getClickStreamData()
                    });
                }
                this._presentation.SDK_CallButtonPress();
            }
        });

        if (StorageSvc.isRemoteMode()) {
            this.getEndButton(extraButtons);
            this.slideShowBtn = this.startSlideshow(extraButtons);
        } else {
            this.getCancelButton(extraButtons);
        }

        container.appendChild(extraButtons);
    }

    public restoreTrackingMode() {
        if (!this._isTrackingPaused) {
            this.setTrackingStart();
        }
    }

    private _setTrackingPause(isShowModal?: boolean) {
        if (this._trackingBtn) {
            this._trackingBtn.isActive = false;
        }
        if (isShowModal) {
            this._handleTrackingPausedMessage();
        }
        StorageSvc.isDev && console.log('Click stream tracking paused');
        this._eventService.PresentationTracking(false);
    }

    private _setTrackingStart() {
        if (this._trackingBtn) {
            this._trackingBtn.isActive = true;
        }
        if (this._modalTrackingMessage) {
            this._modalTrackingMessage.destroy();
            this._modalTrackingMessage = null;
        }
        StorageSvc.isDev && console.log('Click stream tracking started');
        this._eventService.PresentationTracking(true);
    }

    private _initTitleCountPresentation(container: HTMLDivElement) {
        this._titleCountPresentation = new TitleCountPresentation({
            container: container
        }, this._eventService);
    }

    private _initSlideshowTypesSwitcher(container: HTMLDivElement) {
        if (StorageSvc.isViewerData()) return;
        const slideshowTypes = document.createElement('div');
        slideshowTypes.setAttribute('id', 'slideshow-type-switcher');
        container.appendChild(slideshowTypes);

        this._slideShowBtns.push(
            new ButtonSlideShow({
                text: StorageSvc.getLabel('presentations'),
                name: 'presentation',
                container: slideshowTypes,
                classes: 'slide-show-btn__switcher',
                clickFn: (e, el) => {
                    e.stopPropagation();
                    this._toggleSlideShowBtns(el);
                    this._slidesThumbs.hide();
                    this._presentationThumbs.show();
                }
            })
        );

        this._slideShowBtns.push(
            new ButtonSlideShow({
                text: StorageSvc.getLabel('sequences'),
                name: 'slides',
                container: slideshowTypes,
                classes: 'slide-show-btn__switcher',
                isActive: true,
                clickFn: (e, el) => {
                    e.stopPropagation();
                    this._toggleSlideShowBtns(el);
                    this._presentationThumbs.hide();
                    this._slidesThumbs.show();
                }
            })
        );
    }

    private _initPresentationThumbs() {
        this._presentationThumbs = new PresentationThumbs({
            container: this.element,
            clmPath: this._presentation.getCLMPath(),
            presentations: StorageSvc.getPresentations(),
            isHide: true
        }, this._eventService);
    }

    private _initSlidesThumbs() {
        this._slidesThumbs = new SlidesThumbs({
            container: this.element,
            clmPath: this._presentation.getCLMPath(),
            slides: StorageSvc.getListSlides()
        }, this._eventService, this._presentation);
    }

    public checkMandatorySlidesViewed(): boolean {
        const isMandatorySlidesViewed = this._isMandatorySlidesViewed();
        if (!isMandatorySlidesViewed) {
            this.toggleToSlidesThumbs();
            this._presentation.showRequiredSlideMessage();
        }
        return isMandatorySlidesViewed;
    }

    private _isMandatorySlidesViewed(): boolean {
        const notViewedFirstSlides = StorageSvc.getListSlides().find((slide, index) => {
            const isSlideNotViewed = slide.isMandatory && !slide.isViewed;
            if (isSlideNotViewed) {
                this._slidesThumbs.thumbnails[slide.id].setAlarm();
                // this._eventService.PresentationSlideNotViewed(index);
            }
            return isSlideNotViewed;
        });
        return !notViewedFirstSlides;
    }

    private _fixHeight() {
        const style = getComputedStyle(this.element);
        const paddingTop = parseInt(style.paddingTop) || 0;
        this.element.style.minHeight = `${this.element.clientHeight + paddingTop}px`;
    }

    private _toggleSlideShowBtns(el: ButtonSlideShow) {
        this._slideShowBtns.forEach(btn => {
            btn.isActive = btn.uuid === el.uuid;
        });
    }

    public refreshSlideShow() {
        this._slidesThumbs.changeSlides(StorageSvc.getListSlides());
        this._presentationThumbs.changePresentations(StorageSvc.getPresentations());
    }

    public loadSlidesByPresentationIndex(presentationIndex: number, setLastSlide?: boolean) {
        StorageSvc.setCurrentPresentation(presentationIndex);
        StorageSvc.setListSlides(this._presentation.prepareListSlides(StorageSvc.getCurrentPresentation()));
        this._slidesThumbs.changeSlides(StorageSvc.getListSlides());
        this._eventService.PresentationLoaded(StorageSvc.getPresentations()[StorageSvc.getCurrentPresentation()]);
    }

    public presentationChange(presentationIndex: number) {
        this.loadSlidesByPresentationIndex(presentationIndex);
        this.toggleToSlidesThumbs();
    }

    public toggleToSlidesThumbs() {
        const slidesBtn = this._slideShowBtns.filter(btn => btn.name === 'slides');
        slidesBtn && this._toggleSlideShowBtns(slidesBtn[0]);
        this._presentationThumbs.hide();
        this._titleCountPresentation.show();
        this._slidesThumbs.show();
    }

    public show() {
        this._isShow = true;
        this._handleTrackingPausedMessage();
        Api.sendToParent({request: 'PresentationPanelIsOn'});
        this.element.animate([
            {bottom: '-300px'},
            {bottom: '0'},
        ], {
            duration: 300,
            fill: 'both'
        });
    }

    public hide() {
        if (!this._isShow) return;
        this.element.animate([
            {bottom: '0'},
            {bottom: '-300px'},
        ], {
            duration: 300,
            fill: 'both'
        }).finished.then(() => {
            this._isShow = false;
            this._handleTrackingPausedMessage();
            Api.sendToParent({request: 'PresentationPanelIsOff'});
        });
    }

    public isShow() {
        return this._isShow;
    }

    public setTrackingPause(params?: {isShowModal: boolean}) {
        const isShowModal = params ? params.isShowModal : false;
        this._isTrackingPaused = true;
        this._setTrackingPause(isShowModal);
    }

    public setTrackingStart() {
        this._isTrackingPaused = false;
        this._setTrackingStart();
    }

    private _handleTrackingPausedMessage() {
        if (!this._modalTrackingMessage) {
            this._modalTrackingMessage = new ModalMessage({
                container: this._presentation.playerContainerId,
                message: StorageSvc.getLabel('TrackingPaused')
            });
        }

        if (!StorageSvc.isRemoteMode()) return;
        if (this._isShow) {
            this._modalTrackingMessage.show();
        } else {
            this._modalTrackingMessage.hide();
        }
    };

    private getEndButton(container: HTMLDivElement): ButtonSlideShow {
        return new ButtonSlideShow({
            text: StorageSvc.getLabel('End'),
            name: 'end',
            classes: 'slide-show-btn__end',
            container,
            clickFn: () => {
                this._setTrackingPause();
                this._presentation.SDK_EndButtonPress();
                Api.sendToParent({
                    request: 'end',
                    clmData: StorageSvc.getCLMData(),
                    clickStreamMetrics: StorageSvc.getClickStreamData()
                });
            }
        })
    }

    private startSlideshow(container: HTMLDivElement): StartSlideShow {
        return new StartSlideShow({
            text: StorageSvc.getLabel('Start'),
            textActive: StorageSvc.getLabel('Finish'),
            name: 'start-slide',
            classes: 'start-slide',
            container,
            clickFn: (e, _this) => {
                _this.toggleName();
                if (this.isPausedScreenSharing) {
                    console.log('slider has been stopped annual')
                    clearInterval(this._presentation.interval)
                }
                this._presentation.startSlider({isPaused: this.isPausedScreenSharing})
            }
        })
    }

    private getCancelButton(container: HTMLDivElement): ButtonSlideShow {
        return new ButtonSlideShow({
            text: StorageSvc.getLabel('Cancel'),
            name: 'cancel',
            classes: 'slide-show-btn__cancel',
            container,
            clickFn: () => {
                this._setTrackingPause();
                this._presentation.SDK_CancelButtonPress();
                new ModalWindow({
                    container: this._presentation.playerContainerId,
                    message: StorageSvc.getLabel('PresentationWillBeCanceled'),
                    callbackYes: () => {
                        Api.sendToParent({request: 'cancel'});
                    },
                    callbackNo: () => {
                        this.restoreTrackingMode();
                    }
                });
            }
        });
    }
}
