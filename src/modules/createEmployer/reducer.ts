import { createReducer } from 'deox';
import produce from 'immer';

import {
  createCompanyBusinessDetails,
  createEmployerCompanyInfo,
  createHiringManager,
  deleteEmployerLogo,
  deleteHiringMangerRequest,
  editEmployerDetails,
  editEmployerInfo,
  getEmployerDetails,
  getEmployerForEdit,
  getEmployerLogo,
  getEmployerProfile,
  getHiringManagers,
  resetErrors,
  setHiringManagerEditMode,
  setHiringManagerForEdit,
  setHiringManagerId,
  setSelectedEmployer,
  updateEmployerLogo,
  updateHiringManager,
  uploadCompanyLogo,
} from './actions';
import { CreateEmployerState } from './types';

export const initialState: CreateEmployerState = {
  creatingEmployerCompanyInfo: false,
  creatingEmployerCompanyInfoErrors: null,
  employerCompanyInfoCreated: null,
  creatingCompanyBusinessDetails: false,
  creatingCompanyBusinessDetailsErrors: null,
  companyBusinessDetailsCreated: null,
  uploadingCompanyLogo: false,
  uploadingCompanyLogoErrors: null,
  companyLogoUploaded: false,
  registeredCompanyId: 0,
  employerDataForEditLoading: false,
  updatingEmployerInfo: false,
  updateEmployerInfoErrors: null,
  employerInfo: null,
  updatingEmployerDetails: false,
  updateEmployerDetailsErrors: null,
  employerDetails: null,
  employerLogo: null,
  updatingEmployerLogo: false,
  updatingEmployerLogoErrors: null,
  employerId: 0,
  deletingEmployerLogo: false,
  employerLogoDeleted: false,
  companyManagers: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  createdHiringManager: null,
  loadingHiringManagers: false,
  creatingHiringManager: false,
  createHiringManagerErrors: null,
  deletingHiringManger: false,
  updatingHiringManager: false,
  updateHiringManagerErrors: null,
  managerId: 0,
  editMode: false,
  hiringManager: null,
  isEmpty: false,
};

export const createEmployerReducer = createReducer(initialState, handle => [
  handle(createEmployerCompanyInfo.request, state =>
    produce(state, draft => {
      draft.creatingEmployerCompanyInfo = true;
    }),
  ),
  handle(createEmployerCompanyInfo.success, (state, { payload }) =>
    produce(state, draft => {
      draft.creatingEmployerCompanyInfo = false;
      draft.employerCompanyInfoCreated = payload.data;
      draft.registeredCompanyId = payload.data.id;
    }),
  ),
  handle(createEmployerCompanyInfo.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.creatingEmployerCompanyInfo = false;
      draft.creatingEmployerCompanyInfoErrors = payload;
    }),
  ),

  handle(createCompanyBusinessDetails.request, state =>
    produce(state, draft => {
      draft.creatingCompanyBusinessDetails = true;
    }),
  ),
  handle(createCompanyBusinessDetails.success, (state, { payload }) =>
    produce(state, draft => {
      draft.creatingCompanyBusinessDetails = false;
      draft.companyBusinessDetailsCreated = payload.data;
    }),
  ),
  handle(createCompanyBusinessDetails.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.creatingCompanyBusinessDetails = false;
      draft.creatingCompanyBusinessDetailsErrors = payload;
    }),
  ),

  handle(uploadCompanyLogo.request, state =>
    produce(state, draft => {
      draft.uploadingCompanyLogo = true;
    }),
  ),
  handle(uploadCompanyLogo.success, (state, { payload }) =>
    produce(state, draft => {
      draft.uploadingCompanyLogo = false;
      draft.companyLogoUploaded = true;
      draft.employerLogo = payload ? payload.data : null;
      Object.assign(draft, initialState);
    }),
  ),
  handle(uploadCompanyLogo.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.uploadingCompanyLogo = false;
      draft.uploadingCompanyLogoErrors = payload;
    }),
  ),
  handle(resetErrors, state =>
    produce(state, draft => {
      draft.creatingEmployerCompanyInfoErrors = null;
      draft.creatingCompanyBusinessDetailsErrors = null;
    }),
  ),

  handle(getEmployerForEdit.request, state =>
    produce(state, draft => {
      draft.employerDataForEditLoading = true;
    }),
  ),
  handle(getEmployerForEdit.success, state =>
    produce(state, draft => {
      draft.employerDataForEditLoading = false;
    }),
  ),
  handle(getEmployerForEdit.fail, state =>
    produce(state, draft => {
      draft.employerDataForEditLoading = false;
    }),
  ),

  handle(getEmployerProfile.success, (state, { payload }) =>
    produce(state, draft => {
      draft.employerInfo = payload.data;
    }),
  ),

  handle(editEmployerInfo.request, state =>
    produce(state, draft => {
      draft.updatingEmployerInfo = true;
    }),
  ),
  handle(editEmployerInfo.success, (state, { payload }) =>
    produce(state, draft => {
      draft.updatingEmployerInfo = false;
      draft.updateEmployerInfoErrors = null;
      draft.employerInfo = payload.data;
    }),
  ),
  handle(editEmployerInfo.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.updatingEmployerInfo = false;
      draft.updateEmployerInfoErrors = payload;
    }),
  ),

  handle(getEmployerDetails.success, (state, { payload }) =>
    produce(state, draft => {
      draft.employerDetails = payload.data;
    }),
  ),

  handle(editEmployerDetails.request, state =>
    produce(state, draft => {
      draft.updatingEmployerDetails = true;
    }),
  ),
  handle(editEmployerDetails.success, (state, { payload }) =>
    produce(state, draft => {
      draft.updatingEmployerDetails = false;
      draft.updateEmployerDetailsErrors = null;
      draft.employerDetails = payload.data;
    }),
  ),
  handle(editEmployerDetails.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.updatingEmployerDetails = false;
      draft.updateEmployerDetailsErrors = payload;
    }),
  ),

  handle(getEmployerLogo.success, (state, { payload }) =>
    produce(state, draft => {
      draft.employerLogo = payload.data;
    }),
  ),

  handle(updateEmployerLogo.request, state =>
    produce(state, draft => {
      draft.updatingEmployerLogo = true;
    }),
  ),
  handle(updateEmployerLogo.success, (state, { payload }) =>
    produce(state, draft => {
      draft.updatingEmployerLogo = false;
      draft.employerLogo = payload.data;
    }),
  ),
  handle(updateEmployerLogo.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.updatingEmployerLogo = false;
      draft.updatingEmployerLogoErrors = payload;
    }),
  ),

  handle(deleteEmployerLogo.request, state =>
    produce(state, draft => {
      draft.deletingEmployerLogo = true;
    }),
  ),
  handle(deleteEmployerLogo.success, state =>
    produce(state, draft => {
      draft.deletingEmployerLogo = false;
      draft.employerLogoDeleted = true;
      draft.employerLogo = null;
    }),
  ),
  handle(deleteEmployerLogo.fail, state =>
    produce(state, draft => {
      draft.deletingEmployerLogo = false;
    }),
  ),

  handle(setSelectedEmployer, (state, { payload }) =>
    produce(state, draft => {
      draft.employerId = payload.employerId;
    }),
  ),
  handle(getHiringManagers.init, (state, { payload }) =>
    produce(state, draft => {
      if (payload.initialFetch) {
        Object.assign(draft.companyManagers, initialState.companyManagers);
      }
    }),
  ),
  handle(getHiringManagers.request, state =>
    produce(state, draft => {
      draft.loadingHiringManagers = true;
    }),
  ),
  handle(getHiringManagers.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingHiringManagers = false;
      draft.companyManagers = {
        ...payload.data,
        results: draft.companyManagers.results.concat(payload.data.results),
      };
    }),
  ),
  handle(getHiringManagers.fail, state =>
    produce(state, draft => {
      draft.loadingHiringManagers = false;
    }),
  ),
  handle(createHiringManager.request, state =>
    produce(state, draft => {
      draft.creatingHiringManager = true;
    }),
  ),
  handle(createHiringManager.success, (state, { payload }) =>
    produce(state, draft => {
      draft.createdHiringManager = payload.data;
      draft.companyManagers.results = [...draft.companyManagers.results, payload.data];
      draft.creatingHiringManager = false;
    }),
  ),
  handle(createHiringManager.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.createHiringManagerErrors = payload;
      draft.creatingHiringManager = false;
    }),
  ),
  handle(updateHiringManager.request, state =>
    produce(state, draft => {
      draft.updatingHiringManager = true;
    }),
  ),
  handle(updateHiringManager.success, (state, { payload }) =>
    produce(state, draft => {
      draft.updatingHiringManager = false;
      const updatedManagerFromResponse = draft.companyManagers.results.findIndex(
        manager => manager.id === payload.data.id,
      );
      draft.companyManagers.results[updatedManagerFromResponse] = payload?.data;
    }),
  ),
  handle(updateHiringManager.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.updatingHiringManager = false;
      draft.updateHiringManagerErrors = payload;
    }),
  ),

  handle(deleteHiringMangerRequest.request, state =>
    produce(state, draft => {
      draft.deletingHiringManger = true;
    }),
  ),
  handle(deleteHiringMangerRequest.success, state =>
    produce(state, draft => {
      draft.deletingHiringManger = false;
      draft.companyManagers.results = [
        ...draft.companyManagers.results.filter(item => item.id !== draft.managerId),
      ];
    }),
  ),
  handle(deleteHiringMangerRequest.fail, state =>
    produce(state, draft => {
      draft.deletingHiringManger = false;
    }),
  ),
  handle(setHiringManagerId, (state, { payload }) =>
    produce(state, draft => {
      draft.managerId = payload.managerId;
    }),
  ),

  handle(setHiringManagerForEdit, (state, { payload }) =>
    produce(state, draft => {
      draft.hiringManager = payload.hiringManager;
    }),
  ),
  handle(setHiringManagerEditMode, (state, { payload }) =>
    produce(state, draft => {
      draft.editMode = payload.editMode;
    }),
  ),
]);
