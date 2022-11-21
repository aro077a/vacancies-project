import { ActionType, getType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { call, put, select, takeLatest } from 'typed-redux-saga';

import { Company } from '~/services/api/Company';
import { RootState } from '~/store/types';
import { GetCompanyInterestedInRequestParams } from '~/types/requests';

import { getInterestedIn } from './actions';

function* getInterestedInSaga({ payload }: ActionType<typeof getInterestedIn.init>): SagaIterator {
  try {
    const { candidates } = yield* select((state: RootState) => state.companyInterestedIn);

    if (payload.initialFetch || candidates.count > candidates.results.length) {
      yield* put(getInterestedIn.request());

      const requestParams: GetCompanyInterestedInRequestParams = {
        limit: 8,
        offset: candidates.results.length,
        interested: true,
      };

      const { data } = yield* call(Company.getInterestedIn, requestParams);

      yield* put(getInterestedIn.success(data));
    }
  } catch (error) {
    yield* put(getInterestedIn.fail());
  }
}

export function* watchCompanyInterestedIn(): SagaIterator {
  yield* takeLatest(getType(getInterestedIn.init), getInterestedInSaga);
}
