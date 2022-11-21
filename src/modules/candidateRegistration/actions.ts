import { createAction } from 'deox';

import {
  CreateCandidateProfessionalDetailsFormValues,
  CreateCandidateProfileFormValues,
  UploadCandidateCVFormValues,
  UploadCandidateLicensesFormValues,
  UploadCandidatePhotoFormValues,
} from '~/types/formValues';
import {
  CreateCandidateProfessionalDetailsResponse,
  CreateCandidateProfileResponse,
  ErrorResponse,
  UploadCandidateCVResponse,
  UploadCandidatePhotoResponse,
} from '~/types/responses';

export const createProfile = {
  request: createAction(
    'candidateRegistration/CREATE_PROFILE',
    resolve => (payload: CreateCandidateProfileFormValues) => resolve(payload),
  ),
  success: createAction(
    'candidateRegistration/CREATE_PROFILE_SUCCESS',
    resolve => (payload: CreateCandidateProfileResponse) => resolve(payload),
  ),
  fail: createAction(
    'candidateRegistration/CREATE_PROFILE_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const createProfessionalDetails = {
  request: createAction(
    'candidateRegistration/CREATE_PROFESSIONAL_DETAILS',
    resolve => (payload: { formValues: CreateCandidateProfessionalDetailsFormValues }) =>
      resolve(payload),
  ),
  success: createAction(
    'candidateRegistration/CREATE_PROFESSIONAL_DETAILS_SUCCESS',
    resolve => (payload: CreateCandidateProfessionalDetailsResponse) => resolve(payload),
  ),
  fail: createAction(
    'candidateRegistration/CREATE_PROFESSIONAL_DETAILS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const uploadCV = {
  request: createAction(
    'candidateRegistration/UPLOAD_CV',
    resolve => (payload: UploadCandidateCVFormValues) => resolve(payload),
  ),
  success: createAction(
    'candidateRegistration/UPLOAD_CV_SUCCESS',
    resolve => (payload: UploadCandidateCVResponse) => resolve(payload),
  ),
  fail: createAction(
    'candidateRegistration/UPLOAD_CV_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const uploadLicenses = {
  request: createAction(
    'candidateRegistration/UPLOAD_LICENSES',
    resolve => (payload: { formValues: UploadCandidateLicensesFormValues[] }) => resolve(payload),
  ),
  success: createAction('candidateRegistration/UPLOAD_LICENSES_SUCCESS'),
  fail: createAction(
    'candidateRegistration/UPLOAD_LICENSES_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const uploadPhoto = {
  request: createAction(
    'candidateRegistration/UPLOAD_PHOTO',
    resolve => (payload: { formValues: UploadCandidatePhotoFormValues; onSuccess: () => void }) =>
      resolve(payload),
  ),
  success: createAction(
    'candidateRegistration/UPLOAD_PHOTO_SUCCESS',
    resolve => (payload: UploadCandidatePhotoResponse) => resolve(payload),
  ),
  fail: createAction(
    'candidateRegistration/UPLOAD_PHOTO_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const skipLicensesUpload = createAction('candidateRegistration/SKIP_LICENSES_UPLOAD');

export const skipPhotoUpload = createAction('candidateRegistration/SKIP_PHOTO_UPLOAD');

export const skipCvUpload = createAction('candidateRegistration/SKIP_CV_UPLOAD');

export const resetErrors = createAction('candidateRegistration/RESET_ERRORS');
