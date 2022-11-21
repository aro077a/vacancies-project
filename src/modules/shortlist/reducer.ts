import { createReducer } from 'deox';
import produce from 'immer';

import { getShortList, updateShortList } from './actions';
import { ShortListState } from './types';

const initialState: ShortListState = {
  jobs: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  loadingJobs: false,
  updatingShortList: false,
};

export const shortListReducer = createReducer(initialState, handle => [
  handle(getShortList.init, (state, { payload }) =>
    produce(state, draft => {
      if (payload.initialFetch) {
        Object.assign(draft.jobs, initialState.jobs);
      }
    }),
  ),
  handle(getShortList.request, state =>
    produce(state, draft => {
      draft.loadingJobs = true;
    }),
  ),
  handle(getShortList.success, (state, { payload }) =>
    produce(state, draft => {
      draft.jobs = {
        ...payload.data,
        results: draft.jobs.results.concat(payload.data.results),
      };
      draft.loadingJobs = false;
    }),
  ),
  handle(getShortList.fail, state =>
    produce(state, draft => {
      draft.loadingJobs = false;
    }),
  ),
  handle(updateShortList.request, state =>
    produce(state, draft => {
      draft.updatingShortList = true;
    }),
  ),
  handle(updateShortList.success, (state, { payload }) =>
    produce(state, draft => {
      if (payload.data.job) {
        draft.jobs.results = draft.jobs.results.filter(job => job.id !== payload.data.job);
      } else {
        draft.jobs.results = draft.jobs.results.filter(job => job.id !== payload.data.candidate);
      }
      draft.updatingShortList = false;
    }),
  ),
  handle(updateShortList.fail, state =>
    produce(state, draft => {
      draft.updatingShortList = false;
    }),
  ),
]);
