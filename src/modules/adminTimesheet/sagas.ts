import { ActionType, getType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { call, put, select, takeLatest } from 'typed-redux-saga';

import { MatchedJobSteps } from '~/models/common';
import { Admin } from '~/services/api/Admin';
import { RootState } from '~/store/types';
import { CreateEntryFormValues } from '~/types/formValues';
import {
  GetAdminTimesheetRequestParams,
  GetTimesheetPipelineRequestParams,
} from '~/types/requests';
import { getErrorDetailsFromResponse } from '~/utils/errors';
import { dateOrString, getFirstDayOfTheWeek } from '~/utils/helpers';

import {
  createAdminEntry,
  getAdminTimesheet,
  getAdminTimesheetById,
  getCandidatePipeline,
  getCandidatesAndCompaniesWithTimesheet,
  getCandidatesWithTimesheet,
  getCompaniesWithTimesheet,
  setSelectedAdminTimesheetId,
  updateAdminTimesheetStatus,
} from './actions';

function* getAdminTimesheetSaga({
  payload,
}: ActionType<typeof getAdminTimesheet.init>): SagaIterator {
  try {
    const {
      adminTimesheetList,
      searchByCandidate,
      searchByCompany,
      searchByTimesheetStatus,
      searchByWeek,
    } = yield* select((state: RootState) => state.adminTimesheet);
    if (payload.initialFetch || adminTimesheetList.count > adminTimesheetList.results.length) {
      yield* put(getAdminTimesheet.request());

      const requestParams: GetAdminTimesheetRequestParams = {
        offset: adminTimesheetList.results.length,
        limit: 12,
      };

      if (searchByCandidate.value) {
        requestParams.matched__candidate = searchByCandidate.value;
      }

      if (searchByCompany.value) {
        requestParams.matched__job__company = searchByCompany.value;
      }

      if (searchByTimesheetStatus.value) {
        requestParams.status = searchByTimesheetStatus.value;
      }

      if (searchByWeek) {
        requestParams.week = dateOrString(getFirstDayOfTheWeek(searchByWeek).toJSON());
      }

      const { data } = yield* call(Admin.getAdminTimesheet, requestParams);

      yield* put(getAdminTimesheet.success(data));
    }
  } catch (error) {
    yield* put(getAdminTimesheet.fail());
  }
}

function* getAdminTimesheetByIdSaga(): SagaIterator {
  try {
    const timesheetId = yield* select(
      (state: RootState) => state.adminTimesheet.selectedAdminTimesheetId,
    );

    const { data } = yield* call(Admin.getAdminTimesheetByIdRequest, {
      id: timesheetId!,
    });

    yield* put(getAdminTimesheetById.success(data));
  } catch (error) {
    yield* put(getAdminTimesheetById.fail());
  }
}

function* setSelectedAdminTimesheetSaga({
  payload,
}: ActionType<typeof setSelectedAdminTimesheetId>): SagaIterator {
  if (payload !== null) {
    yield* put(getAdminTimesheetById.request());
  }
}

function* updateAdminTimesheetStatusSaga({
  payload,
}: ActionType<typeof updateAdminTimesheetStatus.request>): SagaIterator {
  try {
    const { data } = yield* call(
      Admin.updateAdminTimesheetStatusRequest,
      { id: payload.timesheetId! },
      { status: payload.status },
    );

    yield* put(updateAdminTimesheetStatus.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(updateAdminTimesheetStatus.fail(errorDetails));
  }
}

function* getCandidatesWithTimesheetSaga(): SagaIterator {
  try {
    const { data } = yield* call(Admin.getCandidatesWithTimesheet);
    yield* put(getCandidatesWithTimesheet.success(data));
  } catch (error) {
    yield* put(getCandidatesWithTimesheet.fail());
  }
}

function* getCompaniesWithTimesheetSaga(): SagaIterator {
  try {
    const { data } = yield* call(Admin.getCompaniesWithTimesheet);
    yield* put(getCompaniesWithTimesheet.success(data));
  } catch (error) {
    yield* put(getCompaniesWithTimesheet.fail());
  }
}

function* getCandidatesAndCompaniesWithTimesheetSaga(): SagaIterator {
  yield* call(getCandidatesWithTimesheetSaga);
  yield* call(getCompaniesWithTimesheetSaga);
}

function* createCandidateEntrySaga({
  payload,
}: ActionType<typeof createAdminEntry.request>): SagaIterator {
  try {
    type ItemType = {
      name: string;
      price: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      attachments: any;
    };

    const requestBody: CreateEntryFormValues = {
      ...payload.formValues,
      rows: payload.formValues.rows,
      week: payload.formValues.week,
      matched: payload.formValues.matched,
      additionalExpenses: Object.values(payload.formValues.additionalExpenses).every(
        value => value.name === '' && value.price === '',
      )
        ? []
        : payload.formValues.additionalExpenses.map((additionalExpense: ItemType) => ({
            ...additionalExpense,
            price: additionalExpense.price.slice(1),
            attachments: additionalExpense?.attachments?.map((item: File) => ({
              file: item,
            })),
          })),
    };

    const { data } = yield* call(Admin.createAdminTimesheetEntry, requestBody);

    yield* put(createAdminEntry.success(data));
    payload.onSuccess();
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(createAdminEntry.fail(errorDetails));
  }
}

function* getCandidatePipelineSaga({
  payload,
}: ActionType<typeof getCandidatePipeline.init>): SagaIterator {
  try {
    const { candidatePipeline, selectedCandidate } = yield* select(
      (state: RootState) => state.adminTimesheet,
    );
    if (
      (payload.initialFetch || candidatePipeline.count > candidatePipeline.results.length) &&
      selectedCandidate.value
    ) {
      yield* put(getCandidatePipeline.request());

      const requestParams: GetTimesheetPipelineRequestParams = {
        offset: candidatePipeline.results.length,
        limit: 12,
        step: MatchedJobSteps.TemporaryWorkers,
        contract__isnull: false,
        candidate: selectedCandidate.value,
      };

      const { data } = yield* call(Admin.getCandidateTimesheetPipeline, requestParams);

      yield* put(getCandidatePipeline.success(data));
    }
  } catch (error) {
    yield* put(getCandidatePipeline.fail());
  }
}

export function* watchAdminTimesheet(): SagaIterator {
  yield* takeLatest(getType(getAdminTimesheet.init), getAdminTimesheetSaga);
  yield* takeLatest(getType(getAdminTimesheetById.request), getAdminTimesheetByIdSaga);
  yield* takeLatest(getType(setSelectedAdminTimesheetId), setSelectedAdminTimesheetSaga);
  yield* takeLatest(getType(updateAdminTimesheetStatus.request), updateAdminTimesheetStatusSaga);
  yield* takeLatest(getType(getCandidatesWithTimesheet.request), getCandidatesWithTimesheetSaga);
  yield* takeLatest(getType(getCompaniesWithTimesheet.request), getCompaniesWithTimesheetSaga);
  yield* takeLatest(
    getType(getCandidatesAndCompaniesWithTimesheet),
    getCandidatesAndCompaniesWithTimesheetSaga,
  );
  yield* takeLatest(getType(createAdminEntry.request), createCandidateEntrySaga);
  yield* takeLatest(getType(getCandidatePipeline.init), getCandidatePipelineSaga);
}
