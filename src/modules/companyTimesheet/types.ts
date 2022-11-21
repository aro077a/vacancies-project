import { CompanyTimesheetById } from '~/models/company';
import { GetCompanyTimesheetResponse } from '~/types/responses';

export type CompanyTimesheetState = {
  companyTimesheetList: GetCompanyTimesheetResponse['data'];
  loadingCompanyTimesheetList: boolean;
  updatingTimesheetStatusAsApprovedLoading: boolean;
  updatingTimesheetStatusAsRejectedLoading: boolean;
  companyTimesheet: CompanyTimesheetById | null;
  loadingCompanyTimesheet: boolean;
  timesheetModalVisibility: boolean;
  selectedTimesheetId: number | null;
};
