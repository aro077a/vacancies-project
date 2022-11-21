import { ActionType, getType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { call, put, select, takeLatest } from 'typed-redux-saga';

import { Company } from '~/services/api/Company';
import { RootState } from '~/store/types';
import { GetCompanyActiveJobsParams, GetCompanyClosedJobsParams } from '~/types/requests';

import { deleteMyJob, getActiveJobs, getClosedJobs, updateJobStatus } from './actions';

function* getActiveJobsSaga({ payload }: ActionType<typeof getActiveJobs.init>): SagaIterator {
  try {
    const activeJob = yield* select((state: RootState) => state.companyMyJobs.activeJobs);

    if (payload.initialFetch || activeJob.count > activeJob.results.length) {
      yield* put(getActiveJobs.request());

      const requestParams: GetCompanyActiveJobsParams = {
        offset: activeJob.results.length,
        limit: 8,
        status: 1,
      };

      const { data } = yield* call(Company.getMyActiveJobs, requestParams);

      yield* put(getActiveJobs.success(data));
    }
  } catch (error) {
    yield* put(getActiveJobs.fail());
  }
}

function* getClosedJobsSaga({ payload }: ActionType<typeof getClosedJobs.init>): SagaIterator {
  try {
    const closedJob = yield* select((state: RootState) => state.companyMyJobs.closedJobs);

    if (payload.initialFetch || closedJob.count > closedJob.results.length) {
      yield* put(getClosedJobs.request());

      const requestParams: GetCompanyClosedJobsParams = {
        offset: closedJob.results.length,
        limit: 8,
        status: 2,
      };

      const { data } = yield* call(Company.getMyClosedJobs, requestParams);

      yield* put(getClosedJobs.success(data));
    }
  } catch (error) {
    yield* put(getClosedJobs.fail());
  }
}

function* updateJobStatusSaga({
  payload,
}: ActionType<typeof updateJobStatus.request>): SagaIterator {
  try {
    const jobId = yield* select((state: RootState) => state.companyMyJobs.selectedJob?.id);

    const { data } = yield* call(Company.updateJobStatus, jobId!, { status: payload });

    yield* put(updateJobStatus.success(data));
  } catch (error) {
    yield* put(updateJobStatus.fail());
  }
}

function* deleteMyJobSaga({ payload }: ActionType<typeof deleteMyJob.request>): SagaIterator {
  try {
    const { jobId, status } = payload;

    yield* call(Company.deleteMyJob, jobId);

    yield* put(deleteMyJob.success({ jobId, status }));
  } catch (error) {
    yield* put(deleteMyJob.fail());
  }
}

export function* watchMyJobs(): SagaIterator {
  yield* takeLatest(getType(getActiveJobs.init), getActiveJobsSaga);
  yield* takeLatest(getType(getClosedJobs.init), getClosedJobsSaga);
  yield* takeLatest(getType(updateJobStatus.request), updateJobStatusSaga);
  yield* takeLatest(getType(deleteMyJob.request), deleteMyJobSaga);
}
