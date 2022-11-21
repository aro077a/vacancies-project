import { createAction } from 'deox';

import {
  CreateCandidateProfessionalDetailsFormValues,
  CreateCandidateProfileFormValues,
  UpdateCandidateProfessionalDetailsAdminFormValues,
  UploadCandidateCVFormValues,
  UploadCandidateDocumentsFormValues,
  UploadCandidateLicensesFormValues,
  UploadCandidatePhotoFormValues,
} from '~/types/formValues';
import { UpdateCandidateLookingForJobStatusRequestBody } from '~/types/requests';
import {
  CreateCandidateProfessionalDetailsResponse,
  CreateCandidateProfileResponse,
  ErrorResponse,
  GetCandidateCVResponse,
  GetCandidateDocumentsResponse,
  GetCandidateLicensesResponse,
  GetCandidateOverviewResponse,
  GetCandidatePhotoResponse,
  GetCandidatePrefillDataFromResume,
  GetCandidateProfDetailsByAdminResponse,
  GetCandidateProfDetailsResponse,
  GetCandidateProfileResponse,
  GetCandidateVideoInterviewResponse,
  GetInterviewQuestionsResponse,
  UpdateCandidateDocumentsResponse,
  UpdateCandidateLookingForJobStatus,
  UploadCandidateCVResponse,
  UploadCandidateLicensesResponse,
  UploadCandidatePhotoResponse,
} from '~/types/responses';

export const createCandidateProfile = {
  request: createAction(
    'createCandidate/CREATE_PROFILE',
    resolve => (payload: { formValue: CreateCandidateProfileFormValues; onSuccess: () => void }) =>
      resolve(payload),
  ),
  success: createAction(
    'createCandidate/CREATE_PROFILE_SUCCESS',
    resolve => (payload: CreateCandidateProfileResponse) => resolve(payload),
  ),
  fail: createAction(
    'createCandidate/CREATE_PROFILE_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const createCandidateProfessionalDetails = {
  request: createAction(
    'createCandidate/CREATE_PROFESSIONAL_DETAILS',
    resolve =>
      (payload: {
        formValue:
          | UpdateCandidateProfessionalDetailsAdminFormValues
          | CreateCandidateProfessionalDetailsFormValues;
        onSuccess: () => void;
      }) =>
        resolve(payload),
  ),
  success: createAction(
    'createCandidate/CREATE_PROFESSIONAL_DETAILS_SUCCESS',
    resolve => (payload: CreateCandidateProfessionalDetailsResponse) => resolve(payload),
  ),
  fail: createAction(
    'createCandidate/CREATE_PROFESSIONAL_DETAILS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const uploadCandidateCV = {
  request: createAction(
    'createCandidate/UPLOAD_CV',
    resolve => (payload: { formValue: UploadCandidateCVFormValues; onSuccess: () => void }) =>
      resolve(payload),
  ),
  success: createAction(
    'createCandidate/UPLOAD_CV_SUCCESS',
    resolve => (payload: UploadCandidateCVResponse) => resolve(payload),
  ),
  fail: createAction(
    'createCandidate/UPLOAD_CV_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const uploadCandidateBrandedCV = {
  request: createAction(
    'createCandidate/UPLOAD_BRANDED_CV',
    resolve => (payload: { formValue: UploadCandidateCVFormValues; onSuccess: () => void }) =>
      resolve(payload),
  ),
  success: createAction(
    'createCandidate/UPLOAD_BRANDED_CV_SUCCESS',
    resolve => (payload: GetCandidateOverviewResponse) => resolve(payload),
  ),
  fail: createAction('createCandidate/UPLOAD_BRANDED_CV_FAIL'),
};

export const uploadCandidateLicenses = {
  request: createAction(
    'createCandidate/UPLOAD_LICENSES',
    resolve =>
      (payload: { formValues: UploadCandidateLicensesFormValues[]; onSuccess?: () => void }) =>
        resolve(payload),
  ),
  success: createAction(
    'createCandidate/UPLOAD_LICENSES_SUCCESS',
    resolve => (payload: UploadCandidateLicensesResponse) => resolve(payload),
  ),
  fail: createAction(
    'createCandidate/UPLOAD_LICENSES_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const uploadCandidateDocuments = {
  request: createAction(
    'createCandidate/UPLOAD_DOCUMENTS',
    resolve =>
      (payload: { formValues: UploadCandidateDocumentsFormValues; onSuccess?: () => void }) =>
        resolve(payload),
  ),
  success: createAction(
    'createCandidate/UPLOAD_DOCUMENTS_SUCCESS',
    resolve => (payload: UpdateCandidateDocumentsResponse) => resolve(payload),
  ),
  fail: createAction(
    'createCandidate/UPLOAD_DOCUMENTS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const uploadCandidatePhoto = {
  request: createAction(
    'createCandidate/UPLOAD_PHOTO',
    resolve => (payload: { formValues: UploadCandidatePhotoFormValues; onSuccess: () => void }) =>
      resolve(payload),
  ),
  success: createAction(
    'createCandidate/UPLOAD_PHOTO_SUCCESS',
    resolve => (payload: UploadCandidatePhotoResponse | null) => resolve(payload),
  ),
  fail: createAction(
    'createCandidate/UPLOAD_PHOTO_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const deleteCandidatePhoto = {
  request: createAction('createCandidate/DELETE_PHOTO'),
  success: createAction('createCandidate/DELETE_PHOTO_SUCCESS'),
  fail: createAction(
    'createCandidate/DELETE_PHOTO_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setProfileForEdit = createAction(
  'createCandidate/SET_PROFILE_FOR_EDIT',
  resolve => (payload: GetCandidateProfileResponse) => resolve(payload),
);

export const setDetailsForEdit = createAction(
  'createCandidate/SET_DETAILS_FOR_EDIT',
  resolve => (payload: GetCandidateProfDetailsResponse | GetCandidateProfDetailsByAdminResponse) =>
    resolve(payload),
);

export const setCvForEdit = createAction(
  'createCandidate/SET_CV_FOR_EDIT',
  resolve => (payload: GetCandidateCVResponse) => resolve(payload),
);

export const setBrandedCvForEdit = createAction(
  'createCandidate/SET_BRANDED_CV_FOR_EDIT',
  resolve => (payload: GetCandidateOverviewResponse) => resolve(payload),
);

export const setLicensesForEdit = createAction(
  'createCandidate/SET_LICENSES_FOR_EDIT',
  resolve => (payload: GetCandidateLicensesResponse) => resolve(payload),
);

export const setPhotoForEdit = createAction(
  'createCandidate/SET_PHOTO_FOR_EDIT',
  resolve => (payload: GetCandidatePhotoResponse) => resolve(payload),
);

export const setDocumentsForEdit = createAction(
  'createCandidate/SET_DOCUMENTS_FOR_EDIT',
  resolve => (payload: GetCandidateDocumentsResponse) => resolve(payload),
);

export const setVideoInterviewForEdit = {
  request: createAction('createCandidate/SET_VIDEO_INTERVIEW_FOR_EDIT_REQUEST'),
  success: createAction(
    'createCandidate/SET_VIDEO_INTERVIEW_FOR_EDIT_SUCCESS',
    resolve => (payload: GetCandidateVideoInterviewResponse) => resolve(payload),
  ),
  failVideoNotUploaded: createAction(
    'createCandidate/SET_VIDEO_INTERVIEW_FOR_EDIT_FAIL_VIDEO_NOT_UPLOADED',
  ),
  fail: createAction('createCandidate/SET_VIDEO_INTERVIEW_FOR_EDIT_FAIL'),
};

export const getCandidateDataForEdit = {
  request: createAction(
    'createCandidate/GET_CANDIDATE_DATA_FOR_EDIT',
    resolve => (payload: { candidateId: number }) => resolve(payload),
  ),
  success: createAction('createCandidate/GET_CANDIDATE_DATA_FOR_EDIT_SUCCESS'),
  fail: createAction(
    'createCandidate/GET_CANDIDATE_DATA_FOR_EDIT_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const updateCandidateLookingForJobStatus = {
  request: createAction(
    'createCandidate/UPDATE_CANDIDATE_LOOKING_FOR_JOB_STATUS',
    resolve => (payload: UpdateCandidateLookingForJobStatusRequestBody) => resolve(payload),
  ),
  success: createAction(
    'createCandidate/UPDATE_CANDIDATE_LOOKING_FOR_JOB_STATUS_SUCCESS',
    resolve => (payload: UpdateCandidateLookingForJobStatus) => resolve(payload),
  ),
  fail: createAction(
    'createCandidate/UPDATE_CANDIDATE_LOOKING_FOR_JOB_STATUS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const skipLicensesUpload = createAction(
  'createCandidate/SKIP_LICENSES_UPLOAD',
  resolve => (payload: { onSkip: () => void }) => resolve(payload),
);

export const skipPhotoUpload = createAction(
  'createCandidate/SKIP_PHOTO_UPLOAD',
  resolve => (payload: { onSkip: () => void }) => resolve(payload),
);

export const skipCvUpload = createAction(
  'createCandidate/SKIP_CV_UPLOAD',
  resolve => (payload: { onSkip: () => void }) => resolve(payload),
);

export const resetEditing = createAction('createCandidates/RESET_EDITING');

export const resetErrors = createAction('createCandidate/RESET_ERRORS');

export const getPrefillData = {
  request: createAction(
    'createCandidate/GET_PREFILL_DATA',
    resolve => (payload: File | null) => resolve(payload),
  ),
  success: createAction(
    'createCandidate/GET_PREFILL_DATA_SUCCESS',
    resolve => (payload: GetCandidatePrefillDataFromResume) => resolve(payload),
  ),
  fail: createAction(
    'createCandidate/GET_PREFILL_DATA_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getInterviewQuestions = {
  request: createAction('createCandidate/GET_INTERVIEW_QUESTIONS'),
  success: createAction(
    'createCandidate/GET_INTERVIEW_QUESTIONS_SUCCESS',
    resolve => (payload: GetInterviewQuestionsResponse) => resolve(payload),
  ),
  fail: createAction('createCandidate/GET_INTERVIEW_QUESTIONS_FAIL'),
};

export const setVideoInterview = {
  setAsString: createAction(
    'createCandidate/SET_VIDEO_INTERVIEW_URL',
    resolve => (payload: string) => resolve(payload),
  ),
  setAsBlob: createAction(
    'createCandidate/SET_VIDEO_INTERVIEW_BLOB',
    resolve => (payload: Blob) => resolve(payload),
  ),
};

export const uploadVideoInterview = {
  request: createAction('createCandidate/UPLOAD_VIDEO_INTERVIEW'),
  success: createAction('createCandidate/UPLOAD_VIDEO_INTERVIEW_SUCCESS'),
  fail: createAction('createCandidate/UPLOAD_VIDEO_INTERVIEW_FAIL'),
};

export const deleteVideoInterview = {
  request: createAction('createCandidate/DELETE_VIDEO_INTERVIEW'),
  success: createAction('createCandidate/DELETE_VIDEO_INTERVIEW_SUCCESS'),
  fail: createAction('createCandidate/DELETE_VIDEO_INTERVIEW_FAIL'),
};

export const toggleConfirmModalVisibility = createAction(
  'createCandidate/TOGGLE_CONFIRM_MODAL_VISIBILITY',
  resolve => (payload: boolean) => resolve(payload),
);

export const getCandidateStatus = {
  request: createAction('createCandidate/GET_CANDIDATE_STATUS'),
  success: createAction(
    'createCandidate/GET_CANDIDATE_STATUS_SUCCESS',
    resolve => (payload: GetCandidateProfDetailsResponse) => resolve(payload),
  ),
  fail: createAction(
    'createCandidate/GET_CANDIDATE_STATUS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};
