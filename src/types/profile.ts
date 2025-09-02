export interface Profile {
  nickname: string;
  email: string;
  notificationEnabled: boolean;
}

export type ProfileFormInput = {
  nickname: string;
  email: string;
};
