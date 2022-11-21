import { createAction } from 'deox';

import {
  GetCitiesResponse,
  GetCountriesResponse,
  GetJobGroupTypeResponse,
  GetJobPositionsResponse,
  GetProjectTypesResponse,
  GetStatesResponse,
} from '~/types/responses';

export const getStates = {
  request: createAction('common/GET_STATES'),
  success: createAction(
    'common/GET_STATES_SUCCESS',
    resolve => (payload: GetStatesResponse) => resolve(payload),
  ),
  fail: createAction('common/GET_STATES_FAIL'),
};

export const getCities = {
  request: createAction('common/GET_CITIES'),
  success: createAction(
    'common/GET_CITIES_SUCCESS',
    resolve => (payload: GetCitiesResponse) => resolve(payload),
  ),
  fail: createAction('common/GET_CITIES_FAIL'),
};

export const getJobPositions = {
  request: createAction('common/GET_JOB_POSITIONS'),
  success: createAction(
    'common/GET_JOB_POSITIONS_SUCCESS',
    resolve => (payload: GetJobPositionsResponse) => resolve(payload),
  ),
  fail: createAction('common/GET_JOB_POSITIONS_FAIL'),
};

export const getJobGroups = {
  request: createAction('common/GET_JOB_GROUPS'),
  success: createAction(
    'common/GET_JOB_GROUPS_SUCCESS',
    resolve => (payload: GetJobGroupTypeResponse) => resolve(payload),
  ),
  fail: createAction('common/GET_JOB_GROUPS_FAIL'),
};

export const getProjectTypes = {
  request: createAction('common/GET_PROJECT_TYPES'),
  success: createAction(
    'common/GET_PROJECT_TYPES_SUCCESS',
    resolve => (payload: GetProjectTypesResponse) => resolve(payload),
  ),
  fail: createAction('common/GET_PROJECT_TYPES_FAIL'),
};

export const getHiringManagerJobPositions = {
  request: createAction('common/GET_HIRING_MANAGER_JOB_POSITIONS'),
  success: createAction(
    'common/GET_HIRING_MANAGER_JOB_POSITIONS_SUCCESS',
    resolve => (payload: GetJobPositionsResponse) => resolve(payload),
  ),
  fail: createAction('common/GET_HIRING_MANAGER_JOB_POSITIONS_FAIL'),
};

export const getHiringManagerProjectTypes = {
  request: createAction('common/GET_HIRING_PROJECT_TYPES'),
  success: createAction(
    'common/GET_HIRING_PROJECT_TYPES_SUCCESS',
    resolve => (payload: GetProjectTypesResponse) => resolve(payload),
  ),
  fail: createAction('common/GET_HIRING_PROJECT_TYPES_FAIL'),
};

export const getCountries = {
  request: createAction('common/GET_COUNTRIES'),
  success: createAction(
    'common/GET_COUNTRIES_SUCCESS',
    resolve => (payload: GetCountriesResponse) => resolve(payload),
  ),
  fail: createAction('common/GET_COUNTRIES_FAIL'),
};
