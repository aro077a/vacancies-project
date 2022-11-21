import { createAction } from 'deox';

import { FindJob } from '~/models/candidate';
import { SalaryRangeFormValues } from '~/types/formValues';
import {
  ErrorResponse,
  GetCompaniesWithLiveJobsCountResponse,
  GetFindJobsResponse,
  GetMatchedJobDetailResponse,
  SetJobInterestResponse,
  UpdateShortListResponse,
} from '~/types/responses';
import { SelectOption } from '~/view/components/select';

export const getFindJobs = {
  init: createAction(
    'candidateFindJobs/GET_FIND_JOBS_INIT',
    resolve => (payload: { initialFetch: boolean }) => resolve(payload),
  ),
  request: createAction('candidateFindJobs/GET_FIND_JOBS_REQUEST'),
  success: createAction(
    'candidateFindJobs/GET_FIND_JOBS_SUCCESS',
    resolve => (payload: GetFindJobsResponse) => resolve(payload),
  ),
  fail: createAction(
    'candidateFindJobs/GET_FIND_JOBS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setCompany = createAction(
  'candidateFindJobs/SET_COMPANY',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setLocation = createAction(
  'candidateFindJobs/SET_LOCATION',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setPosition = createAction(
  'candidateFindJobs/SET_POSITION',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setSearchValue = createAction(
  'candidateFindJobs/SET_SEARCH_VALUE',
  resolve => (payload: string) => resolve(payload),
);

export const setSalary = createAction(
  'candidateFindJobs/SET_SALARY',
  resolve => (payload: SalaryRangeFormValues) => resolve(payload),
);

export const setSelectedFindJob = createAction(
  'candidateFindJobs/SET_SELECTED_FIND_JOB',
  resolve => (payload: FindJob | null) => resolve(payload),
);

export const setPositionType = createAction(
  'candidateFindJobs/SET_POSITION_TYPE',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setProjectType = createAction(
  'candidateFindJobs/SET_PROJECT_TYPE',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const getFindJobDescription = {
  request: createAction('candidateFindJobs/GET_FIND_JOB_DESCRIPTION_REQUEST'),
  success: createAction(
    'candidateFindJobs/GET_FIND_JOB_DESCRIPTION_SUCCESS',
    resolve => (payload: GetMatchedJobDetailResponse) => resolve(payload),
  ),
  fail: createAction(
    'candidateFindJobs/GET_FIND_JOB_DESCRIPTION_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setFindJobInterest = {
  request: createAction(
    'candidateFindJobs/SET_FIND_JOB_INTEREST_REQUEST',
    resolve => (payload: { interested: boolean; onSuccess: () => void }) => resolve(payload),
  ),
  success: createAction(
    'candidateFindJobs/SET_FIND_JOB_INTEREST_SUCCESS',
    resolve => (payload: SetJobInterestResponse) => resolve(payload),
  ),
  fail: createAction(
    'candidateFindJobs/SET_FIND_JOB_INTEREST_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const resetFilters = createAction('candidateFindJobs/RESET_SEARCH_FILTERS');

export const addJobToShortList = {
  request: createAction(
    'candidateFindJobs/ADD_JOB_TO_SHORTLIST',
    resolve => (payload: { jobId: number; status: boolean }) => resolve(payload),
  ),
  success: createAction(
    'candidateFindJobs/ADD_JOB_TO_SHORTLIST_SUCCESS',
    resolve => (payload: UpdateShortListResponse) => resolve(payload),
  ),
  fail: createAction(
    'candidateFindJobs/ADD_JOB_TO_SHORTLIST_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setSelectedCompanyId = createAction(
  'candidateFindJobs/SET_SELECTED_COMPANY_ID',
  resolve => (payload: number | null) => resolve(payload),
);

export const getCompaniesWithJobs = {
  init: createAction(
    'candidateFindJobs/GET_COMPANIES_WITH_JOBS_INIT',
    resolve => (payload: { initialFetch: boolean; noLimit?: boolean }) => resolve(payload),
  ),
  request: createAction('candidateFindJobs/GET_COMPANIES_WITH_JOBS_REQUEST'),
  success: createAction(
    'candidateFindJobs/GET_COMPANIES_WITH_JOBS_SUCCESS',
    resolve => (payload: { res: GetCompaniesWithLiveJobsCountResponse; noLimit: boolean }) =>
      resolve(payload),
  ),
  fail: createAction('candidateFindJobs/GET_COMPANIES_WITH_JOBS_FAIL'),
};

export const setSelectedJob = createAction(
  'candidateFindJobs/SET_SELECTED_JOB',
  resolve => (payload: number[]) => resolve(payload),
);

export const setSelectedJobGrop = createAction(
  'candidateFindJobs/SET_SELECTED_GROUP_JOB',
  resolve => (payload: number[]) => resolve(payload),
);
