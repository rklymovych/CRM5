import {BaseElement, IBaseElement} from '../BaseElement';
import './PresentationThumbs.css';
import {EventsService, SDKEvent} from "../../../../shared/events.service";
import {Thumbnail} from "../Thumbnail/Thumbnail";
import {IPresentation} from "../../../../models/presentation";
import {ISlide} from "../../../../models/slide";
import StorageSvc from "../../../../shared/storage.service";
import {SDKResponse} from "../../../../models/SDKResponse";
import {Subscription} from "rxjs";

interface IPresentationThumbs extends IBaseElement {
    clmPath: string;
    presentations: IPresentation[]
}

export class PresentationThumbs extends BaseElement {
    clmPath: string;
    private _presentations: IPresentation[];
    private _thumbnails: Thumbnail[];
    public subscriptions: Subscription[] = [];

    constructor(
        params: IPresentationThumbs,
        private _eventService: EventsService
    ) {
        super({...params, id: 'presentation-thumbs', classes: 'thumbs'});
        this.clmPath = params.clmPath;
        this._presentations = params.presentations;
        this.init();
        this._clearSubscriptions();
        this.subscriptions.push(
            this._eventService.actionRequestsReplay.subscribe((action: SDKResponse) => {
                switch (action.event) {
                    case SDKEvent.PresentationLoaded:
                        this.setThumbViewed(action.data.index);
                        break;
                    default:
                        break
                }
            })
        );
    }

    onInit() {
        this._loadThumbs();
    }

    public setThumbViewed(thumbId: number) {
        this._thumbnails.forEach(thumbnail => {
            thumbnail.setSelected(thumbId);
        });
    }

    private _clearSubscriptions(): void {
        this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    }

    private _loadThumbs() {
        const _this = this;
        this._thumbnails = this._presentations.map((presentation, i) => {
            const firstSlide = presentation.sequences[0].slides[0];
            const thumbnailImg = [this.clmPath, firstSlide.sequencePath, firstSlide.thumbnail].join('/');
            return new Thumbnail({
                classes: 'thumbnail',
                container: this.element,
                mode: 'presentations',
                title: presentation.name,
                index: +i,
                thumbnailImg: thumbnailImg,
                clickFn(e, el) {
                    _this._eventService.PresentationChange(el.index);
                }
            });
        })
    }

    private _destroyThumbnails() {
        if (!this._thumbnails || !this._thumbnails.length) return;
        this._thumbnails.forEach(thumbnail => {
            thumbnail.destroy();
        });
        this._thumbnails = [];
    }

    public changePresentations(presentations: IPresentation[]) {
        this._presentations = presentations;
        this._destroyThumbnails();
        this._loadThumbs();
    }
}
