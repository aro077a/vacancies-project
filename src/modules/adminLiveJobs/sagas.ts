import { ActionType, getType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { call, put, select, takeEvery, takeLatest } from 'typed-redux-saga';

import { Admin } from '~/services/api/Admin';
import { RootState } from '~/store/types';
import {
  GetCompaniesWithLiveJobsCountRequestParams,
  GetLiveJobsRequestParams,
} from '~/types/requests';
import { getErrorDetailsFromResponse } from '~/utils/errors';
import { transformSalaryFromStringToNumber } from '~/utils/strings';

import {
  addLiveJobRecord,
  deleteLiveJobRecord,
  getCompaniesWithLiveJobsCount,
  getLiveJob,
  getLiveJobCompanyInterestedCandidates,
  getLiveJobContracts,
  getLiveJobFeedbackReplies,
  getLiveJobFeedbacks,
  getLiveJobInterestedCandidates,
  getLiveJobMatchedCandidates,
  getLiveJobPotentialCandidates,
  getLiveJobs,
  getLiveJobsRecords,
  sendLiveJobFeedbackReply,
  setSelectedCompanyId,
  setSelectedLiveJob,
  setSelectedLiveJobFeedback,
  updateLiveJobCandidateMatched,
  updateLiveJobRecord,
  updateMatchedCandidatesCountInLiveJobs,
  updateSelectedLiveJobStatus,
} from './actions';

function* getCompaniesWithLiveJobsCountSaga({
  payload,
}: ActionType<typeof getCompaniesWithLiveJobsCount.init>): SagaIterator {
  try {
    const { companiesWithLiveJobsCount } = yield* select((state: RootState) => state.adminLiveJobs);

    if (
      payload.initialFetch ||
      companiesWithLiveJobsCount.count > companiesWithLiveJobsCount.results.length
    ) {
      const { assigned } = yield* select((state: RootState) => state.adminAssigned);

      yield* put(getCompaniesWithLiveJobsCount.request());

      const requestParams: GetCompaniesWithLiveJobsCountRequestParams = {
        offset: companiesWithLiveJobsCount.results.length,
        limit: 10,
      };

      if (assigned) {
        requestParams.assignedMe = true;
      }

      const { data } = yield* call(Admin.getCompaniesWithLiveJobsCount, requestParams);

      yield* put(getCompaniesWithLiveJobsCount.success(data));
    }
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getCompaniesWithLiveJobsCount.fail(errorDetails));
  }
}

function* getLiveJobsSaga({ payload }: ActionType<typeof getLiveJobs.init>): SagaIterator {
  try {
    const {
      searchJobPositionType,
      searchJobRegionFilter,
      searchJobCityFilter,
      searchLiveJobsJobType,
      searchLiveJobsByAdmin,
      searchJobSalaryGte,
      searchJobSalaryLte,
      searchCandidateKeyWord,
      searchSalaryWithSuper,
      searchSelectedJobs,
    } = yield* select((state: RootState) => state.adminLiveJobs);
    const { selectedCompanyId, liveJobs } = yield* select(
      (state: RootState) => state.adminLiveJobs,
    );
    const { assigned } = yield* select((state: RootState) => state.adminAssigned);
    if (payload.initialFetch || liveJobs.count > liveJobs.results.length) {
      yield* put(getLiveJobs.request());

      const requestParams: GetLiveJobsRequestParams = {
        offset: liveJobs.results.length,
        limit: 10,
      };

      if (assigned) {
        requestParams.assignedMe = true;
      }

      if (selectedCompanyId !== null) {
        requestParams.company = selectedCompanyId;
      }

      if (searchCandidateKeyWord) {
        requestParams.search = searchCandidateKeyWord;
      }

      if (searchSalaryWithSuper) {
        if (searchJobSalaryGte) {
          requestParams.superAmount__gte = transformSalaryFromStringToNumber(searchJobSalaryGte);
        }

        if (searchJobSalaryLte) {
          requestParams.superAmount__lte = transformSalaryFromStringToNumber(searchJobSalaryLte);
        }
      } else {
        if (searchJobSalaryGte) {
          requestParams.salary__gte = transformSalaryFromStringToNumber(searchJobSalaryGte);
        }

        if (searchJobSalaryLte) {
          requestParams.salary__lte = transformSalaryFromStringToNumber(searchJobSalaryLte);
        }
      }

      if (searchJobPositionType.value) {
        requestParams.positionType = searchJobPositionType.value;
      }

      if (searchJobRegionFilter.value) {
        requestParams.state = searchJobRegionFilter.value;
      }

      if (searchJobCityFilter.value) {
        requestParams.city = searchJobCityFilter.value;
      }

      if (searchLiveJobsJobType.value) {
        requestParams.position = searchLiveJobsJobType.value;
      }

      if (searchLiveJobsByAdmin.value) {
        requestParams.admin = searchLiveJobsByAdmin.value;
      }

      if (searchSelectedJobs.length) {
        requestParams.position__in = searchSelectedJobs.join(',');
      }

      const { data } = yield* call(Admin.getLiveJobs, requestParams);

      yield* put(getLiveJobs.success(data));
    }
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getLiveJobs.fail(errorDetails));
  }
}

export function* getLiveJobContractsSaga(): SagaIterator {
  try {
    const selectedLiveJobId = yield* select(
      (state: RootState) => state.adminLiveJobs.selectedLiveJob?.id,
    );

    const { data } = yield* call(Admin.getLiveJobContracts, selectedLiveJobId!);

    yield* put(getLiveJobContracts.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getLiveJobContracts.fail(errorDetails));
  }
}

function* setSelectedCompanyIdSaga(): SagaIterator {
  yield* put(getLiveJobs.init({ initialFetch: true }));
}

function* getSelectedLiveJobCandidatesSaga(): SagaIterator {
  yield* put(getLiveJobMatchedCandidates.request());
  yield* put(getLiveJobInterestedCandidates.request());
  yield* put(getLiveJobCompanyInterestedCandidates.request());
  yield* put(getLiveJobPotentialCandidates.request());
  yield* put(getLiveJobContracts.request());
}

function* setSelectedLiveJobSaga({ payload }: ActionType<typeof setSelectedLiveJob>): SagaIterator {
  if (payload !== null) {
    yield* call(getSelectedLiveJobCandidatesSaga);
    yield* put(getLiveJobFeedbacks.request());
    yield* put(getLiveJobsRecords.request());
  }
}

function* updateSelectedLiveJobStatusSaga({
  payload,
}: ActionType<typeof updateSelectedLiveJobStatus.request>): SagaIterator {
  try {
    const selectedLiveJobId = yield* select(
      (state: RootState) => state.adminLiveJobs.selectedLiveJob?.id,
    );

    const { data } = yield* call(Admin.updateLiveJobStatus, { id: selectedLiveJobId! }, payload);

    yield* put(updateSelectedLiveJobStatus.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(updateSelectedLiveJobStatus.fail(errorDetails));
  }
}

function* getLiveJobMatchedCandidatesSaga(): SagaIterator {
  try {
    const selectedLiveJobId = yield* select(
      (state: RootState) => state.adminLiveJobs.selectedLiveJob?.id,
    );

    const { data } = yield* call(Admin.getLiveJobMatchedCandidates, { id: selectedLiveJobId! });

    yield* put(
      updateMatchedCandidatesCountInLiveJobs({
        liveJobId: selectedLiveJobId!,
        candidatesCount: data.data.length,
      }),
    );
    yield* put(getLiveJobMatchedCandidates.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getLiveJobMatchedCandidates.fail(errorDetails));
  }
}

function* getLiveJobInterestedCandidatesSaga(): SagaIterator {
  try {
    const selectedLiveJobId = yield* select(
      (state: RootState) => state.adminLiveJobs.selectedLiveJob?.id,
    );

    const { data } = yield* call(Admin.getLiveJobInterestedCandidates, { id: selectedLiveJobId! });

    yield* put(getLiveJobInterestedCandidates.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getLiveJobInterestedCandidates.fail(errorDetails));
  }
}

function* getLiveJobCompanyInterestedCandidatesSaga(): SagaIterator {
  try {
    const selectedLiveJobId = yield* select(
      (state: RootState) => state.adminLiveJobs.selectedLiveJob?.id,
    );

    const { data } = yield* call(Admin.getLiveJobCompanyInterestedCandidates, {
      id: selectedLiveJobId!,
    });

    yield* put(getLiveJobCompanyInterestedCandidates.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getLiveJobCompanyInterestedCandidates.fail(errorDetails));
  }
}

function* getLiveJobPotentialCandidatesSaga(): SagaIterator {
  try {
    const selectedLiveJobId = yield* select(
      (state: RootState) => state.adminLiveJobs.selectedLiveJob?.id,
    );

    const { data } = yield* call(Admin.getLiveJobPotentialCandidates, {
      id: selectedLiveJobId!,
    });

    yield* put(getLiveJobPotentialCandidates.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getLiveJobPotentialCandidates.fail(errorDetails));
  }
}

function* updateLiveJobCandidateMatchedSaga({
  payload,
}: ActionType<typeof updateLiveJobCandidateMatched.request>): SagaIterator {
  try {
    const selectedLiveJobId = yield* select(
      (state: RootState) => state.adminLiveJobs.selectedLiveJob?.id,
    );

    const { data } = yield* call(Admin.updateLiveJobCandidateMatched, {
      status: payload.status,
      job: selectedLiveJobId!,
      candidate: payload.candidateId,
    });

    yield* put(updateLiveJobCandidateMatched.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(updateLiveJobCandidateMatched.fail(errorDetails));
  }
}

function* getLiveJobFeedbacksSaga(): SagaIterator {
  try {
    const selectedLiveJobId = yield* select(
      (state: RootState) => state.adminLiveJobs.selectedLiveJob?.id,
    );

    const { data } = yield* call(Admin.getLiveJobFeedbacks, {
      id: selectedLiveJobId!,
    });

    yield* put(getLiveJobFeedbacks.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getLiveJobFeedbacks.fail(errorDetails));
  }
}

function* setSelectedLiveJobFeedbackSaga({
  payload,
}: ActionType<typeof setSelectedLiveJobFeedback>): SagaIterator {
  if (payload !== null) {
    yield* put(getLiveJobFeedbackReplies.request());
  }
}

function* getLiveJobFeedbackRepliesSaga(): SagaIterator {
  try {
    const selectedLiveJobFeedbackId = yield* select(
      (state: RootState) => state.adminLiveJobs.selectedLiveJobFeedback?.id,
    );

    const { data } = yield* call(Admin.getLiveJobFeedbackReplies, {
      id: selectedLiveJobFeedbackId!,
    });

    yield* put(getLiveJobFeedbackReplies.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getLiveJobFeedbackReplies.fail(errorDetails));
  }
}

function* sendLiveJobFeedbackReplySaga({
  payload,
}: ActionType<typeof sendLiveJobFeedbackReply.request>): SagaIterator {
  try {
    const selectedLiveJobFeedbackId = yield* select(
      (state: RootState) => state.adminLiveJobs.selectedLiveJobFeedback?.id,
    );

    const { data } = yield* call(
      Admin.sendLiveJobFeedbackReply,
      {
        id: selectedLiveJobFeedbackId!,
      },
      payload,
    );

    yield* put(sendLiveJobFeedbackReply.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(sendLiveJobFeedbackReply.fail(errorDetails));
  }
}

function* getLiveJobRecordSaga(): SagaIterator {
  try {
    const { selectedLiveJob } = yield* select((state: RootState) => state.adminLiveJobs);

    const { data } = yield* call(Admin.getLiveJobRecordsRequest, { id: selectedLiveJob?.id });
    yield* put(getLiveJobsRecords.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getLiveJobsRecords.fail(errorDetails));
  }
}

function* addLiveJobRecordSaga({
  payload,
}: ActionType<typeof addLiveJobRecord.request>): SagaIterator {
  try {
    const { selectedLiveJob } = yield* select((state: RootState) => state.adminLiveJobs);

    const { data } = yield* call(
      Admin.addLiveJobRecordRequest,
      { id: selectedLiveJob?.id },
      payload,
    );

    yield* put(addLiveJobRecord.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(addLiveJobRecord.fail(errorDetails));
  }
}

function* updateLiveJobRecordSaga({
  payload,
}: ActionType<typeof updateLiveJobRecord.request>): SagaIterator {
  try {
    const { selectedLiveJob, selectedRecordId } = yield* select(
      (state: RootState) => state.adminLiveJobs,
    );

    const { data } = yield* call(
      Admin.updateLiveJobRecordRequest,
      { id: selectedLiveJob?.id },
      selectedRecordId,
      payload,
    );

    yield* put(updateLiveJobRecord.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(updateLiveJobRecord.fail(errorDetails));
  }
}

function* deleteLiveJobRecordSaga({
  payload,
}: ActionType<typeof deleteLiveJobRecord.request>): SagaIterator {
  try {
    const { selectedLiveJob } = yield* select((state: RootState) => state.adminLiveJobs);
    const { recordId } = payload;
    yield* call(Admin.deleteLiveJobRecordRequest, { id: selectedLiveJob?.id }, recordId);

    yield* put(deleteLiveJobRecord.success());
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(deleteLiveJobRecord.fail(errorDetails));
  }
}

function* getLiveJobSaga({ payload }: ActionType<typeof getLiveJob.request>): SagaIterator {
  try {
    const { cb, jobId } = payload;

    const { data } = yield* call(Admin.getLiveJob, jobId);

    if (cb) {
      cb(data.data);
    }

    yield* put(getLiveJob.success());
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getLiveJob.fail(errorDetails));
  }
}

export function* watchAdminLiveJobs(): SagaIterator {
  yield* takeLatest(getType(getCompaniesWithLiveJobsCount.init), getCompaniesWithLiveJobsCountSaga);
  yield* takeEvery(getType(getLiveJobs.init), getLiveJobsSaga);
  yield* takeLatest(getType(setSelectedCompanyId), setSelectedCompanyIdSaga);
  yield* takeLatest(getType(setSelectedLiveJob), setSelectedLiveJobSaga);
  yield* takeLatest(getType(updateSelectedLiveJobStatus.request), updateSelectedLiveJobStatusSaga);
  yield* takeLatest(getType(getLiveJobMatchedCandidates.request), getLiveJobMatchedCandidatesSaga);
  yield* takeLatest(
    getType(getLiveJobInterestedCandidates.request),
    getLiveJobInterestedCandidatesSaga,
  );
  yield* takeLatest(
    getType(getLiveJobCompanyInterestedCandidates.request),
    getLiveJobCompanyInterestedCandidatesSaga,
  );
  yield* takeLatest(
    getType(getLiveJobPotentialCandidates.request),
    getLiveJobPotentialCandidatesSaga,
  );
  yield* takeLatest(
    getType(updateLiveJobCandidateMatched.request),
    updateLiveJobCandidateMatchedSaga,
  );
  yield* takeLatest(
    getType(updateLiveJobCandidateMatched.success),
    getSelectedLiveJobCandidatesSaga,
  );
  yield* takeLatest(getType(getLiveJobFeedbacks.request), getLiveJobFeedbacksSaga);
  yield* takeLatest(getType(setSelectedLiveJobFeedback), setSelectedLiveJobFeedbackSaga);
  yield* takeLatest(getType(getLiveJobFeedbackReplies.request), getLiveJobFeedbackRepliesSaga);
  yield* takeLatest(getType(sendLiveJobFeedbackReply.request), sendLiveJobFeedbackReplySaga);
  yield* takeLatest(getType(getLiveJobsRecords.request), getLiveJobRecordSaga);
  yield* takeLatest(getType(addLiveJobRecord.request), addLiveJobRecordSaga);
  yield* takeLatest(getType(updateLiveJobRecord.request), updateLiveJobRecordSaga);
  yield* takeLatest(getType(deleteLiveJobRecord.request), deleteLiveJobRecordSaga);
  yield* takeLatest(getType(getLiveJob.request), getLiveJobSaga);
  yield* takeLatest(getType(getLiveJobContracts.request), getLiveJobContractsSaga);
}
