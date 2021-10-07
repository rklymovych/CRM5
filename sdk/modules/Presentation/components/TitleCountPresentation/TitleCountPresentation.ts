import './TitleCountPresentation.css';
import {BaseElement, IBaseElement} from '../BaseElement';
import {SDKResponse} from '../../../../models/SDKResponse';
import {EventsService, SDKEvent} from '../../../../shared/events.service';
import {Subscription} from 'rxjs';
import StorageSvc from '../../../../shared/storage.service';
import {encodeHTML} from "../../../../shared/helpers.service";

interface ITitleCountPresentation extends IBaseElement {
    title?: string;
    totalSlides?: number
}

export class TitleCountPresentation extends BaseElement {
    private _title: string = '';
    private _currentSlide: number = 0;
    private _totalSlides: number = 0;
    public subscriptions: Subscription[] = [];

    constructor(
        params: ITitleCountPresentation,
        private _eventService: EventsService
    ) {
        super({...params, classes: 'slideshow-title'});
        this._title = params.title || '';
        this._totalSlides = isNaN(params.totalSlides) ? 0 : params.totalSlides;
        this.template = `<div class="slideshow-name">${this._title}</div>
             <div class="slideshow-numbers">
                <span class="slideshow-current">${this._currentSlide}</span> of 
                <span class="slideshow-total">${this._totalSlides}</span>
            </div>`;
        this.init();
        this._clearSubscriptions();
        this.subscriptions.push(
            this._eventService.actionRequestsReplay.subscribe((action: SDKResponse) => {
                switch (action.event) {
                    case SDKEvent.PresentationLoaded:
                        this._setTitle(action?.data?.name || '');
                        this._setTotalSlides(action?.data?.totalSlides || 0);
                        break;
                    case SDKEvent.PresentationLoadSlide:
                        this._setCurrentSlide(action?.data?.slide?.id || 0);
                        break;
                }
            }));
    }

    onInit() {
        this._setTemplate();
    }

    hide() {
        this.element.classList.add('hide');
    }

    show() {
        this.element.classList.remove('hide');
    }

    private _setTitle(title: string) {
        this._title = encodeHTML(title);
        this._setTemplate();
    }

    private _setTotalSlides(num: number) {
        this._totalSlides = isNaN(num) ? 0 : num;
        this._setTemplate();
    }

    private _setCurrentSlide(num: number) {
        this._currentSlide = isNaN(num) ? 0 : num;
        this._setTemplate();
    }

    private _setTemplate() {
        const title = StorageSvc.getLabel('XofX', this._currentSlide + 1, this._totalSlides);
        this.element.innerHTML = `<div class="slideshow-name">${this._title}</div>
             <div class="slideshow-numbers">${title}</div>`;
    }
    private _clearSubscriptions(): void {
        this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    }
}
