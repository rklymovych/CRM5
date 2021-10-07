// Internal services
import {MessageInterface} from './message';
import {IPresentationData} from './i-presentation-data';

export interface Notification extends MessageInterface {

    state: SessionState;
    sessionId: number;
    currentSlide: IPresentationData;

}

export enum SessionState {
    Started = 'STARTED',
    Paused = 'PAUSED',
    Scheduled = 'SCHEDULED',
    Updated = 'UPDATED',
    Canceled = 'CANCELED',
    Ended = 'ENDED'
}

export enum SessionStateOCE {
    PLAYING = 'playing',
    PAUSED = 'paused'
}
