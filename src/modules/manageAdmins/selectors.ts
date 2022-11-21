import { createSelector } from 'reselect';

import { RootState } from '~/store/types';
import { SelectOption } from '~/view/components/select';

import { ManageAdminsState } from './types';

const adminPositionsSelector = (state: RootState): ManageAdminsState['adminPositionsList'] =>
  state.manageAdmins.adminPositionsList;

const adminRegionsSelector = (state: RootState): ManageAdminsState['adminRegions'] =>
  state.manageAdmins.adminRegions;

const adminsSelector = (state: RootState): ManageAdminsState['listOfAdmins'] =>
  state.manageAdmins.listOfAdmins;

export const adminPositionsAsSelectOptionsSelector = createSelector<
  RootState,
  ManageAdminsState['adminPositionsList'],
  SelectOption[]
>([adminPositionsSelector], positions =>
  positions.results.map(position => ({
    value: position.id,
    label: position.name,
    image: position.logo,
    isSelected: position.selected,
  })),
);

export const adminRegionsAsSelectOptionsSelector = createSelector<
  RootState,
  ManageAdminsState['adminRegions'],
  SelectOption[]
>([adminRegionsSelector], regions => {
  return regions.results.map(region => ({
    value: region.id,
    label: region.name,
    abbr: region.abbr,
    isSelected: region.selected,
  }));
});

export const adminsAsSelectOptionsSelector = createSelector<
  RootState,
  ManageAdminsState['listOfAdmins'],
  SelectOption[]
>([adminsSelector], admins => {
  return admins.results.map(admin => ({
    value: admin.id,
    label: `${admin.firstName} ${admin.lastName}`,
    image: admin.photo,
    actions: admin.actions,
  }));
});
