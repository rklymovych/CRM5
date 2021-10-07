// Third-party modules
import {injectable} from 'inversify';

@injectable()
export class BowserService {

    /**
     * Data members
     */
    public bowser = require('bowser');
    public ANDROID = 'Android';
    public IOS = 'iOS';
    public DESKTOP = 'desktop';
    public MOBILE = 'mobile';
    public TABLET = 'tablet';
    public MACOS = 'macOS';
    public WINDOWS = 'windows';
    public IPHONE = 'iPhone';
    public IPAD = 'iPad';
    public CHROME_BROWSER = 'Chrome';
    public FIREFOX_BROWSER = 'Firefox';
    public SAFARI_BROWSER = 'Safari';
    public OPERA_BROWSER = 'Opera';
    public IE_BROWSER = 'Internet Explorer';
    public EDGE_BROWSER = 'Edge';
    private _result: any;

    /**
     * @function constructor
     */
    constructor() {
        this._result = this.bowser.getParser(window.navigator.userAgent).parse().parsedResult;
    }

    /**
     * @function getAll
     * @description Get all information
     * @public
     * @returns {any}
     */
    public getAll(): any {
        return this._result;
    }

    /**
     * @function isMacOS
     * @description Get OS name
     * @public
     * @returns {boolean}
     */
    public isMacOS(): boolean {
        return this._result.os.name === this.MACOS;
    }

    /**
     * @function isWindowsOS
     * @description Get OS name
     * @public
     * @returns {boolean}
     */
    public isWindows(): boolean {
        return this._result.os.name === this.WINDOWS;
    }

    /**
     * @function isAndroid
     * @description Get OS name
     * @public
     * @returns {boolean}
     */
    public isAndroid(): boolean {
        return this._result.os.name === this.ANDROID;
    }

    /**
     * @function isIos
     * @description Get OS name
     * @public
     * @returns {boolean}
     */
    public isIos(): boolean {
        return this._result.os.name === this.IOS;
    }

    /**
     * @function isDesktop
     * @description Get platform type
     * @public
     * @returns {boolean}
     */
    public isDesktop(): boolean {
        return this._result.platform.type === this.DESKTOP
            // Forcing IE11 to be detected as a desktop device
            // IE11 on Surface tablet for instance does not support mobile feature (i.e. touchEvents...)
            || (this.isIE() && this.isTablet());
    }

    /**
     * @function isMobile
     * @description Get platform type
     * @public
     * @returns {boolean}
     */
    public isMobile(): boolean {
        return this._result.platform.type === this.MOBILE;
    }

    /**
     * @function isAndroid
     * @description Get platform type
     * @public
     * @returns {boolean}
     */
    public isTablet(): boolean {
        return this._result.platform.type === this.TABLET;
    }

    /**
     * @function isIphone
     * @description Get device type
     * @public
     * @returns {boolean}
     */
    public isIphone(): boolean {
        return this._result.platform.model === this.IPHONE;
    }

    /**
     * @function isIpad
     * @description Get device type
     * @public
     * @returns {boolean}
     */
    public isIpad(): boolean {
        // return this._result.platform.model === this.IPAD;
        // iPad detection does not work with Bowser lib on new iPadOS 13, so making our own tests to detect it
        return /iPad|iPhone|iPod/.test(navigator.platform) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }

    /**
     * @function isChrome
     * @description Get browser name
     * @public
     * @returns {boolean}
     */
    public isChrome(): boolean {
        return this._result.browser.name === this.CHROME_BROWSER;
    }

    /**
     * @function isFirefox
     * @description Get browser name
     * @public
     * @returns {boolean}
     */
    public isFirefox(): boolean {
        return this._result.browser.name === this.FIREFOX_BROWSER;
    }

    /**
     * @function isSafari
     * @description Get browser name
     * @public
     * @returns {boolean}
     */
    public isSafari(): boolean {
        return this._result.browser.name === this.SAFARI_BROWSER;
    }

    /**
     * @function isOpera
     * @description Get browser name
     * @public
     * @returns {boolean}
     */
    public isOpera(): boolean {
        return this._result.browser.name === this.OPERA_BROWSER;
    }

    /**
     * @function isIE
     * @description Get browser name
     * @public
     * @returns {boolean}
     */
    public isIE(): boolean {
        return this._result.browser.name === this.IE_BROWSER;
    }

    /**
     * @function isEdge
     * @description Get browser name
     * @public
     * @returns {boolean}
     */
    public isEdge(): boolean {
        return this._result.browser.name === this.EDGE_BROWSER;
    }

}
