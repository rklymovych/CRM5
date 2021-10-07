export interface Participant {
  sid: string;
  identity: string;
  accountId: string
  device: {
    type: string;
    os: string;
    browser: string;
  }
}

export interface ParticipantAction {
  joined: Participant[];
  left: Participant[];
}
