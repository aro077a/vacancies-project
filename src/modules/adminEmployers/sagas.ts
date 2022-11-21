import { getType } from 'deox';
import { ActionType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'typed-redux-saga';
import { takeLatest } from 'typed-redux-saga';

import {
  createNewEmployerAction,
  deleteEmployer,
  editEmployerAction,
  getEmployerDetails,
  getEmployers,
  getEmployersPendingApprovals,
  getPendingEmployersCount,
  setCreateEmployerFormValues,
  setSelectedEmployer,
  updateEmployerStatus,
} from '~/modules/adminEmployers/actions';
import { Admin } from '~/services/api/Admin';
import { Company } from '~/services/api/Company';
import { RootState } from '~/store/types';
import { CreateEmployerFormValues } from '~/types/formValues';
import { GetCandidatesRequestParams, GetEmployersResponseParams } from '~/types/requests';
import { getErrorDetailsFromResponse } from '~/utils/errors';

function* getEmployersSaga({ payload }: ActionType<typeof getEmployers.init>): SagaIterator {
  try {
    const { searchText, employers, statusId } = yield* select(
      (state: RootState) => state.adminEmployers,
    );
    const { initialFetch } = payload;
    if (initialFetch || employers.count > employers.results.length) {
      yield* put(getEmployers.request());

      const requestParams: GetCandidatesRequestParams = {
        offset: employers.results.length,
        limit: 12,
      };

      if (searchText) {
        requestParams.search = searchText;
      }
      if (statusId) {
        requestParams.user__status = statusId;
      }
      const { data } = yield* call(Admin.getEmployers, requestParams);

      yield* put(getEmployers.success(data));
    }
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getEmployers.fail(errorDetails));
  }
}

function* getEmployersPendingApprovalsSaga(): SagaIterator {
  yield* put(getEmployers.init({ initialFetch: true }));
}

function* getEmployerDetailsSaga({
  payload,
}: ActionType<typeof getEmployerDetails.request>): SagaIterator {
  try {
    const selectedEmployerId = yield* select(
      (state: RootState) => state.adminEmployers.selectedEmployer?.id,
    );

    const cities = yield* select((state: RootState) => state.common.cities);
    const states = yield* select((state: RootState) => state.common.states);
    const { data }: any = yield* call(Admin.getEmployerDetailsId, {
      id: payload || selectedEmployerId!,
    });
    const response = data.data;
    yield* put(getEmployerDetails.success(response));
    const city = cities.find(city => city.id === response.city.id)!;
    const state = states.find(state => state.id === response.state?.id)!;
    const formData: CreateEmployerFormValues = {
      id: response.id,
      city,
      state,
      user: response.user,
      phone: response.phone,
      name: response.name,
      address: response.address,
      site: response.site,
      status: response.status,
      email: response.contacts?.email,
    };
    yield* put(setCreateEmployerFormValues(formData));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getEmployerDetails.fail(errorDetails));
  }
}

function* updateEmployerStatusSaga({
  payload,
}: ActionType<typeof updateEmployerStatus.request>): SagaIterator {
  try {
    yield* call(
      Admin.updateEmployerStatus,
      { id: payload.employerId! },
      { status: payload.status },
    );

    yield* put(updateEmployerStatus.success({ employerId: payload.employerId }));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(updateEmployerStatus.fail(errorDetails));
  }
}

function* createNewEmployerSaga(): SagaIterator {
  try {
    const cities = yield* select((state: RootState) => state.common.cities);
    const states = yield* select((state: RootState) => state.common.states);
    const { createFormValues } = yield* select((state: RootState) => state.adminEmployers);
    const city = cities.find(
      city => city.id === (createFormValues && createFormValues.city?.value),
    )!;
    const state = states.find(
      state => state.id === (createFormValues && createFormValues.state?.value),
    )!;
    const form: CreateEmployerFormValues | any = {
      ...createFormValues,
      city: city.id,
      state: state.id,
      status: 1,
      user: {
        email: createFormValues?.email,
        password: Math.random().toFixed(8),
      },
    };
    const { data } = yield* call(Company.createNewEmployer, form);
    yield* put(createNewEmployerAction.success(data.data.id));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(createNewEmployerAction.fail(errorDetails));
  }
}

function* editEmployerSaga(): SagaIterator {
  try {
    const cities = yield* select((state: RootState) => state.common.cities);
    const states = yield* select((state: RootState) => state.common.states);
    const { createFormValues } = yield* select((state: RootState) => state.adminEmployers);
    const city = cities.find(
      city => city.id === (createFormValues && createFormValues.city?.value),
    )!;
    const state = states.find(
      state => state.id === (createFormValues && createFormValues.state?.value),
    )!;
    const form: CreateEmployerFormValues | any = {
      ...createFormValues,
      city,
      state,
      status: 1,
      user: {
        email: createFormValues?.email,
      },
    };
    if (createFormValues) {
      const { data } = yield* call(Company.editEmployer, createFormValues.id, form);
      yield* put(createNewEmployerAction.success(data.data.id));
    }
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(createNewEmployerAction.fail(errorDetails));
  }
}

function* setSelectedCompanySaga({
  payload,
}: ActionType<typeof setSelectedEmployer>): SagaIterator {
  if (payload !== null) {
    yield* put(getEmployerDetails.request());
  }
}

function* getPendingEmployersCountSaga(): SagaIterator {
  try {
    const requestParams: GetEmployersResponseParams = {
      offset: 1,
      limit: 1,
      user__status: 1,
    };

    const { data } = yield* call(Admin.getEmployers, requestParams);

    yield* put(getPendingEmployersCount.success(data.data.count));
  } catch (error) {
    yield* put(getPendingEmployersCount.fail());
  }
}

function* deleteEmployerSaga({ payload }: ActionType<typeof deleteEmployer.request>): SagaIterator {
  const { employerId } = payload;
  try {
    yield* call(Admin.deleteEmployerRequest, employerId);

    yield* put(deleteEmployer.success());
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(deleteEmployer.fail(errorDetails));
  }
}

export function* watchAdminEmployers(): SagaIterator {
  yield* takeLatest(getType(getEmployers.init), getEmployersSaga);
  yield* takeLatest(getType(getEmployersPendingApprovals), getEmployersPendingApprovalsSaga);
  yield* takeLatest(getType(getEmployerDetails.request), getEmployerDetailsSaga);
  yield* takeLatest(getType(updateEmployerStatus.request), updateEmployerStatusSaga);
  yield* takeLatest(getType(createNewEmployerAction.request), createNewEmployerSaga);
  yield* takeLatest(getType(editEmployerAction.request), editEmployerSaga);
  yield* takeLatest(getType(getPendingEmployersCount.request), getPendingEmployersCountSaga);
  yield* takeLatest(getType(setSelectedEmployer), setSelectedCompanySaga);
  yield* takeLatest(getType(deleteEmployer.request), deleteEmployerSaga);
}
