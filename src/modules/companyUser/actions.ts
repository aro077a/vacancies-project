import { createAction } from 'deox';

import { User } from '~/models/company';
import { LoginResponse } from '~/types/responses';

export const setUser = createAction(
  'companyUser/SET_USER',
  resolve => (payload: LoginResponse<User>) => resolve(payload),
);
