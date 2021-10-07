import {BaseElement, IBaseElement} from '../BaseElement';
import './ModalWindow.css';
import { createHtmlElement } from '../../../../shared/helpers.service';
import StorageSvc from '../../../../shared/storage.service';

interface IModalWindow extends IBaseElement{
    message: string
    callbackYes?: Function
    callbackNo?: Function
}

export default class ModalWindow extends BaseElement {
    private readonly _message: string;
    private readonly _callbackYes: Function;
    private readonly _callbackNo: Function;

    constructor(params: IModalWindow) {
        super({...params, classes: 'modal open'});
        this._message = params.message;
        if (params.callbackYes) {
            this._callbackYes = params.callbackYes;
        }
        if (params.callbackNo) {
            this._callbackNo = params.callbackNo;
        }
        this.init();
    }

    onInit() {
        this._initModalInner();
    }

    private _initModalInner() {
        const _this = this;
        const modalOverlay = createHtmlElement({classes: 'modal__overlay'});
        const modalContainer = createHtmlElement({classes: 'modal__container'});
        const modalTitle = createHtmlElement({classes: 'modal__title'});
        const modalButtons = createHtmlElement({classes: 'modal__buttons'});
        modalTitle.innerText = this._message;
        new BaseElement({
            container: modalContainer,
            classes: 'modal__close',
            innerHTML: '&#10005;',
            clickFn(e: MouseEvent, element: any) {
                _this._callbackNo && _this._callbackNo();
                _this.destroy();
            }
        }).init();
        new BaseElement({
            container: modalButtons,
            classes: 'modal-btn modal-btn__no',
            text: StorageSvc.getLabel('no'),
            clickFn(e: MouseEvent, element: any) {
                _this._callbackNo && _this._callbackNo();
                _this.destroy();
            }
        }).init();
        new BaseElement({
            container: modalButtons,
            classes: 'modal-btn modal-btn__yes modal-btn_brand',
            text: StorageSvc.getLabel('yes'),
            clickFn(e: MouseEvent, element: any) {
                _this._callbackYes && _this._callbackYes();
                _this.destroy();
            }
        }).init();

        modalContainer.appendChild(modalTitle);
        modalContainer.appendChild(modalButtons);
        this.element.appendChild(modalOverlay);
        this.element.appendChild(modalContainer);
    }
}
