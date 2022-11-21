import { createAction } from 'deox';

import { User } from '~/models/superAdmin';
import { LoginResponse } from '~/types/responses';

export const setUser = createAction(
  'superAdminUser/SET_USER',
  resolve => (payload: LoginResponse<User>) => resolve(payload),
);
