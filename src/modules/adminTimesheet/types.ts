import { AdminTimesheetById } from '~/models/admin';
import {
  ErrorResponse,
  GetAdminTimesheetResponse,
  GetTimesheetPipelineResponse,
} from '~/types/responses';
import { SelectOption } from '~/view/components/select';

export type AdminTimesheetState = {
  adminTimesheetList: GetAdminTimesheetResponse['data'];
  loadingAdminTimesheet: boolean;
  creatingAdminEntry: boolean;
  createAdminEntryErrors: ErrorResponse['detail'] | null;
  adminTimesheet: AdminTimesheetById | null;
  adminTimesheetModalVisibility: boolean;
  selectedAdminTimesheetId: number | null;
  loadingAdminTimesheetById: boolean;
  approvingAdminTimesheetStatus: boolean;
  rejectingAdminTimesheetStatus: boolean;
  searchByTimesheetStatus: SelectOption;
  searchByCandidate: SelectOption;
  searchByCompany: SelectOption;
  searchByWeek: Date | undefined;
  candidatesWithTimesheet: SelectOption[];
  companiesWithTimesheet: SelectOption[];
  loadingCandidatesWithTimesheet: boolean;
  loadingCompaniesWithTimesheet: boolean;
  candidatePipeline: GetTimesheetPipelineResponse['data'];
  loadingCandidatePipeline: boolean;
  selectedCandidate: SelectOption;
  selectedCompany: SelectOption;
};
