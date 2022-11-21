import { DashboardTasks, PriorityItemsType, Scoreboard } from '~/models/admin';
import {
  CreateDashboardTaskResponse,
  ErrorResponse,
  GetAdminDashboardBillingsResponse,
  GetAdminDashboardPaymentReportsResponse,
  GetAdminDashboardScoreboardResponse,
  GetAdminDashboardTasksResponse,
  GetScoreboardDetailsResponse,
  SendResumeResponse,
} from '~/types/responses';

export type AdminDashboardState = {
  dashboardTasks: GetAdminDashboardTasksResponse['data'];
  loadingDashboardTasks: boolean;
  dashboardPaymentReports: GetAdminDashboardPaymentReportsResponse['data'];
  loadingDashboardPaymentReports: boolean;
  creatingDashboardTask: boolean;
  createdDashboardTask: CreateDashboardTaskResponse['data'] | null;
  createdDashboardTaskErrors: ErrorResponse['detail'] | null;
  dashboardTaskPriority: string;
  dashboardTaskPriorityName: PriorityItemsType;
  dashboardBillingRange: string;
  dashboardBillingRangeName: PriorityItemsType;
  loadingDashboardTaskById: boolean;
  dashboardTask: DashboardTasks | null;
  editMode: boolean;
  updatingDashboardTask: boolean;
  taskId: number | undefined;
  deletingDashboardTask: boolean;
  closingDashboardTask: boolean;
  updatingDashboardTaskPriority: boolean;
  loadingScoreboard: boolean;
  dashboardScoreboard: GetAdminDashboardScoreboardResponse['data'] | null;
  loadingScoreboardBillings: boolean;
  dashboardScoreboardBillings: GetAdminDashboardBillingsResponse['data'] | null;
  loadingSendResume: boolean;
  createdResume: SendResumeResponse['data'] | null;
  updatedDashboardTaskErrors: ErrorResponse['detail'] | null;
  createResumeErrors: ErrorResponse['detail'] | null;
  selectedYear: number | string;
  selectedMonth: number | string;
  loadingScoreboardDetails: boolean;
  scoreboardDetails: GetScoreboardDetailsResponse['data'];
  scoreboardItem: Scoreboard;
};
