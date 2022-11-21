import { createAction } from 'deox';

import { User } from '~/models/candidate';
import { LoginResponse } from '~/types/responses';

export const setUser = createAction(
  'candidateUser/SET_USER',
  resolve => (payload: LoginResponse<User>) => resolve(payload),
);
