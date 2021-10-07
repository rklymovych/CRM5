// Third-party modules
import {fromEvent, Subscription} from 'rxjs';

// Internal modules
import {Config} from '../../config';
import IMAGES from '../../images/images';
import {EventTypes} from '../../constant/event-types';
import {Player} from '../../Player';

// Internal models
import {MouseEventType, TouchEventType} from '../../models/touch-gesture';
import {IPresentationData} from '../../models/i-presentation-data';
import {SharedCSS} from '../../models/shared-css';
import {DopResponse} from '../../models/dop_response';
import {SDKResponse} from '../../models/SDKResponse';
import {VideoAction} from '../../models/video-action';
import {SessionStateOCE} from '../../models/notification';

// Internal services
import {EventsService, SDKEvent} from '../../shared/events.service';
import {BowserService} from '../../shared/bowser-service';
import StorageSvc from '../../shared/storage.service';

import './PresentationZip.css';

export class PresentationZip {

    /**
     * Data members
     */
    public scale: number = 0;
    public Mustache = require('mustache');
    // Browser constants
    readonly isDesktop = this._bowserService.isDesktop();
    readonly isMobile = this._bowserService.isMobile();
    readonly isTablet = this._bowserService.isTablet();
    readonly isWindows = this._bowserService.isWindows();
    readonly isMacOS = this._bowserService.isMacOS();
    readonly isAndroid = this._bowserService.isAndroid();
    readonly isIos = this._bowserService.isIos();
    readonly isChromeDesktop = this.isDesktop && this._bowserService.isChrome();
    readonly isFirefoxDesktop = this.isDesktop && this._bowserService.isFirefox();
    readonly isSafariDesktop = this.isDesktop && this._bowserService.isSafari();
    readonly isEdgeDesktop = this.isDesktop && this._bowserService.isEdge();
    readonly isIEDesktop = this.isDesktop && this._bowserService.isIE();
    readonly isOtherBrowserDesktop = !this.isChromeDesktop && !this.isFirefoxDesktop && !this.isSafariDesktop && !this.isEdgeDesktop && !this.isIEDesktop;
    readonly isAndroidMobile = this.isMobile && this.isAndroid;
    readonly isIosMobile = this.isMobile && this.isIos;
    readonly isChromeMobile = this.isMobile && this._bowserService.isChrome();
    readonly isSafariMobile = this.isMobile && this._bowserService.isSafari();
    readonly isAndroidTablet = this.isTablet && this.isAndroid;
    readonly isIosTablet = this.isTablet && this.isIos;
    readonly isChromeTablet = this.isTablet && this._bowserService.isChrome();
    readonly isSafariTablet = this.isTablet && this._bowserService.isSafari();
    private _html_container_id: string = Config.html_container;
    private _contentWidth: number = 0;
    private _contentHeight: number = 0;
    private _iFrameURL: string = '';
    private _iFrame: any;
    private _iFrameWrapper: any;
    private _loadedIFrame: boolean = false;
    private _isScriptInjected: boolean = false;
    private subscriptions: Subscription[] = [];
    private _videoAction: VideoAction[] = [];
    private sdk_container: any;
    private _loaderSpan: HTMLSpanElement;
    private EVENT_SCRIPT_URL: string = process.env.EVENT_SCRIPT_URL;
    private CUSTOM_VIDEO_PLAYER_URL: string = process.env.CUSTOM_VIDEO_PLAYER_URL;
    private CLM_COMMON_SCRIPT_URL: string = process.env.CLM_COMMON_SCRIPT_URL;
    private PRODUCTION: string = process.env.PRODUCTION;
    private isInteractiveMode: boolean = false;
    private PRESENTATION_ID: string;
    private ACCOUNT_ID: string;
    private SEQUENCE_ID: string;
    private SLIDE_NAME: string;
    private _sequenceData: IPresentationData;
    private _isPaused: boolean;
    private templateDataObject: string = "{{{.}}}";

    /**
     * @function constructor
     * @param {EventsService} _eventService
     * @param {BowserService} _bowserService
     * @param {Player} _player
     */
    constructor(
        private _eventService: EventsService,
        private _bowserService: BowserService,
        private _player: Player
    ) {
        this._iFrame = document.createElement('iframe');
        this._iFrameWrapper = document.createElement('div');

        this._initHtmlIFrame();
        this._clearSubscriptions();

        this.subscriptions.push(
            this._eventService.actionRequestsReplay.subscribe((action: SDKResponse) => {
                switch (action.event) {
                    case SDKEvent.PresentationLoadSlide:
                        // if (action.data.url !== this._iFrameURL) {
                            this._sequenceData = action.data;
                            this._injectConfigData();
                            this._initPresentationData(action.data);
                        // }
                        break;

                    case SDKEvent.LaunchEventOnContent:
                        this.launchEvent(action.data);
                        break;

                    case SDKEvent.isInteractiveMode:
                        this.isInteractiveMode = action.data.status;
                        if (this._iFrame.contentWindow && this._iFrame.contentWindow.toggleInteractiveMode) {
                            // Calling toggleInteractiveMode function located in the player.js file of DOP content
                            this._iFrame.contentWindow.toggleInteractiveMode(action.data.status);
                            /* if (action.data.status) {
                                // freeze function cannot be undone when interactive mode is lost
                                // (issue when getting presenter mode right after for instance)
                                // Chrome can deal with it and change the slide anyway, other browsers cannot obviously
                                // Need to deal without it. Assuming current slide of a native HTML content
                                // with interactive mode activated cannot be changed on click (only DOP content can do that)
                                Object.freeze(this._iFrame.contentWindow.location);
                            } */
                        }
                        if (!this.isInteractiveMode) {
                            // Stopping video if a video has been played by the participant and still playing
                            // this._checkVideoPlayingAndStop();

                            // Hiding video panel just in case
                            this._hideVideoPanel();

                            // In the case the Interactive Mode has been removed directly by presenter by toggling again the Interactive Mode button (the sequence has not been changed though)
                            // then needing to reload the slide in case some animations have been played (slide has to be reinitialized)
                            if (this._iFrame.src === this._iFrameURL) {
                                this._iFrame && this._iFrame.contentWindow && this._iFrame.contentWindow.location.reload(true);
                            }
                        }
                        break;

                    case SDKEvent.LaunchEventNotification:
                        // Reloading current slide to re-synch with presenter's one when leaving pause mode if he changed slide in between
                        if (this._isPaused && action.data.state === SessionStateOCE.PLAYING) {
                            this._iFrame && this._iFrame.contentWindow && this._iFrame.contentWindow.location.reload(true);
                        }

                        if (action.data.state === SessionStateOCE.PAUSED) {
                            this._isPaused = true;
                        } else if (action.data.state === SessionStateOCE.PLAYING) {
                            this._isPaused = false;
                        }
                        break;
                }
            })
        );

        fromEvent(window, 'resize').subscribe((event: Event) => {
            this._refreshContentSize();
        });

        fromEvent(this._iFrame, 'load').subscribe((value: any) => {
            this._loadedIFrame = true;
            this._isScriptInjected = false;
            this._iFrameInjection();
            this._hideBodyScroll();
        });

        // Preventing zoom on Safari iOS
        /* window.addEventListener(
            'touchmove',
            function(event: any) {
                if (event.scale !== 1 && event.scale !== undefined) {
                    event.preventDefault();
                }
            },
            { passive: false }
        ); */

        StorageSvc.isDev && console.log('[SDK] Presentation module initialized');
    }

    public getIFrame() {
        return this._iFrame;
    }

    /**
     * @function isIFrameURL
     * @description
     * @public
     * @return {boolean}
     */
    public isIFrameURL(): boolean {
        return this._iFrameURL ? true : false;
    }

    public injectIFrameAction(): void {
        if (!document.getElementById('IFrame-content')) {
            this.sdk_container = document.querySelector('#' + this._html_container_id);
            // init src of the IFrame (to not reload the old src)
            this._iFrame.src = '';
            this.sdk_container.appendChild(this._loaderSpan);
            // insert the Iframe wrapper always at the first position
            this.sdk_container.insertBefore(this._iFrameWrapper, this.sdk_container.firstChild);
        }
    }

    /**
     * @function injectHtmlAction
     * @description
     * @public
     * @returns {void}
     */
    public injectHtmlAction(): void {
        if (!document.getElementById('IFrame-content')) {
            this.injectIFrameAction();
        }

        // case when the app is broken and reloaded (subject listener broken, happen generally in IE browser)
        // and the the _iFrame object lose his reference to the IFrame node in the dom
        const iFrameElement = <HTMLIFrameElement>document.getElementById('IFrame-content');
        if (!this._iFrame.contentWindow && iFrameElement.contentWindow) {
            this._iFrame = iFrameElement;
        }

        // the setTimeout is necessary to load correctly the IFrame (let a lapse of time between the
        // IFrame HTML injection and the url
        // loading
        if (this._iFrame.contentWindow) {
            try {
                if (this._bowserService.isIE()) {
                    // FOR IE BROWSER (ie don't detect url change if only the hash is different. so we add a random param to differentiate DOP url
                    if (this._iFrame.contentWindow.DopPresentation && this._iFrame.contentWindow.Presentation) {
                        let url = this._iFrameURL.split('#');
                        this._iFrameURL = url[0] + '?' + new Date().getTime() + '#' + url[1];
                    }
                    this._iFrame.src = this._iFrameURL;
                    setTimeout(() => {
                        this._loadedIFrame = true;
                        this._loaderSpan.style.display = 'none';
                        // We do not send the loaded message for the first slide
                        // Because it will be sent by the load event in the constructor
                        const dopPresentationStatus: any = this._getPresentationStatus();
                        if (dopPresentationStatus && dopPresentationStatus.slide && dopPresentationStatus.slide > 1) {
                            this.slideLoadedNotification();
                        }
                    }, 500);
                } else {
                    setTimeout(() => {
                        if (this._iFrameURL) {
                            this._iFrame.src = this._iFrameURL;
                            this._loadedIFrame = true;
                            this._loaderSpan.style.display = 'none';
                            // We do not send the loaded message for the first slide
                            // Because it will be sent by the load event in the constructor
                            const dopPresentationStatus: any = this._getPresentationStatus();
                            if (dopPresentationStatus && dopPresentationStatus.slide && dopPresentationStatus.slide > 1) {
                                this.slideLoadedNotification();
                            }
                        }
                    }, 500);
                }
            } catch (e) {
                console.log(e);
            }
        }

        setTimeout(() => {
            this._refreshContentSize();
        }, 0)

    }

    /**
     * @function isVertical
     * @description
     * @public
     * @returns {boolean}
     */
    public isVertical(): boolean {
        return (window.innerWidth / window.innerHeight) < (this._contentWidth / this._contentHeight);
    }

    /**
     * @function oceShakeEvent
     * @description
     * @public
     * @returns {void}
     */
    public oceShakeEvent(): void {
        if (this._loadedIFrame && this._isScriptInjected && this._iFrame.contentWindow) {
            // Simulating a shaking event (used in OCE Allergy content)
            const shake = new CustomEvent('shake');
            this._iFrame.contentWindow.dispatchEvent(shake);
        }
    }

    /**
     * @function oceRotateEvent
     * @description
     * @public
     * @returns {void}
     */
    public oceRotateEvent(): void {
        if (this._loadedIFrame && this._isScriptInjected && this._iFrame.contentWindow) {
            // Simulating rotating event (used in OCE Allergy content)
            const rotate = new DeviceOrientationEvent('deviceorientation', {alpha: 155});
            this._iFrame.contentWindow.dispatchEvent(rotate);
        }
    }

    /**
     * @function hide scroll but keep functionality
     * @description
     * @public
     * @returns {void}
     */
    private _hideBodyScroll(): void {
        if (!this._iFrame && !this._iFrame.contentWindow && !this._iFrame.contentWindow.document) {
            return;
        }
        const styleElement = document.createElement('style');
        styleElement.innerText = 'body::-webkit-scrollbar { display: none; } body { -ms-overflow-style: none; }';
        const headNode = this._iFrame.contentWindow.document.getElementsByTagName('head')[0];
        headNode.appendChild(styleElement);
    }

    /**
     * @function fulfilMustacheVar
     * @description
     * @private
     * @param {string} dynamicContent
     * @returns {void}
     */
    private fulfilMustacheVar(dynamicContent: string): void {
        if (!dynamicContent && !this._iFrame && !this._iFrame.contentWindow && !this._iFrame.contentWindow.document) {
            return;
        }
        const innerDynamicContentVarRegex = /(\w*)\s*=\s*{{{.}}}/g;
        const doc = this._iFrame.contentWindow.document;
        const found = doc.head.textContent.match(innerDynamicContentVarRegex)
            || doc.body.textContent.match(innerDynamicContentVarRegex);
        if (!found || !Array.isArray(found)) return;
        let varName = found && found[0].split('=')[0].trim();
        this._iFrame.contentWindow[varName] = dynamicContent;
    }

    /**
     * @function goMustacheParsing
     * @public
     * @description Function that launches the Mustache parsing with the passed dynamic content.
     * Sub objects' property name have to match with Mustache variables name set in the HTML file.
     * @param {any} dynamicContent
     * @returns {void}
     */
    public goMustacheParsing(dynamicContent: any): void {
        if (!dynamicContent && !this._iFrame && !this._iFrame.contentWindow && !this._iFrame.contentWindow.document) {
            return;
        }
        const body = this._iFrame.contentWindow.document.body;
        const bodyText = body && body.textContent;
        const mustacheLoopVars = bodyText.match(/({{ ?[0-9a-zA-Z\-\_]+ ?}})/g);
        const openingMustacheLoopVars = bodyText.match(/({{ ?#[0-9a-zA-Z\-\_]+ ?}})/g);
        if (mustacheLoopVars || openingMustacheLoopVars) {
            const mustacheVars = {
                mustacheLoopVars: mustacheLoopVars,
                openingMustacheLoopVars: openingMustacheLoopVars
            };
            this._addDatasetAttrIntoClosestParentNode(mustacheVars);
            this._parseMustacheVariables(dynamicContent);
        }
    }

    /**
     * @function slideLoadedNotification
     * @description
     * @public
     * @returns {void}
     */
    public slideLoadedNotification(): void {
        this._player.eventDispatcher({type: EventTypes.SLIDE_LOADED, data: this._sequenceData});
    }

    /**
     * @function _checkVideoPlayingAndStop
     * @description
     * @private
     * @returns {void}
     */
    private _checkVideoPlayingAndStop(): void {
        const videoElems: any = this._iFrame && this._iFrame.contentWindow && this._iFrame.contentWindow.document.getElementsByTagName('video');
        for (let i = 0, length = videoElems.length; i < length; i++) {
            const currentVideo = videoElems[i];
            console.log(currentVideo);
            if (currentVideo && !!(currentVideo.currentTime > 0 && !currentVideo.paused && !currentVideo.ended && currentVideo.readyState > 2)) {
                currentVideo.pause();
            }
        }
    }

    /**
     * @function _hideVideoPanel
     * @description
     * @private
     * @returns {void}
     */
    private _hideVideoPanel(): void {
        const videoPanelElem: any = this._iFrame && this._iFrame.contentWindow && this._iFrame.contentWindow.document.getElementById('video-panel');
        if (videoPanelElem) {
            videoPanelElem.style.display = 'none';
        }
    }

    /**
     * @function _clearSubscriptions
     * @description
     * @private
     * @returns {void}
     */
    private _clearSubscriptions(): void {
        this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    }

    /**
     * @function _initPresentationData
     * @description
     * @private
     * @param {IPresentationData} data
     * @returns {void}
     */
    private _initPresentationData(data: IPresentationData): void {
        this._contentHeight = data && data.size && data.size.height || this._contentHeight || 768;
        this._contentWidth = data && data.size && data.size.width || this._contentWidth || 1024;

        this._loadedIFrame = false;

        this._iFrameURL = data && data.url;

        this.PRESENTATION_ID = data && data.presentationIdentifier;
        this.ACCOUNT_ID = data && data.accountIdentifier;
        this.SEQUENCE_ID = data && data.sequenceIdentifier;
        this.SLIDE_NAME = data && data.slideName;
        this._videoAction = data && data.video;

        this.sdk_container = document.querySelector('#' + this._html_container_id);
        if (this.sdk_container) {
            this.injectHtmlAction();
        } else {
            this.subscriptions.push(
                fromEvent(document, 'load').subscribe(
                    () => {
                        this.sdk_container = document.querySelector('#' + this._html_container_id);
                        this.injectHtmlAction()
                    }
                ));
        }
    }

    /**
     * @function _iFrameInjection
     * @description
     * @private
     * @returns {void}
     */
    private _iFrameInjection(): void {
        const eventSimScript = document.createElement('script');
        const clmCommonScript = document.createElement('script');
        const cloudFrontURL = this._player.StorageSvc.getCloudFrontURL();
        if (!cloudFrontURL) return;
        eventSimScript.type = 'text/javascript';
        clmCommonScript.type = 'text/javascript';

        if (this.CLM_COMMON_SCRIPT_URL) {
            clmCommonScript.src = cloudFrontURL + this.CLM_COMMON_SCRIPT_URL;
        }
        try {
            if (this._iFrame.contentWindow.document && this._iFrame.src === this._iFrameURL) {
                if (this._eventService.videoActionRequests.closed) {
                    this._eventService.initVideoActionRequestsReplay();
                }

                this.subscriptions.push(
                    this._eventService.videoActionRequests.subscribe((action: SDKResponse) => {
                        switch (action.event) {
                            case SDKEvent.VideoEvent:
                                setTimeout(() => {
                                    // Looking for the first video element
                                    // Could set an issue if a DOP presentation with multiple virtual pages has several video elements
                                    if (this._iFrame && this._iFrame.contentWindow && this._iFrame.contentWindow.document && this._iFrame.contentWindow.document.getElementsByTagName('video')[0]) {
                                        this._eventService.launchVideoAction(action.data);
                                    }
                                }, 500);
                                break;
                        }
                    })
                );

                const headNode = this._iFrame.contentWindow.document.getElementsByTagName('head')[0];

                if (!headNode) throw new Error('Slide not loaded');

                headNode.appendChild(eventSimScript);
                headNode.appendChild(clmCommonScript);

                this._isScriptInjected = true;

                setTimeout(() => {
                    // console.info('JS scripts injected');

                    // Sending event when slide is loaded with slide ids
                    this.slideLoadedNotification();

                    // Player.js should be loaded, thus activating interactive mode if needed
                    if (this.isInteractiveMode && this._iFrame.contentWindow && this._iFrame.contentWindow.toggleInteractiveMode) {
                        this._iFrame.contentWindow.toggleInteractiveMode(true);
                        // Object.freeze(this._iFrame.contentWindow.location);
                    }
                }, 1000);

                // TODO: To enable to initialize custom video player
                /* setTimeout(() => {
                    // Custom video player
                    if (this._iFrame.contentWindow && this._iFrame.contentWindow.customVideoPlayer) {
                        const videoElems = this._iFrame.contentWindow.document.getElementsByTagName('video');
                        videoElems && videoElems.length && videoElems[0].addEventListener('loadeddata', () => {
                            this._iFrame.contentWindow.customVideoPlayer().init();
                        });
                        // For cases where loadeddata is not called
                        this._iFrame.contentWindow.customVideoPlayer().init();
                    }
                }, 1000); */

                if (this._bowserService.isIE()) {
                    setTimeout(() => {
                        // Checking presence of the body into the iframe
                        // If empty, then refreshing the iframe
                        this._checkBodyAndRefresh();
                    }, 2000);
                }
            }

            // Sending notification if the slide contains a video (for now only one video per slide)
            const videoContent = this._iFrame.contentWindow.document.getElementsByTagName('video');
            if (videoContent.length) {
                this._eventService.videoNotification(videoContent[0], this._videoAction);
            }
            // Mustache Parsing
            setTimeout(() => {
                if (this._sequenceData && this._sequenceData.hasOwnProperty('dynamicContent')) {
                    const dynamicContentParsed = JSON.parse(this._sequenceData.dynamicContent);
                    this.fulfilMustacheVar(dynamicContentParsed);
                    this.goMustacheParsing(dynamicContentParsed);
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    private _injectConfigData():void {
        try {
            const configData = this.buildPresentationData();
            localStorage.setItem('config_' + this._sequenceData.sequenceName, JSON.stringify(configData));
        } catch (e) {
            console.info(e);
        }
    }

    private buildPresentationData():any {
        //todo: add multi presentation support
        const presentation = this._sequenceData.clmData.presentations[this._player.StorageSvc.getCurrentPresentation()];

        const sequencesDics: Array<{}> = [];
        for(const sequence in presentation.sequences) {
            const sequenceData:{} = {
                id: presentation.sequences[sequence].id,
                name: presentation.sequences[sequence].key,
                slides : []
            };
            sequencesDics.push(sequenceData);
        }

        const result:{} = {
            id: presentation.id,
            name: presentation.id,
            sequences: sequencesDics
        };

        return {
            presentationIndex: 0,
            presentations: [result],
            customers: [this.getCustomerData()]
        };
    }

    private getCustomerData(isPrimary:boolean = false): any {
        return {
            isPrimary : false,
            ...this._sequenceData.clmData.account
        }
    }

    /**
     * @function _checkBodyAndRefresh
     * @description
     * @private
     * @returns {void}
     */
    private _checkBodyAndRefresh(): void {
        if (this._iFrame && this._iFrame.contentWindow) {
            const body = this._iFrame.contentWindow.document.getElementsByTagName('body')[0];
            if (body && !body.innerHTML.trim().length) {
                this._iFrame.contentWindow.location.reload();
            }
        }
    }

    /**
     * @function _initHtmlIFrame
     * @description
     * @private
     * @returns {void}
     */
    private _initHtmlIFrame(): void {
        const IFrame = document.getElementById('iFrame-wrapper');
        const loader = document.getElementById('slide-loader');
        if (IFrame) {
            if (!this.sdk_container) {
                this.sdk_container = document.querySelector('#' + this._html_container_id);
            }
            if (loader) {
                this.sdk_container.removeChild(loader);
            }
            this.sdk_container.removeChild(IFrame);
        }

        this._iFrame.sandbox.add('allow-scripts');
        this._iFrame.sandbox.add('allow-forms');
        this._iFrame.sandbox.add('allow-same-origin');
        this._iFrame.sandbox.add('allow-popups');
        this._iFrame.sandbox.add('allow-modals');
        this._iFrame.sandbox.add('allow-popups-to-escape-sandbox');
        this._iFrame.scrolling = 'yes';
        this._iFrame.style.border = 'none';
        this._iFrame.id = 'IFrame-content';

        this._iFrameWrapper.appendChild(this._iFrame);
        this._iFrameWrapper.id = 'iFrame-wrapper';

        this._loaderSpan = document.createElement('span');
        this._loaderSpan.innerHTML = IMAGES.loader_svg;
        this._loaderSpan.id = 'slide-loader';
    }

    /**
     * @function refreshContentSize
     * @description
     * @public
     * @returns {void}
     */
    private _refreshContentSize(): void {
        let margin: number;

        if (this.sdk_container && this._iFrame && this._contentWidth > 0 && this._contentHeight > 0) {
            if (this.isVertical()) {
                this.scale = (window.innerWidth / this._contentWidth);
                this.scale = (this.scale * 100) / 100;
                margin = (window.innerHeight - (this._contentHeight * this.scale)) / 2;

                this._iFrame.style.width = this._contentWidth + 'px';
                this._iFrame.style.height = this._contentHeight + 'px';

                this._iFrameWrapper.style.width = this._contentWidth + 'px';
                this._iFrameWrapper.style.height = this._contentHeight + 'px';
                this._iFrameWrapper.style.transform = 'scale(' + this.scale + ')';
                this._iFrameWrapper.style.left = 0;
                this._iFrameWrapper.style.top = 0;
                this._iFrameWrapper.style.position = 'absolute';

                this.sdk_container.style.width = '100%';
                this.sdk_container.style.height = this._iFrame.getBoundingClientRect().height + 'px';
                this.sdk_container.style.top = margin + 'px';
                this.sdk_container.style.left = 0;
                this.sdk_container.style.transform = 'none';
                this.sdk_container.style.position = 'absolute';

                SharedCSS.PlayerStyle.width = this._contentWidth + 'px';
                SharedCSS.PlayerStyle.height = this._contentHeight + 'px';
                SharedCSS.PlayerStyle.left = '0';
                SharedCSS.PlayerStyle.top = '0';
                SharedCSS.PlayerStyle.scale = this.scale;
            } else {
                this.scale = (window.document.documentElement.clientHeight / this._contentHeight);
                this.scale = (this.scale * 100) / 100;
                margin = (window.innerWidth - (this._contentWidth * this.scale)) / 2;

                this.sdk_container.style.width = '100%';
                this.sdk_container.style.height = window.document.documentElement.clientHeight + 'px';
                this.sdk_container.style.top = 0;
                this.sdk_container.style.left = 0;
                this.sdk_container.style.transform = 'none';
                this.sdk_container.style.position = 'absolute';
                this.sdk_container.style.overflow = 'hidden';

                SharedCSS.PlayerStyle.width = this._contentWidth + 'px';
                SharedCSS.PlayerStyle.height = this._contentHeight + 'px';
                SharedCSS.PlayerStyle.left = margin + 'px';
                SharedCSS.PlayerStyle.top = '0';
                SharedCSS.PlayerStyle.scale = this.scale;

                this._iFrame.style.width = this._contentWidth + 'px';
                this._iFrame.style.height = this._contentHeight + 'px';

                this._iFrameWrapper.style.width = this._contentWidth + 'px';
                this._iFrameWrapper.style.height = this._contentHeight + 'px';
                this._iFrameWrapper.style.transform = 'scale(' + this.scale + ')';
                this._iFrameWrapper.style.left = margin + 'px';
                this._iFrameWrapper.style.top = 0;
                this._iFrameWrapper.style.position = 'absolute';
            }

            this._eventService.SharedCSSEvent();
        }
    }

    /**
     * @function launchEvent
     * @description
     * @public
     * @param {any} touch
     * @returns {void}
     */
    private launchEvent(touch: any): void {
        // If the Iframe and injected scripts are ready
        if (this._loadedIFrame && this._isScriptInjected && this._iFrame.contentWindow) {
            let presentationStatus: DopResponse | null = this._getPresentationStatus();
            const oldStep: number = presentationStatus ? presentationStatus.slide : 0;

            // Simulating the good event according the combination browser/device
            this._simulateGoodEvent(touch.event, touch.x, touch.y);

            setTimeout(() => {
                presentationStatus = this._getPresentationStatus();
                const newStep: number = presentationStatus ? presentationStatus.slide : 0;
                if (oldStep !== newStep) {
                    // Initializing the _iFrameURL variable after slide change (changing slide needs to initialize the URL)
                    // this._iFrameURL = '';

                    this._eventService.clearDrawedShapes();

                    // Sending event when slide is loaded with slide ids
                    this.slideLoadedNotification();
                }
            }, 500);
        }
    }

    /**
     * @function _simulateGoodEvent
     * @description Simulating the good event according the combination browser/device
     * @private
     * @param {string} event
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    private _simulateGoodEvent(event: string, x: number, y: number): void {
        // Event constants
        const isMouseClickEvent = this.isDesktop && event === MouseEventType.CLICK;
        const isMouseDownEvent = this.isDesktop && event === MouseEventType.MOUSE_DOWN;
        const isMouseMoveEvent = this.isDesktop && event === MouseEventType.MOUSE_MOVE;
        const isMouseUpEvent = this.isDesktop && event === MouseEventType.MOUSE_UP;
        const isMouseEnterEvent = this.isDesktop && event === MouseEventType.MOUSE_ENTER;
        const isMouseLeaveEvent = this.isDesktop && event === MouseEventType.MOUSE_LEAVE;
        const isMobileTapEvent = (this.isMobile || this.isTablet) && event === MouseEventType.CLICK;
        const isMobileTouchStartEvent = (this.isMobile || this.isTablet) && event === MouseEventType.MOUSE_DOWN;
        const isMobileTouchMoveEvent = (this.isMobile || this.isTablet) && event === MouseEventType.MOUSE_MOVE;
        const isMobileTouchEndEvent = (this.isMobile || this.isTablet) && event === MouseEventType.MOUSE_UP;
        const isMobileTouchCancelEvent = (this.isMobile || this.isTablet) && event === MouseEventType.MOUSE_LEAVE;

        // Overlay components on IE need to be hidden to capture mouse events
        if (this.isIEDesktop) {
            this._hideComponent(true);
        }

        // Dealing with desktop browsers
        if (this.isDesktop) {
            // Dealing with events other than click event
            if (isMouseDownEvent || isMouseMoveEvent || isMouseUpEvent || isMouseEnterEvent || isMouseLeaveEvent) {
                this._simulateMouseEvent(event, x, y);
            }
            // Dealing with click event
            else if (isMouseClickEvent) {
                this._simulateMouseClickEvent(x, y);
            }

        }
        // Dealing with mobile and tablet browsers
        else if (this.isMobile || this.isTablet) {
            // Dealing with events other than tap event
            if (isMobileTouchStartEvent || isMobileTouchMoveEvent || isMobileTouchEndEvent || isMobileTouchCancelEvent) {
                this._simulateTouchEvent(event, x, y);
            }
            // Dealing with tap event
            else if (isMobileTapEvent) {
                if (this.isSafariTablet) {
                    this._simulateTouchTapEvent(x, y);
                } else {
                    this._simulateMouseClickEvent(x, y);
                }
            }
        }

        if (this.isIEDesktop) {
            this._hideComponent(false);
        }
    }

    /**
     * @function _simulateMouseEvent
     * @description
     * @private
     * @param {string} event
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    private _simulateMouseEvent(event: string, x: number, y: number): void {
        const iframe = this._iFrame && this._iFrame.contentWindow;
        if (typeof iframe.simulateMouseEvent === 'function') {
            iframe.simulateMouseEvent(x, y, event);
        }
    }

    /**
     * @function _simulateMouseClickEvent
     * @description
     * @private
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    private _simulateMouseClickEvent(x: number, y: number): void {
        const iframe = this._iFrame && this._iFrame.contentWindow;
        if (typeof iframe.simulateMouseClick === 'function') {
            iframe.simulateMouseClick(x, y);
        }
    }

    /**
     * @function _simulatetouchTapEvent
     * @description
     * @private
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    private _simulateTouchTapEvent(x: number, y: number): void {
        const iframe = this._iFrame && this._iFrame.contentWindow;
        if (typeof iframe.simulateTouchTap === 'function') {
            iframe.simulateTouchTap(x, y);
        }
    }

    /**
     * @function _simulateTouchEvent
     * @description
     * @private
     * @param {string} event
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    private _simulateTouchEvent(event: string, x: number, y: number): void {
        const iframe = this._iFrame && this._iFrame.contentWindow;
        const isDOPContent = iframe.DopPresentation;
        if (typeof iframe.simulateTouchEvent === 'function') {
            iframe.simulateTouchEvent(x, y, event);

            // Calling again function with touchEventType parameter
            // TODO: seems to bring an issue with click with Allergy content confirm button presenter on iPad and participant on iPad as well
            let eventSimulated: string;
            if (event === MouseEventType.MOUSE_DOWN) {
                eventSimulated = TouchEventType.TOUCH_START;
            } else if (event === MouseEventType.MOUSE_MOVE) {
                eventSimulated = TouchEventType.TOUCH_MOVE;
            } else if (event === MouseEventType.MOUSE_UP) {
                eventSimulated = TouchEventType.TOUCH_END;
            } else if (event === MouseEventType.MOUSE_LEAVE) {
                eventSimulated = TouchEventType.TOUCH_CANCEL;
            }
            if (!isDOPContent) {
                iframe.simulateTouchEvent(x, y, eventSimulated);
            }
        }
    }

    /**
     * @function _addDatasetAttrIntoClosestParentNode
     * @description Add `data-tpl="mustache"` attribute to the closest parent HTML node of each Mustache variable (basic and loop ones)
     * @private
     * @param {any} mustacheVars
     * @returns {void}
     */
    private _addDatasetAttrIntoClosestParentNode(mustacheVars: any): void {
        // Dealing with Mustache loop variables
        // Assuming each opening Mustache loop variables has a closing sibling
        if (mustacheVars.openingMustacheLoopVars) {
            for (let o of mustacheVars.openingMustacheLoopVars) {
                this._addDatasetAttr(o);
            }
        }
        if (mustacheVars.mustacheLoopVars) {
            // Dealing with Mustache basic variables
            for (let m of mustacheVars.mustacheLoopVars) {
                this._addDatasetAttr(m);
            }
        }
    }

    /**
     * @function _addDatasetAttr
     * @description Add a dataset attribute in the closest HTML node for further Mustache variables recognition
     * @private
     * @param {string} mustacheVar
     * @returns {void}
     */
    private _addDatasetAttr(mustacheVar: string): void {
        const parentTag = this._findClosestParentNode(mustacheVar);
        if (parentTag) {
            parentTag.dataset.tpl = 'mustache';
        }
    }

    /**
     * @function _findClosestParentNode
     * @description Find the closest parent HTML node containing the passed
     * @private
     * @param {string} mustacheVar
     * @returns {any} foundTag
     */
    private _findClosestParentNode(mustacheVar: string): any {
        const allTags: any = this._iFrame.contentWindow.document.body.getElementsByTagName('*');
        let foundTag;
        for (let tag of allTags) {
            if (tag.textContent.indexOf(mustacheVar) !== -1) {
                foundTag = tag;
                // We do not break the loop not to stop to uppermost parent tag
            }
        }
        return foundTag;
    }

    /**
     * @function _parseMustacheVariables
     * @description Parse Mustache variables inside HTML tags containing  `data-tpl="mustache"` attribute
     * @private
     * @param {any} dynamicContent
     * @returns {void}
     */
    private _parseMustacheVariables(dynamicContent: any): void {
        const contents: any = this._iFrame.contentWindow.document.querySelectorAll('[data-tpl]');
        if (contents.length > 0 && this.Mustache) {
            for (const content of contents) {
                if (content.dataset.hasOwnProperty('tpl') && content.dataset.tpl === 'mustache') {
                    content.innerHTML = this.Mustache.render(content.innerHTML, dynamicContent);
                }
            }
        }
    }

    /**
     * @function _getPresentationStatus
     * @description
     * @private
     * @returns {DopResponse|null}
     */
    private _getPresentationStatus(): DopResponse | null {
        // Avoiding cross-origin issue in not production environment (if proxy is well activated we can avoid cros problem)
        if (!this.PRODUCTION) {
            return null;
        }
        if (this._iFrame.contentWindow) {
            if (!this._iFrame.contentWindow.DopPresentation || !this._iFrame.contentWindow.Presentation) {
                return null;
            } else {
                return this._iFrame.contentWindow.Presentation &&
                    typeof this._iFrame.contentWindow.Presentation.CurrentStatus === 'function' &&
                    this._iFrame.contentWindow.Presentation.CurrentStatus();
            }
        } else {
            return null;
        }
    }

    /**
     * @function _hideComponent
     * @description
     * @private
     * @param {boolean} hide
     * @returns {void}
     */
    private _hideComponent(hide: boolean): void {
        if (hide) {
            document.getElementById('drawing-panel').style.display = 'none';
            document.getElementById('touch-panel').style.display = 'none';
        } else {
            document.getElementById('drawing-panel').style.display = 'block';
            document.getElementById('touch-panel').style.display = 'block';
        }
    }

}
