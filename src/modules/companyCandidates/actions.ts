import { createAction } from 'deox';

import { FindJob } from '~/models/candidate';
import { MatchedCandidateDetail } from '~/models/company';
import { SalaryRangeFormValues } from '~/types/formValues';
import {
  ErrorResponse,
  GetCompanyCandidatesResponse,
  GetMatchedJobDetailResponse,
  SetJobInterestResponse,
  UpdateShortListResponse,
} from '~/types/responses';
import { SelectOption } from '~/view/components/select';

export const getCompanyCandidates = {
  request: createAction(
    'companyCandidates/GET_CANDIDATES_REQUEST',
    resolve => (payload: number | string) => resolve(payload),
  ),
  success: createAction(
    'companyCandidates/GET_CANDIDATES_SUCCESS',
    resolve => (payload: GetCompanyCandidatesResponse) => resolve(payload),
  ),
  fail: createAction(
    'companyCandidates/GET_CANDIDATES_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setSelectedCompanyCandidate = {
  request: createAction(
    'companyCandidates/SET_SELECTED_CANDIDATE_REQUEST',
    resolve => (payload: number) => resolve(payload),
  ),
  success: createAction(
    'companyCandidates/SET_SELECTED_CANDIDATE_SUCCESS',
    resolve => (payload: MatchedCandidateDetail) => resolve(payload),
  ),
  fail: createAction(
    'companyCandidates/SET_SELECTED_CANDIDATE_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setRegion = createAction(
  'companyCandidates/SET_REGION',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setCity = createAction(
  'companyCandidates/SET_CITY',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setJobTitle = createAction(
  'companyCandidates/SET_JOB_TITLE',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setSearchValue = createAction(
  'companyCandidates/SET_SEARCH_VALUE',
  resolve => (payload: string) => resolve(payload),
);

export const setSalary = createAction(
  'companyCandidates/SET_SALARY',
  resolve => (payload: SalaryRangeFormValues) => resolve(payload),
);

export const setAvailability = createAction(
  'companyCandidates/SET_AVAILABILITY',
  resolve => (payload: SelectOption[]) => resolve(payload),
);

export const setProjectType = createAction(
  'companyCandidates/SET_PROJECT_TYPE',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setProjectValue = createAction(
  'companyCandidates/SET_PROJECT_VALUE',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setSelectedFindJob = createAction(
  'companyCandidates/SET_SELECTED_FIND_JOB',
  resolve => (payload: FindJob | null) => resolve(payload),
);

export const getFindJobDescription = {
  request: createAction('candidateFindJobs/GET_FIND_JOB_DESCRIPTION_REQUEST'),
  success: createAction(
    'companyCandidates/GET_FIND_JOB_DESCRIPTION_SUCCESS',
    resolve => (payload: GetMatchedJobDetailResponse) => resolve(payload),
  ),
  fail: createAction(
    'companyCandidates/GET_FIND_JOB_DESCRIPTION_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setFindJobInterest = {
  request: createAction(
    'companyCandidates/SET_FIND_JOB_INTEREST_REQUEST',
    resolve => (payload: boolean) => resolve(payload),
  ),
  success: createAction(
    'companyCandidates/SET_FIND_JOB_INTEREST_SUCCESS',
    resolve => (payload: SetJobInterestResponse) => resolve(payload),
  ),
  fail: createAction(
    'companyCandidates/SET_FIND_JOB_INTEREST_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const resetFilters = createAction('companyCandidates/RESET_SEARCH_FILTERS');

export const addCandidateToShortList = {
  request: createAction(
    'companyCandidates/ADD_CANDIDATE_TO_SHORTLIST',
    resolve => (payload: { candidateId: number; status: boolean }) => resolve(payload),
  ),
  success: createAction(
    'companyCandidates/ADD_CANDIDATE_TO_SHORTLIST_SUCCESS',
    resolve => (payload: UpdateShortListResponse) => resolve(payload),
  ),
  fail: createAction(
    'companyCandidates/ADD_CANDIDATE_TO_SHORTLIST_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const toggleInterestedJobSuccessModalVisibility = createAction(
  'companyJobs/TOGGLE_INTERESTED_JOB_SUCCESS_MODAL_VISIBILITY',
);

export const setSelectedInterestedJob = createAction(
  'companyJobs/SET_SELECTED_INTERESTED_JOB',
  resolve => (payload: string) => resolve(payload),
);

export const setSelectedJob = createAction(
  'companyCandidates/SET_SELECTED_JOB',
  resolve => (payload: number[]) => resolve(payload),
);

export const setSelectedJobGrop = createAction(
  'companyCandidates/SET_SELECTED_GROUP_JOB',
  resolve => (payload: number[]) => resolve(payload),
);
