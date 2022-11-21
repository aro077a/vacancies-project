import { ActionType, getType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { call, put, select, takeLatest } from 'typed-redux-saga';

import { User as AdminUser } from '~/models/admin';
import { User as CandidateUser } from '~/models/candidate';
import { UserType } from '~/models/common';
import { User as CompanyUser } from '~/models/company';
import { User as ManagerUser } from '~/models/hiringManager';
import { User as SuperAdminUser } from '~/models/superAdmin';
import { setUser as setAdminUser } from '~/modules/adminUser/actions';
import { resetStore } from '~/modules/app/actions';
import { setUser as setCandidateUser } from '~/modules/candidateUser/actions';
import { setUser as setCompanyUser } from '~/modules/companyUser/actions';
import { setUser as setManagerUser } from '~/modules/hiringManager/actions';
import { setUser as setSuperAdminUser } from '~/modules/superAdminUser/actions';
import { User } from '~/services/api/User';
import { RootState } from '~/store/types';
import { ResetPasswordRequestBody } from '~/types/requests';
import { LoginResponse } from '~/types/responses';
import { getErrorDetailsFromResponse } from '~/utils/errors';

// eslint-disable-next-line no-restricted-imports
import {
  getCities,
  getCountries,
  getHiringManagerJobPositions,
  getHiringManagerProjectTypes,
  getJobGroups,
  getJobPositions,
  getProjectTypes,
  getStates,
} from '../common/actions';
import { forgotPassword, login, logout, resetPassword } from './actions';

function* loginSaga({ payload }: ActionType<typeof login.request>): SagaIterator {
  try {
    const { formValues, onSuccess } = payload;
    const { data } = yield* call(User.login, formValues);

    if (data.data.userType === UserType.ADMIN) {
      yield* put(setAdminUser(data as LoginResponse<AdminUser>));
    } else if (data.data.userType === UserType.COMPANY) {
      yield* put(setCompanyUser(data as LoginResponse<CompanyUser>));
    } else if (data.data.userType === UserType.CANDIDATE) {
      yield* put(setCandidateUser(data as LoginResponse<CandidateUser>));
    } else if (data.data.userType === UserType.MANAGER) {
      yield* put(setManagerUser(data as LoginResponse<ManagerUser>));
    } else if (data.data.userType === UserType.SUPER_ADMIN) {
      yield* put(setSuperAdminUser(data as LoginResponse<SuperAdminUser>));
    }

    yield* put(login.success(data));
    if (data.data.userType) {
      onSuccess(data.data.userType);
      yield* put(getJobGroups.request());
    }
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(login.fail(errorDetails));
  }
}

function* logoutSaga(): SagaIterator {
  yield* put(resetStore());
  yield* put(getCountries.request());
  yield* put(getStates.request());
  yield* put(getCities.request());
  yield* put(getJobPositions.request());
  yield* put(getProjectTypes.request());
  yield* put(getHiringManagerJobPositions.request());
  yield* put(getHiringManagerProjectTypes.request());
}

function* forgotPasswordSaga({ payload }: ActionType<typeof forgotPassword.request>): SagaIterator {
  try {
    const { formValues, onSuccess } = payload;
    yield* call(User.forgotPasswordRequest, formValues);

    yield* put(forgotPassword.success());
    onSuccess();
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(forgotPassword.fail(errorDetails));
  }
}

function* resetPasswordSaga({ payload }: ActionType<typeof resetPassword.request>): SagaIterator {
  try {
    const token = yield* select((state: RootState) => state.user.token);
    const { formValues, onSuccess } = payload;
    const requestBody: ResetPasswordRequestBody = {
      ...formValues,
      token,
    };

    yield* call(User.resetPasswordRequest, requestBody);

    yield* put(resetPassword.success());
    onSuccess();
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(resetPassword.fail(errorDetails));
  }
}

export function* watchUser(): SagaIterator {
  yield* takeLatest(getType(login.request), loginSaga);
  yield* takeLatest(getType(logout), logoutSaga);
  yield* takeLatest(getType(forgotPassword.request), forgotPasswordSaga);
  yield* takeLatest(getType(resetPassword.request), resetPasswordSaga);
}
