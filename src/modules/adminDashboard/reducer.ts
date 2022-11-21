import { createReducer } from 'deox';
import produce from 'immer';

import {
  closeDashBoardTask,
  createAdminDashboardTask,
  deleteDashBoardTask,
  getAdminDashboardPaymentReports,
  getAdminDashboardScoreboard,
  getAdminDashboardScoreboardBillings,
  getAdminDashboardTaskById,
  getAdminDashboardTasks,
  getScoreboardDetails,
  resetErrors,
  sendResume,
  setDashboardBillingRange,
  setDashboardBillingRangeName,
  setDashboardTaskEdit,
  setDashboardTaskId,
  setDashboardTaskPriorityName,
  setDashboardTasksPriority,
  setScoreboardItem,
  setSelectedMonth,
  setSelectedYear,
  updateAdminDashboardTask,
  updateDashBoardTaskPriority,
} from './actions';
import { AdminDashboardState } from './types';

const initialState: AdminDashboardState = {
  dashboardTasks: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  loadingDashboardTasks: false,
  dashboardPaymentReports: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  loadingDashboardPaymentReports: false,
  creatingDashboardTask: false,
  createdDashboardTask: null,
  createdDashboardTaskErrors: null,
  dashboardTaskPriority: '',
  dashboardTaskPriorityName: { label: 'All tasks', value: 0 },
  dashboardBillingRange: '',
  dashboardBillingRangeName: { label: 'All billed', value: 0 },
  loadingDashboardTaskById: false,
  dashboardTask: null,
  editMode: false,
  updatingDashboardTask: false,
  taskId: 0,
  deletingDashboardTask: false,
  closingDashboardTask: false,
  updatingDashboardTaskPriority: false,
  loadingScoreboard: false,
  dashboardScoreboard: null,
  loadingScoreboardBillings: false,
  dashboardScoreboardBillings: null,
  loadingSendResume: false,
  createdResume: null,
  updatedDashboardTaskErrors: null,
  createResumeErrors: null,
  selectedYear: new Date().getFullYear(),
  selectedMonth: 0,
  scoreboardDetails: {
    count: 0,
    results: [],
    next: null,
    previous: null,
  },
  loadingScoreboardDetails: false,
  scoreboardItem: 0,
};

export const adminDashboardReducer = createReducer(initialState, handle => [
  handle(getAdminDashboardTasks.init, (state, { payload }) =>
    produce(state, draft => {
      if (payload.initialFetch) {
        Object.assign(draft.dashboardTasks, initialState.dashboardTasks);
      }
    }),
  ),
  handle(getAdminDashboardTasks.request, state =>
    produce(state, draft => {
      draft.loadingDashboardTasks = true;
    }),
  ),
  handle(getAdminDashboardTasks.success, (state, { payload }) =>
    produce(state, draft => {
      draft.dashboardTasks = {
        ...payload.data,
        results: draft.dashboardTasks.results.concat(payload.data.results),
      };
      draft.loadingDashboardTasks = false;
    }),
  ),
  handle(getAdminDashboardTasks.fail, state =>
    produce(state, draft => {
      draft.loadingDashboardTasks = false;
    }),
  ),

  handle(getAdminDashboardPaymentReports.init, (state, { payload }) =>
    produce(state, draft => {
      if (payload.initialFetch) {
        Object.assign(draft.dashboardPaymentReports, initialState.dashboardPaymentReports);
      }
    }),
  ),
  handle(getAdminDashboardPaymentReports.request, state =>
    produce(state, draft => {
      draft.loadingDashboardPaymentReports = true;
    }),
  ),
  handle(getAdminDashboardPaymentReports.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingDashboardPaymentReports = false;
      draft.dashboardPaymentReports = {
        ...payload.data,
        results: draft.dashboardPaymentReports.results.concat(payload.data.results),
      };
    }),
  ),
  handle(getAdminDashboardPaymentReports.fail, state =>
    produce(state, draft => {
      draft.loadingDashboardPaymentReports = false;
    }),
  ),

  handle(createAdminDashboardTask.request, state =>
    produce(state, draft => {
      draft.creatingDashboardTask = true;
    }),
  ),
  handle(createAdminDashboardTask.success, (state, { payload }) =>
    produce(state, draft => {
      draft.creatingDashboardTask = false;
      draft.createdDashboardTask = payload.data;
      if (!draft.dashboardTaskPriority) {
        draft.dashboardTasks.results = [...draft.dashboardTasks.results, payload.data];
      } else if (draft.dashboardTaskPriorityName.value === payload.data.priority) {
        draft.dashboardTasks.results = [...draft.dashboardTasks.results, payload.data];
      }
    }),
  ),
  handle(createAdminDashboardTask.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.creatingDashboardTask = false;
      draft.createdDashboardTaskErrors = payload;
    }),
  ),

  handle(setDashboardTasksPriority, (state, { payload }) =>
    produce(state, draft => {
      draft.dashboardTaskPriority = payload.priority;
    }),
  ),

  handle(setDashboardTaskPriorityName, (state, { payload }) =>
    produce(state, draft => {
      draft.dashboardTaskPriorityName = {
        ...draft.dashboardTaskPriorityName,
        label: payload.dashboardTaskPriorityName.label,
        value: payload.dashboardTaskPriorityName.value,
      };
    }),
  ),

  handle(setDashboardBillingRange, (state, { payload }) =>
    produce(state, draft => {
      draft.dashboardBillingRange = payload.externalStatus;
    }),
  ),

  handle(setDashboardBillingRangeName, (state, { payload }) =>
    produce(state, draft => {
      draft.dashboardBillingRangeName = {
        ...draft.dashboardBillingRangeName,
        label: payload.dashboardBillingRangeName.label,
        value: payload.dashboardBillingRangeName.value,
      };
    }),
  ),

  handle(getAdminDashboardTaskById.request, state =>
    produce(state, draft => {
      draft.loadingDashboardTaskById = true;
    }),
  ),
  handle(getAdminDashboardTaskById.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingDashboardTaskById = false;
      draft.dashboardTask = payload.data;
    }),
  ),
  handle(getAdminDashboardTaskById.fail, state =>
    produce(state, draft => {
      draft.loadingDashboardTaskById = false;
    }),
  ),

  handle(setDashboardTaskEdit, (state, { payload }) =>
    produce(state, draft => {
      draft.editMode = payload.editMode;
    }),
  ),

  handle(setDashboardTaskId, (state, { payload }) =>
    produce(state, draft => {
      draft.taskId = payload.taskId;
    }),
  ),

  handle(updateAdminDashboardTask.request, state =>
    produce(state, draft => {
      draft.updatingDashboardTask = true;
    }),
  ),
  handle(updateAdminDashboardTask.success, (state, { payload }) =>
    produce(state, draft => {
      draft.updatingDashboardTask = false;
      const updatedTaskFromResponse = draft.dashboardTasks.results.findIndex(
        x => x.id === payload?.data?.id,
      );
      draft.dashboardTasks.results[updatedTaskFromResponse] = payload?.data;
    }),
  ),
  handle(updateAdminDashboardTask.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.updatingDashboardTask = false;
      draft.updatedDashboardTaskErrors = payload;
    }),
  ),

  handle(updateDashBoardTaskPriority.request, state =>
    produce(state, draft => {
      draft.updatingDashboardTaskPriority = true;
    }),
  ),
  handle(updateDashBoardTaskPriority.success, (state, { payload }) =>
    produce(state, draft => {
      draft.updatingDashboardTaskPriority = false;
      const updatedTaskFromResponse = draft.dashboardTasks.results.findIndex(
        x => x.id === payload?.data?.id,
      );
      if (!draft.dashboardTaskPriority) {
        draft.dashboardTasks.results[updatedTaskFromResponse] = payload.data;
      } else if (draft.dashboardTaskPriorityName.value !== payload.data.priority) {
        draft.dashboardTasks.results = [
          ...draft.dashboardTasks.results.filter(item => item.id !== draft.taskId),
        ];
      }
    }),
  ),
  handle(updateDashBoardTaskPriority.fail, state =>
    produce(state, draft => {
      draft.updatingDashboardTaskPriority = false;
    }),
  ),

  handle(deleteDashBoardTask.request, state =>
    produce(state, draft => {
      draft.deletingDashboardTask = true;
    }),
  ),
  handle(deleteDashBoardTask.success, state =>
    produce(state, draft => {
      draft.deletingDashboardTask = false;
      draft.dashboardTasks.results = [
        ...draft.dashboardTasks.results.filter(item => item.id !== draft.taskId),
      ];
    }),
  ),
  handle(deleteDashBoardTask.fail, state =>
    produce(state, draft => {
      draft.deletingDashboardTask = false;
    }),
  ),

  handle(closeDashBoardTask.request, state =>
    produce(state, draft => {
      draft.closingDashboardTask = true;
    }),
  ),
  handle(closeDashBoardTask.success, (state, { payload }) =>
    produce(state, draft => {
      draft.closingDashboardTask = false;
      const updatedTaskFromResponse = draft.dashboardTasks.results.findIndex(
        x => x.id === payload?.data?.id,
      );
      draft.dashboardTasks.results[updatedTaskFromResponse] = payload.data;
      if (draft.dashboardTaskPriorityName) {
        draft.dashboardTasks.results = [
          ...draft.dashboardTasks.results.filter(item => item.id !== draft.taskId),
        ];
      }
    }),
  ),
  handle(closeDashBoardTask.fail, state =>
    produce(state, draft => {
      draft.closingDashboardTask = false;
    }),
  ),

  handle(getAdminDashboardScoreboard.request, state =>
    produce(state, draft => {
      draft.loadingScoreboard = true;
    }),
  ),
  handle(getAdminDashboardScoreboard.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingScoreboard = false;
      draft.dashboardScoreboard = payload.data;
    }),
  ),
  handle(getAdminDashboardScoreboard.fail, state =>
    produce(state, draft => {
      draft.loadingScoreboard = false;
    }),
  ),

  handle(getAdminDashboardScoreboardBillings.request, state =>
    produce(state, draft => {
      draft.loadingScoreboardBillings = true;
    }),
  ),
  handle(getAdminDashboardScoreboardBillings.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingScoreboardBillings = false;
      draft.dashboardScoreboardBillings = payload.data;
    }),
  ),
  handle(getAdminDashboardScoreboardBillings.fail, state =>
    produce(state, draft => {
      draft.loadingScoreboardBillings = false;
    }),
  ),

  handle(sendResume.request, state =>
    produce(state, draft => {
      draft.loadingSendResume = true;
    }),
  ),
  handle(sendResume.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingSendResume = false;
      draft.createdResume = payload.data;
    }),
  ),
  handle(sendResume.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingSendResume = false;
      draft.createResumeErrors = payload;
    }),
  ),
  handle(resetErrors, state =>
    produce(state, draft => {
      draft.createResumeErrors = null;
    }),
  ),
  handle(setSelectedMonth, (state, { payload }) =>
    produce(state, draft => {
      draft.selectedMonth = payload;
      draft.selectedYear = new Date().getFullYear();
    }),
  ),
  handle(setSelectedYear, (state, { payload }) =>
    produce(state, draft => {
      draft.selectedYear = payload;
      draft.selectedMonth = 0;
    }),
  ),
  handle(getScoreboardDetails.init, (state, { payload }) =>
    produce(state, draft => {
      if (payload.initialFetch) {
        Object.assign(draft.scoreboardDetails, initialState.scoreboardDetails);
      }
    }),
  ),
  handle(getScoreboardDetails.request, state =>
    produce(state, draft => {
      draft.loadingScoreboardDetails = true;
    }),
  ),
  handle(getScoreboardDetails.success, (state, { payload }) =>
    produce(state, draft => {
      draft.scoreboardDetails = {
        ...payload.data,
        results: [...draft.scoreboardDetails.results, ...payload.data.results] as any,
      };
      draft.loadingScoreboardDetails = false;
    }),
  ),
  handle(getScoreboardDetails.fail, state =>
    produce(state, draft => {
      draft.loadingScoreboardDetails = false;
    }),
  ),
  handle(setScoreboardItem, (state, { payload }) =>
    produce(state, draft => {
      draft.scoreboardItem = payload;
    }),
  ),
]);
