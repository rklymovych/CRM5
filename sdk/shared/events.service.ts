// Third-party modules
import {injectable} from 'inversify';
import {ReplaySubject, Subject} from 'rxjs';

// Internal models
import {LoadSlide} from '../models/load-slide';
import {LoadPdf} from '../models/load-pdf';
import {Notification} from '../models/notification';
import {TouchGesture} from '../models/touch-gesture';
import {DrawAction} from '../models/draw-action';
import {SDKResponse} from '../models/SDKResponse';
import {VideoAction} from '../models/video-action';
import {PresenterModeNotification} from '../models/presenter-mode-notification';
import {DrawingMode} from '../models/draw-mode';
import {ParticipantAction} from "../models/participantsData";

export enum SDKEvent {
    PresentationLoad = 'presentation_load',
    PresentationInitialControls = 'presentation_initial_controls',
    PresentationLoadSlide = 'presentation_load_slide',
    PresentationSlideLoaded = 'presentation_slide_loaded',
    PresentationLoadPdf = 'presentation_load_pdf',
    PresentationLoaded = 'presentation_loaded',
    PresentationChange = 'presentation_change',
    PresentationGotoPrevSlide = 'presentation_goto_prev_slide',
    PresentationGotoNextSlide = 'presentation_goto_next_slide',
    PresentationTracking = 'presentation_tracking',
    ParticipantsUpdated = 'participants_updated',
    ShareCSSEvent = 'shared_css_event',
    LaunchEventOnContent = 'launch_event_on_content',
    LaunchEventMessage = 'launch_event_message',
    LaunchEventNotification = 'launch_event_notification',
    DrawingAction = 'drawing_action',
    InternalDrawingAction = 'internal_drawing_action',
    ClearDrawedShapes = 'clear_drawed_shapes',
    PresenterModeNotification = 'presenter_mode_notification',
    VideoNotification = 'video_notification',
    VideoAction = 'video_action',
    VideoEvent = 'video_event',
    DrawingMode = 'drawing-mode',
    DrawingNotification = 'drawing-notification',
    ColorpickerAction = 'colorpicker-action',
    ColorpickerColor = 'colorpicker_color',
    isInteractiveMode = 'is_interactive_mode',
    resetPresentationModule = 'reset_presentation_module',
    exitNotification = 'exit_notification'
}

@injectable()
export class EventsService {

    private _actionRequestsReplay: ReplaySubject<SDKResponse> = new ReplaySubject<SDKResponse>();
    private _videoActionRequestsReplay: ReplaySubject<SDKResponse> = new ReplaySubject<SDKResponse>();

    constructor() {}

    get actionRequestsReplay(): Subject<SDKResponse> {
        return this._actionRequestsReplay;
    }

    get videoActionRequests(): Subject<SDKResponse> {
        return this._videoActionRequestsReplay;
    }

    public initVideoActionRequestsReplay(): ReplaySubject<SDKResponse> {
        return this._videoActionRequestsReplay = new ReplaySubject<SDKResponse>();
    }

    public PresentationLoad(data: LoadSlide): void {
        this._actionRequestsReplay.next(new SDKResponse(SDKEvent.PresentationLoad, data));
    }

    public InitialControls(data: any): void {
        this._actionRequestsReplay.next(new SDKResponse(SDKEvent.PresentationInitialControls, data));
    }

    public PresentationLoadSlide(data: any): void {
        // Checking if one of the subscriber is no longer active
        /* if (this._actionRequestsReplay.observers.length < 6) {
            setTimeout( () => {
                // Resetting Presentation module.
                // Problem may occurred (often on IE11)
                // For instance, subscribers stop listening when receiving multiples events quickly (e.g. changing slide)
                this._actionRequestsReplay.next(new SDKResponse(SDKEvent.resetPresentationModule));
                console.log('[SDK] Resetting Presentation module');
            }, 1000)
        } */
        this._actionRequestsReplay.next(new SDKResponse(SDKEvent.PresentationLoadSlide, data));
    }

    public PresentationSlideLoaded(data: any): void {
        this._actionRequestsReplay.next(new SDKResponse(SDKEvent.PresentationSlideLoaded, data));
    }

    public PresentationLoadPdf(data: LoadPdf): void {
        // Checking if one of the subscriber is no longer active
        /* if (this._actionRequestsReplay.observers.length < 6) {
            setTimeout( () => {
                // Resetting Presentation module.
                // Problem may occurred (often on IE11)
                // For instance, subscribers stop listening when receiving multiples events quickly (e.g. changing slide)
                this._actionRequestsReplay.next(new SDKResponse(SDKEvent.resetPresentationModule));
                console.log('[SDK] Resetting Presentation module');
            }, 1000)
        } */
        this._actionRequestsReplay.next(new SDKResponse(SDKEvent.PresentationLoadPdf, data));
    }

    public PresentationGotoPrevSlide(): void {
        this._actionRequestsReplay.next(new SDKResponse(SDKEvent.PresentationGotoPrevSlide));
    }

    public PresentationGotoNextSlide(): void {
        this._actionRequestsReplay.next(new SDKResponse(SDKEvent.PresentationGotoNextSlide));
    }

    public SharedCSSEvent(): void {
        this._actionRequestsReplay.next(new SDKResponse(SDKEvent.ShareCSSEvent))
    }

    public launchEvent(touch: TouchGesture): void {
        this._actionRequestsReplay.next(new SDKResponse(SDKEvent.LaunchEventOnContent, touch));
    }

    public launchEventMessage(touch: TouchGesture): void {
        this._actionRequestsReplay.next(new SDKResponse(SDKEvent.LaunchEventMessage, touch));
    }

    public launchEventNotification(notification: Notification): void {
        this._actionRequestsReplay.next(new SDKResponse(SDKEvent.LaunchEventNotification, notification));
    }

    public launchDrawingAction(drawing: DrawAction): void {
        this._actionRequestsReplay.next(new SDKResponse(SDKEvent.DrawingAction, drawing));
    }

    public launchInternalDrawingAction(drawing: DrawAction): void {
        this._actionRequestsReplay.next(new SDKResponse(SDKEvent.InternalDrawingAction, drawing));
    }

    public clearDrawedShapes(): void {
        this._actionRequestsReplay.next(new SDKResponse(SDKEvent.ClearDrawedShapes));
    }

    public presenterModeNotification(PresenterModeNotification: PresenterModeNotification): void {
        this._actionRequestsReplay.next(new SDKResponse(SDKEvent.PresenterModeNotification, PresenterModeNotification));
    }

    public videoNotification(videoContent: HTMLVideoElement, videoAction: VideoAction[]): void {
        this._actionRequestsReplay.next(new SDKResponse(SDKEvent.VideoNotification, videoContent, videoAction));
    }

    public launchVideoAction(videoAction: VideoAction): void {
        this._actionRequestsReplay.next(new SDKResponse(SDKEvent.VideoAction, videoAction));
    }

    public launchVideoEvent(videoAction: VideoAction): void {
        if (this._videoActionRequestsReplay.closed) {
            this.initVideoActionRequestsReplay();
        }
        this._videoActionRequestsReplay.next(new SDKResponse(SDKEvent.VideoEvent, videoAction));
    }

    public launchDrawingMode(DrawingMode: DrawingMode): void {
        this._actionRequestsReplay.next(new SDKResponse(SDKEvent.DrawingMode, DrawingMode));
    }

    public drawingNotification(Draw: DrawAction): void {
        this._actionRequestsReplay.next(new SDKResponse(SDKEvent.DrawingNotification, Draw));
    }

    public colorpickerAction(isDisplayed: boolean): void {
        this._actionRequestsReplay.next(new SDKResponse(SDKEvent.ColorpickerAction, isDisplayed));
    }

    public colorpickerColor(color: string): void {
        this._actionRequestsReplay.next(new SDKResponse(SDKEvent.ColorpickerColor, color));
    }

    public isInteractiveMode(isInteractiveMode: Boolean): void {
        this._actionRequestsReplay.next(new SDKResponse(SDKEvent.isInteractiveMode, isInteractiveMode));
    }

    public exitNotificationAction(): void {
        this._actionRequestsReplay.next(new SDKResponse(SDKEvent.exitNotification));
    }

    public resetPresentationModule(): void {
        this._actionRequestsReplay.next(new SDKResponse(SDKEvent.resetPresentationModule));
    }

    public PresentationLoaded(data: any): void {
        this._actionRequestsReplay.next(new SDKResponse(SDKEvent.PresentationLoaded, data));
    }

    public PresentationChange(data: any): void {
        this._actionRequestsReplay.next(new SDKResponse(SDKEvent.PresentationChange, data));
    }

    public PresentationTracking(data: boolean): void {
        this._actionRequestsReplay.next(new SDKResponse(SDKEvent.PresentationTracking, data));
    }

    public ParticipantsUpdated(data: ParticipantAction): void {
        this._actionRequestsReplay.next(new SDKResponse(SDKEvent.ParticipantsUpdated, data));
    }

}
