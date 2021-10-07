import {BaseElement, IBaseElement} from "../BaseElement";
import './Thumbnail.css';

type IThumbnailMode = 'presentations' | 'slides';

interface IThumbnail extends IBaseElement {
    index: number
    title?: string
    thumbnailImg: string
    mode?: IThumbnailMode
    isMandatory?: boolean
}

export class Thumbnail extends BaseElement {
    private readonly _thumbnailImg: string;
    private readonly _mode: string;
    private readonly _title: string;
    private readonly _isMandatory: boolean = false;
    public readonly index: number;

    constructor(params: IThumbnail) {
        super({...params});
        this.index = params.index;
        this._thumbnailImg = params.thumbnailImg;
        this._mode = params.mode || 'presentations';
        this._title = params.title;
        this._isMandatory = params.isMandatory;
        this.init();
    }

    onInit() {
        let thumbTitle = '';
        if (this._mode === 'presentations' && this._title){
            thumbTitle = `<div class="thumbnail-title">${this._title}</div>`;
        } else {
            thumbTitle = `<div class="thumbnail-title text">${this._title}</div>`;
        }
        this._isMandatory && this._setMandatory();
        this.element.innerHTML = `<div class="thumbnail-inner">
                                <div class="thumbnail-img" style="background-image: url(${this._thumbnailImg})"></div>
                            </div>${thumbTitle}`;
    }

    public setSelected(thumbId: number): void {
        if (thumbId === this.index) {
            this.element.classList.add('selected');
            this._isMandatory && this._removeMandatory();
        } else {
            this.element.classList.remove('selected');
        }
    }

    private _setMandatory() {
        this.element.classList.add('mandatory');
    }

    private _removeMandatory() {
        this.element.classList.remove('mandatory');
    }

    public setAlarm(): void {
        this.element.classList.add('alarm');
        setTimeout(() => this.element.classList.remove('alarm'), 5000);
    }

}
