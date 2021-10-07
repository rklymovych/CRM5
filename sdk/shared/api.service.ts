import StorageSvc from "./storage.service";

class Api {
    constructor() {}

    /**
     * send message to parent window
     * @void
     */
    public sendToParent(message: any): void {
        StorageSvc.isDev && console.log('sendToParent', message);
        parent.postMessage(message, '*');
    };
}

export default new Api();
