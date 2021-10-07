import {ScreenSize} from './screen-size';
import {VideoAction} from './video-action';
import {ICLMData} from "./clmData";

export interface IPresentationData {
    // path: string;
    url: string;
    size: ScreenSize;
    video: VideoAction[];
    presentationIdentifier: string;
    accountIdentifier: string;
    sequenceIdentifier: string;
    sequenceName: string;
    slideName: string;
    dynamicContent: string;
    clmData: ICLMData
}
