import { createReducer } from 'deox';
import produce from 'immer';

import { CompanyWithLiveJobsCount } from '~/models/admin';

import {
  addJobToShortList,
  getCompaniesWithJobs,
  getFindJobDescription,
  getFindJobs,
  resetFilters,
  setCompany,
  setFindJobInterest,
  setLocation,
  setPosition,
  setPositionType,
  setProjectType,
  setSalary,
  setSearchValue,
  setSelectedCompanyId,
  setSelectedFindJob,
  setSelectedJob,
  setSelectedJobGrop,
} from './actions';
import { CandidateFindJobsState } from './types';

const initialState: CandidateFindJobsState = {
  loadingFindJobs: false,
  findJobs: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  searchSelectedJobs: [],
  companiesWithJobs: {
    count: 0,
    next: null,
    previous: null,
    results: [],
    countJobs: 0,
  },
  searchJobByLocationFilter: {
    label: 'Location',
    value: 0,
  },
  searchJobByJobType: {
    label: 'Job type',
    value: 0,
  },
  searchJobByPositionType: {
    label: 'Position type',
    value: 0,
  },
  searchProjectByProjectType: {
    label: 'Project type',
    value: 0,
  },
  searchJobByCompany: {
    label: 'Company',
    value: 0,
  },
  searchJobByKeyWord: '',
  searchJobBySalaryGte: '',
  searchJobBySalaryLte: '',
  selectedFindJob: null,
  loadingJobDescription: false,
  jobDescription: null,
  settingJobInterest: false,
  addingJobToShortList: false,
  loadingCompaniesWithJobs: false,
  selectedCompanyId: null,
  searchWithSuper: false,
  searchSelectedJobGroups: [],
};

export const candidateFindJobsReducer = createReducer(initialState, handle => [
  handle(getFindJobs.init, (state, { payload }) =>
    produce(state, draft => {
      if (payload.initialFetch) {
        Object.assign(draft.findJobs, initialState.findJobs);
      }
    }),
  ),
  handle(getFindJobs.request, state =>
    produce(state, draft => {
      draft.loadingFindJobs = true;
    }),
  ),
  handle(getFindJobs.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingFindJobs = false;
      draft.findJobs = {
        ...payload.data,
        results: draft.findJobs.results.concat(payload.data.results),
      };
    }),
  ),
  handle(getFindJobs.fail, state =>
    produce(state, draft => {
      draft.loadingFindJobs = false;
    }),
  ),
  handle(setLocation, (state, { payload }) =>
    produce(state, draft => {
      draft.searchJobByLocationFilter = payload;
    }),
  ),
  handle(setPosition, (state, { payload }) =>
    produce(state, draft => {
      draft.searchJobByJobType = payload;
    }),
  ),
  handle(setPositionType, (state, { payload }) =>
    produce(state, draft => {
      draft.searchJobByPositionType = payload;
    }),
  ),
  handle(setCompany, (state, { payload }) =>
    produce(state, draft => {
      draft.searchJobByCompany = payload;
    }),
  ),
  handle(setProjectType, (state, { payload }) =>
    produce(state, draft => {
      draft.searchProjectByProjectType = payload;
    }),
  ),
  handle(setSearchValue, (state, { payload }) =>
    produce(state, draft => {
      draft.searchJobByKeyWord = payload;
    }),
  ),
  handle(setSalary, (state, { payload }) =>
    produce(state, draft => {
      draft.searchWithSuper = payload.withAmount;
      draft.searchJobBySalaryGte = payload.salaryGte;
      draft.searchJobBySalaryLte = payload.salaryLte;
    }),
  ),
  handle(setSelectedFindJob, (state, { payload }) =>
    produce(state, draft => {
      draft.selectedFindJob = payload;
      if (payload === null) {
        draft.jobDescription = null;
        draft.selectedFindJob = null;
      }
    }),
  ),
  handle(getFindJobDescription.request, state =>
    produce(state, draft => {
      draft.loadingJobDescription = true;
    }),
  ),
  handle(getFindJobDescription.success, (state, { payload }) =>
    produce(state, draft => {
      draft.jobDescription = payload.data;
      draft.loadingJobDescription = false;
    }),
  ),
  handle(getFindJobDescription.fail, state =>
    produce(state, draft => {
      draft.loadingJobDescription = false;
    }),
  ),
  handle(setFindJobInterest.request, state =>
    produce(state, draft => {
      draft.settingJobInterest = true;
    }),
  ),
  handle(setFindJobInterest.success, (state, { payload }) =>
    produce(state, draft => {
      draft.settingJobInterest = false;
      if (draft.selectedFindJob && draft.jobDescription) {
        draft.selectedFindJob = {
          ...draft.selectedFindJob,
          interested: payload.data.status,
        };
        draft.jobDescription = {
          ...draft.jobDescription,
          interested: payload.data.status,
        };
      }
    }),
  ),
  handle(setFindJobInterest.fail, state =>
    produce(state, draft => {
      draft.settingJobInterest = false;
    }),
  ),
  handle(resetFilters, state =>
    produce(state, draft => {
      Object.assign(draft, initialState);
    }),
  ),
  handle(addJobToShortList.request, state =>
    produce(state, draft => {
      draft.addingJobToShortList = true;
    }),
  ),
  handle(addJobToShortList.success, (state, { payload }) =>
    produce(state, draft => {
      const addedJobIndex = draft.findJobs.results.findIndex(job => job.id === payload.data.job);
      draft.findJobs.results[addedJobIndex].shortlist = payload.data.shortlist;
      draft.addingJobToShortList = false;
    }),
  ),
  handle(addJobToShortList.fail, state =>
    produce(state, draft => {
      draft.addingJobToShortList = false;
    }),
  ),
  handle(setSelectedCompanyId, (state, { payload }) =>
    produce(state, draft => {
      draft.selectedCompanyId = payload;
    }),
  ),
  handle(getCompaniesWithJobs.init, (state, { payload }) =>
    produce(state, draft => {
      if (payload.initialFetch) {
        draft.selectedCompanyId = null;
        Object.assign(draft.companiesWithJobs, initialState.companiesWithJobs);
      }
    }),
  ),
  handle(getCompaniesWithJobs.request, state =>
    produce(state, draft => {
      draft.loadingCompaniesWithJobs = true;
    }),
  ),
  handle(getCompaniesWithJobs.success, (state, { payload }) =>
    produce(state, draft => {
      if (payload.noLimit) {
        draft.companiesWithJobs.results = payload.res.data as unknown as CompanyWithLiveJobsCount[];
      } else {
        draft.companiesWithJobs = {
          ...payload.res.data,
          results: draft.companiesWithJobs.results.concat(payload.res.data.results),
        };
      }

      draft.loadingCompaniesWithJobs = false;
    }),
  ),
  handle(getCompaniesWithJobs.fail, state =>
    produce(state, draft => {
      draft.loadingCompaniesWithJobs = false;
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
