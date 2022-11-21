import { ActionType, getType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { call, put, select, takeLatest } from 'typed-redux-saga';

import { MatchedJob } from '~/models/admin';
import { updateLiveJobCandidateMatched } from '~/modules/adminLiveJobs/actions';
import { getLiveJobContractsSaga } from '~/modules/adminLiveJobs/sagas';
import { Admin } from '~/services/api/Admin';
import { RootState } from '~/store/types';
import {
  ArrangeInterviewRequestBodyParams,
  CreateContractRequestBodyParams,
  CreateInvoiceRequestBodyParams,
  GetAdminPipelinesRequestParams,
  GetAdminUnmatchedPipelinesRequestParams,
  UpdateMatchedJobStepRequestBodyParams,
} from '~/types/requests';
import { getErrorDetailsFromResponse } from '~/utils/errors';
import { dateOrString } from '~/utils/helpers';
import {
  transformPercentFromStringToNumber,
  transformSalaryFromStringToNumber,
} from '~/utils/strings';

import {
  arrangeInterview,
  createContract,
  createInvoice,
  downloadGeneratedContract,
  getMatchedJobPipeline,
  getPipelines,
  getUnmatchedJobPipeline,
  resetFilters,
  sendContract,
  setAdmin,
  setCity,
  setCompany,
  setContractStatus,
  setContractType,
  setRegion,
  toggleContractModalVisibility,
  updateMatchedJobStep,
} from './actions';

function* getUnmatchedJobsSaga(): SagaIterator {
  try {
    const { assigned } = yield* select((state: RootState) => state.adminAssigned);
    const { searchByCity, searchByCompany, searchByRegion, searchByContractType, searchByAdmin } =
      yield* select((state: RootState) => state.adminMatchedJobsPipeline);

    const requestBody: GetAdminUnmatchedPipelinesRequestParams = {
      assignedMe: assigned,
    };

    if (searchByCity.value) {
      requestBody.city = searchByCity.value;
    }

    if (searchByRegion.value) {
      requestBody.state = searchByRegion.value;
    }

    if (searchByCompany.value) {
      requestBody.company = searchByCompany.value;
    }

    if (searchByContractType.value) {
      requestBody.position_type = searchByContractType.value;
    }

    if (searchByAdmin.value) {
      requestBody.admin = searchByAdmin.value;
    }

    const { data } = yield* call(Admin.getUnmatchedJobsPipeline, requestBody);
    yield* put(getUnmatchedJobPipeline.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getUnmatchedJobPipeline.fail(errorDetails));
  }
}
function* getAdminMatchedJobsSaga(): SagaIterator {
  try {
    const { assigned } = yield* select((state: RootState) => state.adminAssigned);
    const { searchByCity, searchByCompany, searchByRegion, searchByContractType, searchByAdmin } =
      yield* select((state: RootState) => state.adminMatchedJobsPipeline);

    const requestBody: GetAdminPipelinesRequestParams = {
      assignedMe: assigned,
    };

    if (searchByCity.value) {
      requestBody.job__city = searchByCity.value;
    }

    if (searchByRegion.value) {
      requestBody.job__state = searchByRegion.value;
    }

    if (searchByContractType.value) {
      requestBody.job__position_type = searchByContractType.value;
    }

    if (searchByCompany.value) {
      requestBody.job__company = searchByCompany.value;
    }

    if (searchByAdmin.value) {
      requestBody.admin = searchByAdmin.value;
    }

    const { data } = yield* call(Admin.getAdminMatchedJobPipeline, requestBody);
    yield* put(getMatchedJobPipeline.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getMatchedJobPipeline.fail(errorDetails));
  }
}

function* updateMatchedAndUnmatchedJobs(): SagaIterator {
  yield* put(getUnmatchedJobPipeline.request());
  yield* put(getMatchedJobPipeline.request());
}

function* updateAdminMatchedJobsSaga({
  payload,
}: ActionType<typeof updateMatchedJobStep.request>): SagaIterator {
  try {
    if (payload) {
      const { cardId, step, notes, cb, onSuccess } = payload;
      const requestBody: UpdateMatchedJobStepRequestBodyParams = {
        step,
        notes,
      };

      if (!notes) {
        delete requestBody.notes;
      }

      const {
        data: { status },
      } = yield* call(Admin.updateAdminMatchedJobPipeline, { cardId }, requestBody);

      if (cb) {
        cb();
      }

      yield* put(updateMatchedJobStep.success(status));
      if (onSuccess) {
        onSuccess();
      }
    }
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(updateMatchedJobStep.fail(errorDetails));
  }
}

function* arrangeInterviewSaga({
  payload,
}: ActionType<typeof arrangeInterview.request>): SagaIterator {
  try {
    const { editInterviewMode, selectedMatchedJob } = yield* select(
      (state: RootState) => state.adminMatchedJobsPipeline,
    );

    const { interview } = selectedMatchedJob as MatchedJob;

    const { formValues, cb, onSuccess } = payload;

    const requestBody: ArrangeInterviewRequestBodyParams = {
      ...formValues,
      admin: formValues.admin?.value,
      participants: formValues.participants.map(participant => {
        if (typeof participant !== 'string') {
          return participant.label;
        }
        return 0;
      }) as string[],

      date: dateOrString(formValues.date),
      time: new Date(formValues.time).toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };

    const { data } = yield* editInterviewMode
      ? call(Admin.updateArrangedInterview, interview.id!, requestBody)
      : call(Admin.arrangeInterview, requestBody);
    if (cb) {
      cb(data.data);
    }

    yield* put(arrangeInterview.success(data));
    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(arrangeInterview.fail(errorDetails));
  }
}

function* createInvoiceSaga({ payload }: ActionType<typeof createInvoice.request>): SagaIterator {
  try {
    const {
      formValues: { matched, startDate, percent, salary, flatFee, flatFeeDescription },
      cb,
    } = payload;

    const requestBody: CreateInvoiceRequestBodyParams = {
      matched,
      startDate: dateOrString(startDate),
      salary: transformSalaryFromStringToNumber(salary),
      percent: transformPercentFromStringToNumber(percent),
    };

    if (flatFee) {
      requestBody.flatFee = transformSalaryFromStringToNumber(flatFee);
    }

    if (flatFeeDescription) {
      requestBody.flatFeeDescription = flatFeeDescription;
    }

    const { data } = yield* call(Admin.createInvoice, requestBody);

    if (cb) {
      cb(data.data);
    }

    yield* put(createInvoice.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(createInvoice.fail(errorDetails));
  }
}

function* createContractSaga({ payload }: ActionType<typeof createContract.request>): SagaIterator {
  try {
    const { formValues } = payload;

    const requestBody: CreateContractRequestBodyParams = {
      ...formValues,
      agreementDate: dateOrString(formValues.agreementDate),
      commencementDate: dateOrString(formValues.commencementDate),
      supervisor: formValues.supervisor!.value,
      candidateRate: transformSalaryFromStringToNumber(formValues.candidateRate),
      companyRate: transformSalaryFromStringToNumber(formValues.companyRate),
    };

    const { data } = yield* call(Admin.createContract, requestBody);

    yield* put(createContract.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(createContract.fail(errorDetails));
  }
}

function* donwloadGeneratedContractSaga({
  payload,
}: ActionType<typeof downloadGeneratedContract.request>): SagaIterator {
  try {
    const { generatedContractId } = yield* select(
      (state: RootState) => state.adminMatchedJobsPipeline,
    );
    const { data } = yield* call(Admin.downloadGeneratedContract, generatedContractId!, {
      isCandidateInstance: payload.isCandidate,
    });

    const link = document.createElement('a');

    link.href = `data:application/octet-stream;base64,${data.data}`;

    link.download = 'contract.pdf';

    link.click();

    yield* put(downloadGeneratedContract.success(data));
  } catch (error) {
    yield* put(downloadGeneratedContract.fail());
  }
}

function* sendContractSaga({
  payload: { message, index },
}: ActionType<typeof sendContract.request>): SagaIterator {
  try {
    const contractId = yield* select(
      (state: RootState) => state.adminMatchedJobsPipeline.generatedContractId,
    );

    yield* call(Admin.sendContract, contractId!, { message });

    yield* put(toggleContractModalVisibility());

    yield* put(sendContract.success(index));
  } catch (error) {
    yield* put(sendContract.fail());
  }
}

function* getPipelinesSaga(): SagaIterator {
  yield* put(getUnmatchedJobPipeline.request());
  yield* put(getMatchedJobPipeline.request());
}

function* setContractStatusSaga({
  payload,
}: ActionType<typeof setContractStatus.request>): SagaIterator {
  try {
    const { isCompany, status, contractId } = payload;

    yield* call(
      Admin.setContractStatus,
      contractId,
      isCompany ? { companyApproval: status } : { candidateApproval: status },
    );

    yield* put(setContractStatus.success());
  } catch (error) {
    yield* put(setContractStatus.fail());
  }
}

export function* watchAdminMatchedJobsPipeline(): SagaIterator {
  yield* takeLatest(getType(getUnmatchedJobPipeline.request), getUnmatchedJobsSaga);
  yield* takeLatest(getType(getMatchedJobPipeline.request), getAdminMatchedJobsSaga);
  yield* takeLatest(getType(updateMatchedJobStep.request), updateAdminMatchedJobsSaga);
  yield* takeLatest(getType(arrangeInterview.request), arrangeInterviewSaga);
  yield* takeLatest(getType(createInvoice.request), createInvoiceSaga);
  yield* takeLatest(getType(createContract.request), createContractSaga);
  yield* takeLatest(getType(updateLiveJobCandidateMatched.success), updateMatchedAndUnmatchedJobs);
  yield* takeLatest(getType(downloadGeneratedContract.request), donwloadGeneratedContractSaga);
  yield* takeLatest(getType(sendContract.request), sendContractSaga);
  yield* takeLatest(getType(setRegion), getPipelinesSaga);
  yield* takeLatest(getType(setCity), getPipelinesSaga);
  yield* takeLatest(getType(setCompany), getPipelinesSaga);
  yield* takeLatest(getType(setContractType), getPipelinesSaga);
  yield* takeLatest(getType(getPipelines), getPipelinesSaga);
  yield* takeLatest(getType(resetFilters), getPipelinesSaga);
  yield* takeLatest(getType(setAdmin), getPipelinesSaga);
  yield* takeLatest(getType(setContractStatus.request), setContractStatusSaga);
  yield* takeLatest(getType(setContractStatus.success), getLiveJobContractsSaga);
}
