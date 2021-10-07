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

export class PresentationPdf {

    /**
     * Data members
     */
    public scale: number = 0;
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
    private pdfJsLib = require('pdfjs-dist/build/pdf');
    // private pdfJsWorker = require('pdfjs-dist/build/pdf.worker');
    private pdfJsWorker: string = process.env.PDF_WORKER;
    private _html_container_id: string = Config.html_container;
    private _contentWidth: number = 0;
    private _contentHeight: number = 0;
    private _iFrameURL: string = '';
    private _iFrame: any;
    private _canvas: any;
    private _ctx: any;
    private _iFrameWrapper: any;
    private _isScriptInjected: boolean = false;
    private subscriptions: Subscription[] = [];
    private _videoAction: VideoAction[] = [];
    private sdk_container: any;
    private _loaderSpan: HTMLSpanElement;
    // private IS_PROXY: string = process.env.PROXY_CONFIG;
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
    private pdfDoc: any;
    private pageNum: number;
    private pageRendering: boolean;
    private pageNumPending: number;
    private initStatus: boolean;

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
        this._initCanvas();

        this._clearSubscriptions();

        this.subscriptions.push(
            this._eventService.actionRequestsReplay.subscribe((action: SDKResponse) => {
                switch (action.event) {
                    case SDKEvent.PresentationLoadPdf:
                        if (action.data.url !== this._iFrameURL) {
                            this._sequenceData = action.data;
                            this.injectCanvas();
                        }
                        break;

                    case SDKEvent.LaunchEventOnContent:
                        break;

                    case SDKEvent.isInteractiveMode:
                        break;

                    case SDKEvent.LaunchEventNotification:
                        break;
                }
            })
        );

        fromEvent(window, 'resize').subscribe((event: Event) => {
            this.onResize();
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

        console.log('[SDK] Presentation PDF module initialized');
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

    public _initCanvas(): void {
        this._canvas  = document.createElement('canvas');
        this._canvas.id = 'canvas-content';
        this._canvas.style.zIndex = '-5';
        this._canvas.width = 0;
        this._canvas.height = 0;

        document.getElementById(this._html_container_id).appendChild(this._canvas);

        this._loaderSpan = document.createElement('span');
        this._loaderSpan.style.position = 'absolute';
        this._loaderSpan.style.width = '54px';
        this._loaderSpan.style.height = '54px';
        this._loaderSpan.style.display = 'block';
        this._loaderSpan.style.top = 'calc(50% - 27px)';
        this._loaderSpan.style.left = 'calc(50% - 27px)';
        this._loaderSpan.style.zIndex = '10';
        this._loaderSpan.innerHTML = IMAGES.loader_svg;
        this._loaderSpan.id = 'pdf-loader';
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

        this.PRESENTATION_ID = data && data.presentationIdentifier;
        this.ACCOUNT_ID = data && data.accountIdentifier;
        this.SEQUENCE_ID = data && data.sequenceIdentifier;
        this.SLIDE_NAME = data && data.slideName;
        this._videoAction = data && data.video;

        this.sdk_container = document.querySelector('#' + this._html_container_id);
        if (this.sdk_container) {
            this.injectCanvas();
        } else {
            this.subscriptions.push(
                fromEvent(document, 'load').subscribe(
                    () => {
                        this.sdk_container = document.querySelector('#' + this._html_container_id);
                        this.injectCanvas()
                    }
                ));
        }
    }

    /**
     * @function focusOnThumbnail
     * @public
     * @description Make an thumbnail element as selected
     * @param {Element} thumbnailElement
     * @returns {void}
     */
    public focusOnThumbnail(thumbnailElement:any):void {
        if (thumbnailElement) {
            // Removing potential selected classname from all elements with thumbnail classname
            const thumbnails = document.getElementsByClassName('thumbnail');
            Array.from(thumbnails).forEach(item => item.classList.remove('selected'));
            // Adding selected classname to the thumbnail passed in parameter
            thumbnailElement.classList.add('selected');
        }
    }

    public injectCanvas(): void {
        if (!document.getElementById('canvas-content')) {
            this.sdk_container = document.querySelector('#' + this._html_container_id);
            // init src of the IFrame (to not reload the old src)
            this.sdk_container.appendChild(this._loaderSpan);
            // insert the Iframe wrapper always at the first position
            this.sdk_container.insertBefore(this._iFrameWrapper, this.sdk_container.firstChild);
        }

        // case when the app is broken and reloaded (subject listener broken, happen generally in IE browser)
        // and the the _iFrame object lose his reference to the IFrame node in the dom
        const canvasElement = <HTMLCanvasElement>document.getElementById('canvas-content');
        if (!this._canvas && canvasElement) {
            this._canvas = canvasElement;
        }

        const url = this._sequenceData.url;

        // Loaded via <script> tag, create shortcut to access PDF.js exports.
        const pdfJsLib = this.pdfJsLib;

        // pdfJsLib.GlobalWorkerOptions.workerSrc = "webpack://SDK/./node_modules/pdfjs-dist/build/pdf.worker.js";
        pdfJsLib.GlobalWorkerOptions.workerSrc = this.pdfJsWorker;


        this.pageNum = 1;
        this.pageRendering = false;
        this.pageNumPending = null;
        this.pdfDoc = null;
        this.scale = 0.8;
        this._ctx = this._canvas.getContext('2d');

        this.initControls();

        /**
         * Asynchronously downloads PDF.
         */
        pdfJsLib.getDocument(url).promise.then((pdfDoc_:any) => {
            /* const div = document.createElement("div");
            div.id = 'slideshow';
            div.classList.add('show');*/
            const slideShowDiv = document.getElementById("slides-thumbnail");
            slideShowDiv.innerHTML = '';
            const pages = [];
            for (let index = 1; index <= pdfDoc_.numPages; index++) {
                pages.push(index);
            }

            Promise.all(pages.map((num) => {
                // create a div for each page and build a small canvas for it
                const thumbnail = document.createElement('div');
                thumbnail.classList.add('thumbnail');
                thumbnail.id = 'thumbnail-' + num;
                // Attaching a click event to the thumbnail element that will load the corresponding URL through the SDK
                thumbnail.onclick = () => {
                    this.pageNum = num;
                    this.renderPage(num);
                    // Making the clicked element as selected
                    this.focusOnThumbnail(thumbnail);
                };

                slideShowDiv.appendChild(thumbnail);

                // document.getElementById('player').appendChild(div);
                return pdfDoc_.getPage(num).then((page:any) => {
                    // draw page to fit into 96x96 canvas
                    const vp = page.getViewport({scale: 1});
                    const canvas = document.createElement("canvas");
                    canvas.width = 160;
                    canvas.height = 120;
                    const scale = Math.min(canvas.width / vp.width, canvas.height / vp.height);
                    const params = {
                        canvasContext: canvas.getContext('2d'),
                        viewport: page.getViewport({'scale': scale})
                    };
                    return page.render(params).promise.then(() => {
                        return canvas;
                    });
                }).then((canvas:any) => {
                    thumbnail.appendChild(canvas);
                });
            }));
            this.initStatus = true;
            this.pdfDoc = pdfDoc_;
            document.getElementById('player-page-count').textContent = this.pdfDoc.numPages;

            // Initial/first page rendering
            this.renderPage(this.pageNum);
        });
    }

    public getWindowHeight():number {
        return window.innerHeight;
    }

    public getWindowWidth():number {
        return window.innerWidth;
    }

    public renderPage(num: any): void {
        this.pageRendering = true;
        this._loaderSpan.style.display = 'block';
        // Using promise to fetch the page
        this.pdfDoc.getPage(num).then((page:any) => {
            document.getElementById('player').style.height = this.getWindowHeight() + 'px';

            let scale;
            const desiredHeight = this.getWindowHeight();
            const desiredWidth = this.getWindowWidth();
            const viewport = page.getViewport({scale: 1});

            scale = Math.min(desiredWidth / viewport.width, desiredHeight / viewport.height);

            const scaledViewport = page.getViewport({'scale': scale,});

            this._canvas.height = scaledViewport.height;
            this._canvas.width = scaledViewport.width;

            // Render PDF page into canvas context
            const renderContext = {
                canvasContext: this._ctx,
                viewport: scaledViewport
            };
            const renderTask = page.render(renderContext);

            // Wait for rendering to finish
            renderTask.promise.then(() => {
                this.pageRendering = false;
                if (this.pageNumPending !== null) {
                    // New page rendering is pending
                    this.renderPage(this.pageNumPending);
                    this.pageNumPending = null;
                } else {
                    document.getElementById('slide-loader').style.display = 'none';
                    // We do not send the loaded message for the first slide
                    // Because it will be sent by the load event in the constructor
                    this._eventService.PresentationLoaded(this._sequenceData);
                }
            });
        });

        // Update page counters
        document.getElementById('player-page-num').textContent = num;
    }

    public initControls(): void {
        document.getElementById('player-arrow-left').addEventListener('click', () => {
            if (this.pageNum <= 1) {
                return;
            }
            this.pageNum--;
            this.focusOnThumbnail(document.getElementById('thumbnail-' + this.pageNum))
            this.queueRenderPage(this.pageNum);
        });
        document.getElementById('player-arrow-right').addEventListener('click', () => {
            if (this.pageNum >= this.pdfDoc.numPages) {
                return;
            }
            this.pageNum++;
            this.focusOnThumbnail(document.getElementById('thumbnail-' + this.pageNum))
            this.queueRenderPage(this.pageNum);
        });
    }

    public queueRenderPage(num: number): void {
        if (this.pageRendering) {
            this.pageNumPending = num;
        } else {
            this.renderPage(num);
        }
    };

    public onResize():void {
        if (!this.initStatus) {
            return;
        }
        if (this.pageRendering) {
            this.pageNumPending = this.pageNum;
        } else {
            this.renderPage(this.pageNum);
        }
    }

    /**
     * @function slideLoadedNotification
     * @description
     * @public
     * @returns {void}
     */
    public slideLoadedNotification(): void {
        this._player.eventSubscriber({
            type: EventTypes.SLIDE_LOADED,
            data: this._sequenceData
        });
    }
}
