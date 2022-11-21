import { createAction } from 'deox';

import { JobStatus } from '~/models/common';
import { MyJob } from '~/models/company';
import { GetCompanyMyJobsResponse, UpdateCompanyMyJobResponse } from '~/types/responses';

export const getActiveJobs = {
  init: createAction(
    'companyMyJobs/GET_ACTIVE_JOBS_INIT',
    resolve => (payload: { initialFetch: boolean }) => resolve(payload),
  ),
  request: createAction('companyMyJobs/GET_ACTIVE_JOBS_REQUEST'),
  success: createAction(
    'companyMyJobs/GET_ACTIVE_JOBS_SUCCESS',
    resolve => (payload: GetCompanyMyJobsResponse) => resolve(payload),
  ),
  fail: createAction('companyMyJobs/GET_ACTIVE_JOBS_FAIL'),
};

export const getClosedJobs = {
  init: createAction(
    'companyMyJobs/GET_CLOSED_JOBS_INIT',
    resolve => (payload: { initialFetch: boolean }) => resolve(payload),
  ),
  request: createAction('companyMyJobs/GET_CLOSED_JOBS_REQUEST'),
  success: createAction(
    'companyMyJobs/GET_CLOSED_JOBS_SUCCESS',
    resolve => (payload: GetCompanyMyJobsResponse) => resolve(payload),
  ),
  fail: createAction('companyMyJobs/GET_CLOSED_JOBS_FAIL'),
};

export const setSelectedJob = createAction(
  'companyMyJobs/SET_SELECTED_JOB',
  resolve => (payload: MyJob) => resolve(payload),
);

export const updateJobStatus = {
  request: createAction(
    'companyMyJobs/UPDATE_JOB_STATUS',
    resolve => (payload: JobStatus) => resolve(payload),
  ),
  success: createAction(
    'companyMyJobs/UPDATE_JOB_STATUS_SUCCESS',
    resolve => (payload: UpdateCompanyMyJobResponse) => resolve(payload),
  ),
  fail: createAction('companyMyJobs/UPDATE_JOB_STATUS_FAIL'),
};

export const deleteMyJob = {
  request: createAction(
    'companyMyJobs/DELETE_MY_JOB',
    resolve => (payload: { jobId: number; status: JobStatus }) => resolve(payload),
  ),
  success: createAction(
    'companyMyJobs/DELETE_MY_JOB_SUCCESS',
    resolve => (payload: { jobId: number; status: JobStatus }) => resolve(payload),
  ),
  fail: createAction('companyMyJobs/DELETE_MY_JOB_FAIL'),
};
