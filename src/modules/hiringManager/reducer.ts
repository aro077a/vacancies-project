import { createReducer } from 'deox';
import produce from 'immer';

import { setUser } from './actions';
import { HiringManagerUserState } from './types';

export const initialState: HiringManagerUserState = {
  typeId: 0,
  companyId: 0,
  username: '',
};

export const hiringManagerUserReducer = createReducer(initialState, handle => [
  handle(setUser, (state, { payload }) =>
    produce(state, draft => {
      draft.typeId = payload.data.typeId;
      draft.username = payload.data.username;
      draft.companyId = payload.data.companyId;
    }),
  ),
]);
