import { createReducer } from 'deox';
import produce from 'immer';

import {
  addHiringManager,
  deleteCompanyLogo,
  deleteHiringManager,
  editClientDetails,
  editCompanyInfo,
  getClientDetails,
  getCompanyForEdit,
  getCompanyLogo,
  getCompanyProfile,
  getHiringManagers,
  setHiringManagerForEdit,
  setHiringManagerId,
  updateHiringManager,
  updateLogo,
} from './actions';
import { CompanyProfileState } from './types';

const initialState: CompanyProfileState = {
  companyDataForEditLoading: false,
  companyInfo: null,
  updatingCompanyInfoLoading: false,
  updateCompanyInfoErrors: null,
  clientDetails: null,
  updatingCLientDetailsLoading: false,
  updateCLientDetailsErrors: null,
  companyLogo: null,
  updatingCompanyLogo: false,
  updatingCompanyLogoErrors: null,
  companyManagers: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  loadingCompanyManagers: false,
  addingHiringManager: false,
  addHiringManagerErrors: null,
  createdHiringManager: null,
  deletingHiringManger: false,
  managerId: 0,
  updatingHiringManager: false,
  updateHiringManagerErrors: null,
  hiringManager: null,
  deletingCompanyLogo: false,
  companyLogoDeleted: false,
};

export const companyProfileReducer = createReducer(initialState, handle => [
  handle(getCompanyForEdit.request, state =>
    produce(state, draft => {
      draft.companyDataForEditLoading = true;
    }),
  ),
  handle(getCompanyForEdit.success, state =>
    produce(state, draft => {
      draft.companyDataForEditLoading = false;
    }),
  ),
  handle(getCompanyForEdit.fail, state =>
    produce(state, draft => {
      draft.companyDataForEditLoading = false;
    }),
  ),

  handle(getCompanyProfile.success, (state, { payload }) =>
    produce(state, draft => {
      draft.companyInfo = payload.data;
    }),
  ),

  handle(editCompanyInfo.request, state =>
    produce(state, draft => {
      draft.updatingCompanyInfoLoading = true;
    }),
  ),
  handle(editCompanyInfo.success, (state, { payload }) =>
    produce(state, draft => {
      draft.updatingCompanyInfoLoading = false;
      draft.updateCompanyInfoErrors = null;
      draft.companyInfo = payload.data;
    }),
  ),
  handle(editCompanyInfo.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.updatingCompanyInfoLoading = false;
      draft.updateCompanyInfoErrors = payload;
    }),
  ),

  handle(getClientDetails.success, (state, { payload }) =>
    produce(state, draft => {
      draft.clientDetails = payload.data;
    }),
  ),

  handle(editClientDetails.request, state =>
    produce(state, draft => {
      draft.updatingCLientDetailsLoading = true;
    }),
  ),
  handle(editClientDetails.success, (state, { payload }) =>
    produce(state, draft => {
      draft.updatingCLientDetailsLoading = false;
      draft.updateCLientDetailsErrors = null;
      draft.clientDetails = payload.data;
    }),
  ),
  handle(editClientDetails.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.updatingCLientDetailsLoading = false;
      draft.updateCLientDetailsErrors = payload;
    }),
  ),

  handle(getCompanyLogo.success, (state, { payload }) =>
    produce(state, draft => {
      draft.companyLogo = payload.data;
    }),
  ),

  handle(updateLogo.request, state =>
    produce(state, draft => {
      draft.updatingCompanyLogo = true;
    }),
  ),
  handle(updateLogo.success, (state, { payload }) =>
    produce(state, draft => {
      draft.updatingCompanyLogo = false;
      draft.companyLogo = payload.data;
    }),
  ),
  handle(updateLogo.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.updatingCompanyLogo = false;
      draft.updatingCompanyLogoErrors = payload;
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
      draft.loadingCompanyManagers = true;
    }),
  ),
  handle(getHiringManagers.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingCompanyManagers = false;
      draft.companyManagers = {
        ...payload.data,
        results: draft.companyManagers.results.concat(payload.data.results),
      };
    }),
  ),
  handle(getHiringManagers.fail, state =>
    produce(state, draft => {
      draft.loadingCompanyManagers = false;
    }),
  ),

  handle(addHiringManager.request, state =>
    produce(state, draft => {
      draft.addingHiringManager = true;
    }),
  ),
  handle(addHiringManager.success, (state, { payload }) =>
    produce(state, draft => {
      draft.addingHiringManager = false;
      draft.createdHiringManager = payload.data;
      draft.companyManagers.results = [...draft.companyManagers.results, payload.data];
    }),
  ),
  handle(addHiringManager.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.addingHiringManager = false;
      draft.addHiringManagerErrors = payload;
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

  handle(deleteHiringManager.request, state =>
    produce(state, draft => {
      draft.deletingHiringManger = true;
    }),
  ),
  handle(deleteHiringManager.success, state =>
    produce(state, draft => {
      draft.deletingHiringManger = false;
      draft.companyManagers.results = [
        ...draft.companyManagers.results.filter(item => item.id !== draft.managerId),
      ];
    }),
  ),
  handle(deleteHiringManager.fail, state =>
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

  handle(deleteCompanyLogo.request, state =>
    produce(state, draft => {
      draft.deletingCompanyLogo = true;
    }),
  ),
  handle(deleteCompanyLogo.success, state =>
    produce(state, draft => {
      draft.deletingCompanyLogo = false;
      draft.companyLogoDeleted = true;
      draft.companyLogo = null;
    }),
  ),
]);
