import { createReducer } from 'deox';
import produce from 'immer';

import { TimesheetStatus } from '~/models/company';

import {
  getCompanyTimesheet,
  getTimesheetById,
  setSelectedTimesheetId,
  toggleTimesheetModal,
  updateTimesheetStatus,
} from './actions';
import { CompanyTimesheetState } from './types';

const initialState: CompanyTimesheetState = {
  companyTimesheetList: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  loadingCompanyTimesheetList: false,
  updatingTimesheetStatusAsApprovedLoading: false,
  updatingTimesheetStatusAsRejectedLoading: false,
  companyTimesheet: null,
  loadingCompanyTimesheet: false,
  timesheetModalVisibility: false,
  selectedTimesheetId: null,
};

export const companyTimesheetReducer = createReducer(initialState, handle => [
  handle(getCompanyTimesheet.init, (state, { payload }) =>
    produce(state, draft => {
      if (payload.initialFetch) {
        Object.assign(draft.companyTimesheetList, initialState.companyTimesheetList);
      }
    }),
  ),
  handle(getCompanyTimesheet.request, state =>
    produce(state, draft => {
      draft.loadingCompanyTimesheetList = true;
    }),
  ),
  handle(getCompanyTimesheet.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingCompanyTimesheetList = false;
      draft.companyTimesheetList = {
        ...payload.data,
        results: draft.companyTimesheetList.results.concat(payload.data.results),
      };
    }),
  ),
  handle(getCompanyTimesheet.fail, state =>
    produce(state, draft => {
      draft.loadingCompanyTimesheetList = false;
    }),
  ),

  handle(updateTimesheetStatus.request, (state, { payload }) =>
    produce(state, draft => {
      if (payload.status === TimesheetStatus.APPROVED) {
        draft.updatingTimesheetStatusAsApprovedLoading = true;
      } else {
        draft.updatingTimesheetStatusAsRejectedLoading = true;
      }
    }),
  ),
  handle(updateTimesheetStatus.success, (state, { payload }) =>
    produce(state, draft => {
      draft.updatingTimesheetStatusAsApprovedLoading = false;

      draft.updatingTimesheetStatusAsRejectedLoading = false;

      const updatedTimesheetStatus = draft.companyTimesheetList.results.findIndex(
        timesheet => timesheet.id === payload?.data?.id,
      );
      draft.companyTimesheetList.results[updatedTimesheetStatus] = payload?.data;
    }),
  ),
  handle(updateTimesheetStatus.fail, state =>
    produce(state, draft => {
      draft.updatingTimesheetStatusAsApprovedLoading = false;

      draft.updatingTimesheetStatusAsRejectedLoading = false;
    }),
  ),

  handle(getTimesheetById.request, state =>
    produce(state, draft => {
      draft.loadingCompanyTimesheet = true;
    }),
  ),
  handle(getTimesheetById.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingCompanyTimesheet = false;
      draft.companyTimesheet = payload.data;
    }),
  ),
  handle(getTimesheetById.fail, state =>
    produce(state, draft => {
      draft.loadingCompanyTimesheet = false;
    }),
  ),
  handle(toggleTimesheetModal, state =>
    produce(state, draft => {
      draft.timesheetModalVisibility = !draft.timesheetModalVisibility;
    }),
  ),
  handle(setSelectedTimesheetId, (state, { payload }) =>
    produce(state, draft => {
      if (payload === null) {
        draft.companyTimesheet = null;
      }
      draft.selectedTimesheetId = payload;
    }),
  ),
]);
