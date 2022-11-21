import { createAction } from 'deox';

import { Candidate, CandidateFeedback, CandidateStatus } from '~/models/admin';
import { SalaryRangeFormValues } from '~/types/formValues';
import {
  SendCandidateFeedbackReplyRequestBody,
  UpdateCandidateRecordRequestBody,
} from '~/types/requests';
import {
  ErrorResponse,
  getCandidateAdditionalInfoResponse,
  GetCandidateFeedbackRepliesResponse,
  GetCandidateFeedbacksResponse,
  GetCandidateJobMatchedResponse,
  GetCandidateOverviewResponse,
  GetCandidatePotentialResponse,
  GetCandidateRecordResponse,
  GetCandidatesResponse,
  GetCandidateVideoInterviewResponse,
  SendCandidateFeedbackReplyResponse,
  UpdateCandidateJobMatchedResponse,
  UpdateCandidateRecordResponse,
} from '~/types/responses';
import { SelectOption } from '~/view/components/select';

export const getCandidates = {
  init: createAction(
    'adminCandidates/GET_CANDIDATES',
    resolve => (payload: { initialFetch: boolean; status?: number }) => resolve(payload),
  ),
  request: createAction('adminCandidates/GET_CANDIDATES_REQUEST'),
  success: createAction(
    'adminCandidates/GET_CANDIDATES_SUCCESS',
    resolve => (payload: GetCandidatesResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminCandidates/GET_CANDIDATES_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getCandidateJobsMatched = {
  request: createAction('adminCandidates/GET_CANDIDATE_JOBS_MATCHED'),
  success: createAction(
    'adminCandidates/GET_CANDIDATE_JOBS_MATCHED_SUCCESS',
    resolve => (payload: GetCandidateJobMatchedResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminCandidates/GET_CANDIDATE_JOBS_MATCHED_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setCandidatesSearchWithFilters = createAction(
  'adminCandidates/SET_CANDIDATE_SEARCH_WITH_FILTERS',
  resolve => (payload: { jobPosition: number; keyWord: string }) => resolve(payload),
);

export const setSelectedCandidate = createAction(
  'adminCandidates/SET_SELECTED_CANDIDATE',
  resolve =>
    (
      payload: Omit<
        Candidate,
        'status' | 'jobPositions' | 'projectTypes' | 'brandedCv' | 'email' | 'phone'
      > | null,
    ) =>
      resolve(payload),
);

export const getCandidateOverview = {
  request: createAction('adminCandidates/GET_CANDIDATE_OVERVIEW'),
  success: createAction(
    'adminCandidates/GET_CANDIDATE_OVERVIEW_SUCCESS',
    resolve => (payload: GetCandidateOverviewResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminCandidates/GET_CANDIDATE_OVERVIEW_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getJobsShowedInterestInCandidate = {
  request: createAction('adminCandidates/GET_JOBS_INTERESTED_IN_CANDIDATE'),
  success: createAction(
    'adminCandidates/GET_JOBS_INTERESTED_IN_CANDIDATE_SUCCESS',
    resolve => (payload: GetCandidateJobMatchedResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminCandidates/GET_JOBS_INTERESTED_IN_CANDIDATE_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getCandidateInterestedJobs = {
  request: createAction('adminCandidates/GET_CANDIDATE_INTERESTED_JOBS'),
  success: createAction(
    'adminCandidates/GET_CANDIDATE_INTERESTED_JOBS_SUCCESS',
    resolve => (payload: GetCandidateJobMatchedResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminCandidates/GET_CANDIDATE_INTERESTED_JOBS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getCandidatePotentialJobs = {
  request: createAction(
    'adminCandidates/GET_CANDIDATE_POTENTIAL_JOBS',
    resolve => (payload: { initialFetch: boolean } | null) => resolve(payload),
  ),
  success: createAction(
    'adminCandidates/GET_CANDIDATE_POTENTIAL_JOBS_SUCCESS',
    resolve => (payload: GetCandidatePotentialResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminCandidates/GET_CANDIDATE_POTENTIAL_JOBS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const updateCandidateJobMatched = {
  request: createAction(
    'adminCandidates/UPDATE_CANDIDATE_JOB_MATCHED',
    resolve => (payload: { jobId: number; status: boolean }) => resolve(payload),
  ),
  success: createAction(
    'adminCandidates/UPDATE_CANDIDATE_JOB_MATCHED_SUCCESS',
    resolve => (payload: UpdateCandidateJobMatchedResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminCandidates/UPDATE_CANDIDATE_JOB_MATCHED_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getCandidateAdditionalInfo = {
  request: createAction('adminCandidates/GET_CANDIDATE_ADDITIONAL_INFO'),
  success: createAction(
    'adminCandidates/GET_CANDIDATE_ADDITIONAL_INFO_SUCCESS',
    resolve => (payload: getCandidateAdditionalInfoResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminCandidates/GET_CANDIDATE_ADDITIONAL_INFO_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const updateCandidateStatus = {
  request: createAction(
    'adminCandidates/UPDATE_CANDIDATE_STATUS',
    resolve => (payload: { candidateId: number; status: CandidateStatus }) => resolve(payload),
  ),
  success: createAction(
    'adminCandidates/UPDATE_CANDIDATE_STATUS_SUCCESS',
    resolve => (payload: { candidateId: number }) => resolve(payload),
  ),
  fail: createAction(
    'adminCandidates/UPDATE_CANDIDATE_STATUS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const resetCandidateFilters = createAction('adminCandidates/RESET_FILTERS');

export const resetPotentialJobFilters = createAction(
  'adminCandidates/RESET_POTENTIAl_JOB_FILTERS',
  resolve => () => resolve(),
);

export const setFiltersForPotentialJobs = createAction(
  'adminCandidates/SET_POTENTIAl_JOB_FILTERS',
  resolve => (payload: { searchValue: string }) => resolve(payload),
);

export const getCandidateFeedbacks = {
  request: createAction('adminCandidates/GET_CANDIDATE_FEEDBACKS'),
  success: createAction(
    'adminCandidates/GET_CANDIDATE_FEEDBACKS_SUCCESS',
    resolve => (payload: GetCandidateFeedbacksResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminCandidates/GET_CANDIDATE_FEEDBACKS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getCandidateFeedbackReplies = {
  request: createAction('adminCandidates/GET_CANDIDATE_FEEDBACK_REPLIES'),
  success: createAction(
    'adminCandidates/GET_CANDIDATE_FEEDBACK_REPLIES_SUCCESS',
    resolve => (payload: GetCandidateFeedbackRepliesResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminCandidates/GET_CANDIDATE_FEEDBACK_REPLIES_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const sendCandidateFeedbackReply = {
  request: createAction(
    'adminCandidates/SEND_CANDIDATE_FEEDBACK_REPLY',
    resolve => (payload: SendCandidateFeedbackReplyRequestBody) => resolve(payload),
  ),
  success: createAction(
    'adminCandidates/SEND_CANDIDATE_FEEDBACK_REPLY_SUCCESS',
    resolve => (payload: SendCandidateFeedbackReplyResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminCandidates/SEND_CANDIDATE_FEEDBACK_REPLY_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setSelectedCandidateFeedback = createAction(
  'adminCandidates/SET_SELECTED_CANDIDATE_FEEDBACK',
  resolve => (payload: CandidateFeedback | null) => resolve(payload),
);

export const getCandidateRecord = {
  request: createAction(
    'adminCandidates/GET_CANDIDATE_RECORD',
    resolve => (payload: { candidateId: number } | null) => resolve(payload),
  ),
  success: createAction(
    'adminCandidates/GET_CANDIDATE_RECORD_SUCCESS',
    resolve => (payload: GetCandidateRecordResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminCandidates/GET_CANDIDATE_RECORD_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const addCandidateRecord = {
  request: createAction(
    'adminCandidates/ADD_CANDIDATE_RECORD',
    resolve => (payload: { text: string }) => resolve(payload),
  ),
  success: createAction(
    'adminCandidates/ADD_CANDIDATE_RECORD_SUCCESS',
    resolve => (payload: UpdateCandidateRecordResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminCandidates/ADD_CANDIDATE_RECORD_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const updateCandidateRecord = {
  request: createAction(
    'adminCandidates/UPDATE_CANDIDATE_RECORD',
    resolve => (payload: UpdateCandidateRecordRequestBody) => resolve(payload),
  ),
  success: createAction(
    'adminCandidates/UPDATE_CANDIDATE_RECORD_SUCCESS',
    resolve => (payload: UpdateCandidateRecordResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminCandidates/UPDATE_CANDIDATE_RECORD_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const deleteCandidateRecord = {
  request: createAction(
    'adminCandidates/DELETE_CANDIDATE_RECORD',
    resolve => (payload: { recordId: number }) => resolve(payload),
  ),
  success: createAction('adminCandidates/DELETE_CANDIDATE_RECORD_SUCCESS'),
  fail: createAction(
    'adminCandidates/DELETE_CANDIDATE_RECORD_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getCandidateVideoInterview = {
  request: createAction('adminCandidates/GET_CANDIDATE_VIDEO_INTERVIEW'),
  success: createAction(
    'adminCandidates/GET_CANDIDATE_VIDEO_INTERVIEW_SUCCESS',
    resolve => (payload: GetCandidateVideoInterviewResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminCandidates/GET_CANDIDATE_VIDEO_INTERVIEW_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getPendingApprovalCount = {
  request: createAction('adminCandidates/GET_PENDING_APPROVAL_COUNT'),
  success: createAction(
    'adminCandidates/GET_PENDING_APPROVAL_COUNT_SUCCESS',
    resolve => (payload: number) => resolve(payload),
  ),
  fail: createAction('adminCandidates/GET_PENDING_APPROVAL_COUNT_FAIL'),
};

export const toggleThreadModalVisibility = createAction(
  'adminCandidates/TOGGLE_THREAD_MODAL_VISIBILITY',
);

export const downloadCandidateCV = {
  request: createAction(
    'adminCandidates/DOWNLOAD_CANDIDATE_CV',
    resolve => (payload: number) => resolve(payload),
  ),
  success: createAction('adminCandidates/DOWNLOAD_CANDIDATE_CV_SUCCESS'),
  fail: createAction('adminCandidates/DOWNLOAD_CANDIDATE_CV_FAIL'),
};

export const setRegion = createAction(
  'adminCandidates/SET_REGION',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setCity = createAction(
  'adminCandidates/SET_CITY',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setPosition = createAction(
  'adminCandidates/SET_POSITION',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setPermissionType = createAction(
  'adminCandidates/SET_PERMISSION_TYPE',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setSearchValue = createAction(
  'adminCandidates/SET_SEARCH_VALUE',
  resolve => (payload: string) => resolve(payload),
);

export const setSalary = createAction(
  'adminCandidates/SET_SALARY',
  resolve => (payload: SalaryRangeFormValues) => resolve(payload),
);

export const setSelectedRecordId = createAction(
  'adminCandidates/SET_RECORD_ID',
  resolve => (payload: { selectedRecordId: number }) => resolve(payload),
);

export const setRecordEditMode = createAction(
  'adminCandidates/SET_RECORD_EDIT_MODE',
  resolve => (payload: { editMode: boolean }) => resolve(payload),
);

export const deleteCandidate = {
  request: createAction(
    'adminCandidates/DELETE_CANDIDATE',
    resolve => (payload: { candidateId: number; onSuccess: () => void }) => resolve(payload),
  ),
  success: createAction('adminCandidates/DELETE_CANDIDATE_SUCCESS'),
  fail: createAction(
    'adminCandidates/DELETE_CANDIDATE_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setSelectedCandidateId = createAction(
  'adminCandidates/SET_SELECTED_CANDIDATE_ID',
  resolve => (payload: { candidateId: number }) => resolve(payload),
);

export const setProjectType = createAction(
  'adminCandidates/SET_PROJECT_TYPE',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setAvailability = createAction(
  'adminCandidates/SET_AVAILABILITY',
  resolve => (payload: SelectOption[]) => resolve(payload),
);

export const navigateFromContacts = createAction(
  'adminCandidates/SET_NAVIGATE_FROM_CONTACTS',
  resolve => (payload: boolean) => resolve(payload),
);

export const setProjectValue = createAction(
  'adminCandidates/SET_PROJECT_VALUE',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setCandidateStatus = createAction(
  'adminCandidates/SET_CANDIDATE_STATUS',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setSelectedJob = createAction(
  'adminCandidates/SET_SELECTED_JOB',
  resolve => (payload: number[]) => resolve(payload),
);

export const setSelectedJobGrop = createAction(
  'adminCandidates/SET_SELECTED_GROUP_JOB',
  resolve => (payload: number[]) => resolve(payload),
);
