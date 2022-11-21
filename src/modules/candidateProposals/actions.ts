import { createAction } from 'deox';

import { MatchedJob } from '~/models/admin';
import { BoardsType } from '~/models/candidate';
import { MatchedJobSteps } from '~/models/common';
import { CreateFeedbackForJobRequestBody } from '~/types/requests';
import {
  CreatedReplyFeedbackResponse,
  ErrorResponse,
  GetMatchedJobContractsResponse,
  GetMatchedJobDetailResponse,
  GetMatchedJobFeedbackResponse,
  GetMatchedJobsPipelineResponse,
} from '~/types/responses';

export const getCandidateMatchedJobs = {
  request: createAction('candidateProposals/GET_CANDIDATE_MATCHED_JOBS'),
  success: createAction(
    'candidateProposals/GET_CANDIDATE_MATCHED_JOBS_SUCCESS',
    resolve => (payload: GetMatchedJobsPipelineResponse) => resolve(payload),
  ),
  fail: createAction(
    'candidateProposals/GET_CANDIDATE_MATCHED_JOBS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const updateCandidateMatchedJob = {
  request: createAction(
    'candidateProposals/UPDATE_CANDIDATE_MATCHED_JOB_REQUEST',
    resolve => (payload: { step: MatchedJobSteps; matchedId: number; cb: () => void }) =>
      resolve(payload),
  ),
  success: createAction('candidateProposals/UPDATE_CANDIDATE_MATCHED_JOB_SUCCESS'),
  fail: createAction(
    'candidateProposals/UPDATE_CANDIDATE_MATCHED_JOB_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setBoards = createAction(
  'candidateProposals/SET_BOARDS',
  resolve => (payload: BoardsType) => resolve(payload),
);

export const toggleFeedbackModalVisibility = createAction(
  'candidateProposals/TOGGLE_FEEDBACK_MODAL_VISIBILITY',
);

export const createFeedbackForJob = {
  request: createAction(
    'candidateProposals/CREATE_FEEDBACK_FOR_JOB',
    resolve => (payload: { data: CreateFeedbackForJobRequestBody; cb: () => void }) =>
      resolve(payload),
  ),
  success: createAction('candidateProposals/CREATE_FEEDBACK_FOR_JOB_SUCCESS'),
  fail: createAction(
    'candidateProposals/CREATE_FEEDBACK_FOR_JOB_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setSelectedMatchedJob = createAction(
  'candidateProposals/SET_SELECTED_MATCHED_JOB',
  resolve => (payload: (MatchedJob & { index: number }) | null) => resolve(payload),
);

export const getMatchedJobDetail = {
  request: createAction('candidateProposals/GET_MATCHED_JOB_DETAIL'),
  success: createAction(
    'candidateProposals/GET_MATCHED_JOB_DETAIL_SUCCESS',
    resolve => (payload: GetMatchedJobDetailResponse) => resolve(payload),
  ),
  fail: createAction(
    'candidateProposals/GET_MATCHED_JOB_DETAIL_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getMatchedJobContracts = {
  request: createAction('candidateProposals/GET_MATCHED_JOB_CONTRACTS'),
  success: createAction(
    'candidateProposals/GET_MATCHED_JOB_CONTRACTS_SUCCESS',
    resolve => (payload: GetMatchedJobContractsResponse) => resolve(payload),
  ),
  fail: createAction(
    'candidateProposals/GET_MATCHED_JOB_CONTRACTS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getMatchedJobFeedback = {
  request: createAction('candidateProposals/GET_MATCHED_JOB_FEEDBACK'),
  success: createAction(
    'candidateProposals/GET_MATCHED_JOB_FEEDBACK_SUCCESS',
    resolve => (payload: GetMatchedJobFeedbackResponse) => resolve(payload),
  ),
  fail: createAction(
    'candidateProposals/GET_MATCHED_JOB_FEEDBACK_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const approveMatchedJobContract = {
  request: createAction(
    'candidateProposals/APPROVE_MATCHED_JOB_CONTRACT',
    resolve => (payload: boolean) => resolve(payload),
  ),
  success: createAction(
    'candidateProposals/APPROVE_MATCHED_JOB_CONTRACT_SUCCESS',
    resolve => (payload: GetMatchedJobContractsResponse) => resolve(payload),
  ),
  fail: createAction(
    'candidateProposals/APPROVE_MATCHED_JOB_CONTRACT_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const createReplyForFeedback = {
  request: createAction(
    'candidateProposals/CREATE_REPLY_FOR_FEEDBACK',
    resolve => (payload: { newReply: string; feedbackId: number }) => resolve(payload),
  ),
  success: createAction(
    'candidateProposals/CREATE_REPLY_FOR_FEEDBACK_SUCCESS',
    resolve => (payload: CreatedReplyFeedbackResponse) => resolve(payload),
  ),
  fail: createAction(
    'candidateProposals/CREATE_REPLY_FOR_FEEDBACK_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const toggleReviewContractModalVisibility = createAction(
  'candidateProposals/TOGGLE_REVIEW_CONTRACT_MODAL_VISIBILITY',
);

export const setActiveTab = createAction(
  'candidateProposals/SET_ACTIVE_TAB',
  resolve => (payload: number) => resolve(payload),
);

export const resetToInitial = createAction('candidateProposals/RESET_TO_INITIAL');

export const getContract = {
  request: createAction(
    'candidateProposals/GET_CONTRACT',
    resolve => (payload: { isReview: boolean }) => resolve(payload),
  ),
  success: createAction(
    'candidateProposals/GET_CONTRACT_SUCCESS',
    resolve => (payload: string) => resolve(payload),
  ),
  fail: createAction('candidateProposals/GET_CONTRACT_FAIL'),
};
