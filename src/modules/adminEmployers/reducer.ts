import { createReducer } from 'deox';
import produce from 'immer';

import { EmployerStatus } from '~/models/admin';
import {
  createNewEmployerAction,
  deleteEmployer,
  getEmployerDetails,
  getEmployers,
  getEmployersPendingApprovals,
  getPendingEmployersCount,
  resetCreateEmployerForm,
  resetEmployersFilters,
  setAdminEmployersSearch,
  setCreateEmployerActiveStep,
  setCreateEmployerBusinessFormValues,
  setCreateEmployerFormValues,
  setEmployerDetails,
  setEmployerId,
  setSelectedCompany,
  setSelectedEmployer,
  toggleEmployerModalVisibility,
  updateEmployerStatus,
} from '~/modules/adminEmployers/actions';
import { EmployersState } from '~/modules/adminEmployers/types';

const initialState: EmployersState = {
  loadingEmployers: false,
  errors: null,
  activeStep: 1,
  searchText: '',
  createdEmployerId: null,
  selectedEmployer: null,
  selectedCompany: null,
  createFormValues: null,
  createBusinessFormValues: null,
  updateEmployerStatusLoading: false,
  statusId: EmployerStatus.NONE,
  employerDetails: null,
  employers: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  gettingPendingEmployers: false,
  pendingApprovalCount: 0,
  employerModalVisibility: false,
  employerId: 0,
  deletingEmployer: false,
  loadingEmployerDetails: false,
  createEmployerLoading: false,
};

export const adminEmployersReducer = createReducer(initialState, handle => [
  handle(getEmployers.init, (state, { payload }) =>
    produce(state, draft => {
      if (payload.initialFetch) {
        Object.assign(draft.employers, initialState.employers);
      }
    }),
  ),
  handle(getEmployers.request, state =>
    produce(state, draft => {
      draft.loadingEmployers = true;
    }),
  ),
  handle(getEmployers.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingEmployers = false;
      draft.errors = null;
      draft.employers = {
        ...payload.data,
        results: draft.employers.results.concat(payload.data.results),
      };
    }),
  ),
  handle(getEmployers.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingEmployers = false;
      draft.errors = payload;
    }),
  ),
  handle(setAdminEmployersSearch, (state, { payload }) =>
    produce(state, draft => {
      draft.searchText = payload;
    }),
  ),
  handle(getEmployersPendingApprovals, (state, { payload }) =>
    produce(state, draft => {
      draft.statusId = payload;
    }),
  ),
  handle(setSelectedEmployer, (state, { payload }) =>
    produce(state, draft => {
      draft.selectedEmployer = payload;
      if (payload === null) {
        draft.employerDetails = null;
      }
    }),
  ),
  handle(setSelectedCompany, (state, { payload }) =>
    produce(state, draft => {
      draft.selectedCompany = payload;
    }),
  ),
  handle(resetEmployersFilters, state =>
    produce(state, draft => {
      draft.statusId = EmployerStatus.NONE;
      draft.searchText = '';
      draft.loadingEmployers = false;
    }),
  ),
  handle(getEmployerDetails.request, state =>
    produce(state, draft => {
      draft.errors = null;
      draft.loadingEmployerDetails = true;
    }),
  ),
  handle(getEmployerDetails.success, (state, { payload }) =>
    produce(state, draft => {
      draft.employerDetails = payload;
      draft.errors = null;
      draft.loadingEmployerDetails = false;
    }),
  ),
  handle(getEmployerDetails.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.errors = payload;
      draft.loadingEmployerDetails = false;
    }),
  ),

  handle(updateEmployerStatus.request, state =>
    produce(state, draft => {
      draft.updateEmployerStatusLoading = true;
    }),
  ),
  handle(updateEmployerStatus.success, (state, { payload }) =>
    produce(state, draft => {
      draft.updateEmployerStatusLoading = false;
      draft.errors = null;
      draft.employers.results = draft.employers.results.filter(
        employer => employer.id !== payload.employerId,
      );
      draft.pendingApprovalCount--;
    }),
  ),
  handle(updateEmployerStatus.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.updateEmployerStatusLoading = false;
      draft.errors = payload;
    }),
  ),
  handle(setCreateEmployerFormValues, (state, { payload }) =>
    produce(state, draft => {
      draft.createFormValues = payload;
    }),
  ),
  handle(setCreateEmployerActiveStep, (state, { payload }) =>
    produce(state, draft => {
      draft.activeStep = payload;
    }),
  ),
  handle(setCreateEmployerBusinessFormValues, (state, { payload }) =>
    produce(state, draft => {
      draft.createBusinessFormValues = payload;
    }),
  ),
  handle(createNewEmployerAction.request, state =>
    produce(state, draft => {
      draft.createEmployerLoading = true;
    }),
  ),
  handle(createNewEmployerAction.success, (state, { payload }) =>
    produce(state, draft => {
      draft.errors = null;
      draft.createEmployerLoading = false;
      draft.createdEmployerId = payload;
    }),
  ),
  handle(createNewEmployerAction.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.createEmployerLoading = false;
      draft.errors = payload;
    }),
  ),
  handle(resetCreateEmployerForm, state =>
    produce(state, draft => {
      draft.createFormValues = null;
      draft.createBusinessFormValues = null;
      draft.activeStep = 1;
    }),
  ),
  handle(getPendingEmployersCount.request, state =>
    produce(state, draft => {
      draft.gettingPendingEmployers = true;
    }),
  ),
  handle(getPendingEmployersCount.success, (state, { payload }) =>
    produce(state, draft => {
      draft.gettingPendingEmployers = false;
      draft.pendingApprovalCount = payload;
    }),
  ),
  handle(getPendingEmployersCount.fail, state =>
    produce(state, draft => {
      draft.gettingPendingEmployers = false;
    }),
  ),
  handle(toggleEmployerModalVisibility, state =>
    produce(state, draft => {
      draft.employerModalVisibility = !draft.employerModalVisibility;
    }),
  ),
  handle(setEmployerDetails, (state, { payload }) =>
    produce(state, draft => {
      draft.employerDetails = payload.data;
    }),
  ),
  handle(setEmployerId, (state, { payload }) =>
    produce(state, draft => {
      draft.employerId = payload.employerId;
    }),
  ),
  handle(deleteEmployer.request, state =>
    produce(state, draft => {
      draft.deletingEmployer = true;
    }),
  ),
  handle(deleteEmployer.success, state =>
    produce(state, draft => {
      draft.deletingEmployer = false;
      draft.employers.results = [
        ...draft.employers.results.filter(employer => employer.id !== draft.employerId),
      ];
    }),
  ),
  handle(deleteEmployer.fail, state =>
    produce(state, draft => {
      draft.deletingEmployer = false;
    }),
  ),
]);
