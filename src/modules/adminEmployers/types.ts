import { EmployerDetailsProps, Employers, EmployerStatus } from '~/models/admin';
import { CreateEmployerBusinessFormValues, CreateEmployerFormValues } from '~/types/formValues';
import { ErrorResponse, GetEmployersResponse } from '~/types/responses';

export type EmployersState = {
  loadingEmployers: boolean;
  errors: ErrorResponse['detail'] | null;
  activeStep: 1 | 2 | 3;
  statusId: EmployerStatus;
  searchText: string;
  createdEmployerId: number | null;
  updateEmployerStatusLoading: boolean;
  employerDetails: EmployerDetailsProps | null;
  createFormValues: CreateEmployerFormValues | null;
  createBusinessFormValues: CreateEmployerBusinessFormValues | null;
  selectedEmployer: Employers | null;
  selectedCompany: Employers | null;
  employers: GetEmployersResponse['data'];
  gettingPendingEmployers: boolean;
  pendingApprovalCount: number;
  employerModalVisibility: boolean;
  employerId: number;
  deletingEmployer: boolean;
  loadingEmployerDetails: boolean;
  createEmployerLoading: boolean;
};
