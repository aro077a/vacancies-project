import { UserType } from './common';

export type User = {
  refresh: string;
  access: string;
  userType: UserType.MANAGER;
  typeId: number;
  companyId: number;
  username: string;
};
