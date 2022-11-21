import { SagaIterator } from 'redux-saga';
import { call, put, select, takeLatest } from 'typed-redux-saga';

import { Common } from '~/services/api/Common';
import { RootState } from '~/store/types';

import {
  getCities,
  getCountries,
  getHiringManagerJobPositions,
  getHiringManagerProjectTypes,
  getJobGroups,
  getJobPositions,
  getProjectTypes,
  getStates,
} from './actions';

function* getCountriesSaga(): SagaIterator {
  try {
    const countries = yield* select((state: RootState) => state.common.countries);

    if (countries.length === 0) {
      const { data } = yield* call(Common.getCountries);

      yield* put(getCountries.success(data));
    }
  } catch (error) {
    yield* put(getCountries.fail());
  }
}

function* getStatesSaga(): SagaIterator {
  try {
    const states = yield* select((state: RootState) => state.common.states);

    if (states.length === 0) {
      const { data } = yield* call(Common.getStates);

      yield* put(getStates.success(data));
    }
  } catch (error) {
    yield* put(getStates.fail());
  }
}

function* getCitiesSaga(): SagaIterator {
  try {
    const cities = yield* select((state: RootState) => state.common.cities);

    if (cities.length === 0) {
      const { data } = yield* call(Common.getCities);

      yield* put(getCities.success(data));
    }
  } catch (error) {
    yield* put(getCities.fail());
  }
}

function* getJobPositionsSaga(): SagaIterator {
  try {
    const jobPositions = yield* select((state: RootState) => state.common.jobPositions);

    if (jobPositions.length === 0) {
      const { data } = yield* call(Common.getJobPositions);

      yield* put(getJobPositions.success(data));
    }
  } catch (error) {
    yield* put(getJobPositions.fail());
  }
}

function* getJobGroupsSaga(): SagaIterator {
  try {
    const jobGroups = yield* select((state: RootState) => state.common.jobGroups);

    if (jobGroups.length === 0) {
      const { data } = yield* call(Common.getJobGroupsRequest);

      yield* put(getJobGroups.success(data));
    }
  } catch (error) {
    yield* put(getJobGroups.fail());
  }
}

function* getProjectTypesSaga(): SagaIterator {
  try {
    const projectTypes = yield* select((state: RootState) => state.common.projectTypes);

    if (projectTypes.length === 0) {
      const { data } = yield* call(Common.getProjectTypes);

      yield* put(getProjectTypes.success(data));
    }
  } catch (error) {
    yield* put(getProjectTypes.fail());
  }
}

function* getHiringManagerJobPositionsSaga(): SagaIterator {
  try {
    const jobPositions = yield* select((state: RootState) => state.common.hiringManagerPositions);

    if (jobPositions.length === 0) {
      const { data } = yield* call(Common.getHiringManagerJobPositions);

      yield* put(getHiringManagerJobPositions.success(data));
    }
  } catch (error) {
    yield* put(getHiringManagerJobPositions.fail());
  }
}

function* getHiringManagerProjectTypesSaga(): SagaIterator {
  try {
    const projectTypes = yield* select(
      (state: RootState) => state.common.hiringManagerProjectTypes,
    );

    if (projectTypes.length === 0) {
      const { data } = yield* call(Common.getHiringManagerProjectTypes);

      yield* put(getHiringManagerProjectTypes.success(data));
    }
  } catch (error) {
    yield* put(getHiringManagerProjectTypes.fail());
  }
}

export function* watchCommon(): SagaIterator {
  yield* takeLatest(getCountries.request, getCountriesSaga);
  yield* takeLatest(getStates.request, getStatesSaga);
  yield* takeLatest(getCities.request, getCitiesSaga);
  yield* takeLatest(getJobPositions.request, getJobPositionsSaga);
  yield* takeLatest(getJobGroups.request, getJobGroupsSaga);
  yield* takeLatest(getProjectTypes.request, getProjectTypesSaga);
  yield* takeLatest(getHiringManagerProjectTypes.request, getHiringManagerProjectTypesSaga);
  yield* takeLatest(getHiringManagerJobPositions.request, getHiringManagerJobPositionsSaga);
}
