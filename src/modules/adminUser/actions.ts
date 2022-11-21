import { createAction } from 'deox';

import { User } from '~/models/admin';
import { LoginResponse } from '~/types/responses';

export const setUser = createAction(
  'adminUser/SET_USER',
  resolve => (payload: LoginResponse<User>) => resolve(payload),
);
