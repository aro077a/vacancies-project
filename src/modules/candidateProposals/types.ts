import { MatchedJob } from '~/models/admin';
import { BoardsType } from '~/models/candidate';
import {
  GetMatchedJobContractsResponse,
  GetMatchedJobDetailResponse,
  GetMatchedJobFeedbackResponse,
  GetMatchedJobsPipelineResponse,
} from '~/types/responses';

export type CandidateProposalsState = {
  loadingCandidateMatchedJobs: boolean;
  candidateMatchedJobs: GetMatchedJobsPipelineResponse['data'];
  boards: BoardsType;
  updatingMatchedJobStatus: boolean;
  feedbackModalVisibility: boolean;
  creatingFeedbackForJob: boolean;
  selectedMatchedJob: (MatchedJob & { index: number }) | null;
  loadingMatchedJobDetail: boolean;
  matchedJobDetail: GetMatchedJobDetailResponse['data'] | null;
  loadingMatchedJobContracts: boolean;
  matchedJobContracts: GetMatchedJobContractsResponse['data'] | null;
  loadingMatchedJobFeedback: boolean;
  matchedJobFeedback: GetMatchedJobFeedbackResponse['data'] | null;
  approvingMatchedJobContract: boolean;
  creatingReply: boolean;
  reviewContractModalVisibility: boolean;
  activeTab: number;
  gettingContract: boolean;
  contract: null | string;
};
