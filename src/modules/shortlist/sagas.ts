import { ActionType, getType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { call, put, select, takeLatest } from 'typed-redux-saga';

import { UserType } from '~/models/common';
import { Candidate } from '~/services/api/Candidate';
import { Company } from '~/services/api/Company';
import { RootState } from '~/store/types';
import { GetShortListRequestParams } from '~/types/requests';
import { getErrorDetailsFromResponse } from '~/utils/errors';

import { getShortList, updateShortList } from './actions';

function* getShortListSaga({ payload }: ActionType<typeof getShortList.init>): SagaIterator {
  try {
    const { results, count } = yield* select((state: RootState) => state.shortList.jobs);
    const { loggedInUserType } = yield* select((state: RootState) => state.user);
    const isCompany =
      loggedInUserType === UserType.COMPANY || loggedInUserType === UserType.MANAGER;

    if (payload.initialFetch || results.length < count) {
      yield* put(getShortList.request());
      const requestBody: GetShortListRequestParams = {
        limit: 8,
        offset: results.length,
        shortlist: 'true',
      };

      const { data } = isCompany
        ? yield* call(Company.getShortList, requestBody)
        : yield* call(Candidate.getShortList, requestBody);

      yield* put(getShortList.success(data));
    }
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(getShortList.fail(errorDetails));
  }
}

function* updateShortListSaga({
  payload,
}: ActionType<typeof updateShortList.request>): SagaIterator {
  try {
    const { loggedInUserType } = yield* select((state: RootState) => state.user);
    const isCompany =
      loggedInUserType === UserType.COMPANY || loggedInUserType === UserType.MANAGER;
    const { jobId, status } = payload;

    const { data } = isCompany
      ? yield* call(Company.addToShortList, jobId, { shortlist: status })
      : yield* call(Candidate.addToShortList, jobId, { shortlist: status });

    yield* put(updateShortList.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(updateShortList.fail(errorDetails));
  }
}

export function* watchShortList(): SagaIterator {
  yield* takeLatest(getType(getShortList.init), getShortListSaga);
  yield* takeLatest(getType(updateShortList.request), updateShortListSaga);
}
