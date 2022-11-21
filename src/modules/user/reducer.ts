import { createReducer } from 'deox';
import produce from 'immer';

import {
  forgotPassword,
  login,
  resetErrors,
  resetPassword,
  setResetPasswordToken,
  updateTokens,
} from './actions';
import { UserState } from './types';

export const initialState: UserState = {
  loggingIn: false,
  loggingInError: null,
  loggedIn: false,
  loggedInUserType: null,
  auth: null,
  loadingForgotPassword: false,
  forgotPasswordErrors: null,
  token: '',
  loadingResetPassword: false,
};

export const userReducer = createReducer(initialState, handle => [
  handle(login.request, state =>
    produce(state, draft => {
      draft.loggingIn = true;
      draft.loggingInError = null;
    }),
  ),
  handle(login.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loggingIn = false;
      draft.loggedIn = true;
      draft.loggedInUserType = payload.data.userType;
      draft.auth = {
        access: payload.data.access,
        refresh: payload.data.refresh,
      };
    }),
  ),
  handle(login.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.loggingIn = false;
      draft.loggingInError = payload as string;
    }),
  ),
  handle(updateTokens, (state, { payload }) =>
    produce(state, draft => {
      draft.auth!.access = payload.data.access;
      draft.auth!.refresh = payload.data.refresh;
    }),
  ),
  handle(resetErrors, state =>
    produce(state, draft => {
      draft.loggingInError = null;
      draft.forgotPasswordErrors = null;
    }),
  ),
  handle(forgotPassword.request, state =>
    produce(state, draft => {
      draft.loadingForgotPassword = true;
    }),
  ),
  handle(forgotPassword.success, state =>
    produce(state, draft => {
      draft.loadingForgotPassword = false;
    }),
  ),
  handle(forgotPassword.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingForgotPassword = false;
      draft.forgotPasswordErrors = payload;
    }),
  ),

  handle(setResetPasswordToken, (state, { payload }) =>
    produce(state, draft => {
      draft.token = payload.token;
    }),
  ),

  handle(resetPassword.request, state =>
    produce(state, draft => {
      draft.loadingResetPassword = true;
    }),
  ),
  handle(resetPassword.success, state =>
    produce(state, draft => {
      draft.loadingResetPassword = false;
    }),
  ),
  handle(resetPassword.fail, state =>
    produce(state, draft => {
      draft.loadingResetPassword = false;
    }),
  ),
]);
