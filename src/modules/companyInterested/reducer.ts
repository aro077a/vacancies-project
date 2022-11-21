import { createReducer } from 'deox';
import produce from 'immer';

import { getInterestedIn } from './actions';
import { CompanyInterestedInState } from './types';

const initialState: CompanyInterestedInState = {
  loadingCandidates: false,
  candidates: {
    previous: null,
    next: null,
    count: 0,
    results: [],
  },
};

export const CompanyInterestedReducer = createReducer(initialState, handle => [
  handle(getInterestedIn.init, (state, { payload }) =>
    produce(state, draft => {
      if (payload.initialFetch) {
        Object.assign(draft.candidates, initialState.candidates);
      }
    }),
  ),
  handle(getInterestedIn.request, state =>
    produce(state, draft => {
      draft.loadingCandidates = true;
    }),
  ),
  handle(getInterestedIn.success, (state, { payload }) =>
    produce(state, draft => {
      draft.candidates = {
        ...payload.data,
        results: draft.candidates.results.concat(payload.data.results),
      };
      draft.loadingCandidates = false;
    }),
  ),
  handle(getInterestedIn.fail, state =>
    produce(state, draft => {
      draft.loadingCandidates = false;
    }),
  ),
]);
