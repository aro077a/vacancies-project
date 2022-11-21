import { UserType } from '~/models/common';
import { ErrorResponse } from '~/types/responses';

export type UserState = {
  loggingIn: boolean;
  loggingInError: string | null;
  loggedIn: boolean;
  loggedInUserType: UserType | null;
  auth: {
    access: string;
    refresh: string;
  } | null;
  loadingForgotPassword: boolean;
  forgotPasswordErrors: ErrorResponse['detail'] | null;
  token: string;
  loadingResetPassword: boolean;
};
