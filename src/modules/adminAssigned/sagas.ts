import { getType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { put, takeLatest } from 'typed-redux-saga';

import { getCompaniesWithLiveJobsCount, getLiveJobs } from '~/modules/adminLiveJobs/actions';
import { getMatchedJobPipeline, getUnmatchedJobPipeline } from '~/modules/adminPipeline/actions';
import { AdminRouter } from '~/utils/router';

import { assignToMe } from './actions';

function* assignToMeSaga(): SagaIterator {
  if (window.location.pathname === AdminRouter.pipeline) {
    yield* put(getUnmatchedJobPipeline.request());
    yield* put(getMatchedJobPipeline.request());
  }

  if (window.location.pathname === AdminRouter.liveJobs) {
    yield* put(getCompaniesWithLiveJobsCount.init({ initialFetch: true }));
    yield* put(getLiveJobs.init({ initialFetch: true }));
  }
}

export function* watchAdminAssigned(): SagaIterator {
  yield* takeLatest(getType(assignToMe), assignToMeSaga);
}
