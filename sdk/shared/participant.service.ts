import {inject, injectable} from "inversify";
import {Participant} from "../models/participantsData";
import TYPES from "../constant/types";
import {EventsService} from "./events.service";
import {comparer} from "./helpers.service";

@injectable()
export class ParticipantService {
  private _participantList: Participant[] = [];

  constructor(@inject(TYPES.EventsService) private _eventService: EventsService,) {
  }

  /**
   * Make diff of the existing participant list and incoming data
   * If attendee is absent in a new data set - remove it from the participant list & notify CollectData service
   * that the click-stream collection should be stopped for this attendee
   * If attendee is absent in the participant list - add new data to it. Later CollectData service will generate
   * the click-stream based on this list
   */
  public onUpdate(data: Participant[]): void {
    if (!data || !data.length) {
      throw new Error(`HOST EVENT: 'remoteParticipantsUpdated' is empty`);
    }

    const attendeeToRemove = this._participantList.filter(comparer<Participant>(data, 'sid'));
    const attendeeToAdd = data.filter(comparer<Participant>(this._participantList, 'sid'));
    // tell CollectData to recalculate click-stream metrics
    this._eventService.ParticipantsUpdated({joined: [...attendeeToAdd], left: [...attendeeToRemove]});
    this.setParticipantList(data);
  }

  public setParticipantList(data: Participant[]) {
    this._participantList = [...data];
  }

  public get participantList() { return this._participantList; }
}
