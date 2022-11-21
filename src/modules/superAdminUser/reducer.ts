import { createReducer } from 'deox';
import produce from 'immer';

import { setUser } from './actions';
import { SuperAdminUserState } from './types';

export const initialState: SuperAdminUserState = {
  typeId: 0,
  email: '',
};

export const superAdminUserReducer = createReducer(initialState, handle => [
  handle(setUser, (state, { payload }) =>
    produce(state, draft => {
      draft.typeId = payload.data.typeId;
      draft.email = payload.data.email;
    }),
  ),
]);
