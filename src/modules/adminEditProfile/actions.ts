import { createAction } from 'deox';

import {
  EditAdminPaymentDetailsFormValues,
  EditAdminProfileDetailsFormValues,
  EditPasswordFormValues,
  InterviewQuestionsFormValues,
  TermsAndConditionsFormValues,
} from '~/types/formValues';
import {
  ErrorResponse,
  GetAdminPaymentResponse,
  GetAdminProfileResponse,
  GetInterviewQuestionsResponse,
  GetTermsAndConditionsResponse,
} from '~/types/responses';

export const setAdminProfile = {
  request: createAction('adminProfile/GET_ADMIN_PROFILE'),
  success: createAction(
    'adminProfile/GET_ADMIN_PROFILE_SUCCESS',
    resolve => (payload: GetAdminProfileResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminProfile/GET_ADMIN_PROFILE_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const editAdminProfileDetails = {
  request: createAction(
    'adminProfile/EDIT_ADMIN_PROFILE_DETAILS',
    resolve => (payload: { formValues: EditAdminProfileDetailsFormValues }) => resolve(payload),
  ),
  success: createAction(
    'adminProfile/EDIT_ADMIN_PROFILE_DETAILS_SUCCESS',
    resolve => (payload: GetAdminProfileResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminProfile/EDIT_ADMIN_PROFILE_DETAILS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getAdminPaymentDetails = {
  request: createAction('adminProfile/GET_ADMIN_PAYMENT_DETAILS'),
  success: createAction(
    'adminProfile/GET_ADMIN_PAYMENT_DETAILS_SUCCESS',
    resolve => (payload: GetAdminPaymentResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminProfile/GET_ADMIN_PAYMENT_DETAILS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const editAdminPaymentDetails = {
  request: createAction(
    'adminProfile/EDIT_ADMIN_PAYMENT_DETAILS',
    resolve => (payload: { formValues: EditAdminPaymentDetailsFormValues }) => resolve(payload),
  ),
  success: createAction(
    'adminProfile/EDIT_ADMIN_PAYMENT_DETAILS_SUCCESS',
    resolve => (payload: GetAdminPaymentResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminProfile/EDIT_ADMIN_PAYMENT_DETAILS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const editAdminPassword = {
  request: createAction(
    'adminProfile/EDIT_ADMIN_PASSWORDS',
    resolve => (payload: { formValues: EditPasswordFormValues }) => resolve(payload),
  ),
  success: createAction('adminProfile/EDIT_ADMIN_PASSWORDS_SUCCESS'),
  fail: createAction(
    'adminProfile/EDIT_ADMIN_PASSWORDS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getTermsAndConditions = {
  request: createAction('adminProfile/GET_TERMS_AND_CONDITIONS'),
  success: createAction(
    'adminProfile/GET_TERMS_AND_CONDITIONS_SUCCESS',
    resolve => (payload: GetTermsAndConditionsResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminProfile/GET_TERMS_AND_CONDITIONS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const editTermsAndConditions = {
  request: createAction(
    'adminProfile/EDIT_TERMS_AND_CONDITIONS',
    resolve => (payload: { formValues: TermsAndConditionsFormValues }) => resolve(payload),
  ),
  success: createAction(
    'adminProfile/EDIT_TERMS_AND_CONDITIONS_SUCCESS',
    resolve => (payload: GetTermsAndConditionsResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminProfile/EDIT_TERMS_AND_CONDITIONS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getInterviewQuestions = {
  request: createAction('adminProfile/GET_INTERVIEW_QUESTIONS'),
  success: createAction(
    'adminProfile/GET_INTERVIEW_QUESTIONS_SUCCESS',
    resolve => (payload: GetInterviewQuestionsResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminProfile/GET_INTERVIEW_QUESTIONS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const editInterviewQuestions = {
  request: createAction(
    'adminProfile/EDIT_INTERVIEW_QUESTIONS',
    resolve => (payload: { formValues: InterviewQuestionsFormValues }) => resolve(payload),
  ),
  success: createAction(
    'adminProfile/EDIT_INTERVIEW_QUESTIONS_SUCCESS',
    resolve => (payload: GetInterviewQuestionsResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminProfile/EDIT_INTERVIEW_QUESTIONS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};
