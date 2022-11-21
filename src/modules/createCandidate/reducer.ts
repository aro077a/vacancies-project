import { createReducer } from 'deox';
import produce from 'immer';

import {
  createCandidateProfessionalDetails,
  createCandidateProfile,
  deleteCandidatePhoto,
  deleteVideoInterview,
  getCandidateDataForEdit,
  getCandidateStatus,
  getInterviewQuestions,
  getPrefillData,
  resetEditing,
  resetErrors,
  setBrandedCvForEdit,
  setCvForEdit,
  setDetailsForEdit,
  setDocumentsForEdit,
  setLicensesForEdit,
  setPhotoForEdit,
  setProfileForEdit,
  setVideoInterview,
  setVideoInterviewForEdit,
  skipLicensesUpload,
  skipPhotoUpload,
  toggleConfirmModalVisibility,
  updateCandidateLookingForJobStatus,
  uploadCandidateBrandedCV,
  uploadCandidateCV,
  uploadCandidateDocuments,
  uploadCandidateLicenses,
  uploadCandidatePhoto,
  uploadVideoInterview,
} from './actions';
import { CreateCandidateState } from './types';

export const initialState: CreateCandidateState = {
  creatingCandidateProfile: false,
  creatingCandidateProfileErrors: null,
  candidateProfileCreated: null,
  creatingCandidateProfessionalDetails: false,
  creatingCandidateProfessionalDetailsErrors: null,
  candidateProfessionalDetailsCreated: null,
  uploadingCandidateCV: false,
  uploadingCandidateCVErrors: null,
  candidateCVUploaded: null,
  uploadingCandidateLicenses: false,
  uploadingCandidateLicensesErrors: null,
  candidateLicensesUploaded: false,
  uploadingCandidatePhoto: false,
  uploadingCandidatePhotoErrors: null,
  candidatePhotoUploaded: false,
  createdCandidateId: null,
  editMode: false,
  registeredCandidateId: 0,
  loadingCandidateDataForEdit: false,
  candidateLicense: [],
  candidatePhoto: null,
  candidateVideoInterview: null,
  candidateVideoInterviewBlob: null,
  updatingCandidateLookingForJobStatus: false,
  deletingCandidatePhoto: false,
  candidatePhotoDeleted: false,
  loadingPrefillData: false,
  prefillDataFromResume: null,
  interviewQuestions: null,
  loadingInterviewQuestions: false,
  videoInterviewNotLoadedYet: false,
  uploadingVideoInterview: false,
  isUpload: false,
  confirmModalVisibility: false,
  deletingVideoInterview: false,
  candidateNewVideoRecorded: null,
  candidateStatus: 0,
  generalExplanation: null,
  candidateBrandedCV: null,
  uploadingCandidateBrandedCV: false,
  canidateDocuments: [],
  uploadingDocuments: false,
};

export const createCandidateReducer = createReducer(initialState, handle => [
  handle(createCandidateProfile.request, state =>
    produce(state, draft => {
      draft.creatingCandidateProfile = true;
    }),
  ),
  handle(createCandidateProfile.success, (state, { payload }) =>
    produce(state, draft => {
      draft.creatingCandidateProfile = false;
      draft.candidateProfileCreated = payload.data;
      draft.registeredCandidateId = payload.data.id;
    }),
  ),
  handle(createCandidateProfile.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.creatingCandidateProfile = false;
      draft.creatingCandidateProfileErrors = payload;
    }),
  ),
  handle(createCandidateProfessionalDetails.request, state =>
    produce(state, draft => {
      draft.creatingCandidateProfessionalDetails = true;
    }),
  ),
  handle(createCandidateProfessionalDetails.success, (state, { payload }) =>
    produce(state, draft => {
      draft.creatingCandidateProfessionalDetails = false;
      draft.candidateProfessionalDetailsCreated = payload.data;
    }),
  ),
  handle(createCandidateProfessionalDetails.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.creatingCandidateProfessionalDetails = false;
      draft.creatingCandidateProfessionalDetailsErrors = payload;
    }),
  ),
  handle(uploadCandidateCV.request, state =>
    produce(state, draft => {
      draft.uploadingCandidateCV = true;
    }),
  ),
  handle(uploadCandidateCV.success, (state, { payload }) =>
    produce(state, draft => {
      draft.uploadingCandidateCV = false;
      draft.candidateCVUploaded = payload.data;
    }),
  ),
  handle(uploadCandidateCV.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.uploadingCandidateCV = false;
      draft.uploadingCandidateCVErrors = payload;
    }),
  ),
  handle(uploadCandidateBrandedCV.request, state =>
    produce(state, draft => {
      draft.uploadingCandidateBrandedCV = true;
    }),
  ),
  handle(uploadCandidateBrandedCV.success, (state, { payload }) =>
    produce(state, draft => {
      draft.candidateBrandedCV = payload.data;
      draft.uploadingCandidateBrandedCV = false;
    }),
  ),
  handle(uploadCandidateBrandedCV.fail, state =>
    produce(state, draft => {
      draft.uploadingCandidateBrandedCV = false;
    }),
  ),
  handle(uploadCandidateLicenses.request, state =>
    produce(state, draft => {
      draft.uploadingCandidateLicenses = true;
    }),
  ),
  handle(uploadCandidateLicenses.success, (state, { payload }) =>
    produce(state, draft => {
      draft.uploadingCandidateLicenses = false;
      draft.candidateLicensesUploaded = true;
      draft.candidateLicense = payload.data.files;
    }),
  ),
  handle(uploadCandidateLicenses.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.uploadingCandidateLicenses = false;
      draft.uploadingCandidateLicensesErrors = payload;
    }),
  ),
  handle(uploadCandidateDocuments.request, state =>
    produce(state, draft => {
      draft.uploadingDocuments = true;
    }),
  ),
  handle(uploadCandidateDocuments.success, (state, { payload }) =>
    produce(state, draft => {
      draft.uploadingDocuments = false;
      draft.canidateDocuments = payload.data.files;
    }),
  ),
  handle(uploadCandidateDocuments.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.uploadingDocuments = false;
      draft.uploadingCandidateLicensesErrors = payload;
    }),
  ),
  handle(skipLicensesUpload, state =>
    produce(state, draft => {
      draft.candidateLicensesUploaded = true;
    }),
  ),
  handle(uploadCandidatePhoto.request, state =>
    produce(state, draft => {
      draft.uploadingCandidatePhoto = true;
    }),
  ),
  handle(uploadCandidatePhoto.success, (state, { payload }) =>
    produce(state, draft => {
      draft.uploadingCandidatePhoto = false;
      if (draft.editMode) {
        draft.candidatePhotoUploaded = true;
        draft.candidatePhoto = payload ? payload.data : null;
      } else {
        draft.candidatePhotoUploaded = true;
        Object.assign(draft, initialState);
      }
    }),
  ),
  handle(uploadCandidatePhoto.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.uploadingCandidatePhoto = false;
      draft.uploadingCandidatePhotoErrors = payload;
    }),
  ),
  handle(skipPhotoUpload, state =>
    produce(state, draft => {
      draft.candidatePhotoUploaded = true;
    }),
  ),
  handle(resetErrors, state =>
    produce(state, draft => {
      draft.creatingCandidateProfileErrors = null;
      draft.creatingCandidateProfessionalDetailsErrors = null;
      draft.uploadingCandidateCVErrors = null;
      draft.uploadingCandidateLicensesErrors = null;
      draft.uploadingCandidatePhotoErrors = null;
    }),
  ),
  handle(getCandidateDataForEdit.request, state =>
    produce(state, draft => {
      draft.editMode = true;
      draft.loadingCandidateDataForEdit = true;
    }),
  ),
  handle(getCandidateDataForEdit.success, state =>
    produce(state, draft => {
      draft.loadingCandidateDataForEdit = false;
    }),
  ),
  handle(getCandidateDataForEdit.fail, state =>
    produce(state, draft => {
      draft.loadingCandidateDataForEdit = false;
    }),
  ),
  handle(setProfileForEdit, (state, { payload }) =>
    produce(state, draft => {
      draft.candidateProfileCreated = payload.data;
    }),
  ),
  handle(setDetailsForEdit, (state, { payload }) =>
    produce(state, draft => {
      draft.candidateProfessionalDetailsCreated = payload.data;
    }),
  ),
  handle(setDocumentsForEdit, (state, { payload }) =>
    produce(state, draft => {
      draft.canidateDocuments = payload.data;
    }),
  ),
  handle(setCvForEdit, (state, { payload }) =>
    produce(state, draft => {
      draft.candidateCVUploaded = payload.data;
    }),
  ),
  handle(setBrandedCvForEdit, (state, { payload }) =>
    produce(state, draft => {
      draft.candidateBrandedCV = payload.data;
    }),
  ),
  handle(setLicensesForEdit, (state, { payload }) =>
    produce(state, draft => {
      draft.candidateLicense = payload.data;
    }),
  ),
  handle(setPhotoForEdit, (state, { payload }) =>
    produce(state, draft => {
      draft.candidatePhoto = payload.data;
    }),
  ),
  handle(setVideoInterviewForEdit.success, (state, { payload }) =>
    produce(state, draft => {
      if (draft.candidateNewVideoRecorded) {
        draft.candidateVideoInterview = draft.candidateNewVideoRecorded;
      } else {
        draft.candidateVideoInterview = payload.data.video;
      }
    }),
  ),
  handle(setVideoInterviewForEdit.failVideoNotUploaded, state =>
    produce(state, draft => {
      if (draft.candidateNewVideoRecorded) {
        draft.candidateVideoInterview = draft.candidateNewVideoRecorded;
      }
      draft.videoInterviewNotLoadedYet = true;
    }),
  ),
  handle(updateCandidateLookingForJobStatus.request, state =>
    produce(state, draft => {
      draft.updatingCandidateLookingForJobStatus = true;
    }),
  ),
  handle(updateCandidateLookingForJobStatus.success, (state, { payload }) =>
    produce(state, draft => {
      draft.updatingCandidateLookingForJobStatus = false;
      if (draft.candidateProfessionalDetailsCreated?.status) {
        draft.candidateProfessionalDetailsCreated.status = payload.data.status;
      }
      draft.candidateStatus = payload.data.status;
    }),
  ),
  handle(updateCandidateLookingForJobStatus.fail, state =>
    produce(state, draft => {
      draft.updatingCandidateLookingForJobStatus = false;
    }),
  ),
  handle(resetEditing, state =>
    produce(state, draft => {
      Object.assign(draft, initialState);
    }),
  ),
  handle(deleteCandidatePhoto.request, state =>
    produce(state, draft => {
      draft.deletingCandidatePhoto = true;
    }),
  ),
  handle(deleteCandidatePhoto.success, state =>
    produce(state, draft => {
      draft.deletingCandidatePhoto = false;
      draft.candidatePhotoDeleted = true;
      draft.candidatePhoto = null;
    }),
  ),
  handle(deleteCandidatePhoto.fail, state =>
    produce(state, draft => {
      draft.deletingCandidatePhoto = false;
    }),
  ),
  handle(getPrefillData.request, state =>
    produce(state, draft => {
      draft.loadingPrefillData = true;
    }),
  ),
  handle(getPrefillData.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingPrefillData = false;
      draft.prefillDataFromResume = payload.data;
    }),
  ),
  handle(getPrefillData.fail, state =>
    produce(state, draft => {
      draft.loadingPrefillData = false;
    }),
  ),
  handle(getInterviewQuestions.request, state =>
    produce(state, draft => {
      draft.loadingInterviewQuestions = true;
    }),
  ),
  handle(getInterviewQuestions.success, (state, { payload }) =>
    produce(state, draft => {
      // eslint-disable-next-line camelcase
      const { question_4, question_1, question_3, question_2, explanation } = payload.data;
      // eslint-disable-next-line camelcase
      draft.interviewQuestions = [question_1, question_2, question_3, question_4];
      draft.generalExplanation = explanation;
      draft.loadingInterviewQuestions = false;
    }),
  ),
  handle(getInterviewQuestions.fail, state =>
    produce(state, draft => {
      draft.loadingInterviewQuestions = false;
    }),
  ),
  handle(setVideoInterview.setAsString, (state, { payload }) =>
    produce(state, draft => {
      draft.candidateNewVideoRecorded = payload;
    }),
  ),
  handle(setVideoInterview.setAsBlob, (state, { payload }) =>
    produce(state, draft => {
      draft.candidateVideoInterviewBlob = payload;
    }),
  ),
  handle(uploadVideoInterview.request, state =>
    produce(state, draft => {
      draft.uploadingVideoInterview = true;
    }),
  ),
  handle(uploadVideoInterview.success, state =>
    produce(state, draft => {
      draft.confirmModalVisibility = !draft.confirmModalVisibility;
      draft.uploadingVideoInterview = false;
    }),
  ),
  handle(uploadVideoInterview.fail, state =>
    produce(state, draft => {
      draft.uploadingVideoInterview = false;
    }),
  ),
  handle(deleteVideoInterview.request, state =>
    produce(state, draft => {
      draft.deletingVideoInterview = true;
    }),
  ),
  handle(deleteVideoInterview.success, state =>
    produce(state, draft => {
      draft.deletingVideoInterview = false;
      draft.confirmModalVisibility = !draft.confirmModalVisibility;
      draft.candidateVideoInterview = null;
    }),
  ),
  handle(deleteVideoInterview.fail, state =>
    produce(state, draft => {
      draft.deletingVideoInterview = false;
    }),
  ),
  handle(toggleConfirmModalVisibility, (state, { payload }) =>
    produce(state, draft => {
      draft.isUpload = payload;
      draft.confirmModalVisibility = !draft.confirmModalVisibility;
    }),
  ),

  handle(getCandidateStatus.success, (state, { payload }) =>
    produce(state, draft => {
      draft.candidateStatus = payload.data.status;
    }),
  ),
]);
