import { createReducer } from 'deox';
import produce from 'immer';

import {
  createProfessionalDetails,
  createProfile,
  resetErrors,
  skipCvUpload,
  skipLicensesUpload,
  skipPhotoUpload,
  uploadCV,
  uploadLicenses,
  uploadPhoto,
} from './actions';
import { CandidateRegistrationState } from './types';

export const initialState: CandidateRegistrationState = {
  creatingProfile: false,
  creatingProfileErrors: null,
  profileCreated: false,
  creatingProfessionalDetails: false,
  creatingProfessionalDetailsErrors: null,
  professionalDetailsCreated: false,
  uploadingCV: false,
  uploadingCVErrors: null,
  cvUploaded: false,
  uploadingLicenses: false,
  uploadingLicensesErrors: null,
  licensesUploaded: false,
  uploadingPhoto: false,
  uploadingPhotoErrors: null,
  photoUploaded: false,
  registeredUserId: null,
};

export const candidateRegistrationReducer = createReducer(initialState, handle => [
  handle(createProfile.request, state =>
    produce(state, draft => {
      draft.creatingProfile = true;
    }),
  ),
  handle(createProfile.success, (state, { payload }) =>
    produce(state, draft => {
      draft.creatingProfile = false;
      draft.profileCreated = true;
      draft.registeredUserId = payload.data.id;
    }),
  ),
  handle(createProfile.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.creatingProfile = false;
      draft.creatingProfileErrors = payload;
    }),
  ),
  handle(createProfessionalDetails.request, state =>
    produce(state, draft => {
      draft.creatingProfessionalDetails = true;
    }),
  ),
  handle(createProfessionalDetails.success, state =>
    produce(state, draft => {
      draft.creatingProfessionalDetails = false;
      draft.professionalDetailsCreated = true;
    }),
  ),
  handle(createProfessionalDetails.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.creatingProfessionalDetails = false;
      draft.creatingProfessionalDetailsErrors = payload;
    }),
  ),
  handle(uploadCV.request, state =>
    produce(state, draft => {
      draft.uploadingCV = true;
    }),
  ),
  handle(uploadCV.success, state =>
    produce(state, draft => {
      draft.uploadingCV = false;
      draft.cvUploaded = true;
    }),
  ),
  handle(uploadCV.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.uploadingCV = false;
      draft.uploadingCVErrors = payload;
    }),
  ),
  handle(uploadLicenses.request, state =>
    produce(state, draft => {
      draft.uploadingLicenses = true;
    }),
  ),
  handle(uploadLicenses.success, state =>
    produce(state, draft => {
      draft.uploadingLicenses = false;
      draft.licensesUploaded = true;
    }),
  ),
  handle(uploadLicenses.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.uploadingLicenses = false;
      draft.uploadingLicensesErrors = payload;
    }),
  ),
  handle(skipLicensesUpload, state =>
    produce(state, draft => {
      draft.licensesUploaded = true;
    }),
  ),
  handle(uploadPhoto.request, state =>
    produce(state, draft => {
      draft.uploadingPhoto = true;
    }),
  ),
  handle(uploadPhoto.success, state =>
    produce(state, draft => {
      draft.uploadingPhoto = false;
      draft.photoUploaded = true;
    }),
  ),
  handle(uploadPhoto.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.uploadingPhoto = false;
      draft.uploadingPhotoErrors = payload;
    }),
  ),
  handle(skipPhotoUpload, state =>
    produce(state, draft => {
      draft.photoUploaded = true;
    }),
  ),
  handle(skipCvUpload, state =>
    produce(state, draft => {
      draft.cvUploaded = true;
    }),
  ),
  handle(resetErrors, state =>
    produce(state, draft => {
      draft.creatingProfileErrors = null;
      draft.creatingProfessionalDetailsErrors = null;
      draft.uploadingCVErrors = null;
      draft.uploadingLicensesErrors = null;
      draft.uploadingPhotoErrors = null;
    }),
  ),
]);
