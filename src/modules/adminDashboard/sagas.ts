import { format } from 'date-fns';
import { ActionType, getType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { call, put, select, takeLatest } from 'typed-redux-saga';

import { Scoreboard } from '~/models/admin';
import { Admin } from '~/services/api/Admin';
import { RootState } from '~/store/types';
import { CreateTaskFormValues } from '~/types/formValues';
import {
  GetAdminDashboardPaymentReportsRequestParams,
  GetAdminDashboardScoreboardBillingsRequestParams,
  GetAdminDashboardScoreboardRequestParams,
  GetAdminDashboardTasksRequestParams,
  GetScoreboardDetailsRequestBody,
} from '~/types/requests';
import { getErrorDetailsFromResponse } from '~/utils/errors';

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
  sendResume,
  setDashboardBillingRange,
  setDashboardTasksPriority,
  updateAdminDashboardTask,
  updateDashBoardTaskPriority,
} from './actions';

function* getAdminDashboardTasksSaga({
  payload,
}: ActionType<typeof getAdminDashboardTasks.init>): SagaIterator {
  try {
    const { dashboardTasks, dashboardTaskPriority } = yield* select(
      (state: RootState) => state.adminDashboard,
    );
    if (payload.initialFetch || dashboardTasks.count > dashboardTasks.results.length) {
      yield* put(getAdminDashboardTasks.request());
      const requestParams: GetAdminDashboardTasksRequestParams = {
        offset: dashboardTasks.results.length,
        limit: 12,
      };

      if (dashboardTaskPriority) {
        requestParams.priority = dashboardTaskPriority;
      }

      const { data } = yield* call(Admin.getDashboardTasks, requestParams);

      yield* put(getAdminDashboardTasks.success(data));
    }
  } catch (error) {
    yield* put(getAdminDashboardTasks.fail());
  }
}

function* getDashboardTasksByPrioritySaga(): SagaIterator {
  yield* put(getAdminDashboardTasks.init({ initialFetch: true }));
}

function* getAdminDashboardPaymentReportsSaga({
  payload,
}: ActionType<typeof getAdminDashboardPaymentReports.init>): SagaIterator {
  try {
    const { dashboardPaymentReports, dashboardBillingRange } = yield* select(
      (state: RootState) => state.adminDashboard,
    );
    if (
      payload.initialFetch ||
      dashboardPaymentReports.count > dashboardPaymentReports.results.length
    ) {
      yield* put(getAdminDashboardTasks.request());

      const requestParams: GetAdminDashboardPaymentReportsRequestParams = {
        offset: dashboardPaymentReports.results.length,
        limit: 12,
      };
      if (dashboardBillingRange) {
        requestParams.externalStatus = dashboardBillingRange;
      }
      const { data } = yield* call(Admin.getDashboardPaymentReports, requestParams);

      yield* put(getAdminDashboardPaymentReports.success(data));
    }
  } catch (error) {
    yield* put(getAdminDashboardPaymentReports.fail());
  }
}

function* getDashboardBillingRangeSaga(): SagaIterator {
  yield* put(getAdminDashboardPaymentReports.init({ initialFetch: true }));
}

function* createDashboardTaskSaga({
  payload,
}: ActionType<typeof createAdminDashboardTask.request>): SagaIterator {
  try {
    const { formValues } = payload;
    const requestBody: CreateTaskFormValues = {
      ...formValues,
      dueDate: format(new Date(formValues.dueDate), 'yyyy-MM-dd'),
    };
    const { data } = yield* call(Admin.createDashboardTask, requestBody);

    yield* put(createAdminDashboardTask.success(data));
    payload.onSuccess();
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(createAdminDashboardTask.fail(errorDetails));
  }
}

function* getDashboardTaskByIdSaga({
  payload,
}: ActionType<typeof getAdminDashboardTaskById.request>): SagaIterator {
  try {
    const { data } = yield* call(Admin.getDashboardTaskById, { id: payload.id!.toString() });

    yield* put(getAdminDashboardTaskById.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getAdminDashboardTaskById.fail(errorDetails));
  }
}

function* updateDashboardTaskSaga({
  payload,
}: ActionType<typeof updateAdminDashboardTask.request>): SagaIterator {
  try {
    const { formValues, onSuccess } = payload;

    const requestBody: CreateTaskFormValues = {
      ...formValues,
      dueDate: format(new Date(formValues.dueDate), 'yyyy-MM-dd'),
    };
    const { data } = yield* call(Admin.updateDashboardTask, payload.taskId, requestBody);

    yield* put(updateAdminDashboardTask.success(data));
    onSuccess();
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(updateAdminDashboardTask.fail(errorDetails));
  }
}

function* updateDashboardTaskPrioritySaga({
  payload,
}: ActionType<typeof updateDashBoardTaskPriority.request>): SagaIterator {
  try {
    const { taskId, priority } = payload;

    const { data } = yield* call(Admin.closeDashboardTask, taskId, priority);

    yield* put(updateDashBoardTaskPriority.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(updateDashBoardTaskPriority.fail(errorDetails));
  }
}

function* deleteDashboardTaskSaga({
  payload,
}: ActionType<typeof deleteDashBoardTask.request>): SagaIterator {
  try {
    const { taskId } = payload;

    yield* call(Admin.deleteDashboardTask, taskId);

    yield* put(deleteDashBoardTask.success());
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(deleteDashBoardTask.fail(errorDetails));
  }
}

function* closeDashboardTaskSaga({
  payload,
}: ActionType<typeof closeDashBoardTask.request>): SagaIterator {
  try {
    const { taskId, priority } = payload;

    const { data } = yield* call(Admin.closeDashboardTask, taskId, priority);

    yield* put(closeDashBoardTask.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(closeDashBoardTask.fail(errorDetails));
  }
}

function* getAdminDashboardScoreboardSaga({
  payload,
}: ActionType<typeof getAdminDashboardScoreboard.request>): SagaIterator {
  try {
    const { date } = payload;

    const requestParams: GetAdminDashboardScoreboardRequestParams = {
      offset: 0,
      limit: 12,
    };

    if (date.month) {
      requestParams.month = date.month;
    }
    if (date.year) {
      requestParams.year = date.year;
    }

    const { data } = yield* call(Admin.getDashboardScoreboardRequest, requestParams);

    yield* put(getAdminDashboardScoreboard.success(data));
  } catch (error) {
    yield* put(getAdminDashboardScoreboard.fail());
  }
}

function* getAdminDashboardScoreboardBillingsSaga(): SagaIterator {
  try {
    const requestParams: GetAdminDashboardScoreboardBillingsRequestParams = {
      offset: 0,
      limit: 12,
    };

    const { data } = yield* call(Admin.getDashboardScoreboardBillingsRequest, requestParams);

    yield* put(getAdminDashboardScoreboardBillings.success(data));
  } catch (error) {
    yield* put(getAdminDashboardScoreboardBillings.fail());
  }
}

function* sendResumeSaga({ payload }: ActionType<typeof sendResume.request>): SagaIterator {
  try {
    const { formValues, onSuccess } = payload;

    const { data } = yield* call(Admin.sendResumeRequest, {
      ...formValues,
      candidate: formValues?.candidate?.value,
      jobPosition: formValues?.jobPosition?.value,
    });

    yield* put(sendResume.success(data));
    onSuccess();
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(sendResume.fail(errorDetails));
  }
}

function* getScoreboardDetailsSaga({
  payload,
}: ActionType<typeof getScoreboardDetails.init>): SagaIterator {
  try {
    const { results, count } = yield* select(
      (state: RootState) => state.adminDashboard.scoreboardDetails,
    );

    const { scoreboardItem, selectedMonth, selectedYear } = yield* select(
      (state: RootState) => state.adminDashboard,
    );

    if (payload.initialFetch || count > results.length) {
      yield* put(getScoreboardDetails.request());

      const requestBody: GetScoreboardDetailsRequestBody = {
        limit: 10,
        offset: results.length,
      };

      if (selectedMonth) {
        const monthNumber = new Date(Date.parse(`${selectedMonth}, 2022`)).getMonth() + 1;

        requestBody.month = monthNumber;
      } else {
        requestBody.year = selectedYear;
      }

      switch (scoreboardItem) {
        case Scoreboard.Jobs: {
          const { data } = yield* call(Admin.getScoreboardJobs, requestBody);
          yield* put(getScoreboardDetails.success(data));
          break;
        }
        case Scoreboard.Interviews: {
          const { data } = yield* call(Admin.getScoreboardInterviews, requestBody);
          yield* put(getScoreboardDetails.success(data));
          break;
        }
        case Scoreboard.Placements: {
          const { data } = yield* call(Admin.getScoreboardPlacements, requestBody);
          yield* put(getScoreboardDetails.success(data));
          break;
        }
        case Scoreboard.Revenues: {
          const { data } = yield* call(Admin.getScoreboardRevenues, requestBody);
          yield* put(getScoreboardDetails.success(data));
          break;
        }
        case Scoreboard.TempWorks: {
          const { data } = yield* call(Admin.getScoreboardTempWorks, requestBody);
          yield* put(getScoreboardDetails.success(data));
          break;
        }
        default:
          break;
      }
    }
  } catch (error) {
    yield* put(getScoreboardDetails.fail);
  }
}

export function* watchAdminDashboard(): SagaIterator {
  yield* takeLatest(getType(getAdminDashboardTasks.init), getAdminDashboardTasksSaga);
  yield* takeLatest(
    getType(getAdminDashboardPaymentReports.init),
    getAdminDashboardPaymentReportsSaga,
  );
  yield* takeLatest(getType(createAdminDashboardTask.request), createDashboardTaskSaga);
  yield* takeLatest(getType(setDashboardTasksPriority), getDashboardTasksByPrioritySaga);
  yield* takeLatest(getType(setDashboardBillingRange), getDashboardBillingRangeSaga);
  yield* takeLatest(getType(getAdminDashboardTaskById.request), getDashboardTaskByIdSaga);
  yield* takeLatest(getType(updateAdminDashboardTask.request), updateDashboardTaskSaga);
  yield* takeLatest(getType(updateDashBoardTaskPriority.request), updateDashboardTaskPrioritySaga);
  yield* takeLatest(getType(deleteDashBoardTask.request), deleteDashboardTaskSaga);
  yield* takeLatest(getType(closeDashBoardTask.request), closeDashboardTaskSaga);
  yield* takeLatest(getType(getAdminDashboardScoreboard.request), getAdminDashboardScoreboardSaga);
  yield* takeLatest(
    getType(getAdminDashboardScoreboardBillings.request),
    getAdminDashboardScoreboardBillingsSaga,
  );
  yield* takeLatest(getType(sendResume.request), sendResumeSaga);
  yield* takeLatest(getType(getScoreboardDetails.init), getScoreboardDetailsSaga);
}
