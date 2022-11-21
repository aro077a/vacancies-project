import { createAction } from 'deox';

import { User } from '~/models/hiringManager';
import { LoginResponse } from '~/types/responses';

export const setUser = createAction(
  'hiringManagerUser/SET_USER',
  resolve => (payload: LoginResponse<User>) => resolve(payload),
);
