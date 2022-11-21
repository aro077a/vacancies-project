import { User } from '~/models/hiringManager';

export type HiringManagerUserState = Omit<User, 'refresh' | 'access' | 'userType'>;
