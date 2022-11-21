import { UserType } from './common';

export type User = {
  refresh: string;
  access: string;
  userType: UserType.SUPER_ADMIN;
  typeId: number;
  email: string;
};
