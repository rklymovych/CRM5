export class VideoAction {

    eventType: VideoEventType;
    currentTime: number;
    index: number;

}

export enum VideoEventType {
    PLAY = 'play',
    PAUSE = 'pause'
}
