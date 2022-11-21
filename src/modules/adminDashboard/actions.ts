import { createAction } from 'deox';

import { PriorityItemsType, Scoreboard } from '~/models/admin';
import { CreateTaskFormValues, SendResumeFormValues } from '~/types/formValues';
import {
  CreateDashboardTaskResponse,
  ErrorResponse,
  GetAdminDashboardBillingsResponse,
  GetAdminDashboardPaymentReportsResponse,
  GetAdminDashboardScoreboardResponse,
  GetAdminDashboardTasksResponse,
  GetDashboardTaskByIdResponse,
  GetScoreboardDetailsResponse,
  SendResumeResponse,
  UpdateDashboardTaskResponse,
} from '~/types/responses';

export const getAdminDashboardTasks = {
  init: createAction(
    'adminDashboard/GET_ADMIN_DASHBOARD_TASKS_REQUEST',
    resolve => (payload: { initialFetch: boolean; priority?: string }) => resolve(payload),
  ),
  request: createAction('adminDashboard/GET_ADMIN_DASHBOARD_TASKS'),
  success: createAction(
    'adminDashboard/GET_ADMIN_DASHBOARD_TASKS_SUCCESS',
    resolve => (payload: GetAdminDashboardTasksResponse) => resolve(payload),
  ),
  fail: createAction('adminDashboard/GET_ADMIN_DASHBOARD_TASKS_FAIL'),
};

export const getAdminDashboardPaymentReports = {
  init: createAction(
    'adminDashboard/GET_ADMIN_DASHBOARD_PAYMENT_REPORTS_REQUEST',
    resolve => (payload: { initialFetch: boolean }) => resolve(payload),
  ),
  request: createAction('adminDashboard/GET_ADMIN_DASHBOARD_PAYMENT_REPORTS'),
  success: createAction(
    'adminDashboard/GET_ADMIN_DASHBOARD_PAYMENT_REPORTS_SUCCESS',
    resolve => (payload: GetAdminDashboardPaymentReportsResponse) => resolve(payload),
  ),
  fail: createAction('adminDashboard/GET_ADMIN_DASHBOARD_PAYMENT_REPORTS_FAIL'),
};

export const createAdminDashboardTask = {
  request: createAction(
    'adminDashboard/ADD_DASHBOARD_TASK',
    resolve => (payload: { formValues: CreateTaskFormValues; onSuccess: () => void }) =>
      resolve(payload),
  ),
  success: createAction(
    'adminDashboard/ADD_DASHBOARD_TASK_SUCCESS',
    resolve => (payload: CreateDashboardTaskResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminDashboard/ADD_DASHBOARD_TASK_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setDashboardTasksPriority = createAction(
  'adminDashboard/SET_DASHBOARD_PRIORITY',
  resolve => (payload: { priority: string }) => resolve(payload),
);

export const setDashboardTaskPriorityName = createAction(
  'adminDashboard/SET_DASHBOARD_TASK_PRIORITY_NAME',
  resolve => (payload: { dashboardTaskPriorityName: PriorityItemsType }) => resolve(payload),
);

export const setDashboardBillingRange = createAction(
  'adminDashboard/SET_DASHBOARD_BILLING_RANGE',
  resolve => (payload: { externalStatus: string }) => resolve(payload),
);

export const setDashboardBillingRangeName = createAction(
  'adminDashboard/SET_DASHBOARD_BILLING_RANGE_NAME',
  resolve => (payload: { dashboardBillingRangeName: PriorityItemsType }) => resolve(payload),
);

export const getAdminDashboardTaskById = {
  request: createAction(
    'adminDashboard/GET_DASHBOARD_TASK_BY_ID',
    resolve => (payload: { id: number }) => resolve(payload),
  ),
  success: createAction(
    'adminDashboard/GET_DASHBOARD_TASK_BY_ID_SUCCESS',
    resolve => (payload: GetDashboardTaskByIdResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminDashboard/GET_DASHBOARD_TASK_BY_ID_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const updateAdminDashboardTask = {
  request: createAction(
    'adminDashboard/UPDATE_DASHBOARD_TASK',
    resolve =>
      (payload: { formValues: CreateTaskFormValues; taskId: number; onSuccess: () => void }) =>
        resolve(payload),
  ),
  success: createAction(
    'adminDashboard/UPDATE_DASHBOARD_TASK_SUCCESS',
    resolve => (payload: GetDashboardTaskByIdResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminDashboard/UPDATE_DASHBOARD_TASK_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setDashboardTaskEdit = createAction(
  'adminDashboard/SET_DASHBOARD_TASK_FOR_EDIT',
  resolve => (payload: { editMode: boolean }) => resolve(payload),
);

export const setDashboardTaskId = createAction(
  'adminDashboard/SET_DASHBOARD_TASK_ID',
  resolve => (payload: { taskId?: number }) => resolve(payload),
);

export const closeDashBoardTask = {
  request: createAction(
    'adminDashboard/CLOSE_DASHBOARD_TASK',
    resolve => (payload: { taskId: number; priority: { priority: number } }) => resolve(payload),
  ),
  success: createAction(
    'adminDashboard/CLOSE_DASHBOARD_TASK_SUCCESS',
    resolve => (payload: GetDashboardTaskByIdResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminDashboard/CLOSE_DASHBOARD_TASK_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const deleteDashBoardTask = {
  request: createAction(
    'adminDashboard/DELETE_DASHBOARD_TASK',
    resolve => (payload: { taskId: number }) => resolve(payload),
  ),
  success: createAction('adminDashboard/DELETE_DASHBOARD_TASK_SUCCESS'),
  fail: createAction(
    'adminDashboard/DELETE_DASHBOARD_TASK_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const updateDashBoardTaskPriority = {
  request: createAction(
    'adminDashboard/UPDATE_DASHBOARD_TASK_PRIORITY',
    resolve => (payload: { taskId: number; priority: { priority: number } }) => resolve(payload),
  ),
  success: createAction(
    'adminDashboard/UPDATE_DASHBOARD_TASK_PRIORITY_SUCCESS',
    resolve => (payload: UpdateDashboardTaskResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminDashboard/UPDATE_DASHBOARD_TASK_PRIORITY_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getAdminDashboardScoreboard = {
  request: createAction(
    'adminDashboard/GET_ADMIN_DASHBOARD_SCOREBOARD',
    resolve => (payload: { date: { month?: number; year?: number } }) => resolve(payload),
  ),
  success: createAction(
    'adminDashboard/GET_ADMIN_DASHBOARD_SCOREBOARD_SUCCESS',
    resolve => (payload: GetAdminDashboardScoreboardResponse) => resolve(payload),
  ),
  fail: createAction('adminDashboard/GET_ADMIN_DASHBOARD_SCOREBOARD_FAIL'),
};

export const getAdminDashboardScoreboardBillings = {
  request: createAction('adminDashboard/GET_ADMIN_DASHBOARD_SCOREBOARD_BILLINGS'),
  success: createAction(
    'adminDashboard/GET_ADMIN_DASHBOARD_SCOREBOARD_BILLINGS_SUCCESS',
    resolve => (payload: GetAdminDashboardBillingsResponse) => resolve(payload),
  ),
  fail: createAction('adminDashboard/GET_ADMIN_DASHBOARD_SCOREBOARD_BILLINGS_FAIL'),
};

export const sendResume = {
  request: createAction(
    'adminDashboard/SEND_RESUME',
    resolve =>
      (payload: {
        formValues: Omit<SendResumeFormValues, 'companies'> & {
          companies: { id?: number; hiringManagers: number[] }[];
        };
        onSuccess: () => void;
      }) =>
        resolve(payload),
  ),
  success: createAction(
    'adminDashboard/SEND_RESUME_SUCCESS',
    resolve => (payload: SendResumeResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminDashboard/SEND_RESUME_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const resetErrors = createAction('adminDashboard/RESET_ERRORS');

export const setSelectedYear = createAction(
  'adminDashboard/SET_SELECTED_YEAR',
  resolve => (payload: number | string) => resolve(payload),
);

export const setSelectedMonth = createAction(
  'adminDashboard/SET_SELECTED_MONTH',
  resolve => (payload: number | string) => resolve(payload),
);

export const getScoreboardDetails = {
  init: createAction(
    'adminDashboard/GET_SCOREBOARD_DETAILS_INIT',
    resolve => (payload: { initialFetch: boolean }) => resolve(payload),
  ),
  request: createAction('adminDashboard/GET_SCOREBOARD_DETAILS'),
  success: createAction(
    'adminDashboard/GET_SCOREBOARD_DETAILS_SUCCESS',
    resolve => (payload: GetScoreboardDetailsResponse) => resolve(payload),
  ),
  fail: createAction('adminDashboard/GET_SCOREBOARD_DETAILS_FAIL'),
};

export const setScoreboardItem = createAction(
  'adminDashboard/SET_SCOREBOARD_ITEM',
  resolve => (payload: Scoreboard) => resolve(payload),
);
