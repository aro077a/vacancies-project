import {
  ErrorResponse,
  GetAdminJobsResponse,
  GetAdminPositionsListResponse,
  GetAdminRegionsResponse,
  GetListOfAdminsResponse,
  InviteAdminResponse,
} from '~/types/responses';

export type ManageAdminsState = {
  listOfAdmins: GetListOfAdminsResponse['data'];
  loadingListOfAdmins: boolean;
  inviteAdminLoading: boolean;
  inviteAdminErrors: ErrorResponse['detail'] | null;
  invitedAdmin: InviteAdminResponse['data'] | null;
  adminPositionsList: GetAdminPositionsListResponse['data'];
  loadingAdminPositionsList: boolean;
  adminRegions: GetAdminRegionsResponse['data'];
  loadingAdminRegions: boolean;
  loadingAssignCompaniesAndRegions: boolean;
  adminId: number;
  adminJobs: GetAdminJobsResponse['data'];
  loadingAdminJobs: boolean;
  jobId: number;
  assignJobToAdminLoading: boolean;
  assignJobToAdminErrors: ErrorResponse['detail'] | null;
  deleteAdminLoading: boolean;
};
