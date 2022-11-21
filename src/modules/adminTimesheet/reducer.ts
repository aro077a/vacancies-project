import { createReducer } from 'deox';
import produce from 'immer';

import { TimesheetStatus } from '~/models/company';

import {
  createAdminEntry,
  getAdminTimesheet,
  getAdminTimesheetById,
  getCandidatePipeline,
  getCandidatesWithTimesheet,
  getCompaniesWithTimesheet,
  resetTimesheetFilters,
  setCandidate,
  setCompany,
  setSelectedAdminTimesheetId,
  setSelectedCandidate,
  setSelectedCompany,
  setStatus,
  setWeek,
  toggleAdminTimesheetModal,
  updateAdminTimesheetStatus,
} from './actions';
import { AdminTimesheetState } from './types';

const initialState: AdminTimesheetState = {
  adminTimesheetList: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  candidatePipeline: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  adminTimesheetModalVisibility: false,
  selectedAdminTimesheetId: null,
  loadingAdminTimesheetById: false,
  loadingAdminTimesheet: false,
  adminTimesheet: null,
  approvingAdminTimesheetStatus: false,
  rejectingAdminTimesheetStatus: false,
  searchByTimesheetStatus: {
    value: 0,
    label: 'Status',
  },
  searchByCandidate: {
    value: 0,
    label: 'Candidate',
  },
  searchByCompany: {
    value: 0,
    label: 'Company',
  },
  searchByWeek: undefined,
  loadingCandidatesWithTimesheet: false,
  loadingCompaniesWithTimesheet: false,
  candidatesWithTimesheet: [],
  companiesWithTimesheet: [],
  createAdminEntryErrors: null,
  creatingAdminEntry: false,
  loadingCandidatePipeline: false,
  selectedCandidate: {
    value: 0,
    label: 'Candidate',
  },
  selectedCompany: {
    value: 0,
    label: 'Select a company and position',
  },
};

export const adminTimesheetReducer = createReducer(initialState, handle => [
  handle(getAdminTimesheet.init, (state, { payload }) =>
    produce(state, draft => {
      if (payload.initialFetch) {
        Object.assign(draft.adminTimesheetList, initialState.adminTimesheetList);
      }
    }),
  ),
  handle(getAdminTimesheet.request, state =>
    produce(state, draft => {
      draft.loadingAdminTimesheet = true;
    }),
  ),
  handle(getAdminTimesheet.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingAdminTimesheet = false;
      draft.adminTimesheetList = {
        ...payload.data,
        results: draft.adminTimesheetList.results.concat(payload.data.results),
      };
    }),
  ),
  handle(getAdminTimesheet.fail, state =>
    produce(state, draft => {
      draft.loadingAdminTimesheet = false;
    }),
  ),
  handle(toggleAdminTimesheetModal, state =>
    produce(state, draft => {
      draft.adminTimesheetModalVisibility = !draft.adminTimesheetModalVisibility;
    }),
  ),
  handle(setSelectedAdminTimesheetId, (state, { payload }) =>
    produce(state, draft => {
      if (payload === null) {
        draft.adminTimesheet = null;
      }
      draft.selectedAdminTimesheetId = payload;
    }),
  ),

  handle(getAdminTimesheetById.request, state =>
    produce(state, draft => {
      draft.loadingAdminTimesheetById = true;
    }),
  ),

  handle(getAdminTimesheetById.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingAdminTimesheetById = false;
      draft.adminTimesheet = payload.data;
    }),
  ),
  handle(getAdminTimesheetById.fail, state =>
    produce(state, draft => {
      draft.loadingAdminTimesheetById = false;
    }),
  ),

  handle(updateAdminTimesheetStatus.request, (state, { payload }) =>
    produce(state, draft => {
      if (payload.status === TimesheetStatus.APPROVED) {
        draft.approvingAdminTimesheetStatus = true;
      } else {
        draft.rejectingAdminTimesheetStatus = true;
      }
    }),
  ),
  handle(updateAdminTimesheetStatus.success, (state, { payload }) =>
    produce(state, draft => {
      draft.approvingAdminTimesheetStatus = false;

      draft.rejectingAdminTimesheetStatus = false;

      const updatedAdminTimesheetStatus = draft.adminTimesheetList.results.findIndex(
        timesheet => timesheet.id === payload?.data?.id,
      );
      draft.adminTimesheetList.results[updatedAdminTimesheetStatus] = payload?.data;
    }),
  ),
  handle(updateAdminTimesheetStatus.fail, state =>
    produce(state, draft => {
      draft.approvingAdminTimesheetStatus = false;

      draft.rejectingAdminTimesheetStatus = false;
    }),
  ),
  handle(setStatus, (state, { payload }) =>
    produce(state, draft => {
      draft.searchByTimesheetStatus = payload;
    }),
  ),
  handle(setWeek, (state, { payload }) =>
    produce(state, draft => {
      draft.searchByWeek = payload;
    }),
  ),
  handle(setCandidate, (state, { payload }) =>
    produce(state, draft => {
      draft.searchByCandidate = payload;
    }),
  ),
  handle(setCompany, (state, { payload }) =>
    produce(state, draft => {
      draft.searchByCompany = payload;
    }),
  ),
  handle(getCandidatesWithTimesheet.request, state =>
    produce(state, draft => {
      draft.loadingCandidatesWithTimesheet = true;
    }),
  ),
  handle(getCandidatesWithTimesheet.success, (state, { payload }) =>
    produce(state, draft => {
      draft.candidatesWithTimesheet = payload.data.map(candidate => ({
        value: candidate.id,
        label: candidate.fullName,
      }));
      draft.loadingCandidatesWithTimesheet = false;
    }),
  ),
  handle(getCandidatesWithTimesheet.fail, state =>
    produce(state, draft => {
      draft.loadingCandidatesWithTimesheet = false;
    }),
  ),
  handle(getCompaniesWithTimesheet.request, state =>
    produce(state, draft => {
      draft.loadingCompaniesWithTimesheet = true;
    }),
  ),
  handle(getCompaniesWithTimesheet.success, (state, { payload }) =>
    produce(state, draft => {
      draft.companiesWithTimesheet = payload.data.map(company => ({
        value: company.id,
        label: company.name,
      }));
      draft.loadingCompaniesWithTimesheet = false;
    }),
  ),
  handle(getCompaniesWithTimesheet.fail, state =>
    produce(state, draft => {
      draft.loadingCompaniesWithTimesheet = false;
    }),
  ),
  handle(resetTimesheetFilters, state =>
    produce(state, draft => {
      Object.assign(draft, {
        ...draft,
        searchByCandidate: initialState.searchByCandidate,
        searchByCompany: initialState.searchByCompany,
        searchByWeek: initialState.searchByWeek,
        searchByTimesheetStatus: initialState.searchByTimesheetStatus,
      });
    }),
  ),
  handle(createAdminEntry.request, state =>
    produce(state, draft => {
      draft.creatingAdminEntry = true;
    }),
  ),

  handle(createAdminEntry.success, state =>
    produce(state, draft => {
      draft.creatingAdminEntry = false;
    }),
  ),
  handle(createAdminEntry.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.creatingAdminEntry = false;
      draft.createAdminEntryErrors = payload;
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
  handle(setSelectedCandidate, (state, { payload }) =>
    produce(state, draft => {
      Object.assign(draft.selectedCompany, initialState.selectedCompany);
      draft.selectedCandidate = payload;
    }),
  ),
  handle(setSelectedCompany, (state, { payload }) =>
    produce(state, draft => {
      draft.selectedCompany = payload;
    }),
  ),
]);
