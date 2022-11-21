import { createAction } from 'deox';

import { MyJob } from '~/models/company';
import { UpdateLiveJobCandidateMatchedRequestBody } from '~/types/requests';
import { CompanyInterestResponse, ErrorResponse, GetCompanyJobs } from '~/types/responses';

export const getCompanyJobs = {
  request: createAction('companyJobs/GET_JOBS_REQUEST'),
  success: createAction(
    'companyJobs/GET_JOBS_SUCCESS',
    resolve => (payload: GetCompanyJobs) => resolve(payload),
  ),
  fail: createAction(
    'companyJobs/GET_JOBS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const updateInterestedCandidateStatus = {
  request: createAction(
    'companyJobs/UPDATE_INTERESTED_CANDIDATE_STATUS',
    resolve =>
      (payload: {
        formValues: UpdateLiveJobCandidateMatchedRequestBody;
        cb: () => void;
        onSuccess?: () => void;
      }) =>
        resolve(payload),
  ),
  success: createAction(
    'companyJobs/UPDATE_INTERESTED_CANDIDATE_SUCCESS',
    resolve => (payload: CompanyInterestResponse) => resolve(payload),
  ),
  fail: createAction(
    'companyJobs/UPDATE_INTERESTED_CANDIDATE_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const deleteInterestedCandidateStatus = {
  request: createAction(
    'companyJobs/UPDATE_INTERESTED_CANDIDATE_STATUS',
    resolve => (payload: CompanyInterestResponse) => resolve(payload),
  ),
};

export const setSelectedJob = {
  request: createAction(
    'companyJobs/SET_SELECTED_JOB',
    resolve => (payload: MyJob) => resolve(payload),
  ),
};
