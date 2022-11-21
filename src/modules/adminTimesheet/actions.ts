import { createAction } from 'deox';

import { CustomSelectValueType } from '~/models/candidate';
import { TimesheetStatus } from '~/models/company';
import { CreateTimesheetEntryRequestParams } from '~/types/requests';
import {
  CreateTimesheetEntryResponse,
  ErrorResponse,
  GetAdminTimesheetByIdResponse,
  GetAdminTimesheetResponse,
  GetCandidateWithTimesheetResponse,
  GetCompanyWithTimesheetResponse,
  GetTimesheetPipelineResponse,
  UpdateAdminTimesheetStatusResponse,
} from '~/types/responses';
import { SelectOption } from '~/view/components/select';

export const getAdminTimesheet = {
  init: createAction(
    'adminTimesheet/GET_ADMIN_TIMESHEET_REQUEST',
    resolve => (payload: { initialFetch: boolean }) => resolve(payload),
  ),
  request: createAction('adminTimesheet/GET_ADMIN_TIMESHEET'),
  success: createAction(
    'adminTimesheet/GET_ADMIN_TIMESHEET_SUCCESS',
    resolve => (payload: GetAdminTimesheetResponse) => resolve(payload),
  ),
  fail: createAction('adminTimesheet/GET_ADMIN_TIMESHEET_FAIL'),
};

export const toggleAdminTimesheetModal = createAction(
  'adminTimesheet/TOGGLE_ADMIN_TIMESHEET_MODAL',
);

export const setSelectedAdminTimesheetId = createAction(
  'adminTimesheet/SET_SELECTED_ADMIN_TIMESHEET_ID',
  resolve => (payload: number | null) => resolve(payload),
);

export const getAdminTimesheetById = {
  request: createAction('adminTimesheet/GET_ADMIN_TIMESHEET_BY_ID'),
  success: createAction(
    'adminTimesheet/GET_ADMIN_TIMESHEET_BY_ID_SUCCESS',
    resolve => (payload: GetAdminTimesheetByIdResponse) => resolve(payload),
  ),
  fail: createAction('adminTimesheet/GET_ADMIN_TIMESHEET_BY_ID_FAIL'),
};

export const updateAdminTimesheetStatus = {
  request: createAction(
    'adminTimesheet/UPDATE_ADMIN_TIMESHEET_STATUS',
    resolve => (payload: { timesheetId: number; status: TimesheetStatus }) => resolve(payload),
  ),
  success: createAction(
    'adminTimesheet/UPDATE_ADMIN_TIMESHEET_STATUS_SUCCESS',
    resolve => (payload: UpdateAdminTimesheetStatusResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminTimesheet/UPDATE_ADMIN_TIMESHEET_STATUS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setStatus = createAction(
  'adminTimesheet/SET_STATUS',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setCompany = createAction(
  'adminTimesheet/SET_COMPANY',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setCandidate = createAction(
  'adminTimesheet/SET_CANDIDATE',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setWeek = createAction(
  'adminTimesheet/SET_WEEK',
  resolve => (payload: Date) => resolve(payload),
);

export const getCandidatesWithTimesheet = {
  request: createAction('adminTimesheet/GET_CANDIDATES_WITH_TIMESHEET'),
  success: createAction(
    'adminTimesheet/GET_CANDIDATES_WITH_TIMESHEET_SUCCESS',
    resolve => (payload: GetCandidateWithTimesheetResponse) => resolve(payload),
  ),
  fail: createAction('adminTimesheet/GET_CANDIDATES_WITH_TIMESHEET_FAIL'),
};

export const getCompaniesWithTimesheet = {
  request: createAction('adminTimesheet/GET_COMPANIES_WITH_TIMESHEET'),
  success: createAction(
    'adminTimesheet/GET_COMPANIES_WITH_TIMESHEET_SUCCESS',
    resolve => (payload: GetCompanyWithTimesheetResponse) => resolve(payload),
  ),
  fail: createAction('adminTimesheet/GET_COMPANIES_WITH_TIMESHEET_FAIL'),
};

export const getCandidatesAndCompaniesWithTimesheet = createAction(
  'adminTimesheet/GET_CANDIDATES_AND_COMPANIES_WITH_TIMESHEET',
);

export const resetTimesheetFilters = createAction('adminTimesheet/RESET_FILTERS');

export const createAdminEntry = {
  request: createAction(
    'adminTimesheet/CREATE_ADMIN_ENTRY',
    resolve =>
      (payload: { formValues: CreateTimesheetEntryRequestParams; onSuccess: () => void }) =>
        resolve(payload),
  ),
  success: createAction(
    'adminTimesheet/CREATE_ADMIN_ENTRY_SUCCESS',
    resolve => (payload: CreateTimesheetEntryResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminTimesheet/CREATE_ADMIN_ENTRY_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getCandidatePipeline = {
  init: createAction(
    'adminTimesheet/GET_ADMIN_TIMESHEET_PIPELINE_REQUEST',
    resolve => (payload: { initialFetch: boolean }) => resolve(payload),
  ),
  request: createAction('adminTimesheet/GET_ADMIN_TIMESHEET_PIPELINE'),
  success: createAction(
    'adminTimesheet/GET_ADMIN_TIMESHEET_PIPELINE_SUCCESS',
    resolve => (payload: GetTimesheetPipelineResponse) => resolve(payload),
  ),
  fail: createAction('adminTimesheet/GET_ADMIN_TIMESHEET_PIPELINE_FAIL'),
};

export const setSelectedCandidate = createAction(
  'adminTimesheet/SET_SELECTED_CANDIDATE',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setSelectedCompany = createAction(
  'adminTimesheet/SET_SELECTED_COMPANY',
  resolve => (payload: CustomSelectValueType) => resolve(payload),
);
