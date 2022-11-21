import { initialColumnsType, MatchedJob } from '~/models/admin';
import {
  GetMatchedJobPipelineResponse,
  GetMatchedJobsPipelineResponse,
  GetUnmatchedJobPipelineResponse,
} from '~/types/responses';
import { SelectOption } from '~/view/components/select';

export type AdminMatchedJobsPipelineState = {
  unmatchedJobsPipeline: GetUnmatchedJobPipelineResponse['data'];
  loadingUnmatchedJobs: boolean;
  matchedJobsPipeline: GetMatchedJobsPipelineResponse['data'];
  loadingMatchedJobPipeline: boolean;
  updatingMatchedJobStep: boolean;
  initialColumns: initialColumnsType;
  CVModalVisibility: boolean;
  interviewModalVisibility: boolean;
  selectedMatchedJob: (MatchedJob & { index: number }) | null;
  invoiceModalVisibility: boolean;
  contractModalVisibility: boolean;
  arrangingInterview: boolean;
  creatingInvoice: boolean;
  creatingContract: boolean;
  editInterviewMode: boolean;
  isContractGenerated: boolean;
  generatedContractId: number | null;
  donwloadingGeneratedContract: boolean;
  sendingContract: boolean;
  successModalVisibility: boolean;
  isNotesSentStatus: GetMatchedJobPipelineResponse['status'] | null;
  searchByCompany: SelectOption;
  searchByRegion: SelectOption;
  searchByCity: SelectOption;
  searchByContractType: SelectOption;
  searchByAdmin: SelectOption;
};
