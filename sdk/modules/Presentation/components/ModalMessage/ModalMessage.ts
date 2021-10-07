import {BaseElement, IBaseElement} from "../BaseElement";
import './ModalMessage.css';

interface IModalMessage extends IBaseElement{
    message: string
    hidingTime?: number
}

export default class ModalMessage extends BaseElement {
    private _hidingTime: number;

    constructor(params: IModalMessage) {
        super({...params, id: 'modal-message'});
        this.text = params.message;
        this._hidingTime = params.hidingTime;
        this.init();
    }

    onInit() {
        if (this._hidingTime && !isNaN(this._hidingTime)) {
            setTimeout(() => { this.destroy() }, this._hidingTime);
        }
    }
}
