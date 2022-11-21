import { createAction } from 'deox';

import { CreateTimesheetEntryRequestParams } from '~/types/requests';
import {
  CreateTimesheetEntryResponse,
  ErrorResponse,
  GetCandidateTimesheetByIdResponse,
  GetCandidateTimesheetResponse,
  GetTimesheetPipelineResponse,
} from '~/types/responses';

export const getCandidateTimesheet = {
  init: createAction(
    'candidateTimesheet/GET_CANDIDATE_TIMESHEET_REQUEST',
    resolve => (payload: { initialFetch: boolean }) => resolve(payload),
  ),
  request: createAction('candidateTimesheet/GET_CANDIDATE_TIMESHEET'),
  success: createAction(
    'candidateTimesheet/GET_CANDIDATE_TIMESHEET_SUCCESS',
    resolve => (payload: GetCandidateTimesheetResponse) => resolve(payload),
  ),
  fail: createAction('candidateTimesheet/GET_CANDIDATE_TIMESHEET_FAIL'),
};

export const getCandidatePipeline = {
  init: createAction(
    'candidateTimesheet/GET_CANDIDATE_TIMESHEET_PIPELINE_REQUEST',
    resolve => (payload: { initialFetch: boolean }) => resolve(payload),
  ),
  request: createAction('candidateTimesheet/GET_CANDIDATE_TIMESHEET_PIPELINE'),
  success: createAction(
    'candidateTimesheet/GET_CANDIDATE_TIMESHEET_PIPELINE_SUCCESS',
    resolve => (payload: GetTimesheetPipelineResponse) => resolve(payload),
  ),
  fail: createAction('candidateTimesheet/GET_CANDIDATE_TIMESHEET_PIPELINE_FAIL'),
};

export const createCandidateEntry = {
  request: createAction(
    'candidateTimesheet/CREATE_CANDIDATE_ENTRY',
    resolve =>
      (payload: { formValues: CreateTimesheetEntryRequestParams; onSuccess: () => void }) =>
        resolve(payload),
  ),
  success: createAction(
    'candidateTimesheet/CREATE_CANDIDATE_ENTRY_SUCCESS',
    resolve => (payload: CreateTimesheetEntryResponse) => resolve(payload),
  ),
  fail: createAction(
    'candidateTimesheet/CREATE_CANDIDATE_ENTRY_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const toggleCandidateTimesheetModal = createAction(
  'candidateTimesheet/TOGGLE_CANDIDATE_TIMESHEET_MODAL',
);

export const setSelectedCandidateTimesheetId = createAction(
  'candidateTimesheet/SET_SELECTED_CANDIDATE_TIMESHEET_ID',
  resolve => (payload: number | null) => resolve(payload),
);

export const getCandidateTimesheetById = {
  request: createAction('candidateTimesheet/GET_CANDIDATE_TIMESHEET_BY_ID'),
  success: createAction(
    'candidateTimesheet/GET_CANDIDATE_TIMESHEET_BY_ID_SUCCESS',
    resolve => (payload: GetCandidateTimesheetByIdResponse) => resolve(payload),
  ),
  fail: createAction('candidateTimesheet/GET_CANDIDATE_TIMESHEET_BY_ID_FAIL'),
};

export const getCandidateTimesheetContract = {
  request: createAction(
    'candidateTimesheet/GET_CANDIDATE_TIMESHEET_CONTRACT',
    resolve =>
      (payload: { contractId: number | string; isReview?: boolean; onSuccess: () => void }) =>
        resolve(payload),
  ),
  success: createAction(
    'candidateTimesheet/GET_CANDIDATE_TIMESHEET_CONTRACT_SUCCESS',
    resolve => (payload: string) => resolve(payload),
  ),
  fail: createAction('candidateTimesheet/GET_CANDIDATE_TIMESHEET_CONTRACT_FAIL'),
};

export const toggleTimesheetReviewContractModalVisibility = createAction(
  'candidateTimesheet/TOGGLE_REVIEW_CONTRACT_MODAL_VISIBILITY',
);
