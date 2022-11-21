import { createAction } from 'deox';

import { LiveJob, LiveJobFeedback } from '~/models/admin';
import { SalaryRangeFormValues } from '~/types/formValues';
import {
  SendLiveJobFeedbackReplyRequestBody,
  UpdateLiveJobRecordRequestBody,
  UpdateLiveJobStatusRequestBody,
} from '~/types/requests';
import {
  ErrorResponse,
  GetCompaniesWithLiveJobsCountResponse,
  GetLiveJobCandidatesResponse,
  GetLiveJobContractsResponse,
  GetLiveJobFeedbackRepliesResponse,
  GetLiveJobFeedbacksResponse,
  GetLiveJobRecordResponse,
  GetLiveJobsResponse,
  SendLiveJobFeedbackReplyResponse,
  UpdateLiveJobCandidateMatchedResponse,
  UpdateLiveJobRecordResponse,
  UpdateLiveJobStatusResponse,
} from '~/types/responses';
import { SelectOption } from '~/view/components/select';

export const setSelectedCompanyId = createAction(
  'adminLiveJobs/SET_SELECTED_COMPANY_ID',
  resolve => (payload: number | null | undefined) => resolve(payload),
);

export const getCompaniesWithLiveJobsCount = {
  init: createAction(
    'adminLiveJobs/GET_COMPANIES_WITH_LIVE_JOBS_COUNT',
    resolve => (payload: { initialFetch: boolean }) => resolve(payload),
  ),
  request: createAction('adminLiveJobs/GET_COMPANIES_WITH_LIVE_JOBS_COUNT_REQUEST'),
  success: createAction(
    'adminLiveJobs/GET_COMPANIES_WITH_LIVE_JOBS_COUNT_SUCCESS',
    resolve => (payload: GetCompaniesWithLiveJobsCountResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminLiveJobs/GET_COMPANIES_WITH_LIVE_JOBS_COUNT_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getLiveJobs = {
  init: createAction(
    'adminLiveJobs/GET_LIVE_JOBS',
    resolve => (payload: { initialFetch: boolean }) => resolve(payload),
  ),
  request: createAction('adminLiveJobs/GET_LIVE_JOBS_REQUEST'),
  success: createAction(
    'adminLiveJobs/GET_LIVE_JOBS_SUCCESS',
    resolve => (payload: GetLiveJobsResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminLiveJobs/GET_LIVE_JOBS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setSelectedLiveJob = createAction(
  'adminLiveJobs/SET_SELECTED_LIVE_JOB',
  resolve => (payload: LiveJob | null) => resolve(payload),
);

export const updateSelectedLiveJobStatus = {
  request: createAction(
    'adminLiveJobs/UPDATE_SELECTED_LIVE_JOB_STATUS',
    resolve => (payload: UpdateLiveJobStatusRequestBody) => resolve(payload),
  ),
  success: createAction(
    'adminLiveJobs/UPDATE_SELECTED_LIVE_JOB_STATUS_SUCCESS',
    resolve => (payload: UpdateLiveJobStatusResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminLiveJobs/UPDATE_SELECTED_LIVE_JOB_STATUS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getLiveJobMatchedCandidates = {
  request: createAction('adminLiveJobs/GET_LIVE_JOB_MATCHED_CANDIDATES'),
  success: createAction(
    'adminLiveJobs/GET_LIVE_JOB_MATCHED_CANDIDATES_SUCCESS',
    resolve => (payload: GetLiveJobCandidatesResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminLiveJobs/GET_LIVE_JOB_MATCHED_CANDIDATES_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getLiveJobInterestedCandidates = {
  request: createAction('adminLiveJobs/GET_LIVE_JOB_INTERESTED_CANDIDATES'),
  success: createAction(
    'adminLiveJobs/GET_LIVE_JOB_INTERESTED_CANDIDATES_SUCCESS',
    resolve => (payload: GetLiveJobCandidatesResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminLiveJobs/GET_LIVE_JOB_INTERESTED_CANDIDATES_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getLiveJobCompanyInterestedCandidates = {
  request: createAction('adminLiveJobs/GET_LIVE_JOB_COMPANY_INTERESTED_CANDIDATES'),
  success: createAction(
    'adminLiveJobs/GET_LIVE_JOB_COMPANY_INTERESTED_CANDIDATES_SUCCESS',
    resolve => (payload: GetLiveJobCandidatesResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminLiveJobs/GET_LIVE_JOB_COMPANY_INTERESTED_CANDIDATES_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getLiveJobPotentialCandidates = {
  request: createAction('adminLiveJobs/GET_LIVE_JOB_POTENTIAL_CANDIDATES'),
  success: createAction(
    'adminLiveJobs/GET_LIVE_JOB_POTENTIAL_CANDIDATES_SUCCESS',
    resolve => (payload: GetLiveJobCandidatesResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminLiveJobs/GET_LIVE_JOB_POTENTIAL_CANDIDATES_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const updateLiveJobCandidateMatched = {
  request: createAction(
    'adminLiveJobs/UPDATE_LIVE_JOB_CANDIDATE_MATCHED',
    resolve => (payload: { candidateId: number; status: boolean }) => resolve(payload),
  ),
  success: createAction(
    'adminLiveJobs/UPDATE_LIVE_JOB_CANDIDATE_MATCHED_SUCCESS',
    resolve => (payload: UpdateLiveJobCandidateMatchedResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminLiveJobs/UPDATE_LIVE_JOB_CANDIDATE_MATCHED_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const updateMatchedCandidatesCountInLiveJobs = createAction(
  'adminLiveJobs/UPDATE_MATCHED_CANDIDATES_COUNT_IN_LIVE_JOBS',
  resolve => (payload: { liveJobId: number; candidatesCount: number }) => resolve(payload),
);

export const getLiveJobFeedbacks = {
  request: createAction('adminLiveJobs/GET_LIVE_JOB_FEEDBACKS'),
  success: createAction(
    'adminLiveJobs/GET_LIVE_JOB_FEEDBACKS_SUCCESS',
    resolve => (payload: GetLiveJobFeedbacksResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminLiveJobs/GET_LIVE_JOB_FEEDBACKS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setSelectedLiveJobFeedback = createAction(
  'adminLiveJobs/SET_SELECTED_LIVE_JOB_FEEDBACK',
  resolve => (payload: LiveJobFeedback | null) => resolve(payload),
);

export const getLiveJobFeedbackReplies = {
  request: createAction('adminLiveJobs/GET_LIVE_JOB_FEEDBACK_REPLIES'),
  success: createAction(
    'adminLiveJobs/GET_LIVE_JOB_FEEDBACK_REPLIES_SUCCESS',
    resolve => (payload: GetLiveJobFeedbackRepliesResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminLiveJobs/GET_LIVE_JOB_FEEDBACK_REPLIES_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const sendLiveJobFeedbackReply = {
  request: createAction(
    'adminLiveJobs/SEND_LIVE_JOB_FEEDBACK_REPLY',
    resolve => (payload: SendLiveJobFeedbackReplyRequestBody) => resolve(payload),
  ),
  success: createAction(
    'adminLiveJobs/SEND_LIVE_JOB_FEEDBACK_REPLY_SUCCESS',
    resolve => (payload: SendLiveJobFeedbackReplyResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminLiveJobs/SEND_LIVE_JOB_FEEDBACK_REPLY_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getLiveJobsRecords = {
  request: createAction('adminLiveJobs/GET_LIVE_JOB_RECORDS'),
  success: createAction(
    'adminLiveJobs/GET_LIVE_JOB_RECORDS_SUCCESS',
    resolve => (payload: GetLiveJobRecordResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminLiveJobs/GET_LIVE_JOB_RECORDS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const addLiveJobRecord = {
  request: createAction(
    'adminLiveJobs/ADD_LIVE_JOB_RECORD',
    resolve => (payload: { text: string }) => resolve(payload),
  ),
  success: createAction(
    'adminLiveJobs/ADD_LIVE_JOB_RECORD_SUCCESS',
    resolve => (payload: UpdateLiveJobRecordResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminLiveJobs/ADD_LIVE_JOB_RECORD_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const updateLiveJobRecord = {
  request: createAction(
    'adminLiveJobs/UPDATE_LIVE_JOB_RECORD',
    resolve => (payload: UpdateLiveJobRecordRequestBody) => resolve(payload),
  ),
  success: createAction(
    'adminLiveJobs/UPDATE_CANDIDATE_LIVE_JOB_SUCCESS',
    resolve => (payload: UpdateLiveJobRecordResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminLiveJobs/UPDATE_CANDIDATE_LIVE_JOB_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const deleteLiveJobRecord = {
  request: createAction(
    'adminLiveJobs/DELETE_LIVE_JOB_RECORD',
    resolve => (payload: { recordId: number }) => resolve(payload),
  ),
  success: createAction('adminLiveJobs/DELETE_LIVE_JOB_RECORD_SUCCESS'),
  fail: createAction(
    'adminLiveJobs/DELETE_LIVE_JOB_RECORD_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getLiveJob = {
  request: createAction(
    'adminLiveJobs/GET_LIVE_JOB',
    resolve => (payload: { jobId: number; cb: (job: LiveJob) => void }) => resolve(payload),
  ),
  success: createAction('adminLiveJobs/GET_LIVE_JOB_SUCCESS'),
  fail: createAction(
    'adminLiveJobs/GET_LIVE_JOB_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getLiveJobContracts = {
  request: createAction('adminLiveJobs/GET_LIVE_JOB_CONTRACTS'),
  success: createAction(
    'adminLiveJobs/GET_LIVE_JOB_CONTRACTS_SUCCESS',
    resolve => (payload: GetLiveJobContractsResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminLiveJobs/GET_LIVE_JOB_CONTRACTS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const toggleJobModalVisibility = createAction('adminLiveJobs/TOGGLE_MODAL_VISIBILITY');

export const toggleThreadModalVisibility = createAction(
  'adminLiveJobs/TOGGLE_THREAD_MODAL_VISIBILITY',
);

export const setCity = createAction(
  'adminLiveJobs/SET_LOCATION',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setPosition = createAction(
  'adminLiveJobs/SET_POSITION',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setAdmin = createAction(
  'adminLiveJobs/SET_ADMIN',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setSelectedRecordId = createAction(
  'adminLiveJobs/SET_RECORD_ID',
  resolve => (payload: { selectedRecordId: number }) => resolve(payload),
);

export const setRecordEditMode = createAction(
  'adminLiveJobs/SET_RECORD_EDIT_MODE',
  resolve => (payload: { editMode: boolean }) => resolve(payload),
);

export const setPositionType = createAction(
  'adminLiveJobs/SET_POSITION_TYPE',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setSalary = createAction(
  'adminLiveJobs/SET_SALARY',
  resolve => (payload: SalaryRangeFormValues) => resolve(payload),
);

export const setRegion = createAction(
  'adminLiveJobs/SET_REGION',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setSearchValue = createAction(
  'adminLiveJobs/SET_SEARCH_VALUE',
  resolve => (payload: string) => resolve(payload),
);

export const resetFilters = createAction('adminLiveJobs/RESET_FILTERS');

export const setSelectedJob = createAction(
  'adminLiveJobs/SET_SELECTED_JOB',
  resolve => (payload: number[]) => resolve(payload),
);

export const setSelectedJobGrop = createAction(
  'adminLiveJobs/SET_SELECTED_GROUP_JOB',
  resolve => (payload: number[]) => resolve(payload),
);
