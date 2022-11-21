import { ActionType, getType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { call, put, select, takeLatest } from 'typed-redux-saga';

import { MatchedJobSteps } from '~/models/common';
import { Candidate } from '~/services/api/Candidate';
import { RootState } from '~/store/types';
import { CreateEntryFormValues } from '~/types/formValues';
import {
  GetCandidateTimesheetRequestParams,
  GetTimesheetPipelineRequestParams,
} from '~/types/requests';
import { getErrorDetailsFromResponse } from '~/utils/errors';

import {
  createCandidateEntry,
  getCandidatePipeline,
  getCandidateTimesheet,
  getCandidateTimesheetById,
  getCandidateTimesheetContract,
  setSelectedCandidateTimesheetId,
} from './actions';

function* getCandidateTimesheetSaga({
  payload,
}: ActionType<typeof getCandidateTimesheet.init>): SagaIterator {
  try {
    const { candidateTimesheetList } = yield* select(
      (state: RootState) => state.candidateTimesheet,
    );
    if (
      payload.initialFetch ||
      candidateTimesheetList.count > candidateTimesheetList.results.length
    ) {
      yield* put(getCandidateTimesheet.request());

      const requestParams: GetCandidateTimesheetRequestParams = {
        offset: candidateTimesheetList.results.length,
        limit: 12,
      };

      const { data } = yield* call(Candidate.getCandidateTimesheet, requestParams);

      yield* put(getCandidateTimesheet.success(data));
    }
  } catch (error) {
    yield* put(getCandidateTimesheet.fail());
  }
}

function* getCandidatePipelineSaga({
  payload,
}: ActionType<typeof getCandidatePipeline.init>): SagaIterator {
  try {
    const { candidatePipeline } = yield* select((state: RootState) => state.candidateTimesheet);
    if (payload.initialFetch || candidatePipeline.count > candidatePipeline.results.length) {
      yield* put(getCandidatePipeline.request());

      const requestParams: GetTimesheetPipelineRequestParams = {
        offset: candidatePipeline.results.length,
        limit: 12,
        step: MatchedJobSteps.TemporaryWorkers,
        contract__isnull: false,
      };

      const { data } = yield* call(Candidate.getCandidateTimesheetPipeline, requestParams);

      yield* put(getCandidatePipeline.success(data));
    }
  } catch (error) {
    yield* put(getCandidatePipeline.fail());
  }
}

function* createCandidateEntrySaga({
  payload,
}: ActionType<typeof createCandidateEntry.request>): SagaIterator {
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

    const { data } = yield* call(Candidate.createCandidateTimesheetEntry, requestBody);

    yield* put(createCandidateEntry.success(data));
    payload.onSuccess();
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(createCandidateEntry.fail(errorDetails));
  }
}

function* getCandidateTimesheetByIdSaga(): SagaIterator {
  try {
    const timesheetId = yield* select(
      (state: RootState) => state.candidateTimesheet.selectedCandidateTimesheetId,
    );

    const { data } = yield* call(Candidate.getCandidateTimesheetByIdRequest, {
      id: timesheetId!,
    });

    yield* put(getCandidateTimesheetById.success(data));
  } catch (error) {
    yield* put(getCandidateTimesheetById.fail());
  }
}

function* setSelectedCandidateTimesheetSaga({
  payload,
}: ActionType<typeof setSelectedCandidateTimesheetId>): SagaIterator {
  if (payload !== null) {
    yield* put(getCandidateTimesheetById.request());
  }
}

function* getCandidateTimesheetContractSaga({
  payload,
}: ActionType<typeof getCandidateTimesheetContract.request>): SagaIterator {
  try {
    const { contractId, onSuccess } = payload;
    const { data } = yield* call(Candidate.downloadContract, contractId);

    const href = `data:application/octet-stream;base64,${data.data}`;

    yield* put(getCandidateTimesheetContract.success(href));

    if (payload.isReview) {
      onSuccess();
    } else {
      const link = document.createElement('a');

      link.href = href;

      link.download = 'Contract';

      link.click();
    }
  } catch (error) {
    yield* put(getCandidateTimesheetContract.fail());
  }
}

export function* watchCandidateTimesheet(): SagaIterator {
  yield* takeLatest(getType(getCandidateTimesheet.init), getCandidateTimesheetSaga);
  yield* takeLatest(getType(getCandidatePipeline.init), getCandidatePipelineSaga);
  yield* takeLatest(getType(createCandidateEntry.request), createCandidateEntrySaga);
  yield* takeLatest(getType(getCandidateTimesheetById.request), getCandidateTimesheetByIdSaga);
  yield* takeLatest(getType(setSelectedCandidateTimesheetId), setSelectedCandidateTimesheetSaga);
  yield* takeLatest(
    getType(getCandidateTimesheetContract.request),
    getCandidateTimesheetContractSaga,
  );
}
