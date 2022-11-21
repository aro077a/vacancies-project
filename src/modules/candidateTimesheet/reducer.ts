import { createReducer } from 'deox';
import produce from 'immer';

import {
  createCandidateEntry,
  getCandidatePipeline,
  getCandidateTimesheet,
  getCandidateTimesheetById,
  getCandidateTimesheetContract,
  setSelectedCandidateTimesheetId,
  toggleCandidateTimesheetModal,
  toggleTimesheetReviewContractModalVisibility,
} from './actions';
import { CandidateTimesheetState } from './types';

const initialState: CandidateTimesheetState = {
  candidateTimesheetList: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  loadingCandidateTimesheet: false,
  candidatePipeline: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  loadingCandidatePipeline: false,
  creatingCandidateEntry: false,
  createCandidateEntryErrors: null,
  candidateTimesheetModalVisibility: false,
  selectedCandidateTimesheetId: null,
  loadingCandidateTimesheetById: false,
  candidateTimesheet: null,
  candidateContract: null,
  loadingCandidateContract: false,
  reviewTimesheetContractModalVisibility: false,
};

export const candidateTimesheetReducer = createReducer(initialState, handle => [
  handle(getCandidateTimesheet.init, (state, { payload }) =>
    produce(state, draft => {
      if (payload.initialFetch) {
        Object.assign(draft.candidateTimesheetList, initialState.candidateTimesheetList);
      }
    }),
  ),
  handle(getCandidateTimesheet.request, state =>
    produce(state, draft => {
      draft.loadingCandidateTimesheet = true;
    }),
  ),
  handle(getCandidateTimesheet.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingCandidateTimesheet = false;
      draft.candidateTimesheetList = {
        ...payload.data,
        results: draft.candidateTimesheetList.results.concat(payload.data.results),
      };
    }),
  ),
  handle(getCandidateTimesheet.fail, state =>
    produce(state, draft => {
      draft.loadingCandidateTimesheet = false;
    }),
  ),

  handle(getCandidatePipeline.init, (state, { payload }) =>
    produce(state, draft => {
      if (payload.initialFetch) {
        Object.assign(draft.candidatePipeline, initialState.candidatePipeline);
      }
    }),
  ),
  handle(getCandidatePipeline.request, state =>
    produce(state, draft => {
      draft.loadingCandidatePipeline = true;
    }),
  ),
  handle(getCandidatePipeline.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingCandidatePipeline = false;
      draft.candidatePipeline = {
        ...payload.data,
        results: draft.candidatePipeline.results.concat(payload.data.results),
      };
    }),
  ),
  handle(getCandidatePipeline.fail, state =>
    produce(state, draft => {
      draft.loadingCandidatePipeline = false;
    }),
  ),

  handle(createCandidateEntry.request, state =>
    produce(state, draft => {
      draft.creatingCandidateEntry = true;
    }),
  ),

  handle(createCandidateEntry.success, state =>
    produce(state, draft => {
      draft.creatingCandidateEntry = false;
    }),
  ),
  handle(createCandidateEntry.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.creatingCandidateEntry = false;
      draft.createCandidateEntryErrors = payload;
    }),
  ),

  handle(toggleCandidateTimesheetModal, state =>
    produce(state, draft => {
      draft.candidateTimesheetModalVisibility = !draft.candidateTimesheetModalVisibility;
    }),
  ),
  handle(setSelectedCandidateTimesheetId, (state, { payload }) =>
    produce(state, draft => {
      if (payload === null) {
        draft.candidateTimesheet = null;
      }
      draft.selectedCandidateTimesheetId = payload;
    }),
  ),

  handle(getCandidateTimesheetById.request, state =>
    produce(state, draft => {
      draft.loadingCandidateTimesheetById = true;
    }),
  ),

  handle(getCandidateTimesheetById.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingCandidateTimesheetById = false;
      draft.candidateTimesheet = payload.data;
    }),
  ),
  handle(getCandidateTimesheetById.fail, state =>
    produce(state, draft => {
      draft.loadingCandidateTimesheetById = false;
    }),
  ),
  handle(getCandidateTimesheetContract.request, state =>
    produce(state, draft => {
      draft.loadingCandidateContract = true;
    }),
  ),

  handle(getCandidateTimesheetContract.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingCandidateContract = false;
      draft.candidateContract = payload;
    }),
  ),
  handle(getCandidateTimesheetContract.fail, state =>
    produce(state, draft => {
      draft.loadingCandidateContract = false;
    }),
  ),
  handle(toggleTimesheetReviewContractModalVisibility, state =>
    produce(state, draft => {
      draft.reviewTimesheetContractModalVisibility = !draft.reviewTimesheetContractModalVisibility;
    }),
  ),
]);
