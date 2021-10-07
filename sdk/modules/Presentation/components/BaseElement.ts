import {uuidv4} from '../../../shared/helpers.service';

export interface IBaseElement {
    container: string | HTMLElement
    id?: string
    name?: string
    classes?: string
    tagName?: string
    text?: string
    innerHTML?: string
    isHide?: boolean

    clickFn?(e: MouseEvent, element: any): void
}

export class BaseElement {
    private readonly _uuid: string;
    private readonly _container: string | HTMLElement;
    private readonly _tagName: string;
    private readonly _id: string;
    private readonly _clickFn: Function;

    public text: string;
    public name: string;
    public classes: string;
    public element: HTMLElement;
    public innerHTML: string;
    public template: string;
    public isHide: boolean;

    public get uuid(): string {
        return this._uuid
    }

    public get container(): string | HTMLElement {
        return this._container
    }

    constructor(
        {
            container,
            id = '',
            classes = '',
            tagName = 'div',
            name = '',
            text,
            innerHTML,
            isHide = false,
            clickFn
        }: IBaseElement
    ) {
        this._uuid = `${uuidv4()}`;
        this._container = container;
        this._tagName = tagName;
        this._id = id;
        this.classes = classes;
        this.text = text;
        this.name = name;
        this.innerHTML = innerHTML;
        this.isHide = !!isHide;
        if (clickFn) {
            this._clickFn = clickFn;
        }
    }

    init() {
        try {
            const element = document.createElement(this._tagName);
            this._id && element.setAttribute('id', this._id);
            this.classes && element.classList.add(...this.classes.trim().split(' '));
            this.text && (element.innerText = this.text);
            this.innerHTML && (element.innerHTML = this.innerHTML);
            if (this._clickFn) {
                element.onclick = (e) => {
                    this._clickFn(e, this);
                }
            }
            this.element = element;
            this.onInit();
            this.render();
            this.afterRender();
            this.element.hidden = this.isHide;
        } catch (e) {
            console.error('Element creation error');
        }
    }

    onInit() {
    }

    onDestroy() {
    }

    destroy() {
        this.element.remove();
        this.onDestroy();
    }

    show() {
        this.element.hidden = false;
    }

    hide() {
        this.element.hidden = true;
    }

    reRender() {
        this.destroy();
        this.render();
    }

    render() {
        this.template && (this.element.innerHTML = this.template);
        if (this._container instanceof HTMLElement) {
            this._container.appendChild(this.element);
        } else if (typeof this._container === 'string') {
            const container = document.querySelector(this._container);
            if (container) {
                container.appendChild(this.element);
            }
        }
    }

    afterRender() {

    }
}
