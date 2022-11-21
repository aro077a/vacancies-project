import { createReducer } from 'deox';
import produce from 'immer';

import { getCompanies } from './actions';
import { CompanyState } from './types';

const initialState: CompanyState = {
  companies: [],
};

export const companyReducer = createReducer(initialState, handle => [
  handle(getCompanies.success, (state, { payload }) =>
    produce(state, draft => {
      draft.companies = payload.data;
    }),
  ),
]);
