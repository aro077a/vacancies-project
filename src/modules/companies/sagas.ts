import { getType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { call, put, select, takeLatest } from 'typed-redux-saga';

import { Common } from '~/services/api/Common';
import { RootState } from '~/store/types';

import { getCompanies } from './actions';

function* getCompaniesSaga(): SagaIterator {
  try {
    const { companies } = yield* select((state: RootState) => state.companies);

    if (companies.length === 0) {
      const { data } = yield* call(Common.getCompanies);

      yield* put(getCompanies.success(data));
    }
  } catch (error) {
    yield* put(getCompanies.fail());
  }
}

export function* watchCompany(): SagaIterator {
  yield* takeLatest(getType(getCompanies.request), getCompaniesSaga);
}
