import { createAction } from 'deox';

import {
  AssignCompaniesAndRegionsFormValues,
  AssignJobToAdminFormValues,
  InviteAdminFormValues,
} from '~/types/formValues';
import {
  AssignCompaniesAndRegionsToAdminResponse,
  AssignJobToAdminResponse,
  ErrorResponse,
  GetAdminJobsResponse,
  GetAdminPositionsListResponse,
  GetAdminRegionsResponse,
  GetListOfAdminsResponse,
  InviteAdminResponse,
} from '~/types/responses';

export const getListOfAdmins = {
  init: createAction(
    'manageAdmins/GET_ADMINS_LIST_REQUEST',
    resolve => (payload: { initialFetch: boolean }) => resolve(payload),
  ),
  request: createAction('manageAdmins/GET_ADMINS_LIST'),
  success: createAction(
    'manageAdmins/GET_ADMINS_LIST_SUCCESS',
    resolve => (payload: GetListOfAdminsResponse) => resolve(payload),
  ),
  fail: createAction('manageAdmins/GET_ADMINS_LIST_FAIL'),
};

export const inviteAdmin = {
  request: createAction(
    'manageAdmins/INVITE_ADMIN',
    resolve => (payload: { formValues: InviteAdminFormValues; onSuccess: () => void }) =>
      resolve(payload),
  ),
  success: createAction(
    'manageAdmins/INVITE_ADMIN_SUCCESS',
    resolve => (payload: InviteAdminResponse) => resolve(payload),
  ),
  fail: createAction(
    'manageAdmins/INVITE_ADMIN_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getAdminPositionsList = {
  init: createAction(
    'manageAdmins/GET_ADMIN_POSITION_LIST_REQUEST',
    resolve => (payload: { initialFetch: boolean; adminId: number }) => resolve(payload),
  ),
  request: createAction('manageAdmins/GET_ADMIN_POSITION_LIST'),
  success: createAction(
    'manageAdmins/GET_ADMIN_POSITION_LIST_SUCCESS',
    resolve => (payload: GetAdminPositionsListResponse) => resolve(payload),
  ),
  fail: createAction('manageAdmins/GET_ADMIN_POSITION_LIST_FAIL'),
};

export const getAdminRegions = {
  init: createAction(
    'manageAdmins/GET_ADMIN_REGIONS_REQUEST',
    resolve => (payload: { initialFetch: boolean; adminId: number }) => resolve(payload),
  ),
  request: createAction('manageAdmins/GET_ADMIN_REGIONS'),
  success: createAction(
    'manageAdmins/GET_ADMIN_REGIONS_SUCCESS',
    resolve => (payload: GetAdminRegionsResponse) => resolve(payload),
  ),
  fail: createAction('manageAdmins/GET_ADMIN_REGIONS_FAIL'),
};

export const getAdminJobs = {
  init: createAction(
    'manageAdmins/GET_ADMIN_JOBS_REQUEST',
    resolve => (payload: { initialFetch: boolean }) => resolve(payload),
  ),
  request: createAction('manageAdmins/GET_ADMIN_JOBS'),
  success: createAction(
    'manageAdmins/GET_ADMIN_JOBS_SUCCESS',
    resolve => (payload: GetAdminJobsResponse) => resolve(payload),
  ),
  fail: createAction('manageAdmins/GET_ADMIN_JOBS_FAIL'),
};

export const setAdminId = createAction(
  'manageAdmins/SET_ADMIN_ID',
  resolve => (payload: { adminId: number }) => resolve(payload),
);

export const setJobId = createAction(
  'manageAdmins/SET_JOB_ID',
  resolve => (payload: { jobId: number }) => resolve(payload),
);

export const assignCompaniesAndRegionsToAdmin = {
  request: createAction(
    'manageAdmins/ASSIGN_COMPANIES_AND_REGIONS',
    resolve =>
      (payload: { formValues: AssignCompaniesAndRegionsFormValues; onSuccess: () => void }) =>
        resolve(payload),
  ),
  success: createAction(
    'manageAdmins/ASSIGN_COMPANIES_AND_REGIONS_SUCCESS',
    resolve => (payload: AssignCompaniesAndRegionsToAdminResponse) => resolve(payload),
  ),
  fail: createAction(
    'manageAdmins/ASSIGN_COMPANIES_AND_REGIONS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const assignJobToAdmin = {
  request: createAction(
    'manageAdmins/ASSIGN_JOB',
    resolve => (payload: { formValues: AssignJobToAdminFormValues; onSuccess: () => void }) =>
      resolve(payload),
  ),
  success: createAction(
    'manageAdmins/ASSIGN_JOB_SUCCESS',
    resolve => (payload: AssignJobToAdminResponse) => resolve(payload),
  ),
  fail: createAction(
    'manageAdmins/ASSIGN_JOB_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const deleteAdmin = {
  request: createAction(
    'manageAdmins/DELETE_ADMIN',
    resolve => (payload: { adminId: number; onSuccess: () => void }) => resolve(payload),
  ),
  success: createAction('manageAdmins/DELETE_ADMIN_SUCCESS'),
  fail: createAction(
    'manageAdmins/DELETE_ADMIN_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};
