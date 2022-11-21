import { createReducer } from 'deox';
import produce from 'immer';

import { setUser } from './actions';
import { CompanyUserState } from './types';

export const initialState: CompanyUserState = {
  typeId: 0,
  company: '',
  logo: null,
};

export const companyUserReducer = createReducer(initialState, handle => [
  handle(setUser, (state, { payload }) =>
    produce(state, draft => {
      draft.typeId = payload.data.typeId;
      draft.company = payload.data.company;
      draft.logo = payload.data.logo;
    }),
  ),
]);
