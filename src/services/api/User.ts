import { AxiosPromise } from 'axios';

import { ForgotPasswordFormValues, LoginFormValues } from '~/types/formValues';
import { ResetPasswordRequestBody } from '~/types/requests';
import { LoginResponse } from '~/types/responses';

import { Api } from './Api';

export class User {
  static login(data: LoginFormValues): AxiosPromise<LoginResponse> {
    return Api.post('user/login', data);
  }

  static forgotPasswordRequest(data: ForgotPasswordFormValues): AxiosPromise<null> {
    return Api.post('user/forgot-password', data);
  }

  static resetPasswordRequest(data: ResetPasswordRequestBody): AxiosPromise<null> {
    return Api.post('user/reset-password', data);
  }
}
