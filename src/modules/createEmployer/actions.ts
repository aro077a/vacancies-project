import { createAction } from 'deox';

import { CompanyHiringManger, Logo } from '~/models/company';
import {
  CreateCompanyContactDetailsFormValues,
  CreateEmployerBusinessFormValues,
  CreateHiringCompanyFormValues,
  CreateNewEmployerFormValues,
  UpdateCompanyInfoFormValues,
  UploadCompanyLogoFormValues,
} from '~/types/formValues';
import {
  CreateCompanyBusinessDetailsResponse,
  CreateCompanyContactDetailsResponse,
  CreateEmployerCompanyInfoResponse,
  ErrorResponse,
  GetClientContactDetailsResponse,
  GetCompanyHiringManagerResponse,
  GetCompanyLogoResponse,
  GetCompanyResponse,
  GetCreatedHiringManagerResponse,
  GetUpdatedCompanyHiringManagerResponse,
  UploadCompanyLogoResponse,
} from '~/types/responses';

export const createEmployerCompanyInfo = {
  request: createAction(
    'createEmployer/CREATE_EMPLOYER',
    resolve => (payload: { formValue: CreateNewEmployerFormValues; onSuccess: () => void }) =>
      resolve(payload),
  ),
  success: createAction(
    'createEmployer/CREATE_EMPLOYER_SUCCESS',
    resolve => (payload: CreateEmployerCompanyInfoResponse) => resolve(payload),
  ),
  fail: createAction(
    'createEmployer/CREATE_EMPLOYER_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const createCompanyBusinessDetails = {
  request: createAction(
    'createEmployer/CREATE_COMPANY_DETAILS',
    resolve => (payload: { formValue: CreateEmployerBusinessFormValues; onSuccess: () => void }) =>
      resolve(payload),
  ),
  success: createAction(
    'createEmployer/CREATE_COMPANY_DETAILS_SUCCESS',
    resolve => (payload: CreateCompanyBusinessDetailsResponse) => resolve(payload),
  ),
  fail: createAction(
    'createEmployer/CREATE_COMPANY_DETAILS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const uploadCompanyLogo = {
  request: createAction(
    'createEmployer/UPLOAD_COMPANY_LOGO',
    resolve => (payload: { formValues: UploadCompanyLogoFormValues; onSuccess: () => void }) =>
      resolve(payload),
  ),
  success: createAction(
    'createEmployer/UPLOAD_COMPANY_LOGO_SUCCESS',
    resolve => (payload: UploadCompanyLogoResponse | null) => resolve(payload),
  ),
  fail: createAction(
    'createEmployer/UPLOAD_COMPANY_LOGO_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getHiringManagers = {
  init: createAction(
    'createEmployer/GET_HIRING_MANAGERS',
    resolve => (payload: { initialFetch: boolean }) => resolve(payload),
  ),
  request: createAction('createEmployer/GET_HIRING_MANAGERS_REQUEST'),
  success: createAction(
    'createEmployer/GET_HIRING_MANAGERS_SUCCESS',
    resolve => (payload: GetCompanyHiringManagerResponse) => resolve(payload),
  ),
  fail: createAction(
    'createEmployer/GET_HIRING_MANAGERS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const createHiringManager = {
  request: createAction(
    'createEmployer/CREATE_HIRING_MANAGER',
    resolve => (payload: { formValues: CreateHiringCompanyFormValues; onSuccess: () => void }) =>
      resolve(payload),
  ),
  success: createAction(
    'createEmployer/CREATE_HIRING_MANAGER_SUCCESS',
    resolve => (payload: GetCreatedHiringManagerResponse) => resolve(payload),
  ),
  fail: createAction(
    'createEmployer/CREATE_HIRING_MANAGER_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const updateHiringManager = {
  request: createAction(
    'createEmployer/UPDATE_HIRING_MANAGER',
    resolve => (payload: { formValues: CreateHiringCompanyFormValues; onSuccess: () => void }) =>
      resolve(payload),
  ),
  success: createAction(
    'createEmployer/UPDATE_HIRING_MANAGER_SUCCESS',
    resolve => (payload: GetUpdatedCompanyHiringManagerResponse) => resolve(payload),
  ),
  fail: createAction(
    'createEmployer/UPDATE_HIRING_MANAGER_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const deleteHiringMangerRequest = {
  request: createAction(
    'createEmployer/DELETE_HIRING_MANAGER',
    resolve => (payload: { managerId: number }) => resolve(payload),
  ),
  success: createAction('createEmployer/DELETE_HIRING_MANAGER_SUCCESS'),
  fail: createAction(
    'createEmployer/DELETE_HIRING_MANAGER_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const resetErrors = createAction('createEmployer/RESET_ERRORS');

export const getEmployerForEdit = {
  request: createAction(
    'createEmployer/GET_EMPLOYER_FOR_EDIT',
    resolve => (payload: { employerId: number }) => resolve(payload),
  ),
  success: createAction('createEmployer/GET_EMPLOYER_FOR_EDIT_SUCCESS'),
  fail: createAction(
    'createEmployer/GET_EMPLOYER_FOR_EDIT_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getEmployerProfile = {
  success: createAction(
    'createEmployer/GET_EMPLOYER_PROFILE_SUCCESS',
    resolve => (payload: GetCompanyResponse) => resolve(payload),
  ),
};

export const editEmployerInfo = {
  request: createAction(
    'createEmployer/EDIT_EMPLOYER_INFO',
    resolve => (payload: { formValues: UpdateCompanyInfoFormValues }) => resolve(payload),
  ),
  success: createAction(
    'createEmployer/EDIT_EMPLOYER_INFO_SUCCESS',
    resolve => (payload: GetCompanyResponse) => resolve(payload),
  ),
  fail: createAction(
    'createEmployer/EDIT_EMPLOYER_INFO_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getEmployerDetails = {
  success: createAction(
    'createEmployer/GET_EMPLOYER_DETAILS_SUCCESS',
    resolve => (payload: GetClientContactDetailsResponse) => resolve(payload),
  ),
};

export const editEmployerDetails = {
  request: createAction(
    'createEmployer/EDIT_EMPLOYER_DETAILS',
    resolve =>
      (payload: { formValues: CreateCompanyContactDetailsFormValues; onSuccess: () => void }) =>
        resolve(payload),
  ),
  success: createAction(
    'createEmployer/EDIT_EMPLOYER_DETAILS_SUCCESS',
    resolve => (payload: CreateCompanyContactDetailsResponse) => resolve(payload),
  ),
  fail: createAction(
    'createEmployer/EDIT_EMPLOYER_DETAILS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getEmployerLogo = {
  success: createAction(
    'createEmployer/GET_EMPLOYER_LOGO_SUCCESS',
    resolve => (payload: GetCompanyLogoResponse) => resolve(payload),
  ),
};

export const updateEmployerLogo = {
  request: createAction(
    'createEmployer/UPLOAD_EMPLOYER_LOGO',
    resolve => (payload: { formValues: UploadCompanyLogoFormValues }) => resolve(payload),
  ),
  success: createAction(
    'createEmployer/UPLOAD_EMPLOYER_LOGO_SUCCESS',
    resolve => (payload: UploadCompanyLogoResponse) => resolve(payload),
  ),
  fail: createAction(
    'createEmployer/UPLOAD_EMPLOYER_LOGO_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const deleteEmployerLogo = {
  request: createAction('createEmployer/DELETE_LOGO'),
  success: createAction('createEmployer/DELETE_LOGO_SUCCESS'),
  fail: createAction(
    'createEmployer/DELETE_LOGO_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setSelectedEmployer = createAction(
  'createEmployer/SET_EMPLOYER',
  resolve => (payload: { employerId: number }) => resolve(payload),
);

export const setEmployerLogo = createAction(
  'createEmployer/SET_EMPLOYER_LOGO',
  resolve => (payload: { logo: Logo | null }) => resolve(payload),
);

export const setHiringManagerId = createAction(
  'createEmployer/SET_HIRING_MANAGER_ID',
  resolve => (payload: { managerId: number }) => resolve(payload),
);

export const setHiringManagerForEdit = createAction(
  'createEmployer/SET_HIRING_MANAGER_FOR_EDIT',
  resolve => (payload: { hiringManager: CompanyHiringManger }) => resolve(payload),
);

export const setHiringManagerEditMode = createAction(
  'createEmployer/SET_HIRING_MANAGER_EDIT_MODE',
  resolve => (payload: { editMode: boolean }) => resolve(payload),
);

export const setHiringManagerIsEmptyError = createAction(
  'createEmployer/SET_HIRING_MANAGER_IS_EMPTY',
  resolve => (payload: { isEmpty: boolean }) => resolve(payload),
);
