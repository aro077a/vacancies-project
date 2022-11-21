import { ActionType, getType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { call, put, select, takeLatest } from 'typed-redux-saga';

import { Common } from '~/services/api/Common';
import { Company } from '~/services/api/Company';
import { RootState } from '~/store/types';
import {
  CreateHiringManagerRequestBody,
  GetCompanyHiringManagersRequestBody,
} from '~/types/requests';
import { getErrorDetailsFromResponse } from '~/utils/errors';

import {
  createContactDetails,
  createHiringManager,
  enterInfo,
  getHiringManagers,
  uploadLogo,
} from './actions';

function* enterInfoSaga({ payload }: ActionType<typeof enterInfo.request>): SagaIterator {
  try {
    const { data } = yield* call(Company.enterInfo, {
      ...payload,
      user: { email: payload.user.email, password: payload.user.password },
      city: payload.city!.value,
      state: payload.state!.value,
      site: payload.site || null,
    });

    yield* put(enterInfo.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(enterInfo.fail(errorDetails));
  }
}

function* createContactDetailsSaga({
  payload,
}: ActionType<typeof createContactDetails.request>): SagaIterator {
  try {
    const companyId = yield* select(
      (state: RootState) => state.companyRegistration.registeredUserId,
    );

    const { data } = yield* call(Company.createContactDetails, companyId!, {
      ...payload,
      position: payload.position || null,
    });

    yield* put(createContactDetails.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(createContactDetails.fail(errorDetails));
  }
}

function* uploadLogoSaga({ payload }: ActionType<typeof uploadLogo.request>): SagaIterator {
  try {
    const companyId = yield* select(
      (state: RootState) => state.companyRegistration.registeredUserId,
    );

    const { data } = yield* call(Company.uploadLogo, payload.id || companyId!, payload.formValues);

    yield* put(uploadLogo.success(data));

    payload.onSuccess();
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(uploadLogo.fail(errorDetails));
  }
}

function* getCreatedCompanyManagersSaga(): SagaIterator {
  try {
    const companyId = yield* select(
      (state: RootState) => state.companyRegistration.registeredUserId,
    );
    const { createdCompanyManagers } = yield* select(
      (state: RootState) => state.companyRegistration,
    );
    const requestParams: GetCompanyHiringManagersRequestBody = {
      offset: createdCompanyManagers.results.length,
      limit: 12,
    };

    const { data } = yield* call(Common.getCompanyHiringManagers, companyId, requestParams);

    yield* put(getHiringManagers.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(getHiringManagers.fail(errorDetails));
  }
}

function* createHiringManagerSaga({
  payload,
}: ActionType<typeof createHiringManager.request>): SagaIterator {
  try {
    const companyId = yield* select(
      (state: RootState) => state.companyRegistration?.registeredUserId,
    );

    const {
      formValues: { firstName, lastName, email, position, project, phone, city },
      onSuccess,
    } = payload;

    const requestBody: CreateHiringManagerRequestBody = {
      firstName,
      lastName,
      email,
      phone,
      office: city!.value,
    };

    if (position?.value) {
      requestBody.position = position.value;
    }

    if (project?.value) {
      requestBody.project = project.value;
    }

    const { data } = yield* call(Common.createCompanyHiringManager, companyId, requestBody);

    yield* put(createHiringManager.success(data));

    onSuccess();
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(createHiringManager.fail(errorDetails));
  }
}

export function* watchCompanyRegistration(): SagaIterator {
  yield* takeLatest(getType(enterInfo.request), enterInfoSaga);
  yield* takeLatest(getType(createContactDetails.request), createContactDetailsSaga);
  yield* takeLatest(getType(uploadLogo.request), uploadLogoSaga);
  yield* takeLatest(getType(createHiringManager.request), createHiringManagerSaga);
  yield* takeLatest(getType(getHiringManagers.request), getCreatedCompanyManagersSaga);
}
