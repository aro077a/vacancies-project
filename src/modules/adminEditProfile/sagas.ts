import { ActionType, getType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { call, put, select, takeLatest } from 'typed-redux-saga';

import { Admin } from '~/services/api/Admin';
import { RootState } from '~/store/types';
import { getErrorDetailsFromResponse } from '~/utils/errors';

import {
  editAdminPassword,
  editAdminPaymentDetails,
  editAdminProfileDetails,
  editInterviewQuestions,
  editTermsAndConditions,
  getAdminPaymentDetails,
  getInterviewQuestions,
  getTermsAndConditions,
  setAdminProfile,
} from './actions';

function* setAdminProfileSaga(): SagaIterator {
  try {
    const adminId = yield* select((state: RootState) => state.adminUser.typeId);

    const { data } = yield* call(Admin.getAdminProfile, adminId);

    yield* put(setAdminProfile.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(setAdminProfile.fail(errorDetails));
  }
}

function* editAdminProfileDetailsSaga({
  payload,
}: ActionType<typeof editAdminProfileDetails.request>): SagaIterator {
  try {
    const adminId = yield* select((state: RootState) => state.adminUser.typeId);

    const { formValues } = payload;

    const { data } = yield* call(Admin.editAdminProfileDetails, adminId, formValues);

    yield* put(editAdminProfileDetails.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(editAdminProfileDetails.fail(errorDetails));
  }
}

function* adminPaymentDetailsSaga(): SagaIterator {
  try {
    const { data } = yield* call(Admin.getAdminPayments);

    yield* put(getAdminPaymentDetails.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(getAdminPaymentDetails.fail(errorDetails));
  }
}

function* editAdminPaymentDetailsSaga({
  payload,
}: ActionType<typeof editAdminPaymentDetails.request>): SagaIterator {
  try {
    const { formValues } = payload;

    const { data } = yield* call(Admin.editAdminPayments, formValues);

    yield* put(editAdminPaymentDetails.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(editAdminPaymentDetails.fail(errorDetails));
  }
}

function* editAdminPasswordsSaga({
  payload,
}: ActionType<typeof editAdminPassword.request>): SagaIterator {
  try {
    const { formValues } = payload;

    yield* call(Admin.updatePassword, formValues);

    yield* put(editAdminPassword.success());
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(editAdminPassword.fail(errorDetails));
  }
}
function* termsAndConditionsSaga(): SagaIterator {
  try {
    const { data } = yield* call(Admin.getTermsAndConditions);

    yield* put(getTermsAndConditions.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(getTermsAndConditions.fail(errorDetails));
  }
}

function* editTermsAndConditionsSaga({
  payload,
}: ActionType<typeof editTermsAndConditions.request>): SagaIterator {
  try {
    const { formValues } = payload;

    const { data } = yield* call(Admin.updateTermsAndConditions, formValues);

    yield* put(editTermsAndConditions.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(editTermsAndConditions.fail(errorDetails));
  }
}

function* interviewQuestionsSaga(): SagaIterator {
  try {
    const { data } = yield* call(Admin.fetchInterviewQuestions);

    yield* put(getInterviewQuestions.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(getInterviewQuestions.fail(errorDetails));
  }
}

function* editInterviewQuestionsSaga({
  payload,
}: ActionType<typeof editInterviewQuestions.request>): SagaIterator {
  try {
    const { formValues } = payload;

    const { data } = yield* call(Admin.updateInterviewQuestions, formValues);

    yield* put(editInterviewQuestions.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(editInterviewQuestions.fail(errorDetails));
  }
}

export function* watchAdminProfile(): SagaIterator {
  yield* takeLatest(getType(setAdminProfile.request), setAdminProfileSaga);
  yield* takeLatest(getType(editAdminProfileDetails.request), editAdminProfileDetailsSaga);
  yield* takeLatest(getType(getAdminPaymentDetails.request), adminPaymentDetailsSaga);
  yield* takeLatest(getType(editAdminPaymentDetails.request), editAdminPaymentDetailsSaga);
  yield* takeLatest(getType(editAdminPassword.request), editAdminPasswordsSaga);
  yield* takeLatest(getType(getTermsAndConditions.request), termsAndConditionsSaga);
  yield* takeLatest(getType(editTermsAndConditions.request), editTermsAndConditionsSaga);
  yield* takeLatest(getType(getInterviewQuestions.request), interviewQuestionsSaga);
  yield* takeLatest(getType(editInterviewQuestions.request), editInterviewQuestionsSaga);
}
