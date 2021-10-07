export class DrawAction {

    public actionType: DrawActionType;
    public color: string;
    public x: number;
    public y: number;
    public userID: string;
    public platform: string;
    public browser: string;
    public to: string;

}

export enum DrawActionType {
    STARTED = 4,
    ADD = 5,
    ENDED = 6,
    CANCELED = 7,
    CLEAR = 3,
}
