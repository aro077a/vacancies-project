import { LiveJob, LiveJobFeedback } from '~/models/admin';
import {
  GetCompaniesWithLiveJobsCountResponse,
  GetLiveJobCandidatesResponse,
  GetLiveJobContractsResponse,
  GetLiveJobFeedbackRepliesResponse,
  GetLiveJobFeedbacksResponse,
  GetLiveJobRecordResponse,
  GetLiveJobsResponse,
} from '~/types/responses';
import { SelectOption } from '~/view/components/select';

export type AdminLiveJobsState = {
  selectedCompanyId: number | null;
  searchSelectedJobs: number[];
  searchSelectedJobGroups: number[];
  loadingCompaniesWithLiveJobsCount: boolean;
  companiesWithLiveJobsCount: GetCompaniesWithLiveJobsCountResponse['data'];
  loadingLiveJobs: boolean;
  liveJobs: GetLiveJobsResponse['data'];
  selectedLiveJob: LiveJob | null;
  updatingLiveJobStatus: boolean;
  loadingLiveJobMatchedCandidates: boolean;
  liveJobMatchedCandidates: GetLiveJobCandidatesResponse['data'];
  loadingLiveJobInterestedCandidates: boolean;
  liveJobInterestedCandidates: GetLiveJobCandidatesResponse['data'];
  loadingLiveJobCompanyInterestedCandidates: boolean;
  liveJobCompanyInterestedCandidates: GetLiveJobCandidatesResponse['data'];
  loadingLiveJobPotentialCandidates: boolean;
  liveJobPotentialCandidates: GetLiveJobCandidatesResponse['data'];
  updatingLiveJobCandidateMatched: boolean;
  loadingLiveJobFeedbacks: boolean;
  liveJobFeedbacks: GetLiveJobFeedbacksResponse['data'];
  selectedLiveJobFeedback: LiveJobFeedback | null;
  loadingLiveJobFeedbackReplies: boolean;
  liveJobFeedbackReplies: GetLiveJobFeedbackRepliesResponse['data'] | null;
  sendingLiveJobFeedbackReply: boolean;
  loadingLiveJob: boolean;
  liveJobContracts: GetLiveJobContractsResponse['data'];
  pendingContracts: GetLiveJobContractsResponse['data'];
  loadingLiveJobContracts: boolean;
  jobModalVisibility: boolean;
  threadModalVisibility: boolean;
  searchLiveJobsJobType: SelectOption;
  searchLiveJobsByAdmin: SelectOption;
  loadingLiveJobsRecord: boolean;
  liveJobsRecords: GetLiveJobRecordResponse['data'] | [];
  addLiveJobRecordLoading: boolean;
  updatingLiveJobRecord: boolean;
  deletingLiveJobRecord: boolean;
  selectedRecordId: number;
  searchJobRegionFilter: SelectOption;
  searchJobCityFilter: SelectOption;
  searchJobPositionType: SelectOption;
  editMode: boolean;
  searchJobSalaryGte: string;
  searchJobSalaryLte: string;
  searchCandidateKeyWord: string;
  searchSalaryWithSuper: boolean | undefined;
};
