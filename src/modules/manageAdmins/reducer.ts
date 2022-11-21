import { createReducer } from 'deox';
import produce from 'immer';

import {
  assignCompaniesAndRegionsToAdmin,
  assignJobToAdmin,
  deleteAdmin,
  getAdminJobs,
  getAdminPositionsList,
  getAdminRegions,
  getListOfAdmins,
  inviteAdmin,
  setAdminId,
  setJobId,
} from './actions';
import { ManageAdminsState } from './types';

const initialState: ManageAdminsState = {
  listOfAdmins: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  loadingListOfAdmins: false,
  inviteAdminLoading: false,
  inviteAdminErrors: null,
  invitedAdmin: null,
  adminPositionsList: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  loadingAdminPositionsList: false,
  adminRegions: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  loadingAdminRegions: false,
  loadingAssignCompaniesAndRegions: false,
  adminId: 0,
  adminJobs: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  loadingAdminJobs: false,
  jobId: 0,
  assignJobToAdminLoading: false,
  assignJobToAdminErrors: null,
  deleteAdminLoading: false,
};

export const manageAdminsReducer = createReducer(initialState, handle => [
  handle(getListOfAdmins.init, (state, { payload }) =>
    produce(state, draft => {
      if (payload.initialFetch) {
        Object.assign(draft.listOfAdmins, initialState.listOfAdmins);
      }
    }),
  ),
  handle(getListOfAdmins.request, state =>
    produce(state, draft => {
      draft.loadingListOfAdmins = true;
    }),
  ),
  handle(getListOfAdmins.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingListOfAdmins = false;
      draft.listOfAdmins = {
        ...payload.data,
        results: draft.listOfAdmins.results.concat(payload.data.results),
      };
    }),
  ),
  handle(getListOfAdmins.fail, state =>
    produce(state, draft => {
      draft.loadingListOfAdmins = false;
    }),
  ),

  handle(inviteAdmin.request, state =>
    produce(state, draft => {
      draft.inviteAdminLoading = true;
    }),
  ),
  handle(inviteAdmin.success, (state, { payload }) =>
    produce(state, draft => {
      draft.inviteAdminLoading = false;
      draft.invitedAdmin = payload.data;
    }),
  ),
  handle(inviteAdmin.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.inviteAdminLoading = false;
      draft.inviteAdminErrors = payload;
    }),
  ),

  handle(getAdminPositionsList.init, (state, { payload }) =>
    produce(state, draft => {
      if (payload.initialFetch) {
        Object.assign(draft.adminPositionsList, initialState.adminPositionsList);
      }
    }),
  ),
  handle(getAdminPositionsList.request, state =>
    produce(state, draft => {
      draft.loadingAdminPositionsList = true;
    }),
  ),
  handle(getAdminPositionsList.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingAdminPositionsList = false;
      draft.adminPositionsList = {
        ...payload.data,
        results: draft.adminPositionsList.results.concat(payload.data.results),
      };
    }),
  ),
  handle(getAdminPositionsList.fail, state =>
    produce(state, draft => {
      draft.loadingAdminPositionsList = false;
    }),
  ),

  handle(getAdminRegions.init, (state, { payload }) =>
    produce(state, draft => {
      if (payload.initialFetch) {
        Object.assign(draft.adminRegions, initialState.adminRegions);
      }
    }),
  ),
  handle(getAdminRegions.request, state =>
    produce(state, draft => {
      draft.loadingAdminRegions = true;
    }),
  ),
  handle(getAdminRegions.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingAdminRegions = false;
      draft.adminRegions = {
        ...payload.data,
        results: draft.adminRegions.results.concat(payload.data.results),
      };
    }),
  ),
  handle(getAdminRegions.fail, state =>
    produce(state, draft => {
      draft.loadingAdminRegions = false;
    }),
  ),
  handle(getAdminJobs.init, (state, { payload }) =>
    produce(state, draft => {
      if (payload.initialFetch) {
        Object.assign(draft.adminJobs, initialState.adminJobs);
      }
    }),
  ),
  handle(getAdminJobs.request, state =>
    produce(state, draft => {
      draft.loadingAdminJobs = true;
    }),
  ),
  handle(getAdminJobs.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingAdminJobs = false;
      draft.adminJobs = {
        ...payload.data,
        results: draft.adminJobs.results.concat(payload.data.results),
      };
    }),
  ),
  handle(getAdminJobs.fail, state =>
    produce(state, draft => {
      draft.loadingAdminJobs = false;
    }),
  ),

  handle(setAdminId, (state, { payload }) =>
    produce(state, draft => {
      draft.adminId = payload.adminId;
    }),
  ),

  handle(setJobId, (state, { payload }) =>
    produce(state, draft => {
      draft.jobId = payload.jobId;
    }),
  ),

  handle(assignCompaniesAndRegionsToAdmin.request, state =>
    produce(state, draft => {
      draft.loadingAssignCompaniesAndRegions = true;
    }),
  ),
  handle(assignCompaniesAndRegionsToAdmin.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingAssignCompaniesAndRegions = false;
      const updatedAdminFromResponse = draft.listOfAdmins.results.findIndex(
        admin => admin.id === payload.data.id,
      );
      draft.listOfAdmins.results[updatedAdminFromResponse] = payload.data;
    }),
  ),
  handle(assignCompaniesAndRegionsToAdmin.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingAssignCompaniesAndRegions = false;
      draft.inviteAdminErrors = payload;
    }),
  ),

  handle(assignJobToAdmin.request, state =>
    produce(state, draft => {
      draft.assignJobToAdminLoading = true;
    }),
  ),
  handle(assignJobToAdmin.success, state =>
    produce(state, draft => {
      draft.assignJobToAdminLoading = false;
      draft.adminJobs.results = [
        ...draft.adminJobs.results.filter(item => item.id !== draft.jobId),
      ];
    }),
  ),
  handle(assignJobToAdmin.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.assignJobToAdminLoading = false;
      draft.assignJobToAdminErrors = payload;
    }),
  ),

  handle(deleteAdmin.request, (state, { payload }) =>
    produce(state, draft => {
      draft.deleteAdminLoading = true;
      draft.adminId = payload.adminId;
    }),
  ),
  handle(deleteAdmin.success, state =>
    produce(state, draft => {
      draft.deleteAdminLoading = false;
      draft.listOfAdmins.results = draft.listOfAdmins.results.filter(
        admin => admin.id !== draft.adminId,
      );
    }),
  ),
  handle(deleteAdmin.fail, state =>
    produce(state, draft => {
      draft.deleteAdminLoading = false;
    }),
  ),
]);
