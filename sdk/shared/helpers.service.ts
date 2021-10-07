export function uuidv4() {
    // @ts-ignore
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, (c: number) =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

export function isIPad() {
    return navigator.userAgent.toLowerCase().indexOf("ipad") != -1;
}

interface ICreateHtmlElement {
    tag?: string
    id?: string
    classes?: string
}

export function createHtmlElement(params?: ICreateHtmlElement): HTMLElement {
    const {tag = 'div', id, classes} = params || {};
    const element = document.createElement(tag);
    id && element.setAttribute('id', id);
    classes && element.classList.add(...classes.trim().split(' '));
    return element;
}

export function isObjectEmpty(obj: any) {
    return Object.keys(obj || {}).length === 0;
}

export function comparer<T>(compareWith: T[], predicate: string) {
    return (current: T) => {
        return compareWith.filter((other: T) => {
            return other[predicate] === current[predicate]
        }).length === 0;
    }
}

export function encodeHTML(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}
