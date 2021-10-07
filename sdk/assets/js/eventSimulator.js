/**
 * @function clickableParent
 * @description
 * @public
 * @param {any} element
 * @return {null|any}
 */
function clickableParent(element) {
    if (element && element.onclick) {
        return element;
    } else if (element && element.parentNode) {
        return clickableParent(element.parentNode);
    } else {
        return null;
    }
}

/**
 * @function jQueryClickableParent
 * @description
 * @public
 * @param {any} element
 * @returns {null|any}
 */
function jQueryClickableParent(element) {
    if (window.jQuery && window.jQuery(element).click) {
        return element;
    } else if (element && element.parentNode) {
        return jQueryClickableParent(element.parentNode);
    } else {
        return null;
    }
}

/**
 * @function sendClickEvent
 * @description
 * @public
 * @param {any} clickableElem
 * @returns {void}
 */
function sendClickEvent(clickableElem) {
    // Triggering click with native JS
    if (!window.jQuery) {
        var clickEvent;
        if (window.navigator.userAgent.match(/Trident.*rv\:11\./)) {
            clickEvent = document.createEvent('MouseEvents');
            clickEvent.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        } else {
            clickEvent = new MouseEvent('click', { cancelable: true, bubbles: true });
        }
        clickableElem && clickableElem.dispatchEvent(clickEvent);
    }
    // Triggering click with jQuery
    else {
        clickableElem && jQuery(clickableElem).trigger('click');
    }
}

/**
 * @function sendMouseEvent
 * @description
 * @public
 * @param {number} x
 * @param {number} y
 * @param {any} element
 * @param {string} eventType
 * @returns {void}
 */
function sendMouseEvent(x, y, element, eventType) {
    var mouseEvent = document.createEvent('MouseEvents');
    mouseEvent.initMouseEvent(eventType, true, true, window, 1, 0, 0, x, y, false, false, false, false, 0, null);
    element && element.dispatchEvent(mouseEvent);
}

/**
 * @function simulateMouseEvent
 * @description
 * @public
 * @param {number} x
 * @param {number} y
 * @param {string} eventType
 * @returns {void}
 */
function simulateMouseEvent(x, y, eventType) {
    var element = document.elementFromPoint(x, y);
    if (!element) {
        return;
    }
    sendMouseEvent(x, y, element, eventType);
}

/**
 * @function simulateMouseClick
 * @description
 * @public
 * @param {number} x
 * @param {number} y
 * @returns {void}
 */
function simulateMouseClick(x, y) {
    var element = document.elementFromPoint(x,y);
    var userAgent = window.navigator.userAgent;
    var isIE11 = userAgent.match(/Trident.*rv\:11\./);
    var IEEdgeVersion = /\b(MSIE |Trident.*?rv:|Edge\/)(\d+)/.exec(userAgent);
    var isEdge18Plus = IEEdgeVersion && IEEdgeVersion.length >= 3 ? parseInt(IEEdgeVersion[2]) >= 18 : false;
    var clickableElem = clickableParent(element) || jQueryClickableParent(element) || element;
    if (clickableElem) {
        if (isIE11 || isEdge18Plus) {
            sendMouseEvent(x, y, element, 'mousedown');
            sendMouseEvent(x, y, element, 'mouseup');
        }
        sendClickEvent(clickableElem);
    } else {
        sendMouseEvent(x, y, element, 'mousedown');
        sendMouseEvent(x, y, element, 'mouseup');
    }
}

/**
 * @function sendTouchEvent
 * @description
 * @public
 * @param {number} x
 * @param {number} y
 * @param {any} element
 * @param {string} eventType
 * @returns {void}
 */
function sendTouchEvent(x, y, element, eventType) {
    var touchObj = new Touch({
        identifier: Date.now(),
        target: element,
        clientX: x,
        clientY: y,
        pageX: x,
        pageY: y,
        radiusX: 2.5,
        radiusY: 2.5,
        rotationAngle: 10,
        force: 0.5
    });
    var touchEvent = new TouchEvent(eventType, {
        cancelable: true,
        bubbles: true,
        touches: [touchObj],
        targetTouches: [],
        changedTouches: [touchObj]
    });
    element && element.dispatchEvent(touchEvent);
}

/**
 * @function simulateTouchTap
 * @description
 * @public
 * @param {number} x
 * @param {number} y
 * @returns {void}
 */
function simulateTouchTap(x, y) {
    var element = document.elementFromPoint(x,y);
    var clickableElement = clickableParent(element);
    var target;
    if (clickableElement != null) {
        target = clickableElement;
        sendClickEvent(target);
    } else {
        target = element;
        sendTouchEvent(x, y, target, 'touchstart');
        sendTouchEvent(x, y, target, 'touchend');
    }
}

/**
 * @function simulateTouchEvent
 * @description
 * @public
 * @param {number} x
 * @param {number} y
 * @param {string} eventType
 * @returns {void}
 */
function simulateTouchEvent(x, y, eventType) {
    var element = document && document.elementFromPoint(x, y);
    if (!element) {
        return;
    }
    sendTouchEvent(x, y, element, eventType);
}
