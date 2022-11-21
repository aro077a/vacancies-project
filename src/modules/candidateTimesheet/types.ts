import { CandidateTimesheetById } from '~/models/candidate';
import {
  ErrorResponse,
  GetCandidateTimesheetResponse,
  GetTimesheetPipelineResponse,
} from '~/types/responses';

export type CandidateTimesheetState = {
  candidateTimesheetList: GetCandidateTimesheetResponse['data'];
  loadingCandidateTimesheet: boolean;
  loadingCandidatePipeline: boolean;
  candidatePipeline: GetTimesheetPipelineResponse['data'];
  creatingCandidateEntry: boolean;
  createCandidateEntryErrors: ErrorResponse['detail'] | null;
  loadingCandidateTimesheetById: boolean;
  candidateTimesheet: CandidateTimesheetById | null;
  candidateTimesheetModalVisibility: boolean;
  selectedCandidateTimesheetId: number | null;
  candidateContract: null | string;
  loadingCandidateContract: boolean;
  reviewTimesheetContractModalVisibility: boolean;
};
