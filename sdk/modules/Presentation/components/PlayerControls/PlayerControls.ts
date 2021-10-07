import {BaseElement, IBaseElement} from '../BaseElement';
import './PlayerControls.css';

interface IPlayerControls extends IBaseElement {
    clickLeft: Function;
    clickRight: Function;
}

export class PlayerControls extends BaseElement {
    public template: string;
    private clickLeft: Function;
    private clickRight: Function;

    constructor(params: IPlayerControls) {
        super({...params, classes: 'controls'});
        this.clickLeft = params.clickLeft;
        this.clickRight = params.clickRight;
        this.init();
    }

    onInit() {
        const _this = this;
        new BaseElement({
            container: this.element,
            classes: 'arrow left',
            clickFn(e: MouseEvent, id: string) {
                _this.clickLeft();
            }
        }).init();
        new BaseElement({
            container: this.element,
            classes: 'arrow right',
            clickFn(e: MouseEvent, id: string) {
                _this.clickRight();
            }
        }).init();
    }
}
