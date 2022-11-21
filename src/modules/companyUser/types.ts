import { User } from '~/models/company';

export type CompanyUserState = Omit<User, 'refresh' | 'access' | 'userType'>;
