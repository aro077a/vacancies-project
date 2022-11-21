import { UserType } from '~/models/common';

export type RegistrationState = {
  registering: boolean;
  selectedUserType: UserType | null;
  setupPagesCount: number;
  registrationFinished: boolean;
};
