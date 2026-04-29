export enum PARTICIPANT_STATUS_ENUM {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  COMPLETED = 'completed',
}

export interface IParticipantProfile {
  id: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
}

export interface IPendingActivityParticipant {
  id: string;
  guest_user_id: string;
  status: PARTICIPANT_STATUS_ENUM;
  user: IParticipantProfile;
}
