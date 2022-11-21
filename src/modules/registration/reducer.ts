import { createReducer } from 'deox';
import produce from 'immer';

import { markRegistrationFinished, setUserType } from './actions';
import { RegistrationState } from './types';

export const initialState: RegistrationState = {
  registering: false,
  selectedUserType: null,
  setupPagesCount: 0,
  registrationFinished: false,
};

export const registrationReducer = createReducer(initialState, handle => [
  handle(setUserType, (state, { payload }) =>
    produce(state, draft => {
      draft.registering = true;
      draft.selectedUserType = payload.type;
      draft.setupPagesCount = payload.setupPagesCount;
    }),
  ),
  handle(markRegistrationFinished, state =>
    produce(state, draft => {
      draft.registering = false;
      draft.selectedUserType = null;
      draft.setupPagesCount = 0;
      draft.registrationFinished = true;
    }),
  ),
]);
