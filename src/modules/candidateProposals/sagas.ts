import { ActionType, getType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { call, put, select, takeLatest } from 'typed-redux-saga';

import { Candidate } from '~/services/api/Candidate';
import { RootState } from '~/store/types';
import { getErrorDetailsFromResponse } from '~/utils/errors';

import {
  approveMatchedJobContract,
  createFeedbackForJob,
  createReplyForFeedback,
  getCandidateMatchedJobs,
  getContract,
  getMatchedJobContracts,
  getMatchedJobDetail,
  getMatchedJobFeedback,
  setSelectedMatchedJob,
  toggleReviewContractModalVisibility,
  updateCandidateMatchedJob,
} from './actions';

function* getCandidateProposalsSaga(): SagaIterator {
  try {
    const { data } = yield* call(Candidate.getCandidateProposals);

    yield* put(getCandidateMatchedJobs.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getCandidateMatchedJobs.fail(errorDetails));
  }
}

function* updateCandidateMatchedJobStatus({
  payload,
}: ActionType<typeof updateCandidateMatchedJob.request>): SagaIterator {
  try {
    const { step, matchedId, cb } = payload;

    yield* call(Candidate.updateCandidateMatchedJobStatus, matchedId!, { step });

    if (cb) {
      cb();
    }

    yield* put(updateCandidateMatchedJob.success());
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(updateCandidateMatchedJob.fail(errorDetails));
  }
}

function* getMatchedJobDetailSaga(): SagaIterator {
  try {
    const selectedJobId = yield* select(
      (state: RootState) => state.candidateProposals.selectedMatchedJob?.job,
    );

    const { data } = yield* call(Candidate.getJobDetail, selectedJobId!);

    yield* put(getMatchedJobDetail.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getMatchedJobDetail.fail(errorDetails));
  }
}

function* getMatchedJobContractsSaga(): SagaIterator {
  try {
    const selectedJobId = yield* select(
      (state: RootState) => state.candidateProposals.selectedMatchedJob?.job,
    );

    const { data } = yield* call(Candidate.getContracts, selectedJobId!);

    yield* put(getMatchedJobContracts.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getMatchedJobContracts.fail(errorDetails));
  }
}

function* getMatchedJobFeedbackSaga(): SagaIterator {
  try {
    const selectedJobId = yield* select(
      (state: RootState) => state.candidateProposals.selectedMatchedJob?.job,
    );

    const { data } = yield* call(Candidate.getFeedbacks, selectedJobId!);

    yield* put(getMatchedJobFeedback.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getMatchedJobFeedback.fail(errorDetails));
  }
}

function* createFeedbackForJobSaga({
  payload,
}: ActionType<typeof createFeedbackForJob.request>): SagaIterator {
  try {
    const { data, cb } = payload;

    yield* call(Candidate.createFeedbackForJob, data);

    if (cb) {
      cb();
    }

    yield* put(createFeedbackForJob.success());
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(createFeedbackForJob.fail(errorDetails));
  }
}

function* getMatchedJobInfo(): SagaIterator {
  yield* put(getMatchedJobDetail.request());
  yield* put(getMatchedJobContracts.request());
  yield* put(getMatchedJobFeedback.request());
}

function* setSelectedMatchedJobSaga({
  payload,
}: ActionType<typeof setSelectedMatchedJob>): SagaIterator {
  if (payload !== null) {
    yield* call(getMatchedJobInfo);
  }
}

function* approveMatchedJobContractSaga({
  payload,
}: ActionType<typeof approveMatchedJobContract.request>): SagaIterator {
  try {
    const selectedJobId = yield* select(
      (state: RootState) => state.candidateProposals.selectedMatchedJob?.job,
    );

    const { data } = yield* call(Candidate.approveContract, selectedJobId!, { approved: payload });

    yield* put(approveMatchedJobContract.success(data));

    yield* put(toggleReviewContractModalVisibility());
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(approveMatchedJobContract.fail(errorDetails));
  }
}

function* createReplyOnFeedback({
  payload,
}: ActionType<typeof createReplyForFeedback.request>): SagaIterator {
  try {
    const { feedbackId, newReply } = payload;

    const { data } = yield* call(Candidate.createReplyOnFeedback, feedbackId, { text: newReply });

    yield* put(createReplyForFeedback.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(createReplyForFeedback.fail(errorDetails));
  }
}

function* downloadContractSaga({ payload }: ActionType<typeof getContract.request>): SagaIterator {
  try {
    const contractId = yield* select(
      (state: RootState) => state.candidateProposals.selectedMatchedJob?.contract?.id,
    );

    const { data } = yield* call(Candidate.downloadContract, contractId!);

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

export function* watchCandidateProposals(): SagaIterator {
  yield* takeLatest(getType(getCandidateMatchedJobs.request), getCandidateProposalsSaga);
  yield* takeLatest(getType(updateCandidateMatchedJob.request), updateCandidateMatchedJobStatus);
  yield* takeLatest(getType(createFeedbackForJob.request), createFeedbackForJobSaga);
  yield* takeLatest(getType(getMatchedJobDetail.request), getMatchedJobDetailSaga);
  yield* takeLatest(getType(getMatchedJobContracts.request), getMatchedJobContractsSaga);
  yield* takeLatest(getType(getMatchedJobFeedback.request), getMatchedJobFeedbackSaga);
  yield* takeLatest(getType(setSelectedMatchedJob), setSelectedMatchedJobSaga);
  yield* takeLatest(getType(approveMatchedJobContract.request), approveMatchedJobContractSaga);
  yield* takeLatest(getType(createReplyForFeedback.request), createReplyOnFeedback);
  yield* takeLatest(getType(getContract.request), downloadContractSaga);
}
