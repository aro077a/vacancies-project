import { ActionType, getType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { call, put, select, takeLatest } from 'typed-redux-saga';

import { Company } from '~/services/api/Company';
import { RootState } from '~/store/types';
import { GetCompanyCandidatesRequestParams } from '~/types/requests';
import { getErrorDetailsFromResponse } from '~/utils/errors';
import { transformSalaryFromStringToNumber } from '~/utils/strings';

import {
  addCandidateToShortList,
  getCompanyCandidates,
  setSelectedCompanyCandidate,
} from './actions';

function* getCandidatesSaga({
  payload,
}: ActionType<typeof getCompanyCandidates.request>): SagaIterator {
  try {
    const {
      searchCandidateJobType,
      searchCandidateKeyWord,
      searchCandidateSalaryGte,
      searchCandidateSalaryLte,
      searchCandidateCityFilter,
      searchCandidateByProjectType,
      searchCandidateByAvailability,
      searchCandidateRegionFilter,
      searchCandidateByProjectValue,
      searchSelectedJobs,
    } = yield* select((state: RootState) => state.companyCandidates);
    if (typeof payload === 'number') {
      const requestParams: GetCompanyCandidatesRequestParams = {
        offset: payload > 1 ? (payload - 1) * 8 : 0,
        limit: 8,
      };

      if (searchCandidateRegionFilter.value) {
        requestParams.state = searchCandidateRegionFilter.value;
      }

      if (searchCandidateByAvailability.length) {
        requestParams.prof_detail__availability__in = searchCandidateByAvailability.map(
          item => item.value,
        );
      }

      if (searchCandidateByProjectType.value) {
        requestParams.prof_detail__project_types = searchCandidateByProjectType.value;
      }

      if (searchCandidateByProjectValue.value) {
        requestParams.prof_detail__project_types = searchCandidateByProjectValue.value;
      }

      if (searchCandidateJobType.value) {
        requestParams.prof_detail__job_title = searchCandidateJobType.value;
      }

      if (searchCandidateKeyWord) {
        requestParams.search = searchCandidateKeyWord;
      }

      if (searchCandidateCityFilter.value) {
        requestParams.city = searchCandidateCityFilter.value;
      }

      if (searchCandidateSalaryGte) {
        requestParams.prof_detail__min_salary__gte =
          transformSalaryFromStringToNumber(searchCandidateSalaryGte);
      }

      if (searchCandidateSalaryLte) {
        requestParams.prof_detail__min_salary__lte =
          transformSalaryFromStringToNumber(searchCandidateSalaryLte);
      }

      if (searchSelectedJobs.length) {
        requestParams.prof_detail__job_title__in = searchSelectedJobs.join(',');
      }

      const { data } = yield* call(Company.getCandidates, requestParams);

      yield* put(getCompanyCandidates.success(data));
    }
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getCompanyCandidates.fail(errorDetails));
  }
}

function* setSelectedCandidateSaga({
  payload,
}: ActionType<typeof setSelectedCompanyCandidate.request>): SagaIterator {
  if (payload !== null) {
    try {
      const { data } = yield* call(Company.getCandidateInfo, payload);
      yield* put(setSelectedCompanyCandidate.success(data.data));
    } catch (error) {
      const errorDetails = getErrorDetailsFromResponse(error);

      yield* put(setSelectedCompanyCandidate.fail(errorDetails));
    }
  }
}

function* addCandidateToShortListSaga({
  payload,
}: ActionType<typeof addCandidateToShortList.request>): SagaIterator {
  try {
    const { candidateId, status } = payload;

    const { data } = yield* call(Company.addToShortList, candidateId!, { shortlist: status });

    yield* put(addCandidateToShortList.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(addCandidateToShortList.fail(errorDetails));
  }
}

export function* watchCompanyCandidates(): SagaIterator {
  yield* takeLatest(getType(getCompanyCandidates.request), getCandidatesSaga);
  yield* takeLatest(getType(setSelectedCompanyCandidate.request), setSelectedCandidateSaga);
  yield* takeLatest(getType(addCandidateToShortList.request), addCandidateToShortListSaga);
}
