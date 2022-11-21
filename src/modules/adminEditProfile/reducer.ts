import { createReducer } from 'deox';
import produce from 'immer';

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
import { AdminProfileState } from './types';

const initialState: AdminProfileState = {
  getAdminProfileLoading: false,
  profileEditingLoading: false,
  profileDetailsEditErrors: null,
  paymentDetailsEditErrors: null,
  termsAndConditionsEditErrors: null,
  interviewQuestionsEditErrors: null,
  editPasswordErrors: null,
  adminId: 0,
  user: null,
  phone: '',
  paymentDetails: null,
  gettingPaymentDetailsLoading: false,
  editingPaymentDetailsLoading: false,
  gettingTermsAndConditionsLoading: false,
  editingTermsAndConditionsLoading: false,
  gettingInterviewQuestionsLoading: false,
  editingInterviewQuestionsLoading: false,
  editingPasswordLoading: false,
  text: '',
  interviewQuestions: null,
};

export const adminProfileReducer = createReducer(initialState, handle => [
  handle(setAdminProfile.request, state =>
    produce(state, draft => {
      draft.getAdminProfileLoading = true;
    }),
  ),
  handle(setAdminProfile.success, (state, { payload }) =>
    produce(state, draft => {
      draft.getAdminProfileLoading = false;
      draft.adminId = payload.data.id;
      draft.user = payload.data.user;
      draft.phone = payload.data.phone;
    }),
  ),
  handle(setAdminProfile.fail, state =>
    produce(state, draft => {
      draft.getAdminProfileLoading = false;
    }),
  ),

  handle(editAdminProfileDetails.request, state =>
    produce(state, draft => {
      draft.profileEditingLoading = true;
    }),
  ),
  handle(editAdminProfileDetails.success, (state, { payload }) =>
    produce(state, draft => {
      draft.profileEditingLoading = false;
      draft.profileDetailsEditErrors = null;
      draft.adminId = payload.data.id;
      draft.user = payload.data.user;
      draft.phone = payload.data.phone;
    }),
  ),
  handle(editAdminProfileDetails.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.profileEditingLoading = false;
      draft.profileDetailsEditErrors = payload;
    }),
  ),

  handle(getAdminPaymentDetails.request, state =>
    produce(state, draft => {
      draft.gettingPaymentDetailsLoading = true;
    }),
  ),
  handle(getAdminPaymentDetails.success, (state, { payload }) =>
    produce(state, draft => {
      draft.gettingPaymentDetailsLoading = false;
      draft.paymentDetails = payload.data;
    }),
  ),
  handle(getAdminPaymentDetails.fail, state =>
    produce(state, draft => {
      draft.gettingPaymentDetailsLoading = false;
    }),
  ),

  handle(editAdminPaymentDetails.request, state =>
    produce(state, draft => {
      draft.editingPaymentDetailsLoading = true;
    }),
  ),
  handle(editAdminPaymentDetails.success, (state, { payload }) =>
    produce(state, draft => {
      draft.editingPaymentDetailsLoading = false;
      draft.paymentDetailsEditErrors = null;
      draft.paymentDetails = payload.data;
    }),
  ),
  handle(editAdminPaymentDetails.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.editingPaymentDetailsLoading = false;
      draft.paymentDetailsEditErrors = payload;
    }),
  ),

  handle(editAdminPassword.request, state =>
    produce(state, draft => {
      draft.editingPasswordLoading = true;
    }),
  ),
  handle(editAdminPassword.success, state =>
    produce(state, draft => {
      draft.editingPasswordLoading = false;
    }),
  ),
  handle(editAdminPassword.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.editingPasswordLoading = false;
      draft.editPasswordErrors = payload;
    }),
  ),

  handle(getTermsAndConditions.request, state =>
    produce(state, draft => {
      draft.gettingTermsAndConditionsLoading = true;
    }),
  ),
  handle(getTermsAndConditions.success, (state, { payload }) =>
    produce(state, draft => {
      draft.gettingTermsAndConditionsLoading = false;
      draft.text = payload.data.text;
    }),
  ),
  handle(getTermsAndConditions.fail, state =>
    produce(state, draft => {
      draft.gettingTermsAndConditionsLoading = false;
    }),
  ),

  handle(editTermsAndConditions.request, state =>
    produce(state, draft => {
      draft.editingTermsAndConditionsLoading = true;
    }),
  ),
  handle(editTermsAndConditions.success, (state, { payload }) =>
    produce(state, draft => {
      draft.editingTermsAndConditionsLoading = false;
      draft.text = payload.data.text;
    }),
  ),
  handle(editTermsAndConditions.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.editingTermsAndConditionsLoading = false;
      draft.termsAndConditionsEditErrors = payload;
    }),
  ),

  handle(getInterviewQuestions.request, state =>
    produce(state, draft => {
      draft.gettingInterviewQuestionsLoading = true;
    }),
  ),
  handle(getInterviewQuestions.success, (state, { payload }) =>
    produce(state, draft => {
      draft.gettingInterviewQuestionsLoading = false;
      draft.interviewQuestions = payload.data;
    }),
  ),
  handle(getInterviewQuestions.fail, state =>
    produce(state, draft => {
      draft.gettingInterviewQuestionsLoading = false;
    }),
  ),

  handle(editInterviewQuestions.request, state =>
    produce(state, draft => {
      draft.editingInterviewQuestionsLoading = true;
    }),
  ),
  handle(editInterviewQuestions.success, (state, { payload }) =>
    produce(state, draft => {
      draft.editingInterviewQuestionsLoading = false;
      draft.interviewQuestionsEditErrors = null;
      draft.interviewQuestions = payload.data;
    }),
  ),
  handle(editInterviewQuestions.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.editingInterviewQuestionsLoading = false;
      draft.interviewQuestionsEditErrors = payload;
    }),
  ),
]);
