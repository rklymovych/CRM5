// Internal services
import {SDKEvent} from '../shared/events.service';

export class SDKResponse {

    public event: SDKEvent;
    public data: any;
    public option: any;

    constructor(type: SDKEvent, data: any = null, option: any = null) {
        this.event = type;
        this.data = data;
        this.option = option;
    }

}
