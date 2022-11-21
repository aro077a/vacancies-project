import { ActionType, getType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { call, put, select, takeLatest } from 'typed-redux-saga';

import { Candidate } from '~/services/api/Candidate';
import { RootState } from '~/store/types';
import {
  GetCandidateFindJobsRequestParams,
  GetCompaniesWithJobsRequestParams,
} from '~/types/requests';
import { getErrorDetailsFromResponse } from '~/utils/errors';
import { transformSalaryFromStringToNumber } from '~/utils/strings';

import {
  addJobToShortList,
  getCompaniesWithJobs,
  getFindJobDescription,
  getFindJobs,
  setFindJobInterest,
  setSelectedCompanyId,
  setSelectedFindJob,
} from './actions';

function* getCompaniesWithJobsSaga({
  payload,
}: ActionType<typeof getCompaniesWithJobs.init>): SagaIterator {
  try {
    if (payload.noLimit) {
      yield* put(getCompaniesWithJobs.request());

      const requestBody: GetCompaniesWithJobsRequestParams = {
        offset: 0,
      };

      const { data } = yield* call(Candidate.getCompaniesWithJobs, requestBody);

      yield* put(getCompaniesWithJobs.success({ res: data, noLimit: true }));
    } else {
      const { companiesWithJobs } = yield* select((state: RootState) => state.candidateFindJobs);

      if (payload.initialFetch || companiesWithJobs.count > companiesWithJobs.results.length) {
        yield* put(getCompaniesWithJobs.request());

        const requestBody: GetCompaniesWithJobsRequestParams = {
          limit: 10,
          offset: companiesWithJobs.results.length,
        };

        const { data } = yield* call(Candidate.getCompaniesWithJobs, requestBody);

        yield* put(getCompaniesWithJobs.success({ res: data, noLimit: false }));
      }
    }
  } catch (error) {
    yield* put(getCompaniesWithJobs.fail());
  }
}

function* getFindJobsSaga({ payload }: ActionType<typeof getFindJobs.init>): SagaIterator {
  try {
    const { findJobs } = yield* select((state: RootState) => state.candidateFindJobs);

    if (payload.initialFetch || findJobs.count > findJobs.results.length) {
      yield* put(getFindJobs.request());

      const {
        searchJobByJobType,
        searchJobByKeyWord,
        searchJobByLocationFilter,
        searchJobBySalaryGte,
        searchJobBySalaryLte,
        searchJobByPositionType,
        searchProjectByProjectType,
        selectedCompanyId,
        searchJobByCompany,
        searchWithSuper,
        searchSelectedJobs,
      } = yield* select((state: RootState) => state.candidateFindJobs);

      const requestParams: GetCandidateFindJobsRequestParams = {
        limit: 10,
        offset: findJobs.results.length,
      };

      if (searchProjectByProjectType.value) {
        requestParams.projectType = searchProjectByProjectType.value;
      }

      if (searchJobByPositionType.value) {
        requestParams.positionType = searchJobByPositionType.value;
      }

      if (searchJobByJobType.value) {
        requestParams.position = searchJobByJobType.value;
      }

      if (searchJobByKeyWord) {
        requestParams.search = searchJobByKeyWord;
      }

      if (searchJobByLocationFilter.value) {
        requestParams.city = searchJobByLocationFilter.value;
      }

      if (searchWithSuper) {
        if (searchJobBySalaryGte) {
          requestParams.superAmount__gte = transformSalaryFromStringToNumber(searchJobBySalaryGte);
        }

        if (searchJobBySalaryLte) {
          requestParams.superAmount__lte = transformSalaryFromStringToNumber(searchJobBySalaryLte);
        }
      } else {
        if (searchJobBySalaryGte) {
          requestParams.salary__gte = transformSalaryFromStringToNumber(searchJobBySalaryGte);
        }

        if (searchJobBySalaryLte) {
          requestParams.salary__lte = transformSalaryFromStringToNumber(searchJobBySalaryLte);
        }
      }

      if (selectedCompanyId) {
        requestParams.company = selectedCompanyId;
      }

      if (searchJobByCompany.value) {
        requestParams.company = searchJobByCompany.value;
      }

      if (searchSelectedJobs.length) {
        requestParams.position__in = searchSelectedJobs.join(',');
      }

      const { data } = yield* call(Candidate.getFindJobs, requestParams);

      yield* put(getFindJobs.success(data));
    }
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(getFindJobs.fail(errorDetails));
  }
}

function* getFindJobDescriptionSaga(): SagaIterator {
  try {
    const selectedFindJobId = yield* select(
      (state: RootState) => state.candidateFindJobs.selectedFindJob?.id,
    );

    const { data } = yield* call(Candidate.getJobDetail, selectedFindJobId!);

    yield* put(getFindJobDescription.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(getFindJobDescription.fail(errorDetails));
  }
}

function* setJobFindJobInterestSaga({
  payload,
}: ActionType<typeof setFindJobInterest.request>): SagaIterator {
  try {
    const selectedJobId = yield* select(
      (state: RootState) => state.candidateFindJobs.selectedFindJob?.id,
    );

    const { data } = yield* call(Candidate.setJobInterest, {
      job: selectedJobId!,
      status: payload.interested,
    });

    yield* put(setFindJobInterest.success(data));
    payload.onSuccess();
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(setFindJobInterest.fail(errorDetails));
  }
}

function* setSelectedFindJobSaga({ payload }: ActionType<typeof setSelectedFindJob>): SagaIterator {
  if (payload !== null) {
    yield* put(getFindJobDescription.request());
  }
}

function* addJobToShortListSaga({
  payload,
}: ActionType<typeof addJobToShortList.request>): SagaIterator {
  try {
    const { jobId, status } = payload;

    const { data } = yield* call(Candidate.addToShortList, jobId!, { shortlist: status });

    yield* put(addJobToShortList.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(addJobToShortList.fail(errorDetails));
  }
}

function* setSelectedCompanySaga(): SagaIterator {
  yield* put(getFindJobs.init({ initialFetch: true }));
}

export function* watchFindJobsSaga(): SagaIterator {
  yield* takeLatest(getType(getFindJobs.init), getFindJobsSaga);
  yield* takeLatest(getType(getFindJobDescription.request), getFindJobDescriptionSaga);
  yield* takeLatest(getType(setSelectedFindJob), setSelectedFindJobSaga);
  yield* takeLatest(getType(setFindJobInterest.request), setJobFindJobInterestSaga);
  yield* takeLatest(getType(addJobToShortList.request), addJobToShortListSaga);
  yield* takeLatest(getType(getCompaniesWithJobs.init), getCompaniesWithJobsSaga);
  yield* takeLatest(getType(setSelectedCompanyId), setSelectedCompanySaga);
}
