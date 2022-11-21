import { createAction } from 'deox';

import {
  CreateCompanyContactDetailsFormValues,
  CreateHiringCompanyFormValues,
  EnterCompanyMainInfoFormValues,
  UploadCompanyLogoFormValues,
} from '~/types/formValues';
import {
  CreateCompanyContactDetailsResponse,
  EnterCompanyMainInfoResponse,
  ErrorResponse,
  GetCompanyHiringManagerResponse,
  GetCreatedHiringManagerResponse,
  UploadCompanyLogoResponse,
} from '~/types/responses';

export const enterInfo = {
  request: createAction(
    'companyRegistration/CREATE_INFO',
    resolve => (payload: EnterCompanyMainInfoFormValues) => resolve(payload),
  ),
  success: createAction(
    'companyRegistration/CREATE_INFO_SUCCESS',
    resolve => (payload: EnterCompanyMainInfoResponse) => resolve(payload),
  ),
  fail: createAction(
    'companyRegistration/CREATE_INFO_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const createContactDetails = {
  request: createAction(
    'companyRegistration/CREATE_CONTACT_DETAILS',
    resolve => (payload: CreateCompanyContactDetailsFormValues) => resolve(payload),
  ),
  success: createAction(
    'companyRegistration/CREATE_CONTACT_DETAILS_SUCCESS',
    resolve => (payload: CreateCompanyContactDetailsResponse) => resolve(payload),
  ),
  fail: createAction(
    'companyRegistration/CREATE_CONTACT_DETAILS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const uploadLogo = {
  request: createAction(
    'companyRegistration/UPLOAD_LOGO',
    resolve =>
      (payload: {
        formValues: UploadCompanyLogoFormValues;
        onSuccess: () => void;
        id?: number | null;
      }) =>
        resolve(payload),
  ),
  success: createAction(
    'companyRegistration/UPLOAD_LOGO_SUCCESS',
    resolve => (payload: UploadCompanyLogoResponse) => resolve(payload),
  ),
  fail: createAction(
    'companyRegistration/UPLOAD_LOGO_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getHiringManagers = {
  init: createAction(
    'companyRegistration/GET_HIRING_MANAGERS',
    resolve => (payload: { initialFetch: boolean }) => resolve(payload),
  ),
  request: createAction('adminContacts/GET_HIRING_MANAGERS_REQUEST'),
  success: createAction(
    'companyRegistration/GET_HIRING_MANAGERS_SUCCESS',
    resolve => (payload: GetCompanyHiringManagerResponse) => resolve(payload),
  ),
  fail: createAction(
    'companyRegistration/GET_HIRING_MANAGERS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const createHiringManager = {
  request: createAction(
    'companyRegistration/ADD_HIRING_MANAGER',
    resolve => (payload: { formValues: CreateHiringCompanyFormValues; onSuccess: () => void }) =>
      resolve(payload),
  ),
  success: createAction(
    'companyRegistration/ADD_HIRING_MANAGER_SUCCESS',
    resolve => (payload: GetCreatedHiringManagerResponse) => resolve(payload),
  ),
  fail: createAction(
    'companyRegistration/ADD_HIRING_MANAGER_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const skipLogoUpload = createAction('companyRegistration/SKIP_LOGO_UPLOAD');

export const resetErrors = createAction('companyRegistration/RESET_ERRORS');
