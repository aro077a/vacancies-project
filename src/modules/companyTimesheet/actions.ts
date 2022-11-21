import { createAction } from 'deox';

import { TimesheetStatus } from '~/models/company';
import {
  ErrorResponse,
  GetCompanyTimesheetByIdResponse,
  GetCompanyTimesheetResponse,
  UpdateCompanyTimesheetStatusResponse,
} from '~/types/responses';

export const getCompanyTimesheet = {
  init: createAction(
    'companyTimesheet/GET_COMPANY_TIMESHEET_REQUEST',
    resolve => (payload: { initialFetch: boolean }) => resolve(payload),
  ),
  request: createAction('companyTimesheet/GET_COMPANY_TIMESHEET'),
  success: createAction(
    'companyTimesheet/GET_COMPANY_TIMESHEET_SUCCESS',
    resolve => (payload: GetCompanyTimesheetResponse) => resolve(payload),
  ),
  fail: createAction('companyTimesheet/GET_COMPANY_TIMESHEET_FAIL'),
};

export const updateTimesheetStatus = {
  request: createAction(
    'companyTimesheet/UPDATE_TIMESHEET_STATUS',
    resolve => (payload: { timesheetId: number; status: TimesheetStatus }) => resolve(payload),
  ),
  success: createAction(
    'companyTimesheet/UPDATE_TIMESHEET_STATUS_SUCCESS',
    resolve => (payload: UpdateCompanyTimesheetStatusResponse) => resolve(payload),
  ),
  fail: createAction(
    'companyTimesheet/UPDATE_TIMESHEET_STATUS_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const getTimesheetById = {
  request: createAction('companyTimesheet/GET_TIMESHEET_BY_ID'),
  success: createAction(
    'companyTimesheet/GET_TIMESHEET_BY_ID_SUCCESS',
    resolve => (payload: GetCompanyTimesheetByIdResponse) => resolve(payload),
  ),
  fail: createAction(
    'companyTimesheet/GET_TIMESHEET_BY_ID_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const toggleTimesheetModal = createAction('companyTimesheet/TOGGLE_TIMESHEET_MODAL');

export const setSelectedTimesheetId = createAction(
  'companyTimesheet/SET_SELECTED_TIMESHEET_ID',
  resolve => (payload: number | null) => resolve(payload),
);
