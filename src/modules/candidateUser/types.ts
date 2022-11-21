import { User } from '~/models/candidate';

export type CandidateUserState = Omit<User, 'refresh' | 'access' | 'userType'>;
