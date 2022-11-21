import { MatchedJob } from '~/models/admin';
import { BoardsType } from '~/models/candidate';
import { MatchedCandidateFeedback } from '~/models/company';
import {
  GetMatchedCandidateContractsResponse,
  GetMatchedCandidateDetailResponse,
  GetMatchedCandidateFeedbackResponse,
  GetMatchedJobsPipelineResponse,
} from '~/types/responses';

export type CompanyInterviewsState = {
  matchedJobs: GetMatchedJobsPipelineResponse['data'];
  loadingMatchedJobs: boolean;
  boards: BoardsType;
  noteModalVisibility: boolean;
  feedbackModalVisibility: boolean;
  creatingFeedbackForCandidate: boolean;
  isAccept: boolean;
  updatingMatchedCandidateStatus: boolean;
  selectedMatchedCandidate: (MatchedJob & { index: number }) | null;
  loadingMatchedCandidateDetail: boolean;
  matchedCandidateOverview: GetMatchedCandidateDetailResponse['data'] | null;
  loadingMatchedCandidateContract: boolean;
  matchedCandidateContracts: GetMatchedCandidateContractsResponse['data'];
  loadingMatchedCandidateFeedback: boolean;
  matchedCandidateFeedbacks: GetMatchedCandidateFeedbackResponse['data'];
  selectedCandidateMatchedFeedback: MatchedCandidateFeedback | null;
  feedbackSent: boolean;
  contractConfirmed: boolean;
  approvingMatchedCandidateContract: boolean;
  creatingReply: boolean;
  activeTab: number;
  gettingContract: boolean;
  contractFile: null | string;
  addingToShortList: boolean;
};
