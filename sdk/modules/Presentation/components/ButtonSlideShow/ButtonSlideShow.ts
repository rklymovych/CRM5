import {BaseElement, IBaseElement} from '../BaseElement';
import './ButtonSlideShow.css';

interface IButtonSlideShow extends IBaseElement {
    isActive?: boolean
}

export class ButtonSlideShow extends BaseElement {
    private _isActive: boolean;
    private DEFAULT_CLASSES = 'slide-show-btn';

    public template: string;

    public get isActive(): boolean {
        return this._isActive
    }

    public set isActive(active: boolean) {
        this._isActive = active;
        this._setBtnClassIsActive();
    }

    public toggleActive() {
        this._isActive = !this._isActive;
        this._setBtnClassIsActive();
    }

    constructor(params: IButtonSlideShow) {
        super({...params, tagName: 'button'});
        this._isActive = params.isActive;
        this.classes = this.classes ? `${this.DEFAULT_CLASSES} ${this.classes}` : this.DEFAULT_CLASSES;
        this.init();
    }

    private _getClasses(): string {
        console.log('params', this.classes);
        return '';
    }

    private _setBtnClassIsActive() {
        if (this._isActive) {
            this.element.classList.add('active')
        } else {
            this.element.classList.remove('active')
        }
    }

    onInit() {
        this._setBtnClassIsActive();
    }
}

interface ISlideShow extends IButtonSlideShow {
    textActive?: string;
}

export class StartSlideShow extends ButtonSlideShow {
    public _textActive: string;
    public _textInactive: string;

    constructor({textActive, ...params}: ISlideShow) {
        super(params);
        this._textActive = textActive;
        this._textInactive = params.text;
        this.isActive = false;
    }

    public toggleName() {
        this.element.innerText = this._textActive;
        this.element.innerText = this.isActive ? this._textInactive :this._textActive;
        this.toggleActive()
    }
}
