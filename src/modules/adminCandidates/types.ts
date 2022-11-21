import { Candidate, CandidateFeedback } from '~/models/admin';
import {
  getCandidateAdditionalInfoResponse,
  GetCandidateFeedbackRepliesResponse,
  GetCandidateFeedbacksResponse,
  GetCandidateJobMatchedResponse,
  GetCandidateOverviewResponse,
  GetCandidatePotentialResponse,
  GetCandidateRecordResponse,
  GetCandidatesResponse,
  GetCandidateVideoInterviewResponse,
} from '~/types/responses';
import { SelectOption } from '~/view/components/select';

export type CandidatesState = {
  candidates: GetCandidatesResponse['data'];
  loadingCandidates: boolean;
  loadingCandidateJobsMatched: boolean;
  candidateJobsMatched: GetCandidateJobMatchedResponse['data'];
  selectedCandidate: Omit<
    Candidate,
    'jobPositions' | 'projectTypes' | 'email' | 'phone' | 'brandedCv'
  > | null;
  loadingCandidateOverview: boolean;
  candidateOverview: GetCandidateOverviewResponse['data'] | null;
  loadingJobsInterestedInCandidate: boolean;
  jobsInterestedInCandidate: GetCandidateJobMatchedResponse['data'];
  loadingCandidateInterestedJobs: boolean;
  candidateInterestedJobs: GetCandidateJobMatchedResponse['data'];
  loadingPotentialCandidateJobs: boolean;
  potentialCandidateJobs: GetCandidatePotentialResponse['data'];
  updatingCandidateJobMatched: boolean;
  loadingCandidateAdditionalInfo: boolean;
  candidateAdditionalInfo: getCandidateAdditionalInfoResponse['data'] | null;
  loadingCandidateVideoInterview: boolean;
  candidateVideoInterview: GetCandidateVideoInterviewResponse['data'] | null;
  candidateSearchValue: string;
  candidateSearchJobType: number;
  updateCandidateStatusLoading: boolean;
  candidateFeedbacks: GetCandidateFeedbacksResponse['data'] | [];
  loadingCandidateFeedbacks: boolean;
  selectedCandidateFeedbackReplies: GetCandidateFeedbackRepliesResponse['data'] | null;
  loadingSelectedCandidateFeedbackReplies: boolean;
  selectedCandidateFeedback: CandidateFeedback | null;
  sendingCandidateFeedbackReply: boolean;
  loadingCandidateRecord: boolean;
  updatingCandidateRecord: boolean;
  candidateRecords: GetCandidateRecordResponse['data'] | [];
  deletingCandidateRecord: boolean;
  potentialSearchValue: string;
  pendingApprovalCount: number;
  gettingPendingCandidates: boolean;
  threadModalVisibility: boolean;
  downloadingCandidateCV: boolean;
  searchCandidateRegionFilter: SelectOption;
  searchCandidateCityFilter: SelectOption;
  searchCandidateJobType: SelectOption;
  searchCandidateByPermission: SelectOption;
  searchCandidateKeyWord: string;
  searchCandidateSalaryGte: string;
  searchCandidateSalaryLte: string;
  addCandidateRecordLoading: boolean;
  selectedRecordId: number;
  editMode: boolean;
  deletingCandidate: boolean;
  selectedCandidateId: number;
  searchCandidateByProjectType: SelectOption;
  searchCandidateByAvailability: SelectOption[];
  navigateFromContactsToCandidates: boolean;
  searchCandidateByProjectValue: SelectOption;
  searchCandidateByStatus: SelectOption;
  searchSelectedJobs: number[];
  searchSelectedJobGroups: number[];
};
