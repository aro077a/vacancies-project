import { ActionType, getType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { all, call, put, select, takeLatest } from 'typed-redux-saga';

import { Common } from '~/services/api/Common';
import { Company } from '~/services/api/Company';
import { Employer } from '~/services/api/Employer';
import { RootState } from '~/store/types';
import { UpdateCompanyInfoFormValues } from '~/types/formValues';
import {
  CreateCompanyInfoRequestBody,
  CreateHiringManagerRequestBody,
  GetCompanyHiringManagersRequestBody,
} from '~/types/requests';
import { getErrorDetailsFromResponse } from '~/utils/errors';

import {
  createCompanyBusinessDetails,
  createEmployerCompanyInfo,
  createHiringManager,
  deleteEmployerLogo,
  deleteHiringMangerRequest,
  editEmployerInfo,
  getEmployerForEdit,
  getEmployerLogo,
  getEmployerProfile,
  getHiringManagers,
  updateEmployerLogo,
  updateHiringManager,
  uploadCompanyLogo,
} from './actions';

function* createEmployerCompanyInfoSaga({
  payload,
}: ActionType<typeof createEmployerCompanyInfo.request>): SagaIterator {
  try {
    const { formValue, onSuccess } = payload;

    const employerId = yield* select(
      (state: RootState) => state.createEmployer.employerCompanyInfoCreated?.id,
    );

    const requestBody: CreateCompanyInfoRequestBody = {
      ...formValue,
      user: { email: formValue.user.email, password: formValue.user.password },
      city: formValue?.city?.value,
      state: formValue?.state?.value,
      admin: formValue?.admin?.value,
    };
    if (!employerId) {
      requestBody.user.password = `itxYhR7ywh${Math.floor(Math.random() * 100)}`;
    }

    const { data } = employerId
      ? yield* call(Company.editEmployer, employerId, requestBody)
      : yield* call(Employer.createCompanyInfo, requestBody);

    yield* put(createEmployerCompanyInfo.success(data));

    onSuccess();
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(createEmployerCompanyInfo.fail(errorDetails));
  }
}

function* createCompanyBusinessDetailsSaga({
  payload,
}: ActionType<typeof createCompanyBusinessDetails.request>): SagaIterator {
  try {
    const companyId = yield* select(
      (state: RootState) => state.createEmployer.employerCompanyInfoCreated?.id,
    );
    const registeredCompanyId = yield* select(
      (state: RootState) => state.createEmployer.registeredCompanyId,
    );

    const id = companyId || registeredCompanyId;

    const { formValue, onSuccess } = payload;

    const { data } = yield* call(Employer.createCompanyDetails, id, formValue);

    yield* put(createCompanyBusinessDetails.success(data));

    onSuccess();
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(createCompanyBusinessDetails.fail(errorDetails));
  }
}

function* uploadCompanyLogoSaga({
  payload,
}: ActionType<typeof uploadCompanyLogo.request>): SagaIterator {
  try {
    const companyId = yield* select(
      (state: RootState) => state.createEmployer.employerCompanyInfoCreated?.id,
    );
    const registeredCompanyId = yield* select(
      (state: RootState) => state.createEmployer.registeredCompanyId,
    );
    const employerId = yield* select((state: RootState) => state.createEmployer.employerId);

    const id = companyId || registeredCompanyId || employerId;

    const { data } = yield* call(Employer.uploadCompanyLogo, id, payload.formValues);

    payload.onSuccess();

    yield* put(uploadCompanyLogo.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(uploadCompanyLogo.fail(errorDetails));
  }
}

function* setEmployerProfileSaga(employerId: number): SagaIterator {
  try {
    const { data } = yield* call(Company.getCompany, employerId);

    yield* put(getEmployerProfile.success(data));
    // eslint-disable-next-line no-empty
  } catch (error) {}
}

function* editEmployerProfileSaga({
  payload,
}: ActionType<typeof editEmployerInfo.request>): SagaIterator {
  try {
    const employerId = yield* select((state: RootState) => state.createEmployer.employerId);

    const { formValues } = payload;
    const requestBody: UpdateCompanyInfoFormValues = {
      ...formValues,
      city: formValues.city.value,
      state: formValues.state.value,
      admin: formValues.admin.value,
    };

    const { data } = yield* call(Company.updateCompanyInfo, employerId, requestBody);

    yield* put(editEmployerInfo.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(editEmployerInfo.fail(errorDetails));
  }
}

function* getEmployerLogoSaga(employerId: number): SagaIterator {
  try {
    const { data } = yield* call(Company.fetchCompanyLogo, employerId);

    yield* put(getEmployerLogo.success(data));
    // eslint-disable-next-line no-empty
  } catch (error) {}
}

function* getEmployerForEditSaga({
  payload,
}: ActionType<typeof getEmployerForEdit.request>): SagaIterator {
  yield* all<any>([
    call(setEmployerProfileSaga, payload.employerId),
    call(getEmployerLogoSaga, payload.employerId),
  ]);

  yield* put(getEmployerForEdit.success());
}

function* updateEmployerLogoSaga({
  payload,
}: ActionType<typeof updateEmployerLogo.request>): SagaIterator {
  try {
    const { employerId, employerLogo } = yield* select((state: RootState) => state.createEmployer);

    const { data } = !employerLogo
      ? yield* call(Company.upLoadCompanyLogoRequest, employerId, payload.formValues)
      : yield* call(Company.updateCompanyLogoRequest, employerId, payload.formValues);

    yield* put(updateEmployerLogo.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(updateEmployerLogo.fail(errorDetails));
  }
}

function* deleteEmployerLogoSaga(): SagaIterator {
  try {
    const employerId = yield* select((state: RootState) => state.createEmployer.employerId);

    yield* call(Company.deletePhoto, employerId);

    yield* put(deleteEmployerLogo.success());
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(deleteEmployerLogo.fail(errorDetails));
  }
}

function* getCreatedCompanyManagersSaga({
  payload,
}: ActionType<typeof getHiringManagers.init>): SagaIterator {
  try {
    const employerId = yield* select((state: RootState) => state.createEmployer.employerId);
    const selectedCompanyId = yield* select(
      (state: RootState) => state.createEmployer?.registeredCompanyId,
    );

    const companyId = selectedCompanyId || employerId;

    const { companyManagers } = yield* select((state: RootState) => state.createEmployer);
    const { initialFetch } = payload;
    if (initialFetch || companyManagers.count > companyManagers.results.length) {
      yield* put(getHiringManagers.request());

      const requestParams: GetCompanyHiringManagersRequestBody = {
        offset: companyManagers.results.length,
        limit: 12,
      };

      const { data } = yield* call(Common.getCompanyHiringManagers, companyId, requestParams);

      yield* put(getHiringManagers.success(data));
    }
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(getHiringManagers.fail(errorDetails));
  }
}

function* createHiringManagerSaga({
  payload,
}: ActionType<typeof createHiringManager.request>): SagaIterator {
  try {
    const employerId = yield* select((state: RootState) => state.createEmployer.employerId);
    const selectedCompanyId = yield* select(
      (state: RootState) => state.createEmployer?.registeredCompanyId,
    );

    const companyId = selectedCompanyId || employerId;

    const {
      formValues: { email, firstName, lastName, city, phone, permission, position, project },
      onSuccess,
    } = payload;

    const requestBody: CreateHiringManagerRequestBody = {
      email,
      firstName,
      lastName,
      office: city!.value,
      phone,
      permission,
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

function* updateHiringMangerSaga({
  payload,
}: ActionType<typeof updateHiringManager.request>): SagaIterator {
  try {
    const employerId = yield* select((state: RootState) => state.createEmployer.employerId);
    const selectedCompanyId = yield* select(
      (state: RootState) => state.createEmployer?.registeredCompanyId,
    );

    const { formValues } = payload;

    const companyId = selectedCompanyId || employerId;
    const { managerId } = yield* select((state: RootState) => state.createEmployer);

    const requestBody: CreateHiringManagerRequestBody = {
      email: formValues.email,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      office: formValues.city!.value,
      phone: formValues.phone,
      permission: formValues.permission,
    };

    if (formValues.position?.value) {
      requestBody.position = formValues.position.value;
    }

    if (formValues.project?.value) {
      requestBody.project = formValues.project.value;
    }

    const { data } = yield* call(
      Company.updateCompanyHiringManager,
      companyId,
      managerId,
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
}: ActionType<typeof deleteHiringMangerRequest.request>): SagaIterator {
  try {
    const employerId = yield* select((state: RootState) => state.createEmployer.employerId);
    const selectedCompanyId = yield* select(
      (state: RootState) => state.createEmployer?.registeredCompanyId,
    );
    const cmpnyId = yield* select((state: RootState) => state.companyUser.typeId);

    const companyId = selectedCompanyId || employerId || cmpnyId;
    const { managerId } = payload;

    yield* call(Company.deleteHiringManager, companyId, managerId);

    yield* put(deleteHiringMangerRequest.success());
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(deleteHiringMangerRequest.fail(errorDetails));
  }
}

export function* watchCreateEmployer(): SagaIterator {
  yield* takeLatest(getType(createEmployerCompanyInfo.request), createEmployerCompanyInfoSaga);
  yield* takeLatest(
    getType(createCompanyBusinessDetails.request),
    createCompanyBusinessDetailsSaga,
  );
  yield* takeLatest(getType(uploadCompanyLogo.request), uploadCompanyLogoSaga);
  yield* takeLatest(getType(getEmployerForEdit.request), getEmployerForEditSaga);
  yield* takeLatest(getType(editEmployerInfo.request), editEmployerProfileSaga);
  yield* takeLatest(getType(updateEmployerLogo.request), updateEmployerLogoSaga);
  yield* takeLatest(getType(deleteEmployerLogo.request), deleteEmployerLogoSaga);
  yield* takeLatest(getType(createHiringManager.request), createHiringManagerSaga);
  yield* takeLatest(getType(getHiringManagers.init), getCreatedCompanyManagersSaga);
  yield* takeLatest(getType(updateHiringManager.request), updateHiringMangerSaga);
  yield* takeLatest(getType(deleteHiringMangerRequest.request), deleteHiringManagerSaga);
}
