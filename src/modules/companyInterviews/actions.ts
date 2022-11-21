import { createAction } from 'deox';

import { MatchedJob } from '~/models/admin';
import { BoardsType } from '~/models/candidate';
import { MatchedJobSteps } from '~/models/common';
import { MatchedCandidateFeedback } from '~/models/company';
import { CreateFeedbackForCandidateBodyParams } from '~/types/requests';
import {
  CreatedReplyFeedbackResponse,
  ErrorResponse,
  GetMatchedCandidateContractsResponse,
  GetMatchedCandidateDetailResponse,
  GetMatchedCandidateFeedbackResponse,
  GetMatchedJobContractsResponse,
  GetMatchedJobsPipelineResponse,
  UpdateShortListResponse,
} from '~/types/responses';

export const getCompanyMatchedCandidates = {
  request: createAction('companyInterviews/GET_COMPANY_MATCHED_CANDIDATES'),
  success: createAction(
    'companyInterviews/GET_COMPANY_MATCHED_CANDIDATES_SUCCESS',
    resolve => (payload: GetMatchedJobsPipelineResponse) => resolve(payload),
  ),
  fail: createAction(
    'companyInterviews/GET_COMPANY_MATCHED_CANDIDATES_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setBoards = createAction(
  'companyInterviews/SET_BOARDS',
  resolve => (payload: BoardsType) => resolve(payload),
);

export const toggleNoteModalVisibility = createAction(
  'companyInterviews/TOGGLE_NOTE_MODAL_VISIBILITY',
  resolve => (payload: boolean) => resolve(payload),
);

export const updateMatchedCandidateStatus = {
  request: createAction(
    'companyInterviews/UPDATE_MATCHED_CANDIDATE_STATUS',
    resolve =>
      (payload: {
        matchedId: number;
        formValues: { step: MatchedJobSteps; note?: string };
        cb: () => void;
      }) =>
        resolve(payload),
  ),
  success: createAction('companyInterviews/UPDATE_MATCHED_CANDIDATE_STATUS_SUCCESS'),
  fail: createAction(
    'companyInterviews/UPDATE_MATCHED_CANDIDATE_STATUS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setSelectedMatchedCandidate = createAction(
  'companyInterviews/SET_SELECTED_MATCHED_CANDIDATE',
  resolve => (payload: (MatchedJob & { index: number }) | null) => resolve(payload),
);

export const toggleFeedbackModalVisibility = createAction(
  'companyInterviews/TOGGLE_FEEDBACK_MODAL_VISIBILITY',
);

export const createFeedbackForCandidate = {
  request: createAction(
    'companyInterviews/CREATE_FEEDBACK_FOR_CANDIDATE',
    resolve => (payload: { data: CreateFeedbackForCandidateBodyParams; cb: () => void }) =>
      resolve(payload),
  ),
  success: createAction('companyInterviews/CREATE_FEEDBACK_FOR_CANDIDATE_SUCCESS'),
  fail: createAction(
    'companyInterviews/CREATE_FEEDBACK_FOR_CANDIDATE_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getMatchedCandidateDetail = {
  request: createAction('companyInterview/GET_MATCHED_CANDIDATE_DETAIL'),
  success: createAction(
    'companyInterviews/GET_MATCHED_CANDIDATE_DETAIL_SUCCESS',
    resolve => (payload: GetMatchedCandidateDetailResponse) => resolve(payload),
  ),
  fail: createAction(
    'companyInterviews/GET_MATCHED_CANDIDATE_DETAIL_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getMatchedCandidateContract = {
  request: createAction('companyInterview/GET_MATCHED_CANDIDATE_CONTRACT'),
  success: createAction(
    'companyInterviews/GET_MATCHED_CANDIDATE_CONTRACT_SUCCESS',
    resolve => (payload: GetMatchedCandidateContractsResponse) => resolve(payload),
  ),
  fail: createAction(
    'companyInterviews/GET_MATCHED_CANDIDATE_CONTRACT_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getMatchedCandidateFeedback = {
  request: createAction('companyInterview/GET_MATCHED_CANDIDATE_FEEDBACK'),
  success: createAction(
    'companyInterviews/GET_MATCHED_CANDIDATE_FEEDBACK_SUCCESS',
    resolve => (payload: GetMatchedCandidateFeedbackResponse['data']) => resolve(payload),
  ),
  fail: createAction(
    'companyInterviews/GET_MATCHED_CANDIDATE_FEEDBACK_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setSelectedMatchedCandidateFeedback = createAction(
  'companyInterviews/SET_SELECTED_MATCHED_CANDIDATE_FEEDBACK',
  resolve => (payload: MatchedCandidateFeedback | null) => resolve(payload),
);

export const markFeedbackSent = createAction(
  'companyInterviews/MARK_FEEDBACK_SENT',
  resolve => (payload: boolean) => resolve(payload),
);

export const markConfirmedContract = createAction(
  'companyInterviews/MARK_CONTRACT_CONFIRMED',
  resolve => (payload: boolean) => resolve(payload),
);

export const createReplyForFeedback = {
  request: createAction(
    'companyInterviews/CREATE_REPLY_FOR_FEEDBACK',
    resolve => (payload: { newReply: string; feedbackId: number }) => resolve(payload),
  ),
  success: createAction(
    'companyInterviews/CREATE_REPLY_FOR_FEEDBACK_SUCCESS',
    resolve => (payload: CreatedReplyFeedbackResponse) => resolve(payload),
  ),
  fail: createAction(
    'companyInterviews/CREATE_REPLY_FOR_FEEDBACK_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const approveMatchedCandidateContract = {
  request: createAction(
    'companyInterviews/APPROVE_MATCHED_CANDIDATE_CONTRACT',
    resolve => (payload: { data: { approved: boolean; contractId: number }; cb: () => void }) =>
      resolve(payload),
  ),
  success: createAction(
    'companyInterviews/APPROVE_MATCHED_CANDIDATE_CONTRACT_SUCCESS',
    resolve => (payload: GetMatchedJobContractsResponse) => resolve(payload),
  ),
  fail: createAction(
    'companyInterviews/APPROVE_MATCHED_CANDIDATE_CONTRACT_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setActiveTab = createAction(
  'companyInterviews/SET_ACTIVE_TAB',
  resolve => (payload: number) => resolve(payload),
);

export const resetToInitial = createAction('companyInterviews/RESET_TO_INITIAL');

export const getContract = {
  request: createAction(
    'companyInterviews/GET_CONTRACT',
    resolve => (payload: { isReview: boolean }) => resolve(payload),
  ),
  success: createAction(
    'companyInterviews/GET_CONTRACT_SUCCESS',
    resolve => (payload: string) => resolve(payload),
  ),
  fail: createAction('companyInterviews/GET_CONTRACT_FAIL'),
};

export const addCandidateToShortList = {
  request: createAction(
    'companyInterviews/ADD_CANDIDATE_TO_SHORTLIST',
    resolve => (payload: { candidateId: number; status: boolean }) => resolve(payload),
  ),
  success: createAction(
    'companyInterviews/ADD_CANDIDATE_TO_SHORTLIST_SUCCESS',
    resolve => (payload: UpdateShortListResponse) => resolve(payload),
  ),
  fail: createAction(
    'companyInterviews/ADD_CANDIDATE_TO_SHORTLIST_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};
