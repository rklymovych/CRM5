export class TouchGesture {

    public gestureType: TouchGestureType;
    public event: MouseEventType | TouchEventType;
    public x: number;
    public y: number;

}

export enum TouchGestureType {
    SCROLL = 0,
    MOVE = 1,
    CANCEL = 2,
    CLICK = 3,
    DOWN = 4,
    UP = 5
}

export enum EventGestureCode {
    MOVE = 'm',
    CLICK = 'click',
    DOWN = 'd',
    UP = 'u',
    CANCEL = 'c'
}

export enum MouseEventType {
    MOUSE_ENTER = 'mouseenter',
    MOUSE_LEAVE = 'mouseleave',
    MOUSE_UP = 'mouseup',
    MOUSE_DOWN = 'mousedown',
    CLICK = 'click',
    MOUSE_MOVE = 'mousemove'
}

export enum TouchEventType {
    TOUCH_MOVE = 'touchmove',
    TOUCH_END = 'touchend',
    TOUCH_CANCEL = 'touchcancel',
    TOUCH_START = 'touchstart'
}
