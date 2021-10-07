import {BaseElement, IBaseElement} from '../BaseElement';
import './SlidesThumbs.css';
import {EventsService, SDKEvent} from "../../../../shared/events.service";
import {Thumbnail} from "../Thumbnail/Thumbnail";
import {ISlide} from "../../../../models/slide";
import {Presentation} from "../../Presentation";
import {SDKResponse} from "../../../../models/SDKResponse";
import {Subscription} from "rxjs";
import StorageSvc from '../../../../shared/storage.service';

interface ISlidesThumbs extends IBaseElement {
    clmPath: string
    slides: ISlide[]
}

export class SlidesThumbs extends BaseElement {
    clmPath: string;
    private _slides: ISlide[];
    public thumbnails: Thumbnail[];
    public subscriptions: Subscription[] = [];

    constructor(
        params: ISlidesThumbs,
        private _eventService: EventsService,
        private _presentation: Presentation
    ) {
        super({...params, id: 'slides-thumbs', classes: 'thumbs'});
        this.clmPath = params.clmPath;
        this._slides = params.slides;
        this.init();
        this._clearSubscriptions();
        this.subscriptions.push(
            this._eventService.actionRequestsReplay.subscribe((action: SDKResponse) => {
                switch (action.event) {
                    case SDKEvent.PresentationLoadSlide:
                        this.setSlideAndThumbViewed(action.data.slide.id);
                        break;

                    case SDKEvent.PresentationSlideLoaded:
                        break;
                    default:
                        break
                }
            })
        );
    }

    setSlideAndThumbViewed(thumbId: number) {
        this.thumbnails.forEach(thumbnail => {
            thumbnail.setSelected(thumbId);
        });

        StorageSvc.setSlideViewed(thumbId);
    }

    onInit() {
        this._loadThumbs();
    }

    private _clearSubscriptions(): void {
        this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    }

    private _loadThumbs() {
        const _this = this;
        this.thumbnails = this._slides.map((item: ISlide, index:any, array:any) => {
            const thumbnailImg = [this.clmPath, item.sequencePath, item.thumbnail].join('/');
            return new Thumbnail({
                classes: 'thumbnail',
                container: this.element,
                title: StorageSvc.isViewerData() || !StorageSvc.isShowingSequenceNamesEnabled() ? index+1 : item.sequenceName || '',
                index: +index,
                thumbnailImg: thumbnailImg,
                mode: 'slides',
                isMandatory: item.isMandatory,
                clickFn(e: MouseEvent, el) {
                    _this._presentation.changeSlide(el.index);
                }
            });
        });
    }

    private _destroyThumbnails() {
        if (!this.thumbnails || !this.thumbnails.length) return;
        this.thumbnails.forEach(thumbnail => {
            thumbnail.destroy();
        });
        this.thumbnails = [];
    }

    public changeSlides(slides: ISlide[]) {
        this._slides = slides;
        this._destroyThumbnails();
        this._loadThumbs();
    }
}
