import { ActionType, getType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { all, call, put, select, takeLatest } from 'typed-redux-saga';

import { JobStatus, UserType } from '~/models/common';
import { Common } from '~/services/api/Common';
import { RootState } from '~/store/types';
import {
  CreateHiringManagerRequestBody,
  CreateJobInfoRequestBody,
  UpdateHiringManagerRequestBody,
} from '~/types/requests';
import { getErrorDetailsFromResponse } from '~/utils/errors';
import { transformSalaryFromStringToNumber } from '~/utils/strings';

import {
  addHiringManager,
  createDescription,
  createJobInfo,
  deleteJob,
  getHiringManagers,
  getJobDataForEdit,
  getRepresentativeManager,
  setDescriptionForEdit,
  setHiringManagerForEdit,
  setHiringManagerForJob,
  setInfoForEdit,
  updateHiringManager,
  updateJobInfo,
} from './actions';

function* createJobInfoSaga({ payload }: ActionType<typeof createJobInfo.request>): SagaIterator {
  try {
    const saveCreatedJobInfo = yield* select(
      (state: RootState) => state.createJob.saveCreatedJobInfo,
    );

    const jobId = yield* select((state: RootState) => state.createJob.createdJobInfo?.id);

    const { isUpdate } = payload;

    const userLoggedIn = yield* select((state: RootState) => state.user.loggedInUserType);

    const requestBody: CreateJobInfoRequestBody = {
      ...saveCreatedJobInfo?.formValues,
      salary:
        typeof saveCreatedJobInfo?.formValues?.salary === 'string'
          ? transformSalaryFromStringToNumber(saveCreatedJobInfo?.formValues?.salary)
          : saveCreatedJobInfo?.formValues?.salary,
      company: saveCreatedJobInfo?.formValues.company?.value,
      position: saveCreatedJobInfo?.formValues.position?.value,
      projectType: saveCreatedJobInfo?.formValues.projectType?.value,
      city: saveCreatedJobInfo?.formValues.city?.value,
      state: saveCreatedJobInfo?.formValues.state?.value,
      status: JobStatus.ACTIVE,
      hiringManager: payload.managerId,
      admin: saveCreatedJobInfo?.formValues.admin?.value,
      superAmount: saveCreatedJobInfo?.formValues?.superAmount
        ? transformSalaryFromStringToNumber(saveCreatedJobInfo.formValues?.superAmount)
        : null,
      representative: payload?.representative,
    };

    if (userLoggedIn === UserType.COMPANY) {
      const companyId = yield* select((state: RootState) => state.companyUser.typeId);

      requestBody.company = companyId;
    } else if (userLoggedIn === UserType.MANAGER) {
      const companyId = yield* select(state => state.hiringManagerUser.companyId);

      requestBody.company = companyId;
    }
    const { data } = isUpdate
      ? yield* call(Common.updateJobInfo, { id: jobId as number }, requestBody)
      : yield* call(Common.createJobInfo, requestBody);
    yield* put(createJobInfo.success(data));

    payload.onSuccess();
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(createJobInfo.fail(errorDetails));
  }
}

function* updateJobInfoSaga({ payload }: ActionType<typeof updateJobInfo.request>): SagaIterator {
  try {
    const userLoggedIn = yield* select((state: RootState) => state.user.loggedInUserType);
    const hiringManagerId = yield* select(
      (state: RootState) => state.createJob.createdJobInfo?.hiringManager,
    );
    const requestBody: CreateJobInfoRequestBody = {
      ...payload?.formValues,
      salary:
        typeof payload.formValues.salary === 'string'
          ? transformSalaryFromStringToNumber(payload.formValues.salary)
          : payload.formValues.salary,
      company: payload.formValues.company!.value || payload.formValues.company,
      position: payload.formValues.position!.value,
      projectType: payload.formValues.projectType!.value,
      city: payload.formValues.city!.value,
      state: payload.formValues.state!.value,
      status: JobStatus.ACTIVE,
      hiringManager: hiringManagerId,
      admin: payload.formValues.admin?.value,
      superAmount: payload.formValues.superAmount
        ? transformSalaryFromStringToNumber(payload.formValues.superAmount)
        : null,
      representative: payload?.formValues.representative,
    };

    if (userLoggedIn === UserType.COMPANY) {
      const companyId = yield* select((state: RootState) => state.companyUser.typeId);

      requestBody.company = companyId;
    } else if (userLoggedIn === UserType.MANAGER) {
      const companyId = yield* select((state: RootState) => state.hiringManagerUser.companyId);

      requestBody.company = companyId;
    }
    const jobId = yield* select((state: RootState) => state.createJob.createdJobInfo!.id);
    const { data } = yield* call(Common.updateJobInfo, { id: jobId }, requestBody);

    yield* put(updateJobInfo.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(updateJobInfo.fail(errorDetails));
  }
}

function* createDescriptionSaga({
  payload,
}: ActionType<typeof createDescription.request>): SagaIterator {
  try {
    const jobId = yield* select((state: RootState) => state.createJob.createdJobInfo!.id);
    const createdDescription = yield* select(
      (state: RootState) => state.createJob.createdDescription,
    );

    const { data } = createdDescription
      ? yield* call(Common.updateJobDescription, { id: jobId }, payload.requestBody)
      : yield* call(Common.createJobDescription, { id: jobId }, payload.requestBody);

    payload.onSuccess();

    yield* put(createDescription.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(createDescription.fail(errorDetails));
  }
}

function* setHiringManagerForJobSaga({
  payload,
}: ActionType<typeof setHiringManagerForJob.request>): SagaIterator {
  try {
    const jobId = yield* select((state: RootState) => state.createJob.createdJobInfo!.id);
    const companyId = yield* select((state: RootState) => state.hiringManagerUser.companyId);
    const userLoggedIn = yield* select((state: RootState) => state.user.loggedInUserType);

    const { onSuccess, managerId } = payload;
    if (userLoggedIn === UserType.MANAGER) {
      yield* call(Common.setHiringManager, jobId, { hiringManager: companyId });
    }
    yield* call(Common.setHiringManager, jobId, { hiringManager: managerId });

    onSuccess();

    yield* put(setHiringManagerForJob.success());
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(setHiringManagerForJob.fail(errorDetails));
  }
}

function* getInfoForEditSaga(jobId: number): SagaIterator {
  try {
    const { data } = yield* call(Common.getJobInfo, { id: jobId });

    yield* put(setInfoForEdit(data));
    // eslint-disable-next-line no-empty
  } catch (error) {}
}

function* getHiringManagerForEditSaga(): SagaIterator {
  try {
    const userLoggedIn = yield* select((state: RootState) => state.user.loggedInUserType);
    const companyId = yield* select((state: RootState) => state.companyUser.typeId);

    const companyIdAsJobCompanyId = yield* select(
      state => state.adminLiveJobs.selectedLiveJob?.company,
    );
    const companyIdAsHiringManagerId = yield* select(
      (state: RootState) => state.hiringManagerUser.companyId,
    );
    const id =
      userLoggedIn === UserType.COMPANY
        ? companyId
        : userLoggedIn === UserType.MANAGER
        ? companyIdAsHiringManagerId
        : companyIdAsJobCompanyId;

    const { data } = yield* call(Common.getCompanyHiringManagers, id);

    yield* put(setHiringManagerForEdit(data));
    // eslint-disable-next-line no-empty
  } catch (error) {}
}

function* getDescriptionForEditSaga(jobId: number): SagaIterator {
  try {
    const { data } = yield* call(Common.getJobDescription, { id: jobId });

    yield* put(setDescriptionForEdit(data));
    // eslint-disable-next-line no-empty
  } catch (error) {}
}

function* getJobDataForEditSaga({
  payload,
}: ActionType<typeof getJobDataForEdit.request>): SagaIterator {
  yield* all<any>([
    call(getInfoForEditSaga, payload.jobId),
    call(getHiringManagerForEditSaga),
    call(getDescriptionForEditSaga, payload.jobId),
  ]);

  yield* put(getJobDataForEdit.success());
}

function* deleteJobSaga({ payload }: ActionType<typeof deleteJob.request>): SagaIterator {
  try {
    const jobId = yield* select((state: RootState) => state.createJob.createdJobInfo!.id);

    yield* call(Common.deleteJob, { id: jobId });

    yield* put(deleteJob.success());

    payload.onSuccess();
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(deleteJob.fail(errorDetails));
  }
}

function* getCompanyManagersSaga(): SagaIterator {
  try {
    const userLoggedIn = yield* select((state: RootState) => state.user.loggedInUserType);

    const companyId = yield* select((state: RootState) => state.createJob?.savedCompanyId);
    const createdCompanyId = yield* select(
      (state: RootState) => state.createJob.createdJobInfo?.id,
    );
    const managerId = yield* select((state: RootState) => state.hiringManagerUser.companyId);
    const id = companyId || createdCompanyId;
    const { data } =
      userLoggedIn === UserType.MANAGER
        ? yield* call(Common.getCompanyHiringManagers, managerId)
        : yield* call(Common.getCompanyHiringManagers, id);

    yield* put(getHiringManagers.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(getHiringManagers.fail(errorDetails));
  }
}

function* addHiringManagerSaga({
  payload,
}: ActionType<typeof addHiringManager.request>): SagaIterator {
  try {
    const companyId = yield* select((state: RootState) => state.createJob?.savedCompanyId);
    const createdCompanyId = yield* select(
      (state: RootState) => state.createJob.createdJobInfo?.id,
    );
    const userLoggedIn = yield* select((state: RootState) => state.user.loggedInUserType);
    const managerId = yield* select((state: RootState) => state.hiringManagerUser.companyId);

    const {
      formValues: { email, lastName, firstName, position, project, city, phone, permission },
      onSuccess,
    } = payload;
    const id = companyId || createdCompanyId;

    const requestBody: CreateHiringManagerRequestBody = {
      email,
      lastName,
      firstName,
      position: position?.value,
      project: project?.value,
      office: city?.value,
      phone,
      permission,
    };

    const { data } =
      userLoggedIn === UserType.MANAGER
        ? yield* call(Common.createCompanyHiringManager, managerId, requestBody)
        : yield* call(Common.createCompanyHiringManager, id!, requestBody);
    yield* put(addHiringManager.success(data));

    onSuccess();
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(addHiringManager.fail(errorDetails));
  }
}

function* updateHiringManagerSaga({
  payload,
}: ActionType<typeof updateHiringManager.request>): SagaIterator {
  try {
    const userLoggedIn = yield* select((state: RootState) => state.user.loggedInUserType);
    const { createdJobInfo } = yield* select((state: RootState) => state.createJob);

    const requestBody: UpdateHiringManagerRequestBody = {
      ...createdJobInfo,
      salary: createdJobInfo?.salary,
      company: createdJobInfo?.company,
      position: createdJobInfo?.position,
      projectType: createdJobInfo?.projectType,
      city: createdJobInfo?.city,
      state: createdJobInfo?.state,
      status: createdJobInfo?.status,
      hiringManager: payload.hrManagerId,
      overview: createdJobInfo?.overview,
      representative: payload.representative,
    };
    if (userLoggedIn === UserType.COMPANY) {
      const companyId = yield* select((state: RootState) => state.companyUser.typeId);

      requestBody.company = companyId;
    } else if (userLoggedIn === UserType.MANAGER) {
      const companyId = yield* select((state: RootState) => state.hiringManagerUser.companyId);

      requestBody.company = companyId;
    }
    const jobId = yield* select((state: RootState) => state.createJob.createdJobInfo!.id);
    const { data } = yield* call(Common.updateJobInfo, { id: jobId }, requestBody);

    yield* put(updateHiringManager.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(updateHiringManager.fail(errorDetails));
  }
}

function* getRepresentativeManagerSaga({
  payload,
}: ActionType<typeof getRepresentativeManager.request>): SagaIterator {
  try {
    const id = payload?.selectedCompanyId;
    const { data } = yield* call(Common.getRepresentativeManagerRequest, id);

    yield* put(getRepresentativeManager.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(deleteJob.fail(errorDetails));
  }
}

export function* watchCreateJob(): SagaIterator {
  yield* takeLatest(getType(createJobInfo.request), createJobInfoSaga);
  yield* takeLatest(getType(createDescription.request), createDescriptionSaga);
  yield* takeLatest(getType(getJobDataForEdit.request), getJobDataForEditSaga);
  yield* takeLatest(getType(deleteJob.request), deleteJobSaga);
  yield* takeLatest(getType(getHiringManagers.request), getCompanyManagersSaga);
  yield* takeLatest(getType(createJobInfo.success), getCompanyManagersSaga);
  yield* takeLatest(getType(addHiringManager.request), addHiringManagerSaga);
  yield* takeLatest(getType(setHiringManagerForJob.request), setHiringManagerForJobSaga);
  yield* takeLatest(getType(updateJobInfo.request), updateJobInfoSaga);
  yield* takeLatest(getType(updateHiringManager.request), updateHiringManagerSaga);
  yield* takeLatest(getType(getRepresentativeManager.request), getRepresentativeManagerSaga);
}
