import { ActionType, getType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { call, put, select, takeLatest } from 'typed-redux-saga';

import { Admin } from '~/services/api/Admin';
import { RootState } from '~/store/types';
import { GetCandidatePotentialRequestParams, GetCandidatesRequestParams } from '~/types/requests';
import { getErrorDetailsFromResponse } from '~/utils/errors';
import { transformSalaryFromStringToNumber } from '~/utils/strings';
import { SelectOption } from '~/view/components/select';

import {
  addCandidateRecord,
  deleteCandidate,
  deleteCandidateRecord,
  downloadCandidateCV,
  getCandidateAdditionalInfo,
  getCandidateFeedbackReplies,
  getCandidateFeedbacks,
  getCandidateInterestedJobs,
  getCandidateJobsMatched,
  getCandidateOverview,
  getCandidatePotentialJobs,
  getCandidateRecord,
  getCandidates,
  getCandidateVideoInterview,
  getJobsShowedInterestInCandidate,
  getPendingApprovalCount,
  sendCandidateFeedbackReply,
  setCandidatesSearchWithFilters,
  setFiltersForPotentialJobs,
  setSelectedCandidate,
  setSelectedCandidateFeedback,
  updateCandidateJobMatched,
  updateCandidateRecord,
  updateCandidateStatus,
} from './actions';

function* getCandidatesSaga({ payload }: ActionType<typeof getCandidates.init>): SagaIterator {
  try {
    const {
      searchCandidateJobType,
      searchCandidateKeyWord,
      searchCandidateRegionFilter,
      searchCandidateCityFilter,
      searchCandidateSalaryGte,
      searchCandidateSalaryLte,
      candidates,
      searchCandidateByProjectType,
      searchCandidateByProjectValue,
      searchCandidateByAvailability,
      searchCandidateByPermission,
      searchCandidateByStatus,
      searchSelectedJobs,
    } = yield* select((state: RootState) => state.adminCandidates);

    const { initialFetch, status } = payload;
    if (initialFetch || candidates.count > candidates.results.length) {
      yield* put(getCandidates.request());
      const requestParams: GetCandidatesRequestParams = {
        offset: candidates.results.length,
        limit: 12,
        search: searchCandidateKeyWord,
        prof_detail__job_positions: searchCandidateJobType.value,
        city: searchCandidateCityFilter.value,
        state: searchCandidateRegionFilter.value,
        prof_detail__min_salary__gte: transformSalaryFromStringToNumber(searchCandidateSalaryGte),
        prof_detail__min_salary__lte: transformSalaryFromStringToNumber(searchCandidateSalaryLte),
        prof_detail__project_types: searchCandidateByProjectType.value,
        prof_detail__project_values: searchCandidateByProjectValue.value,
        prof_detail__availability__in: searchCandidateByAvailability.map(
          (item: SelectOption) => item.value,
        ),
      };

      if (searchCandidateByStatus.value) {
        requestParams.prof_detail__status = searchCandidateByStatus.value;
      }

      if (!searchCandidateKeyWord) {
        delete requestParams.search;
      }

      if (!searchCandidateJobType.value) {
        delete requestParams.prof_detail__job_positions;
      }

      if (status) {
        requestParams.user__status = status;
      }

      if (!searchCandidateCityFilter.value) {
        delete requestParams.city;
      }

      if (!searchCandidateRegionFilter.value) {
        delete requestParams.state;
      }

      if (!searchCandidateSalaryGte) {
        delete requestParams.prof_detail__min_salary__gte;
      }

      if (!searchCandidateSalaryLte) {
        delete requestParams.prof_detail__min_salary__lte;
      }

      if (!searchCandidateByProjectType.value) {
        delete requestParams.prof_detail__project_types;
      }

      if (!searchCandidateByProjectValue.value) {
        delete requestParams.prof_detail__project_values;
      }

      if (!searchCandidateByAvailability.length) {
        delete requestParams.prof_detail__availability__in;
      }

      if (searchCandidateByPermission.value) {
        requestParams.prof_detail__permission = searchCandidateByPermission.value;
      }

      if (searchSelectedJobs.length) {
        requestParams.prof_detail__job_title__in = searchSelectedJobs.join(',');
      }

      const { data } = yield* call(Admin.getCandidates, requestParams);

      yield* put(getCandidates.success(data));
    }
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getCandidates.fail(errorDetails));
  }
}

function* getSelectedCandidateInfoSaga(): SagaIterator {
  yield* put(getCandidateJobsMatched.request());
  yield* put(getCandidateOverview.request());
  yield* put(getJobsShowedInterestInCandidate.request());
  yield* put(getCandidateInterestedJobs.request());
  yield* put(getCandidateAdditionalInfo.request());
  yield* put(getCandidateFeedbacks.request());
  yield* put(getCandidateVideoInterview.request());
  yield* put(getCandidateRecord.request(null));
}

function* getCandidatesWithFiltersSaga(): SagaIterator {
  yield* put(getCandidates.init({ initialFetch: true, status: 2 }));
}

function* setSelectedCandidateSaga({
  payload,
}: ActionType<typeof setSelectedCandidate>): SagaIterator {
  if (payload !== null) {
    yield* call(getSelectedCandidateInfoSaga);
  }
}

function* getCandidateJobsMatchedSaga(): SagaIterator {
  try {
    const selectedCandidateId = yield* select(
      (state: RootState) => state.adminCandidates.selectedCandidate?.id,
    );

    const { data } = yield* call(Admin.getCandidateJobsMatched, { id: selectedCandidateId! });

    yield* put(getCandidateJobsMatched.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getCandidateJobsMatched.fail(errorDetails));
  }
}

function* getCandidateOverviewSaga(): SagaIterator {
  try {
    const selectedCandidateId = yield* select(
      (state: RootState) => state.adminCandidates.selectedCandidate?.id,
    );

    const { data } = yield* call(Admin.getCandidateOverview, { id: selectedCandidateId! });

    yield* put(getCandidateOverview.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getCandidateOverview.fail(errorDetails));
  }
}

function* getCandidateVideoInterviewSaga(): SagaIterator {
  try {
    const selectedCandidateId = yield* select(
      (state: RootState) => state.adminCandidates.selectedCandidate?.id,
    );

    const { data } = yield* call(Admin.getCandidateVideoInterview, selectedCandidateId!);

    yield* put(getCandidateVideoInterview.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getCandidateVideoInterview.fail(errorDetails));
  }
}

function* getCandidateAdditionalInfoSaga(): SagaIterator {
  try {
    const selectedCandidateId = yield* select(
      (state: RootState) => state.adminCandidates.selectedCandidate?.id,
    );

    const { data } = yield* call(Admin.getCandidateAdditionalInfo, { id: selectedCandidateId! });

    yield* put(getCandidateAdditionalInfo.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getCandidateAdditionalInfo.fail(errorDetails));
  }
}

function* getJobsInterestedInCandidateSaga(): SagaIterator {
  try {
    const selectedCandidateId = yield* select(
      (state: RootState) => state.adminCandidates.selectedCandidate?.id,
    );

    const { data } = yield* call(Admin.getJobsShowedInterestInCandidate, {
      id: selectedCandidateId!,
    });

    yield* put(getJobsShowedInterestInCandidate.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getJobsShowedInterestInCandidate.fail(errorDetails));
  }
}

function* getCandidateInterestedJobsSaga(): SagaIterator {
  try {
    const selectedCandidateId = yield* select(
      (state: RootState) => state.adminCandidates.selectedCandidate?.id,
    );

    const { data } = yield* call(Admin.getCandidateInterestJob, {
      id: selectedCandidateId!,
    });

    yield* put(getCandidateInterestedJobs.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getCandidateInterestedJobs.fail(errorDetails));
  }
}

function* getCandidatePotentialJobsSaga({
  payload,
}: ActionType<typeof getCandidatePotentialJobs.request>): SagaIterator {
  try {
    const selectedCandidateId = yield* select(
      (state: RootState) => state.adminCandidates.selectedCandidate?.id,
    );

    const potentialJobCount = yield* select(
      (state: RootState) => state.adminCandidates.potentialCandidateJobs,
    );

    const { potentialSearchValue } = yield* select((state: RootState) => state.adminCandidates);

    if (payload?.initialFetch || potentialJobCount.count > potentialJobCount.results.length) {
      getCandidatePotentialJobs.request(null);
      const requestParams: GetCandidatePotentialRequestParams = {
        limit: 10,
        offset: potentialJobCount.results.length,
      };

      if (potentialSearchValue) {
        requestParams.search = potentialSearchValue;
      }

      const { data } = yield* call(
        Admin.getPotentialCandidateJobs,
        selectedCandidateId!,
        requestParams,
      );

      yield* put(getCandidatePotentialJobs.success(data));
    }
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getCandidatePotentialJobs.fail(errorDetails));
  }
}

function* setFiltersForPotentialJobsSaga(): SagaIterator {
  yield* put(getCandidatePotentialJobs.request({ initialFetch: true }));
}

function* getCandidateFeedbacksSaga(): SagaIterator {
  try {
    const selectedCandidateId = yield* select(
      (state: RootState) => state.adminCandidates.selectedCandidate?.id,
    );

    const { data } = yield* call(Admin.getCandidateFeedbacks, { id: selectedCandidateId! });

    yield* put(getCandidateFeedbacks.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getCandidateFeedbacks.fail(errorDetails));
  }
}

function* getCandidateSelectedFeedbackRepliesSaga(): SagaIterator {
  try {
    const selectedFeedbackId = yield* select(
      (state: RootState) => state.adminCandidates.selectedCandidateFeedback?.id,
    );

    const { data } = yield* call(Admin.getCandidateFeedbackReplies, {
      feedbackId: selectedFeedbackId!,
    });

    yield* put(getCandidateFeedbackReplies.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getCandidateFeedbackReplies.fail(errorDetails));
  }
}

function* sendCandidateSelectedFeedbackReplySaga({
  payload,
}: ActionType<typeof sendCandidateFeedbackReply.request>): SagaIterator {
  try {
    const selectedFeedbackId = yield* select(
      (state: RootState) => state.adminCandidates.selectedCandidateFeedback?.id,
    );

    const { data } = yield* call(
      Admin.sendCandidateFeedbackReply,
      {
        feedbackId: selectedFeedbackId!,
      },
      { text: payload.text },
    );

    yield* put(sendCandidateFeedbackReply.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(sendCandidateFeedbackReply.fail(errorDetails));
  }
}

function* setSelectedCandidateFeedbackSaga({
  payload,
}: ActionType<typeof setSelectedCandidateFeedback>): SagaIterator {
  if (payload !== null) {
    yield* put(getCandidateFeedbackReplies.request());
  }
}

function* updateCandidateJobMatchedSaga({
  payload,
}: ActionType<typeof updateCandidateJobMatched.request>): SagaIterator {
  try {
    const selectedCandidateId = yield* select(
      (state: RootState) => state.adminCandidates.selectedCandidate?.id,
    );

    const { data } = yield* call(Admin.updateCandidateJobMatched, {
      status: payload.status,
      job: payload.jobId,
      candidate: selectedCandidateId!,
    });

    yield* put(updateCandidateJobMatched.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(updateCandidateJobMatched.fail(errorDetails));
  }
}

function* updateCandidateStatusSaga({
  payload,
}: ActionType<typeof updateCandidateStatus.request>): SagaIterator {
  try {
    yield* call(
      Admin.updateCandidateStatus,
      { id: payload.candidateId! },
      { status: payload.status },
    );

    yield* put(updateCandidateStatus.success({ candidateId: payload.candidateId }));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(updateCandidateStatus.fail(errorDetails));
  }
}

function* getCandidateRecordSaga({
  payload,
}: ActionType<typeof getCandidateRecord.request>): SagaIterator {
  try {
    const selectedCandidateId = yield* select(
      (state: RootState) => state.adminCandidates.selectedCandidate?.id,
    );

    const id = selectedCandidateId || payload?.candidateId;

    const { data } = yield* call(Admin.getCandidateRecord, {
      id: id!,
    });
    yield* put(getCandidateRecord.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getCandidateRecord.fail(errorDetails));
  }
}

function* addCandidateRecordSaga({
  payload,
}: ActionType<typeof addCandidateRecord.request>): SagaIterator {
  try {
    const selectedCandidateId = yield* select(
      (state: RootState) => state.adminCandidates.selectedCandidate?.id,
    );

    const candidateId = yield* select(
      (state: RootState) => state.createCandidate.candidateProfileCreated?.id,
    );

    const id = selectedCandidateId || candidateId;
    const { data } = yield* call(Admin.addCandidateRecordRequest, { id: id! }, payload);

    yield* put(addCandidateRecord.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(addCandidateRecord.fail(errorDetails));
  }
}

function* updateCandidateRecordSaga({
  payload,
}: ActionType<typeof updateCandidateRecord.request>): SagaIterator {
  try {
    const selectedCandidateId = yield* select(
      (state: RootState) => state.adminCandidates.selectedCandidate?.id,
    );

    const candidateId = yield* select(
      (state: RootState) => state.createCandidate.candidateProfileCreated?.id,
    );

    const id = selectedCandidateId || candidateId;
    const { selectedRecordId } = yield* select((state: RootState) => state.adminCandidates);

    const { data } = yield* call(
      Admin.updateCandidateRecord,
      { id: id! },
      selectedRecordId,
      payload,
    );

    yield* put(updateCandidateRecord.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(updateCandidateRecord.fail(errorDetails));
  }
}

function* deleteCandidateRecordSaga({
  payload,
}: ActionType<typeof deleteCandidateRecord.request>): SagaIterator {
  try {
    const selectedCandidateId = yield* select(
      (state: RootState) => state.adminCandidates.selectedCandidate?.id,
    );
    const candidateId = yield* select(
      (state: RootState) => state.createCandidate.candidateProfileCreated?.id,
    );
    const id = selectedCandidateId || candidateId;
    const { recordId } = payload;
    yield* call(Admin.deleteCandidateRecord, id, recordId);

    yield* put(deleteCandidateRecord.success());
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(deleteCandidateRecord.fail(errorDetails));
  }
}

function* getPendingApprovalCountSaga(): SagaIterator {
  try {
    const requestParams: GetCandidatesRequestParams = {
      offset: 1,
      limit: 1,
      user__status: 1,
    };

    const { data } = yield* call(Admin.getCandidates, requestParams);

    yield* put(getPendingApprovalCount.success(data.data.count));
  } catch (error) {
    yield* put(getPendingApprovalCount.fail());
  }
}

function* downloadCandidateCVSaga({
  payload,
}: ActionType<typeof downloadCandidateCV.request>): SagaIterator {
  try {
    const { data } = yield* call(Admin.donwloadCandidateCV, payload);

    const link = document.createElement('a');

    link.href = `data:application/octet-stream;base64,${data.data}`;

    link.download = 'Candidate_CV.pdf';

    link.click();

    yield* put(downloadCandidateCV.success());
  } catch (error) {
    yield* put(downloadCandidateCV.fail());
  }
}

function* deleteCandidateSaga({
  payload,
}: ActionType<typeof deleteCandidate.request>): SagaIterator {
  const { candidateId, onSuccess } = payload;
  try {
    yield* call(Admin.deleteCandidateRequest, candidateId);

    yield* put(deleteCandidate.success());
    onSuccess();
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(deleteCandidate.fail(errorDetails));
  }
}

export function* watchAdminCandidates(): SagaIterator {
  yield* takeLatest(getType(getCandidates.init), getCandidatesSaga);
  yield* takeLatest(getType(setSelectedCandidate), setSelectedCandidateSaga);
  yield* takeLatest(getType(getCandidateJobsMatched.request), getCandidateJobsMatchedSaga);
  yield* takeLatest(getType(getCandidateOverview.request), getCandidateOverviewSaga);
  yield* takeLatest(
    getType(getJobsShowedInterestInCandidate.request),
    getJobsInterestedInCandidateSaga,
  );
  yield* takeLatest(getType(getCandidateInterestedJobs.request), getCandidateInterestedJobsSaga);
  yield* takeLatest(getType(getCandidatePotentialJobs.request), getCandidatePotentialJobsSaga);
  yield* takeLatest(getType(updateCandidateJobMatched.request), updateCandidateJobMatchedSaga);
  yield* takeLatest(getType(updateCandidateJobMatched.success), getSelectedCandidateInfoSaga);
  yield* takeLatest(getType(getCandidateAdditionalInfo.request), getCandidateAdditionalInfoSaga);
  yield* takeLatest(getType(setCandidatesSearchWithFilters), getCandidatesWithFiltersSaga);
  yield* takeLatest(getType(updateCandidateStatus.request), updateCandidateStatusSaga);
  yield* takeLatest(getType(getCandidateFeedbacks.request), getCandidateFeedbacksSaga);
  yield* takeLatest(
    getType(getCandidateFeedbackReplies.request),
    getCandidateSelectedFeedbackRepliesSaga,
  );
  yield* takeLatest(
    getType(sendCandidateFeedbackReply.request),
    sendCandidateSelectedFeedbackReplySaga,
  );
  yield* takeLatest(getType(getCandidateVideoInterview.request), getCandidateVideoInterviewSaga);
  yield* takeLatest(getType(setSelectedCandidateFeedback), setSelectedCandidateFeedbackSaga);
  yield* takeLatest(getType(getCandidateRecord.request), getCandidateRecordSaga);
  yield* takeLatest(getType(updateCandidateRecord.request), updateCandidateRecordSaga);
  yield* takeLatest(getType(deleteCandidateRecord.request), deleteCandidateRecordSaga);
  yield* takeLatest(getType(setFiltersForPotentialJobs), setFiltersForPotentialJobsSaga);
  yield* takeLatest(getType(getPendingApprovalCount.request), getPendingApprovalCountSaga);
  yield* takeLatest(getType(downloadCandidateCV.request), downloadCandidateCVSaga);
  yield* takeLatest(getType(addCandidateRecord.request), addCandidateRecordSaga);
  yield* takeLatest(getType(deleteCandidate.request), deleteCandidateSaga);
}
