import { ActionType, getType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { call, put, select, takeLatest } from 'typed-redux-saga';

import { toggleReviewContractModalVisibility } from '~/modules/candidateProposals/actions';
import { Company } from '~/services/api/Company';
import { RootState } from '~/store/types';
import { getErrorDetailsFromResponse } from '~/utils/errors';

import {
  addCandidateToShortList,
  approveMatchedCandidateContract,
  createFeedbackForCandidate,
  createReplyForFeedback,
  getCompanyMatchedCandidates,
  getContract,
  getMatchedCandidateContract,
  getMatchedCandidateDetail,
  getMatchedCandidateFeedback,
  setSelectedMatchedCandidate,
  updateMatchedCandidateStatus,
} from './actions';

function* getCompanyMatchedCandidatesSaga(): SagaIterator {
  try {
    const { data } = yield* call(Company.getMatchedCandidates);

    yield* put(getCompanyMatchedCandidates.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(getCompanyMatchedCandidates.fail(errorDetails));
  }
}

function* updateMatchedCandidateStatusSaga({
  payload,
}: ActionType<typeof updateMatchedCandidateStatus.request>): SagaIterator {
  try {
    const { cb, formValues, matchedId } = payload;

    if (!formValues.note) {
      delete formValues.note;
    }

    yield* call(Company.updateMatchedCandidateStatus, matchedId!, formValues);

    if (cb) {
      cb();
    }

    yield* put(updateMatchedCandidateStatus.success());
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(updateMatchedCandidateStatus.fail(errorDetails));
  }
}

function* createFeedbackForCandidateSaga({
  payload,
}: ActionType<typeof createFeedbackForCandidate.request>): SagaIterator {
  try {
    const { data, cb } = payload;

    yield* call(Company.createFeedbackForCandidate, data);

    if (cb) {
      cb();
    }

    yield* put(createFeedbackForCandidate.success());
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(createFeedbackForCandidate.fail(errorDetails));
  }
}

function* getMatchedCandidateDetailSaga(): SagaIterator {
  try {
    const selectedCandidateId = yield* select(
      (state: RootState) => state.companyInterviews.selectedMatchedCandidate?.candidate,
    );

    const { data } = yield* call(Company.getMatchedCandidateDetail, selectedCandidateId!);

    yield* put(getMatchedCandidateDetail.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(getMatchedCandidateDetail.fail(errorDetails));
  }
}

function* getMatchedCandidateContractSaga(): SagaIterator {
  try {
    const selectedCandidateId = yield* select(
      (state: RootState) => state.companyInterviews.selectedMatchedCandidate?.candidate,
    );

    const { data } = yield* call(Company.getMatchedCandidateContract, selectedCandidateId!);

    yield* put(getMatchedCandidateContract.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(getMatchedCandidateContract.fail(errorDetails));
  }
}

function* getMatchedCandidateFeedbackSaga(): SagaIterator {
  try {
    const selectedCandidateId = yield* select(
      (state: RootState) => state.companyInterviews.selectedMatchedCandidate?.candidate,
    );

    const { data } = yield* call(Company.getMatchedCandidateFeedback, selectedCandidateId!);

    yield* put(getMatchedCandidateFeedback.success(data.data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(getMatchedCandidateFeedback.fail(errorDetails));
  }
}

function* getMatchedCandidateInfoSaga(): SagaIterator {
  yield* put(getMatchedCandidateDetail.request());
  yield* put(getMatchedCandidateContract.request());
  yield* put(getMatchedCandidateFeedback.request());
}

function* setSelectedMatchedCandidateSaga({
  payload,
}: ActionType<typeof setSelectedMatchedCandidate>): SagaIterator {
  if (payload !== null) {
    yield* call(getMatchedCandidateInfoSaga);
  }
}

function* createReplyOnFeedback({
  payload,
}: ActionType<typeof createReplyForFeedback.request>): SagaIterator {
  try {
    const { feedbackId, newReply } = payload;

    const { data } = yield* call(Company.createReplyForFeedback, feedbackId, { text: newReply });

    yield* put(createReplyForFeedback.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(createReplyForFeedback.fail(errorDetails));
  }
}

function* approveMatchedCandidateContractSaga({
  payload,
}: ActionType<typeof approveMatchedCandidateContract.request>): SagaIterator {
  try {
    const { data, cb } = payload;

    const response = yield* call(Company.approveMatchedCandidateContract, data.contractId!, {
      approved: data.approved,
    });

    if (cb) {
      cb();
    }

    yield* put(approveMatchedCandidateContract.success(response.data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(approveMatchedCandidateContract.fail(errorDetails));
  }
}

function* downloadContractSaga({ payload }: ActionType<typeof getContract.request>): SagaIterator {
  try {
    const contractId = yield* select(
      (state: RootState) => state.companyInterviews.selectedMatchedCandidate?.contract?.id,
    );

    const { data } = yield* call(Company.downloadContract, contractId!);

    const href = `data:application/octet-stream;base64,${data.data}`;

    yield* put(getContract.success(href));

    if (payload.isReview) {
      yield* put(toggleReviewContractModalVisibility());
    } else {
      const link = document.createElement('a');

      link.href = href;

      link.download = 'Contract';

      link.click();
    }
  } catch (error) {
    yield* put(getContract.fail());
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

export function* watchCompanyInterviews(): SagaIterator {
  yield* takeLatest(getType(getCompanyMatchedCandidates.request), getCompanyMatchedCandidatesSaga);
  yield* takeLatest(
    getType(updateMatchedCandidateStatus.request),
    updateMatchedCandidateStatusSaga,
  );
  yield* takeLatest(getType(createFeedbackForCandidate.request), createFeedbackForCandidateSaga);
  yield* takeLatest(getType(getMatchedCandidateDetail.request), getMatchedCandidateDetailSaga);
  yield* takeLatest(getType(setSelectedMatchedCandidate), setSelectedMatchedCandidateSaga);
  yield* takeLatest(getType(getMatchedCandidateContract.request), getMatchedCandidateContractSaga);
  yield* takeLatest(getType(getMatchedCandidateFeedback.request), getMatchedCandidateFeedbackSaga);
  yield* takeLatest(getType(createReplyForFeedback.request), createReplyOnFeedback);
  yield* takeLatest(
    getType(approveMatchedCandidateContract.request),
    approveMatchedCandidateContractSaga,
  );
  yield* takeLatest(getType(getContract.request), downloadContractSaga);
  yield* takeLatest(getType(addCandidateToShortList.request), addCandidateToShortListSaga);
}
