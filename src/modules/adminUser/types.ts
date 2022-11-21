import { User } from '~/models/admin';

export type AdminUserState = Omit<User, 'refresh' | 'access' | 'userType'>;
