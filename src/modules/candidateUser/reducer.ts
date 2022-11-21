import { createReducer } from 'deox';
import produce from 'immer';

import { setUser } from './actions';
import { CandidateUserState } from './types';

export const initialState: CandidateUserState = {
  typeId: 0,
  username: '',
  photo: null,
  status: '',
  userStatus: 0,
};

export const candidateUserReducer = createReducer(initialState, handle => [
  handle(setUser, (state, { payload }) =>
    produce(state, draft => {
      draft.typeId = payload.data.typeId;
      draft.username = payload.data.username;
      draft.photo = payload.data.photo;
      draft.status = payload.data.status;
      draft.userStatus = payload.data.userStatus;
    }),
  ),
]);
