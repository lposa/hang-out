export enum ACTIVITY_STATUS_ENUM {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

export interface IParticipantProfile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
}

export interface IPendingActivityParticipant {
  id: string;
  status: ACTIVITY_STATUS_ENUM;
  user: IParticipantProfile;
}
