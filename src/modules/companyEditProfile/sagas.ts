import { ActionType, getType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { all, call, put, select, takeLatest } from 'typed-redux-saga';

import { UserType } from '~/models/common';
import { Company } from '~/services/api/Company';
import { RootState } from '~/store/types';
import { UpdateCompanyInfoFormValues } from '~/types/formValues';
import {
  CreateHiringManagerRequestBody,
  GetECompanyManagersResponseParams,
} from '~/types/requests';
import { getErrorDetailsFromResponse } from '~/utils/errors';

import {
  addHiringManager,
  deleteCompanyLogo,
  deleteHiringManager,
  editCompanyInfo,
  getCompanyForEdit,
  getCompanyLogo,
  getCompanyProfile,
  getHiringManagers,
  updateHiringManager,
  updateLogo,
} from './actions';

function* setCompanyProfileSaga(): SagaIterator {
  try {
    const companyId = yield* select((state: RootState) => state.companyUser.typeId);
    const managerId = yield* select((state: RootState) => state.hiringManagerUser.companyId);
    const userLoggedIn = yield* select((state: RootState) => state.user.loggedInUserType);

    const { data } =
      userLoggedIn === UserType.MANAGER
        ? yield* call(Company.getCompany, managerId)
        : yield* call(Company.getCompany, companyId);

    yield* put(getCompanyProfile.success(data));
    // eslint-disable-next-line no-empty
  } catch (error) {}
}

function* editCompanyProfileSaga({
  payload,
}: ActionType<typeof editCompanyInfo.request>): SagaIterator {
  try {
    const companyId = yield* select((state: RootState) => state.companyUser.typeId);

    const { formValues } = payload;
    const requestBody: UpdateCompanyInfoFormValues = {
      ...formValues,
      city: formValues.city.value,
      state: formValues.state.value,
    };

    const { data } = yield* call(Company.updateCompanyInfo, companyId, requestBody);

    yield* put(editCompanyInfo.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(editCompanyInfo.fail(errorDetails));
  }
}

function* getCompanyLogoSaga(): SagaIterator {
  try {
    const companyId = yield* select((state: RootState) => state.companyUser.typeId);
    const managerId = yield* select((state: RootState) => state.hiringManagerUser.companyId);
    const userLoggedIn = yield* select((state: RootState) => state.user.loggedInUserType);

    const { data } =
      userLoggedIn === UserType.MANAGER
        ? yield* call(Company.fetchCompanyLogo, managerId)
        : yield* call(Company.fetchCompanyLogo, companyId);

    yield* put(getCompanyLogo.success(data));
    // eslint-disable-next-line no-empty
  } catch (error) {}
}

function* getCompanyForEditSaga(): SagaIterator {
  yield* all<any>([call(setCompanyProfileSaga), call(getCompanyLogoSaga)]);

  yield* put(getCompanyForEdit.success());
}

function* uploadCompanyLogoSaga({ payload }: ActionType<typeof updateLogo.request>): SagaIterator {
  try {
    const companyId = yield* select((state: RootState) => state.companyUser.typeId);
    const { companyLogo } = yield* select((state: RootState) => state.companyProfile);

    const { data } = !companyLogo
      ? yield* call(Company.upLoadCompanyLogoRequest, companyId, payload.formValues)
      : yield* call(Company.updateCompanyLogoRequest, companyId, payload.formValues);

    payload.onSuccess();

    yield* put(updateLogo.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(updateLogo.fail(errorDetails));
  }
}

function* getCompanyManagersSaga({
  payload,
}: ActionType<typeof getHiringManagers.init>): SagaIterator {
  try {
    const companyId = yield* select((state: RootState) => state.companyUser.typeId);
    const employerId = yield* select((state: RootState) => state.createEmployer.employerId);
    const userLoggedIn = yield* select((state: RootState) => state.user.loggedInUserType);

    const { companyManagers } = yield* select((state: RootState) => state.companyProfile);
    if (payload.initialFetch || companyManagers.count > companyManagers.results.length) {
      const requestParams: GetECompanyManagersResponseParams = {
        offset: companyManagers.results.length,
        limit: 12,
      };

      const { data } =
        userLoggedIn === (UserType.ADMIN || UserType.SUPER_ADMIN)
          ? yield* call(Company.getCompanyHiringManager, employerId, requestParams)
          : yield* call(Company.getCompanyHiringManager, companyId, requestParams);

      yield* put(getHiringManagers.success(data));
    }
  } catch (error) {
    yield* put(getHiringManagers.fail());
  }
}

function* addHiringMangerSaga({
  payload,
}: ActionType<typeof addHiringManager.request>): SagaIterator {
  try {
    const companyId = yield* select((state: RootState) => state.companyUser.typeId);
    const employerId = yield* select((state: RootState) => state.createEmployer.employerId);

    const registeredCompanyId = yield* select(
      (state: RootState) => state.createEmployer.registeredCompanyId,
    );

    const {
      formValues: { firstName, lastName, email, phone, position, permission, project, city },
    } = payload;

    const id = companyId || employerId || registeredCompanyId;

    const requestBody: CreateHiringManagerRequestBody = {
      firstName,
      lastName,
      email,
      position: position?.value,
      project: project?.value,
      phone,
      office: city?.value,
      permission,
    };

    const { data } = yield* call(Company.createCompanyHiringManager, id, requestBody);

    yield* put(addHiringManager.success(data));
    payload.onSuccess();
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(addHiringManager.fail(errorDetails));
  }
}

function* updateHiringMangerSaga({
  payload,
}: ActionType<typeof updateHiringManager.request>): SagaIterator {
  try {
    const companyId = yield* select((state: RootState) => state.companyUser.typeId);

    const manager = yield* select((state: RootState) => state.companyProfile.managerId);

    const { employerId, managerId } = yield* select((state: RootState) => state.createEmployer);

    const idManager = manager || managerId;

    const registeredCompanyId = yield* select(
      (state: RootState) => state.createEmployer.registeredCompanyId,
    );

    const {
      formValues: { firstName, lastName, email, position, project, city, phone, permission },
    } = payload;

    const requestBody: CreateHiringManagerRequestBody = {
      lastName,
      firstName,
      email,
      position: position?.value,
      project: project?.value,
      phone,
      office: city?.value,
      permission,
    };

    const { data } = companyId
      ? yield* call(Company.updateCompanyHiringManager, companyId, idManager, requestBody)
      : employerId
      ? yield* call(Company.updateCompanyHiringManager, employerId, idManager, requestBody)
      : yield* call(
          Company.updateCompanyHiringManager,
          registeredCompanyId,
          idManager,
          requestBody,
        );

    yield* put(updateHiringManager.success(data));
    payload.onSuccess();
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(updateHiringManager.fail(errorDetails));
  }
}

function* deleteHiringManagerSaga({
  payload,
}: ActionType<typeof deleteHiringManager.request>): SagaIterator {
  try {
    const companyId = yield* select((state: RootState) => state.companyUser.typeId);

    const registeredCompanyId = yield* select(
      (state: RootState) => state.createEmployer.registeredCompanyId,
    );
    const employerId = yield* select((state: RootState) => state.createEmployer.employerId);

    const { managerId } = payload;

    yield* call(
      Company.deleteHiringManager,
      companyId || registeredCompanyId || employerId,
      managerId,
    );

    yield* put(deleteHiringManager.success());
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(deleteHiringManager.fail(errorDetails));
  }
}

function* deleteCompanyLogoSaga(): SagaIterator {
  try {
    const companyId = yield* select((state: RootState) => state.companyUser.typeId);

    yield* call(Company.deletePhoto, companyId);

    yield* put(deleteCompanyLogo.success());
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(deleteCompanyLogo.fail(errorDetails));
  }
}

export function* watchCompanyProfile(): SagaIterator {
  yield* takeLatest(getType(getCompanyForEdit.request), getCompanyForEditSaga);
  yield* takeLatest(getType(editCompanyInfo.request), editCompanyProfileSaga);
  yield* takeLatest(getType(updateLogo.request), uploadCompanyLogoSaga);
  yield* takeLatest(getType(getHiringManagers.init), getCompanyManagersSaga);
  yield* takeLatest(getType(addHiringManager.request), addHiringMangerSaga);
  yield* takeLatest(getType(updateHiringManager.request), updateHiringMangerSaga);
  yield* takeLatest(getType(deleteHiringManager.request), deleteHiringManagerSaga);
  yield* takeLatest(getType(deleteCompanyLogo.request), deleteCompanyLogoSaga);
}
