import { createAction } from 'deox';

import { CreateHiringCompanyFormValues, CreateJobInfoFormValues } from '~/types/formValues';
import { CreateJobDescriptionRequestBody } from '~/types/requests';
import {
  CreateJobDescriptionResponse,
  CreateJobInfoResponse,
  ErrorResponse,
  GetCreatedHiringManagerResponse,
  GetHiringManagersResponse,
  GetJobDescriptionResponse,
  GetJobInfoResponse,
  RepresentativeManagerResponse,
} from '~/types/responses';

export const createJobInfo = {
  request: createAction(
    'createJob/CREATE_JOB_INFO',
    resolve =>
      (payload: {
        managerId?: number;
        representative?: boolean;
        onSuccess: () => void;
        isUpdate?: boolean;
      }) =>
        resolve(payload),
  ),
  success: createAction(
    'createJob/CREATE_JOB_INFO_SUCCESS',
    resolve => (payload: CreateJobInfoResponse) => resolve(payload),
  ),
  fail: createAction(
    'createJob/CREATE_JOB_INFO_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const updateJobInfo = {
  request: createAction(
    'createJob/UPDATE_JOB_INFO',
    resolve =>
      (payload: {
        formValues: Omit<CreateJobInfoFormValues, 'superType'>;
        representative?: boolean;
      }) =>
        resolve(payload),
  ),
  success: createAction(
    'createJob/UPDATE_JOB_INFO_SUCCESS',
    resolve => (payload: CreateJobInfoResponse) => resolve(payload),
  ),
  fail: createAction(
    'createJob/UPDATE_JOB_INFO_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const saveJobInfo = createAction(
  'createJob/SAVE_JOB_INFO',
  resolve => (payload: { formValues: Omit<CreateJobInfoFormValues, 'superType'> }) =>
    resolve(payload),
);

export const createDescription = {
  request: createAction(
    'createJob/CREATE_DESCRIPTION',
    resolve => (payload: { requestBody: CreateJobDescriptionRequestBody; onSuccess: () => void }) =>
      resolve(payload),
  ),
  success: createAction(
    'createJob/CREATE_DESCRIPTION_SUCCESS',
    resolve => (payload: CreateJobDescriptionResponse) => resolve(payload),
  ),
  fail: createAction(
    'createJob/CREATE_DESCRIPTION_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getJobDataForEdit = {
  request: createAction(
    'createJob/GET_JOB_DATA_FOR_EDIT',
    resolve => (payload: { jobId: number }) => resolve(payload),
  ),
  success: createAction(
    'createJob/GET_JOB_DATA_FOR_EDIT_SUCCESS',
    resolve => (payload?: GetJobInfoResponse) => resolve(payload),
  ),
  fail: createAction(
    'createJob/GET_JOB_DATA_FOR_EDIT_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setInfoForEdit = createAction(
  'createJob/SET_INFO_FOR_EDIT',
  resolve => (payload: GetJobInfoResponse) => resolve(payload),
);

export const setHiringManagerForEdit = createAction(
  'createJob/SET_HIRING_MANAGER_FOR_EDIT',
  resolve => (payload: GetCreatedHiringManagerResponse) => resolve(payload),
);

export const setDescriptionForEdit = createAction(
  'createJob/SET_DESCRIPTION_FOR_EDIT',
  resolve => (payload: GetJobDescriptionResponse) => resolve(payload),
);

export const toggleDeleteJobModalVisibility = createAction(
  'createJob/TOGGLE_DELETE_JOB_MODAL_VISIBILITY',
);

export const deleteJob = {
  request: createAction(
    'createJob/DELETE_JOB',
    resolve => (payload: { onSuccess: () => void }) => resolve(payload),
  ),
  success: createAction('createJob/DELETE_JOB_SUCCESS'),
  fail: createAction(
    'createJob/DELETE_JOB_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const resetEditing = createAction('createJob/RESET_EDITING');

export const resetErrors = createAction('createJob/RESET_ERRORS');

export const getHiringManagers = {
  request: createAction(
    'createJob/GET_HIRING_MANAGERS',
    resolve => (payload?: { selectedCompanyId: number }) => resolve(payload),
  ),
  success: createAction(
    'createJob/GET_HIRING_MANAGERS_SUCCESS',
    resolve => (payload: GetHiringManagersResponse | GetHiringManagersResponse) => resolve(payload),
  ),
  fail: createAction(
    'createJob/GET_HIRING_MANAGERS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const addHiringManager = {
  request: createAction(
    'createJob/ADD_HIRING_MANAGER',
    resolve => (payload: { formValues: CreateHiringCompanyFormValues; onSuccess: () => void }) =>
      resolve(payload),
  ),
  success: createAction(
    'createJob/ADD_HIRING_MANAGER_SUCCESS',
    resolve => (payload: GetCreatedHiringManagerResponse) => resolve(payload),
  ),
  fail: createAction(
    'createJob/ADD_HIRING_MANAGER_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setHiringManagerForJob = {
  request: createAction(
    'createJob/SET_HIRING_MANAGER_FOR_JOB',
    resolve => (payload: { managerId: number; onSuccess: () => void }) => resolve(payload),
  ),
  success: createAction('createJob/SET_HIRING_MANAGER_FOR_JOB_SUCCESS'),
  fail: createAction(
    'createJob/SET_HIRING_MANAGER_FOR_JOB_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const updateHiringManager = {
  request: createAction(
    'createJob/UPDATE_HIRING_MANAGER',
    resolve => (payload: { representative?: boolean; hrManagerId: number | undefined }) =>
      resolve(payload),
  ),
  success: createAction(
    'createJob/UPDATE_HIRING_MANAGER_SUCCESS',
    resolve => (payload: CreateJobInfoResponse) => resolve(payload),
  ),
  fail: createAction(
    'createJob/UPDATE_HIRING_MANAGER_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getRepresentativeManager = {
  request: createAction(
    'createJob/GET_REPRESENTATIVE_MANAGERS',
    resolve => (payload: { selectedCompanyId?: number }) => resolve(payload),
  ),
  success: createAction(
    'createJob/GET_REPRESENTATIVE_MANAGERS_SUCCESS',
    resolve => (payload: RepresentativeManagerResponse) => resolve(payload),
  ),
  fail: createAction(
    'createJob/GET_REPRESENTATIVE_MANAGERS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};
