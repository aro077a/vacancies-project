import { ActionType, getType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { call, put, select, takeLatest } from 'typed-redux-saga';

import { Company } from '~/services/api/Company';
import { RootState } from '~/store/types';
import { GetCompanyTimesheetRequestParams } from '~/types/requests';
import { getErrorDetailsFromResponse } from '~/utils/errors';

import {
  getCompanyTimesheet,
  getTimesheetById,
  setSelectedTimesheetId,
  updateTimesheetStatus,
} from './actions';

function* getCompanyTimesheetSaga({
  payload,
}: ActionType<typeof getCompanyTimesheet.init>): SagaIterator {
  try {
    const { companyTimesheetList } = yield* select((state: RootState) => state.companyTimesheet);
    if (payload.initialFetch || companyTimesheetList.count > companyTimesheetList.results.length) {
      yield* put(getCompanyTimesheet.request());

      const requestParams: GetCompanyTimesheetRequestParams = {
        offset: companyTimesheetList.results.length,
        limit: 12,
      };

      const { data } = yield* call(Company.getCompanyTimesheet, requestParams);

      yield* put(getCompanyTimesheet.success(data));
    }
  } catch (error) {
    yield* put(getCompanyTimesheet.fail());
  }
}

function* updateTimesheetStatusSaga({
  payload,
}: ActionType<typeof updateTimesheetStatus.request>): SagaIterator {
  try {
    const { data } = yield* call(
      Company.updateTimesheetStatus,
      { id: payload.timesheetId! },
      { status: payload.status },
    );

    yield* put(updateTimesheetStatus.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(updateTimesheetStatus.fail(errorDetails));
  }
}

function* getCompanyTimesheetByIdSaga(): SagaIterator {
  try {
    const timesheetId = yield* select(
      (state: RootState) => state.companyTimesheet.selectedTimesheetId,
    );
    const { data } = yield* call(Company.getCompanyTimesheetById, { id: timesheetId! });

    yield* put(getTimesheetById.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getTimesheetById.fail(errorDetails));
  }
}

function* setSelectedTimesheetSaga({
  payload,
}: ActionType<typeof setSelectedTimesheetId>): SagaIterator {
  if (payload !== null) {
    yield* put(getTimesheetById.request());
  }
}

export function* watchCompanyTimesheet(): SagaIterator {
  yield* takeLatest(getType(getCompanyTimesheet.init), getCompanyTimesheetSaga);
  yield* takeLatest(getType(updateTimesheetStatus.request), updateTimesheetStatusSaga);
  yield* takeLatest(getType(getTimesheetById.request), getCompanyTimesheetByIdSaga);
  yield* takeLatest(getType(setSelectedTimesheetId), setSelectedTimesheetSaga);
}
