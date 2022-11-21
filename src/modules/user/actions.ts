import { createAction } from 'deox';

import {
  ForgotPasswordFormValues,
  LoginFormValues,
  ResetPasswordFormValues,
} from '~/types/formValues';
import { ErrorResponse, LoginResponse, RefreshTokensResponse } from '~/types/responses';

export const login = {
  request: createAction(
    'user/LOGIN',
    resolve => (payload: { formValues: LoginFormValues; onSuccess: (arg0: string) => void }) =>
      resolve(payload),
  ),
  success: createAction(
    'user/LOGIN_SUCCESS',
    resolve => (payload: LoginResponse) => resolve(payload),
  ),
  fail: createAction(
    'user/LOGIN_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const updateTokens = createAction(
  'user/UPDATE_TOKENS',
  resolve => (payload: RefreshTokensResponse) => resolve(payload),
);

export const forgotPassword = {
  request: createAction(
    'user/FORGOT_PASSWORD',
    resolve => (payload: { formValues: ForgotPasswordFormValues; onSuccess: () => void }) =>
      resolve(payload),
  ),
  success: createAction('user/FORGOT_PASSWORD_SUCCESS'),
  fail: createAction(
    'user/FORGOT_PASSWORD_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setResetPasswordToken = createAction(
  'user/SET_RESET_PASSWORD_TOKEN',
  resolve => (payload: { token: string }) => resolve(payload),
);

export const resetPassword = {
  request: createAction(
    'user/RESET_PASSWORD',
    resolve => (payload: { formValues: ResetPasswordFormValues; onSuccess: () => void }) =>
      resolve(payload),
  ),
  success: createAction('user/RESET_PASSWORD_SUCCESS'),
  fail: createAction(
    'user/RESET_PASSWORD_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const logout = createAction('user/LOGOUT');

export const resetErrors = createAction('user/RESET_ERRORS');
