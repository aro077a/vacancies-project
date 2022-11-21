import { User } from '~/models/superAdmin';

export type SuperAdminUserState = Omit<User, 'refresh' | 'access' | 'userType'>;
