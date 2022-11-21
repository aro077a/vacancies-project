import { createAction } from 'deox';

import { initialColumnsType, MatchedJob } from '~/models/admin';
import { MatchedJobSteps } from '~/models/common';
import {
  ArrangeInterviewFormValues,
  CreateInvoiceFormValues,
  CreateJobContractFormValues,
} from '~/types/formValues';
import {
  ArrangeInterviewResponse,
  CreateContractResponse,
  CreateInvoiceResponse,
  ErrorResponse,
  GetGeneratedContractResponse,
  GetMatchedJobPipelineResponse,
  GetMatchedJobsPipelineResponse,
  GetUnmatchedJobPipelineResponse,
} from '~/types/responses';
import { SelectOption } from '~/view/components/select';

export const getUnmatchedJobPipeline = {
  request: createAction('adminPipeline/GET_UNMATCHED_JOB_PIPELINE'),
  success: createAction(
    'adminPipeline/GET_UNMATCHED_JOB_PIPELINE_SUCCESS',
    resolve => (payload: GetUnmatchedJobPipelineResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminPipeline/GET_UNMATCHED_JOB_PIPELINE_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getMatchedJobPipeline = {
  request: createAction('adminPipeline/GET_MATCHED_JOB_PIPELINE'),
  success: createAction(
    'adminPipeline/GET_MATCHED_JOB_PIPELINE_SUCCESS',
    resolve => (payload: GetMatchedJobsPipelineResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminPipeline/GET_MATCHED_JOB_PIPELINE_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const updateMatchedJobStep = {
  request: createAction(
    'adminPipeline/UPDATE_MATCHED_JOB_STEP',
    resolve =>
      (payload: {
        step: MatchedJobSteps;
        cardId: number;
        notes: string | null;
        cb: () => void;
        onSuccess?: () => void;
      }) =>
        resolve(payload),
  ),
  success: createAction(
    'adminPipeline/UPDATE_MATCHED_JOB_STEP_SUCCESS',
    resolve => (payload: GetMatchedJobPipelineResponse['status'] | null) => resolve(payload),
  ),
  fail: createAction(
    'adminPipeline/UPDATE_MATCHED_JOB_STEP_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setColumns = createAction(
  'adminPipeline/SET_COLUMNS',
  resolve => (payload: initialColumnsType) => resolve(payload),
);

export const toggleSendCVModalVisibility = createAction(
  'adminPipeline/TOGGLE_SEND_CV_MODAL_VISIBILITY',
);

export const toggleInterviewModalVisibility = createAction(
  'adminPipeline/TOGGLE_INTERVIEW_MODAL_VISIBILITY',
);

export const toggleInvoiceModalVisibility = createAction(
  'adminPipeline/TOGGLE_CREATE_INVOICE_MODAL_VISIBILITY',
);

export const toggleContractModalVisibility = createAction(
  'adminPipeline/TOGGLE_CONTRACT_MODAL_VISIBILITY',
);

export const setSelectedMatchedJob = createAction(
  'adminPipeline/SET_SELECTED_MATCHED_JOB',
  resolve => (payload: (MatchedJob & { index: number }) | null) => resolve(payload),
);

export const arrangeInterview = {
  request: createAction(
    'adminPipeline/ARRANGE_INTERVIEW_REQUEST',
    resolve =>
      (payload: {
        formValues: ArrangeInterviewFormValues & { matched: number };
        cb: (matchedJob: ArrangeInterviewResponse['data']) => void;
        onSuccess?: () => void;
      }) =>
        resolve(payload),
  ),
  success: createAction(
    'adminPipeline/ARRANGE_INTERVIEW_SUCCESS',
    resolve => (payload: ArrangeInterviewResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminPipeline/ARRANGE_INTERVIEW_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const createInvoice = {
  request: createAction(
    'adminPipeline/CREATE_INVOICE_REQUEST',
    resolve =>
      (payload: {
        formValues: CreateInvoiceFormValues & { matched: number };
        cb: (invoice: CreateInvoiceResponse['data']) => void;
      }) =>
        resolve(payload),
  ),
  success: createAction(
    'adminPipeline/CREATE_INVOICE_SUCCESS',
    resolve => (payload: CreateInvoiceResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminPipeline/CREATE_INVOICE_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const createContract = {
  request: createAction(
    'adminPipeline/CREATE_CONTRACT_REQUEST',
    resolve => (payload: { formValues: CreateJobContractFormValues & { matched: number } }) =>
      resolve(payload),
  ),
  success: createAction(
    'adminPipeline/CREATE_CONTRACT_SUCCESS',
    resolve => (payload: CreateContractResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminPipeline/CREATE_CONTRACT_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const editInterviewMode = createAction(
  'adminPipeline/EDIT_INTERVIEW_MODE',
  resolve => (payload: boolean) => resolve(payload),
);

export const resetToInitial = createAction('adminPipeline/RESET_TO_INITIAL');

export const downloadGeneratedContract = {
  request: createAction(
    'adminPipeline/DOWNLOAD_GENERATED_CONTRACT',
    resolve => (payload: { isCandidate: boolean }) => resolve(payload),
  ),
  success: createAction(
    'adminPipeline/DOWNLOAD_GENERATED_CONTRACT_SUCCESS',
    resolve => (payload: GetGeneratedContractResponse) => resolve(payload),
  ),
  fail: createAction('adminPipeline/DOWNLOAD_GENERATED_CONTRACT_FAIL'),
};

export const sendContract = {
  request: createAction(
    'adminPipeline/SEND_CONTRACT',
    resolve => (payload: { message: string; index: number }) => resolve(payload),
  ),
  success: createAction(
    'adminPipeline/SEND_CONTRACT_SUCCESS',
    resolve => (payload: number) => resolve(payload),
  ),
  fail: createAction('adminPipeline/SEND_CONTRACT_FAIL'),
};

export const setGeneratedContractId = createAction(
  'adminPipeline/SET_GENERATED_CONTRACT_ID',
  resolve => (payload: number) => resolve(payload),
);

export const toggleSuccessModalVisibility = createAction(
  'adminPipeline/TOGGLE_SUCCESS_MODAL_VISIBILITY',
);

export const setRegion = createAction(
  'adminPipeline/SET_REGION',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setCity = createAction(
  'adminPipeline/SET_CITY',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setCompany = createAction(
  'adminPipeline/SET_COMPANY',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setContractType = createAction(
  'adminPipeline/SET_CONTRACT_TYPE',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setAdmin = createAction(
  'adminPipeline/SET_ADMIN',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const getPipelines = createAction('adminPipeline/GET_PIPELINES');

export const resetFilters = createAction('adminPipeline/RESET_FILTERS');

export const setContractStatus = {
  request: createAction(
    'adminPipeline/SET_CONTRACT_STATUS',
    resolve => (payload: { isCompany: boolean; status: boolean; contractId: number }) =>
      resolve(payload),
  ),
  success: createAction('adminPipeline/SET_CONTRACT_STATUS_SUCCESS'),
  fail: createAction('adminPipeline/SET_CONTRACT_STATUS_FAIL'),
};
