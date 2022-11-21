import { ActionType, getType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { call, put, takeLatest } from 'typed-redux-saga';

import { Company } from '~/services/api/Company';
import { GetCompanyJobsRequestParams } from '~/types/requests';
import { getErrorDetailsFromResponse } from '~/utils/errors';

import { getCompanyJobs, updateInterestedCandidateStatus } from './actions';

function* getCompanyJobsSaga(): SagaIterator {
  try {
    const requestParams: GetCompanyJobsRequestParams = {
      offset: 0,
      limit: 8,
      status: 1,
    };

    const { data } = yield* call(Company.getMyJobs, requestParams);

    yield* put(getCompanyJobs.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getCompanyJobs.fail(errorDetails));
  }
}

function* updateInterestedCandidateSaga({
  payload,
}: ActionType<typeof updateInterestedCandidateStatus.request>): SagaIterator {
  try {
    const { formValues, cb, onSuccess } = payload;

    const { data } = yield* call(Company.updateCompanyInterests, formValues);

    cb();

    yield* put(updateInterestedCandidateStatus.success(data));
    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(updateInterestedCandidateStatus.fail(errorDetails));
  }
}

export function* watchCompanyJobs(): SagaIterator {
  yield* takeLatest(getType(getCompanyJobs.request), getCompanyJobsSaga);
  yield* takeLatest(
    getType(updateInterestedCandidateStatus.request),
    updateInterestedCandidateSaga,
  );
}
