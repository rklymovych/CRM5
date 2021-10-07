// Internal interfaces
import {MessageInterface} from './message';
import {ScreenSize} from './screen-size';

export interface LoadSlide extends MessageInterface {
    path: string;
    real_path: string;
    size: ScreenSize;
}
