import { createAction } from 'deox';

import { UserType } from '~/models/common';

export const setUserType = createAction(
  'registration/SET_USER_TYPE',
  resolve => (payload: { type: UserType; setupPagesCount: number }) => resolve(payload),
);

export const markRegistrationFinished = createAction('registration/MARK_REGISTRATION_FINISHED');
