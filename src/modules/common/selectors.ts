import { createSelector } from 'reselect';

import { RootState } from '~/store/types';
import { SelectOption } from '~/view/components/select';

import { CommonState } from './types';

const citiesSelector = (state: RootState): CommonState['cities'] => state.common.cities;
const statesSelector = (state: RootState): CommonState['states'] => state.common.states;
const jobPositionsSelector = (state: RootState): CommonState['jobPositions'] =>
  state.common.jobPositions;
const projectTypesSelector = (state: RootState): CommonState['projectTypes'] =>
  state.common.projectTypes;
const countriesSelector = (state: RootState): CommonState['countries'] => state.common.countries;
const hiringManagerProjectTypesSelector = (
  state: RootState,
): CommonState['hiringManagerProjectTypes'] => state.common.hiringManagerProjectTypes;
const hiringManagerJobPositionsSelector = (
  state: RootState,
): CommonState['hiringManagerPositions'] => state.common.hiringManagerPositions;

export const countriesAsSelectOptionsSelector = createSelector<
  RootState,
  CommonState['countries'],
  SelectOption[]
>([countriesSelector], countries => {
  return countries.map(country => ({
    value: country.id,
    label: country.name,
  }));
});

export const citiesAsSelectOptionsSelector = createSelector<
  RootState,
  CommonState['cities'],
  SelectOption<{ stateId: number }>[]
>([citiesSelector], cities => {
  return cities.map(city => ({
    value: city.id,
    label: city.name,
    meta: { stateId: city.stateId },
  }));
});

export const statesAsSelectOptionsSelector = createSelector<
  RootState,
  CommonState['states'],
  SelectOption[]
>([statesSelector], states => {
  return states.map(state => ({
    value: state.id,
    label: state.name,
  }));
});

export const jobPositionsAsSelectOptionsSelector = createSelector<
  RootState,
  CommonState['jobPositions'],
  SelectOption[]
>([jobPositionsSelector], jobPositions => {
  return jobPositions.map(jobPosition => ({
    value: jobPosition.id,
    label: jobPosition.name,
  }));
});

export const projectTypesAsSelectOptionsSelector = createSelector<
  RootState,
  CommonState['projectTypes'],
  SelectOption[]
>([projectTypesSelector], projectTypes => {
  return projectTypes.map(projectType => ({
    value: projectType.id,
    label: projectType.name,
  }));
});

export const hiringManagerJobPositionsAsSelectOptionsSelector = createSelector<
  RootState,
  CommonState['hiringManagerPositions'],
  SelectOption[]
>([hiringManagerJobPositionsSelector], jobPositions => {
  return jobPositions.map(jobPosition => ({
    value: jobPosition.id,
    label: jobPosition.name,
  }));
});

export const hiringManagerProjectTypesAsSelectOptionsSelector = createSelector<
  RootState,
  CommonState['hiringManagerProjectTypes'],
  SelectOption[]
>([hiringManagerProjectTypesSelector], projectTypes => {
  return projectTypes.map(projectType => ({
    value: projectType.id,
    label: projectType.name,
  }));
});
