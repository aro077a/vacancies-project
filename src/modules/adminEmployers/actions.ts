import { createAction } from 'deox';

import { EmployerDetailsProps, Employers, EmployerStatus } from '~/models/admin';
import { CreateEmployerBusinessFormValues, CreateEmployerFormValues } from '~/types/formValues';
import {
  ErrorResponse,
  GetEmployersDetailsResponse,
  GetEmployersResponse,
} from '~/types/responses';

export const getEmployers = {
  init: createAction(
    'adminEmployers/GET_EMPLOYERS',
    resolve => (payload: { initialFetch: boolean }) => resolve(payload),
  ),
  request: createAction('adminEmployers/GET_EMPLOYERS_REQUEST'),
  success: createAction(
    'adminEmployers/GET_EMPLOYERS_SUCCESS',
    resolve => (payload: GetEmployersResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminEmployers/GET_EMPLOYERS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setAdminEmployersSearch = createAction(
  'adminEmployers/SET_SEARCH_TEXT',
  resolve => (payload: string) => resolve(payload),
);

export const getEmployersPendingApprovals = createAction(
  'adminEmployers/GET_PENDING_APPROVALS',
  resolve => () => resolve(EmployerStatus.PENDING),
);

export const setSelectedEmployer = createAction(
  'adminEmployers/SET_SELECTED_EMPLOYER',
  resolve => (payload: Employers | null) => resolve(payload),
);

export const setSelectedCompany = createAction(
  'adminEmployers/SET_SELECTED_COMPANY',
  resolve => (payload: Employers | null) => resolve(payload),
);

export const getEmployerDetails = {
  request: createAction(
    'adminEmployers/GET_EMPLOYER_DETAILS_REQUEST',
    resolve => (payload?: number) => resolve(payload),
  ),
  success: createAction(
    'adminEmployers/GET_EMPLOYER_DETAILS_SUCCESS',
    resolve => (payload: EmployerDetailsProps | null) => resolve(payload),
  ),
  fail: createAction(
    'adminEmployers/GET_EMPLOYER_DETAILS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setCreateEmployerFormValues = createAction(
  'adminEmployers/SET_CREATE_FORM_EMPLOYER_VALUES',
  resolve => (payload: CreateEmployerFormValues | null) => resolve(payload),
);

export const setCreateEmployerBusinessFormValues = createAction(
  'adminEmployers/SET_CREATE_BUSINESS_FORM_EMPLOYER_VALUES',
  resolve => (payload: CreateEmployerBusinessFormValues | null) => resolve(payload),
);

export const updateEmployerStatus = {
  request: createAction(
    'adminEmployers/UPDATE_EMPLOYER_STATUS',
    resolve => (payload: { employerId: number; status: EmployerStatus }) => resolve(payload),
  ),
  success: createAction(
    'adminEmployers/UPDATE_EMPLOYER_STATUS_SUCCESS',
    resolve => (payload: { employerId: number }) => resolve(payload),
  ),
  fail: createAction(
    'adminEmployers/UPDATE_EMPLOYER_STATUS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setCreateEmployerActiveStep = createAction(
  'adminEmployers/SET_ACTIVE_STEP',
  resolve => (payload: 1 | 2 | 3) => resolve(payload),
);

export const createNewEmployerAction = {
  request: createAction('adminEmployers/CREATE_NEW_EMPLOYER'),
  success: createAction(
    'adminEmployers/CREATE_NEW_EMPLOYER_SUCCESS',
    resolve => (payload: number) => resolve(payload),
  ),
  fail: createAction(
    'adminEmployers/CREATE_NEW_EMPLOYER_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const editEmployerAction = {
  request: createAction('adminEmployers/EDIT_EMPLOYER'),
  success: createAction(
    'adminEmployers/EDIT_EMPLOYER_SUCCESS',
    resolve => (payload: number) => resolve(payload),
  ),
  fail: createAction(
    'adminEmployers/EDIT_EMPLOYER_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const resetCreateEmployerForm = createAction('adminEmployers/RESET_CREATE_EMPLOYER_FORM');

export const resetEmployersFilters = createAction('adminEmployers/RESET_EMPLOYERS_FILTERS');

export const getPendingEmployersCount = {
  request: createAction('adminEmployers/GET_PENDING_APPROVAL_COUNT'),
  success: createAction(
    'adminEmployers/GET_PENDING_APPROVAL_COUNT_SUCCESS',
    resolve => (payload: number) => resolve(payload),
  ),
  fail: createAction('adminEmployers/GET_PENDING_APPROVAL_COUNT_FAIL'),
};

export const toggleEmployerModalVisibility = createAction(
  'adminEmployers/TOGGLE_EMPLOYER_MODAL_VISIBILITY',
);

export const setEmployerDetails = createAction(
  'adminEmployers/SET_EMPLOYER_DETAILS',
  resolve => (payload: GetEmployersDetailsResponse) => resolve(payload),
);

export const setEmployerId = createAction(
  'adminEmployers/SET_EMPLOYER_ID',
  resolve => (payload: { employerId: number }) => resolve(payload),
);

export const deleteEmployer = {
  request: createAction(
    'adminEmployers/DELETE_EMPLOYER',
    resolve => (payload: { employerId: number }) => resolve(payload),
  ),
  success: createAction('adminEmployers/DELETE_EMPLOYER_SUCCESS'),
  fail: createAction(
    'adminEmployers/DELETE_EMPLOYER_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};
