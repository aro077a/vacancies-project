import { ActionType, getType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { call, put, select, takeLatest } from 'typed-redux-saga';

import { Admin } from '~/services/api/Admin';
import { RootState } from '~/store/types';
import { AssignJobToAdminFormValues } from '~/types/formValues';
import {
  GetAdminCompaniesRequestParams,
  GetAdminRegionsRequestParams,
  GetListOfAdminsRequestParams,
} from '~/types/requests';
import { getErrorDetailsFromResponse } from '~/utils/errors';

import {
  assignCompaniesAndRegionsToAdmin,
  assignJobToAdmin,
  deleteAdmin,
  getAdminJobs,
  getAdminPositionsList,
  getAdminRegions,
  getListOfAdmins,
  inviteAdmin,
} from './actions';

function* getListOfAdminsSaga({ payload }: ActionType<typeof getListOfAdmins.init>): SagaIterator {
  try {
    const { listOfAdmins } = yield* select((state: RootState) => state.manageAdmins);
    if (payload.initialFetch || listOfAdmins.count > listOfAdmins.results.length) {
      yield* put(getListOfAdmins.request());
      const requestParams: GetListOfAdminsRequestParams = {
        offset: listOfAdmins.results.length,
        limit: 12,
      };

      const { data } = yield* call(Admin.getAllAdmins, requestParams);

      yield* put(getListOfAdmins.success(data));
    }
  } catch (error) {
    yield* put(getListOfAdmins.fail());
  }
}

function* inviteAdminSaga({ payload }: ActionType<typeof inviteAdmin.request>): SagaIterator {
  try {
    const { formValues, onSuccess } = payload;
    const { data } = yield* call(Admin.inviteAdminRequest, formValues);

    yield* put(inviteAdmin.success(data));
    onSuccess();
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(inviteAdmin.fail(errorDetails));
  }
}

function* getAdminPositionsListSaga({
  payload,
}: ActionType<typeof getAdminPositionsList.init>): SagaIterator {
  try {
    const { adminPositionsList } = yield* select((state: RootState) => state.manageAdmins);
    if (payload.initialFetch || adminPositionsList.count > adminPositionsList.results.length) {
      yield* put(getAdminPositionsList.request());
      const requestParams: GetAdminCompaniesRequestParams = {
        offset: adminPositionsList.results.length,
        limit: 12,
      };
      const { adminId } = payload;
      const { data } = yield* call(Admin.getAdminPositionsListRequest, adminId, requestParams);

      yield* put(getAdminPositionsList.success(data));
    }
  } catch (error) {
    yield* put(getAdminPositionsList.fail());
  }
}

function* getAdminRegionsSaga({ payload }: ActionType<typeof getAdminRegions.init>): SagaIterator {
  try {
    const { adminRegions } = yield* select((state: RootState) => state.manageAdmins);
    if (payload.initialFetch || adminRegions.count > adminRegions.results.length) {
      yield* put(getAdminRegions.request());
      const requestParams: GetAdminRegionsRequestParams = {
        offset: adminRegions.results.length,
        limit: 12,
      };
      const { adminId } = payload;
      const { data } = yield* call(Admin.getAdminRegionList, adminId, requestParams);

      yield* put(getAdminRegions.success(data));
    }
  } catch (error) {
    yield* put(getAdminRegions.fail());
  }
}

function* getAdminJobsSaga({ payload }: ActionType<typeof getAdminJobs.init>): SagaIterator {
  try {
    const { adminJobs } = yield* select((state: RootState) => state.manageAdmins);
    if (payload.initialFetch || adminJobs.count > adminJobs.results.length) {
      yield* put(getAdminRegions.request());
      const requestParams: GetAdminRegionsRequestParams = {
        offset: adminJobs.results.length,
        limit: 12,
      };

      const { data } = yield* call(Admin.getAdminJobList, requestParams);

      yield* put(getAdminJobs.success(data));
    }
  } catch (error) {
    yield* put(getAdminJobs.fail());
  }
}

function* assignCompaniesAndRegionsToAdminSaga({
  payload,
}: ActionType<typeof assignCompaniesAndRegionsToAdmin.request>): SagaIterator {
  try {
    const { adminId } = yield* select((state: RootState) => state.manageAdmins);
    const { formValues, onSuccess } = payload;
    const { data } = yield* call(Admin.assignCompaniesAndRegionsToAdmin, adminId, formValues);

    yield* put(assignCompaniesAndRegionsToAdmin.success(data));
    onSuccess();
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(assignCompaniesAndRegionsToAdmin.fail(errorDetails));
  }
}

function* assignJobToAdminSaga({
  payload,
}: ActionType<typeof assignJobToAdmin.request>): SagaIterator {
  try {
    const { jobId } = yield* select((state: RootState) => state.manageAdmins);
    const { formValues, onSuccess } = payload;
    const requestBody: AssignJobToAdminFormValues = {
      ...formValues,
      job: jobId,
      admin: formValues?.admin?.value,
    };
    const { data } = yield* call(Admin.assignJobToAdminRequest, requestBody);

    yield* put(assignJobToAdmin.success(data));
    onSuccess();
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(assignJobToAdmin.fail(errorDetails));
  }
}

function* deleteAdminSaga({ payload }: ActionType<typeof deleteAdmin.request>): SagaIterator {
  try {
    const { adminId, onSuccess } = payload;
    yield* call(Admin.deleteAdminRequest, adminId);

    yield* put(deleteAdmin.success());
    onSuccess();
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(deleteAdmin.fail(errorDetails));
  }
}

export function* watchAdmins(): SagaIterator {
  yield* takeLatest(getType(getListOfAdmins.init), getListOfAdminsSaga);
  yield* takeLatest(getType(inviteAdmin.request), inviteAdminSaga);
  yield* takeLatest(getType(getAdminPositionsList.init), getAdminPositionsListSaga);
  yield* takeLatest(getType(getAdminRegions.init), getAdminRegionsSaga);
  yield* takeLatest(getType(getAdminJobs.init), getAdminJobsSaga);
  yield* takeLatest(
    getType(assignCompaniesAndRegionsToAdmin.request),
    assignCompaniesAndRegionsToAdminSaga,
  );
  yield* takeLatest(getType(assignJobToAdmin.request), assignJobToAdminSaga);
  yield* takeLatest(getType(deleteAdmin.request), deleteAdminSaga);
}
