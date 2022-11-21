import { createReducer } from 'deox';
import produce from 'immer';

import {
  createHiringManager,
  enterInfo,
  getHiringManagers,
  resetErrors,
  skipLogoUpload,
  uploadLogo,
} from './actions';
import { CompanyRegistrationState } from './types';

export const initialState: CompanyRegistrationState = {
  enteringMainInfo: false,
  enteringMainInfoErrors: null,
  mainInfoEntered: false,
  creatingContactDetails: false,
  creatingContactDetailsErrors: null,
  contactDetailsCreated: false,
  uploadingLogo: false,
  uploadingLogoErrors: null,
  logoUploaded: false,
  registeredUserId: 0,
  createdCompanyManagers: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  createdHiringManager: null,
  loadingHiringManagers: false,
  creatingHiringManager: false,
};

export const companyRegistrationReducer = createReducer(initialState, handle => [
  handle(enterInfo.request, state =>
    produce(state, draft => {
      draft.enteringMainInfo = true;
    }),
  ),
  handle(enterInfo.success, (state, { payload }) =>
    produce(state, draft => {
      draft.enteringMainInfo = false;
      draft.mainInfoEntered = true;
      draft.registeredUserId = payload.data.id;
    }),
  ),
  handle(enterInfo.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.enteringMainInfo = false;
      draft.enteringMainInfoErrors = payload;
    }),
  ),
  handle(getHiringManagers.init, (state, { payload }) =>
    produce(state, draft => {
      if (payload.initialFetch) {
        Object.assign(draft.createdCompanyManagers, initialState.createdCompanyManagers);
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
      draft.createdCompanyManagers = {
        ...payload.data,
        results: draft.createdCompanyManagers.results.concat(payload.data.results),
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
      draft.createdCompanyManagers.results = [
        ...draft.createdCompanyManagers.results,
        payload.data,
      ];
      draft.creatingHiringManager = false;
    }),
  ),
  handle(createHiringManager.fail, state =>
    produce(state, draft => {
      draft.creatingHiringManager = false;
    }),
  ),
  handle(uploadLogo.request, state =>
    produce(state, draft => {
      draft.uploadingLogo = true;
    }),
  ),
  handle(uploadLogo.success, state =>
    produce(state, draft => {
      draft.uploadingLogo = false;
      draft.logoUploaded = true;
    }),
  ),
  handle(uploadLogo.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.uploadingLogo = false;
      draft.uploadingLogoErrors = payload;
    }),
  ),
  handle(skipLogoUpload, state =>
    produce(state, draft => {
      draft.logoUploaded = true;
    }),
  ),
  handle(resetErrors, state =>
    produce(state, draft => {
      draft.enteringMainInfoErrors = null;
    }),
  ),
]);
