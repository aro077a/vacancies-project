import { createReducer } from 'deox';
import produce from 'immer';

import {
  getCities,
  getCountries,
  getHiringManagerJobPositions,
  getHiringManagerProjectTypes,
  getJobGroups,
  getJobPositions,
  getProjectTypes,
  getStates,
} from './actions';
import { CommonState } from './types';

export const initialState: CommonState = {
  countries: [],
  cities: [],
  states: [],
  jobPositions: [],
  jobGroups: [],
  projectTypes: [],
  hiringManagerPositions: [],
  hiringManagerProjectTypes: [],
};

export const commonReducer = createReducer(initialState, handle => [
  handle(getCountries.success, (state, { payload }) =>
    produce(state, draft => {
      draft.countries = payload.data;
    }),
  ),
  handle(getCities.success, (state, { payload }) =>
    produce(state, draft => {
      draft.cities = payload.data;
    }),
  ),
  handle(getStates.success, (state, { payload }) =>
    produce(state, draft => {
      draft.states = payload.data;
    }),
  ),
  handle(getJobPositions.success, (state, { payload }) =>
    produce(state, draft => {
      draft.jobPositions = payload.data;
    }),
  ),
  handle(getJobGroups.success, (state, { payload }) =>
    produce(state, draft => {
      draft.jobGroups = payload.data;
    }),
  ),
  handle(getProjectTypes.success, (state, { payload }) =>
    produce(state, draft => {
      draft.projectTypes = payload.data;
    }),
  ),
  handle(getHiringManagerJobPositions.success, (state, { payload }) =>
    produce(state, draft => {
      draft.hiringManagerPositions = payload.data;
    }),
  ),
  handle(getHiringManagerProjectTypes.success, (state, { payload }) =>
    produce(state, draft => {
      draft.hiringManagerProjectTypes = payload.data;
    }),
  ),
]);
