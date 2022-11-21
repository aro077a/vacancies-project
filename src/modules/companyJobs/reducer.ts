import { createReducer } from 'deox';
import produce from 'immer';

import { getCompanyJobs, setSelectedJob, updateInterestedCandidateStatus } from './actions';
import { CompanyJobsState } from './types';

const initialState: CompanyJobsState = {
  jobs: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  jobsLoading: false,
  selectedJob: null,
  updatingInterestedCandidateStatus: false,
  companyInterest: null,
};

export const companyJobsReducer = createReducer(initialState, handle => [
  handle(getCompanyJobs.request, state =>
    produce(state, draft => {
      draft.jobsLoading = true;
    }),
  ),
  handle(getCompanyJobs.success, (state, { payload }) =>
    produce(state, draft => {
      draft.jobsLoading = false;
      draft.jobs = payload.data;
    }),
  ),
  handle(getCompanyJobs.fail, state =>
    produce(state, draft => {
      draft.jobsLoading = false;
    }),
  ),
  handle(updateInterestedCandidateStatus.request, state =>
    produce(state, draft => {
      draft.updatingInterestedCandidateStatus = true;
    }),
  ),
  handle(updateInterestedCandidateStatus.success, (state, { payload }) =>
    produce(state, draft => {
      draft.companyInterest = payload.data;
      draft.updatingInterestedCandidateStatus = false;
    }),
  ),
  handle(updateInterestedCandidateStatus.fail, state =>
    produce(state, draft => {
      draft.updatingInterestedCandidateStatus = false;
    }),
  ),
  handle(setSelectedJob.request, (state, { payload }) =>
    produce(state, draft => {
      draft.selectedJob = payload;
    }),
  ),
]);
