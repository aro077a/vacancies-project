import { createReducer } from 'deox';
import produce from 'immer';

import { JobStatus } from '~/models/common';

import {
  deleteMyJob,
  getActiveJobs,
  getClosedJobs,
  setSelectedJob,
  updateJobStatus,
} from './actions';
import { MyJobsState } from './types';

const initialState: MyJobsState = {
  tabs: [
    {
      id: 1,
      label: 'Active jobs',
      badge: 0,
    },
    {
      id: 2,
      label: 'Closed jobs',
      badge: 0,
    },
  ],
  loadingActiveJobs: false,
  activeJobs: {
    count: 0,
    previous: null,
    next: null,
    results: [],
  },
  loadingClosedJobs: false,
  closedJobs: {
    count: 0,
    previous: null,
    next: null,
    results: [],
  },
  selectedJob: null,
  updatingJobStatus: false,
  deletingMyJob: false,
};

export const myJobsReducer = createReducer(initialState, handle => [
  handle(getActiveJobs.init, (state, { payload }) =>
    produce(state, draft => {
      if (payload.initialFetch) {
        Object.assign(draft.activeJobs, initialState.activeJobs);
        draft.closedJobs.results = [];
      }
    }),
  ),
  handle(getActiveJobs.request, state =>
    produce(state, draft => {
      draft.loadingActiveJobs = true;
    }),
  ),
  handle(getActiveJobs.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingActiveJobs = false;
      draft.tabs[0].badge = payload.data.count;
      draft.activeJobs = {
        ...payload.data,
        results: draft.activeJobs.results.concat(payload.data.results),
      };
    }),
  ),
  handle(getClosedJobs.fail, state =>
    produce(state, draft => {
      draft.loadingActiveJobs = false;
    }),
  ),
  handle(getClosedJobs.init, (state, { payload }) =>
    produce(state, draft => {
      if (payload.initialFetch) {
        Object.assign(draft.closedJobs, initialState.closedJobs);
        draft.activeJobs.results = [];
      }
    }),
  ),
  handle(getClosedJobs.request, state =>
    produce(state, draft => {
      draft.loadingClosedJobs = true;
    }),
  ),
  handle(getClosedJobs.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingClosedJobs = false;
      draft.tabs[1].badge = payload.data.count;
      draft.closedJobs = {
        ...payload.data,
        results: draft.closedJobs.results.concat(payload.data.results),
      };
    }),
  ),
  handle(getClosedJobs.fail, state =>
    produce(state, draft => {
      draft.loadingClosedJobs = false;
    }),
  ),
  handle(setSelectedJob, (state, { payload }) =>
    produce(state, draft => {
      draft.selectedJob = payload;
    }),
  ),
  handle(updateJobStatus.request, state =>
    produce(state, draft => {
      draft.updatingJobStatus = true;
    }),
  ),
  handle(updateJobStatus.success, (state, { payload }) =>
    produce(state, draft => {
      if (payload.data.status === JobStatus.ACTIVE) {
        draft.closedJobs.results = [
          ...draft.closedJobs.results.filter(job => job.id !== payload.data.id),
        ];
        draft.tabs[1].badge -= 1;
        draft.tabs[0].badge += 1;
      } else {
        draft.activeJobs.results = [
          ...draft.activeJobs.results.filter(job => job.id !== payload.data.id),
        ];
        draft.tabs[0].badge -= 1;
        draft.tabs[1].badge += 1;
      }

      if (draft.selectedJob) {
        draft.selectedJob.status = payload.data.status;
      }
      draft.updatingJobStatus = false;
    }),
  ),
  handle(updateJobStatus.fail, state =>
    produce(state, draft => {
      draft.updatingJobStatus = false;
    }),
  ),
  handle(deleteMyJob.request, state =>
    produce(state, draft => {
      draft.deletingMyJob = true;
    }),
  ),
  handle(deleteMyJob.success, (state, { payload }) =>
    produce(state, draft => {
      const { jobId, status } = payload;
      if (status === JobStatus.ACTIVE) {
        draft.activeJobs.results = [...draft.activeJobs.results.filter(job => job.id !== jobId)];
        draft.tabs[0].badge -= 1;
      } else {
        draft.closedJobs.results = [...draft.closedJobs.results.filter(job => job.id !== jobId)];
        draft.tabs[1].badge -= 1;
      }
      draft.deletingMyJob = false;
    }),
  ),
  handle(deleteMyJob.fail, state =>
    produce(state, draft => {
      draft.deletingMyJob = false;
    }),
  ),
]);
