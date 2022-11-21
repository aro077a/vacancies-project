import { createReducer } from 'deox';
import produce from 'immer';

import { setUser } from './actions';
import { AdminUserState } from './types';

export const initialState: AdminUserState = {
  typeId: 0,
  email: '',
};

export const adminUserReducer = createReducer(initialState, handle => [
  handle(setUser, (state, { payload }) =>
    produce(state, draft => {
      draft.typeId = payload.data.typeId;
      draft.email = payload.data.email;
    }),
  ),
]);
