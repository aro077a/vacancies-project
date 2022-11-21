import { createAction } from 'deox';

import {
  ErrorResponse,
  GetCompanyCandidatesResponse,
  GetFindJobsResponse,
  UpdateShortListResponse,
} from '~/types/responses';

export const getShortList = {
  init: createAction(
    'shortList/GET_SHORT_LIST_INIT',
    resolve => (payload: { initialFetch: boolean }) => resolve(payload),
  ),
  request: createAction('shortList/GET_SHORT_LIST_REQUEST'),
  success: createAction(
    'shortList/GET_SHORT_LIST_SUCCESS',
    resolve => (payload: GetFindJobsResponse | GetCompanyCandidatesResponse) => resolve(payload),
  ),
  fail: createAction(
    'shortList/GET_SHORT_LIST_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const updateShortList = {
  request: createAction(
    'shortList/UPDATE_SHORT_LIST',
    resolve => (payload: { jobId: number; status: boolean }) => resolve(payload),
  ),
  success: createAction(
    'shortList/UPDATE_SHORT_LIST_SUCCESS',
    resolve => (payload: UpdateShortListResponse) => resolve(payload),
  ),
  fail: createAction(
    'shortList/UPDATE_SHORT_LIST',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};
