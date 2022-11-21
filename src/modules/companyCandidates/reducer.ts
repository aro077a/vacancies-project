import { createReducer } from 'deox';
import produce from 'immer';

import {
  addCandidateToShortList,
  getCompanyCandidates,
  resetFilters,
  setAvailability,
  setCity,
  setJobTitle,
  setProjectType,
  setProjectValue,
  setRegion,
  setSalary,
  setSearchValue,
  setSelectedCompanyCandidate,
  setSelectedInterestedJob,
  setSelectedJob,
  setSelectedJobGrop,
  toggleInterestedJobSuccessModalVisibility,
} from './actions';
import { CompanyCandidatesState } from './types';

const initialState: CompanyCandidatesState = {
  candidates: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  searchSelectedJobs: [],
  loadingCandidates: false,
  loadingSelectedCandidate: false,
  selectedCandidate: null,
  searchCandidateCityFilter: {
    label: 'City',
    value: 0,
  },
  searchCandidateRegionFilter: {
    label: 'Region',
    value: 0,
  },
  searchCandidateByProjectType: {
    label: 'Project type',
    value: 0,
  },
  searchCandidateByProjectValue: {
    label: 'Project value',
    value: 0,
  },
  searchCandidateByAvailability: [],
  searchCandidateJobType: {
    label: 'Job type',
    value: 0,
  },
  searchCandidateKeyWord: '',
  searchCandidateSalaryGte: '',
  searchCandidateSalaryLte: '',
  selectedFindJob: null,
  addingToShortList: false,
  interestedJobSuccessModalVisibility: false,
  selectedInterestedJob: '',
  searchSelectedJobGroups: [],
};

export const companyCandidatesReducer = createReducer(initialState, handle => [
  handle(getCompanyCandidates.request, state =>
    produce(state, draft => {
      draft.loadingCandidates = true;
    }),
  ),
  handle(getCompanyCandidates.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingCandidates = false;
      draft.candidates = {
        ...payload.data,
        results: payload.data.results,
      };
    }),
  ),
  handle(getCompanyCandidates.fail, state =>
    produce(state, draft => {
      draft.loadingCandidates = false;
    }),
  ),
  handle(setSelectedCompanyCandidate.request, state =>
    produce(state, draft => {
      draft.loadingSelectedCandidate = true;
    }),
  ),
  handle(setSelectedCompanyCandidate.success, (state, { payload }) =>
    produce(state, draft => {
      draft.selectedCandidate = payload;
      draft.loadingSelectedCandidate = false;
    }),
  ),
  handle(setRegion, (state, { payload }) =>
    produce(state, draft => {
      draft.searchCandidateRegionFilter = payload;
    }),
  ),
  handle(setCity, (state, { payload }) =>
    produce(state, draft => {
      draft.searchCandidateCityFilter = payload;
    }),
  ),
  handle(setJobTitle, (state, { payload }) =>
    produce(state, draft => {
      draft.searchCandidateJobType = payload;
    }),
  ),
  handle(setAvailability, (state, { payload }) =>
    produce(state, draft => {
      draft.searchCandidateByAvailability = payload;
    }),
  ),
  handle(setProjectType, (state, { payload }) =>
    produce(state, draft => {
      draft.searchCandidateByProjectType = payload;
    }),
  ),
  handle(setProjectValue, (state, { payload }) =>
    produce(state, draft => {
      draft.searchCandidateByProjectValue = payload;
    }),
  ),
  handle(setSearchValue, (state, { payload }) =>
    produce(state, draft => {
      draft.searchCandidateKeyWord = payload;
    }),
  ),
  handle(setSalary, (state, { payload }) =>
    produce(state, draft => {
      draft.searchCandidateSalaryGte = payload.salaryGte;
      draft.searchCandidateSalaryLte = payload.salaryLte;
    }),
  ),
  handle(addCandidateToShortList.request, state =>
    produce(state, draft => {
      draft.addingToShortList = true;
    }),
  ),
  handle(addCandidateToShortList.success, (state, { payload }) =>
    produce(state, draft => {
      const addedCandidateIndex = draft.candidates.results.findIndex(
        candidate => candidate.id === payload.data.candidate,
      );
      draft.candidates.results[addedCandidateIndex].shortlist = payload.data.shortlist;
      draft.addingToShortList = false;
    }),
  ),
  handle(addCandidateToShortList.fail, state =>
    produce(state, draft => {
      draft.addingToShortList = false;
    }),
  ),
  handle(resetFilters, state =>
    produce(state, draft => {
      Object.assign(draft, initialState);
    }),
  ),
  handle(toggleInterestedJobSuccessModalVisibility, state =>
    produce(state, draft => {
      draft.interestedJobSuccessModalVisibility = !draft.interestedJobSuccessModalVisibility;
    }),
  ),
  handle(setSelectedInterestedJob, (state, { payload }) =>
    produce(state, draft => {
      draft.selectedInterestedJob = payload;
    }),
  ),
  handle(setSelectedJob, (state, { payload }) =>
    produce(state, draft => {
      draft.searchSelectedJobs = payload;
    }),
  ),
  handle(setSelectedJobGrop, (state, { payload }) =>
    produce(state, draft => {
      draft.searchSelectedJobGroups = payload;
    }),
  ),
]);
