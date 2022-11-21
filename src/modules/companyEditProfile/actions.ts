import { createAction } from 'deox';

import { CompanyHiringManger } from '~/models/company';
import {
  CreateCompanyContactDetailsFormValues,
  CreateHiringCompanyFormValues,
  UpdateCompanyInfoFormValues,
  UploadCompanyLogoFormValues,
} from '~/types/formValues';
import {
  CreateCompanyContactDetailsResponse,
  ErrorResponse,
  GetClientContactDetailsResponse,
  GetCompanyHiringManagerResponse,
  GetCompanyLogoResponse,
  GetCompanyResponse,
  GetUpdatedCompanyHiringManagerResponse,
  UploadCompanyLogoResponse,
} from '~/types/responses';

export const getCompanyForEdit = {
  request: createAction('companyProfile/GET_COMPANY_FOR_EDIT'),
  success: createAction('companyProfile/GET_COMPANY_FOR_EDIT_SUCCESS'),
  fail: createAction(
    'companyProfile/GET_COMPANY_FOR_EDIT_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getCompanyProfile = {
  success: createAction(
    'companyProfile/GET_COMPANY_PROFILE_SUCCESS',
    resolve => (payload: GetCompanyResponse) => resolve(payload),
  ),
};

export const editCompanyInfo = {
  request: createAction(
    'companyProfile/EDIT_COMPANY_INFO',
    resolve => (payload: { formValues: UpdateCompanyInfoFormValues }) => resolve(payload),
  ),
  success: createAction(
    'companyProfile/EDIT_COMPANY_INFO_SUCCESS',
    resolve => (payload: GetCompanyResponse) => resolve(payload),
  ),
  fail: createAction(
    'companyProfile/EDIT_COMPANY_INFO_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getClientDetails = {
  success: createAction(
    'companyProfile/GET_CLIENT_DETAILS_SUCCESS',
    resolve => (payload: GetClientContactDetailsResponse) => resolve(payload),
  ),
};

export const editClientDetails = {
  request: createAction(
    'companyProfile/EDIT_CLIENT_DETAILS',
    resolve => (payload: { formValues: CreateCompanyContactDetailsFormValues }) => resolve(payload),
  ),
  success: createAction(
    'companyProfile/EDIT_CLIENT_DETAILS_SUCCESS',
    resolve => (payload: CreateCompanyContactDetailsResponse) => resolve(payload),
  ),
  fail: createAction(
    'companyProfile/EDIT_CLIENT_DETAILS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getCompanyLogo = {
  success: createAction(
    'companyProfile/GET_COMPANY_LOGO_SUCCESS',
    resolve => (payload: GetCompanyLogoResponse) => resolve(payload),
  ),
};

export const updateLogo = {
  request: createAction(
    'companyProfile/UPLOAD_COMPANY_LOGO',
    resolve => (payload: { formValues: UploadCompanyLogoFormValues; onSuccess: () => void }) =>
      resolve(payload),
  ),
  success: createAction(
    'companyProfile/UPLOAD_COMPANY_LOGO_SUCCESS',
    resolve => (payload: UploadCompanyLogoResponse) => resolve(payload),
  ),
  fail: createAction(
    'companyProfile/UPLOAD_COMPANY_LOGO_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};
export const getHiringManagers = {
  init: createAction(
    'companyProfile/GET_HIRING_MANAGERS',
    resolve => (payload: { initialFetch: boolean }) => resolve(payload),
  ),
  request: createAction('adminContacts/GET_HIRING_MANAGERS_REQUEST'),
  success: createAction(
    'companyProfile/GET_HIRING_MANAGERS_SUCCESS',
    resolve => (payload: GetCompanyHiringManagerResponse) => resolve(payload),
  ),
  fail: createAction('adminContacts/GET_HIRING_MANAGERS_FAIL'),
};

export const addHiringManager = {
  request: createAction(
    'companyProfile/ADD_HIRING_MANAGER',
    resolve => (payload: { formValues: CreateHiringCompanyFormValues; onSuccess: () => void }) =>
      resolve(payload),
  ),
  success: createAction(
    'companyProfile/ADD_HIRING_MANAGER_SUCCESS',
    resolve => (payload: GetUpdatedCompanyHiringManagerResponse) => resolve(payload),
  ),
  fail: createAction(
    'companyProfile/ADD_HIRING_MANAGER_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const updateHiringManager = {
  request: createAction(
    'companyProfile/UPDATE_HIRING_MANAGER',
    resolve => (payload: { formValues: CreateHiringCompanyFormValues; onSuccess: () => void }) =>
      resolve(payload),
  ),
  success: createAction(
    'companyProfile/UPDATE_HIRING_MANAGER_SUCCESS',
    resolve => (payload: GetUpdatedCompanyHiringManagerResponse) => resolve(payload),
  ),
  fail: createAction(
    'companyProfile/UPDATE_HIRING_MANAGER_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const deleteHiringManager = {
  request: createAction(
    'companyProfile/DELETE_HIRING_MANAGER',
    resolve => (payload: { managerId: number }) => resolve(payload),
  ),
  success: createAction('companyProfile/DELETE_HIRING_MANAGER_SUCCESS'),
  fail: createAction(
    'companyProfile/DELETE_HIRING_MANAGER_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setHiringManagerId = createAction(
  'companyProfile/SET_HIRING_MANAGER_ID',
  resolve => (payload: { managerId: number }) => resolve(payload),
);

export const setHiringManagerForEdit = createAction(
  'companyProfile/SET_HIRING_MANAGER_FOR_EDIT',
  resolve => (payload: { hiringManager: CompanyHiringManger }) => resolve(payload),
);

export const deleteCompanyLogo = {
  request: createAction('companyProfile/DELETE_COMPANY_LOGO'),
  success: createAction('companyProfile/DELETE_COMPANY_LOGO_SUCCESS'),
  fail: createAction(
    'companyProfile/DELETE_COMPANY_LOGO_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};
