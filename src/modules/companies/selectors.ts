import { createSelector } from 'reselect';

import { RootState } from '~/store/types';
import { SelectOption } from '~/view/components/select';

import { CompanyState } from './types';

const companiesSelector = (state: RootState): CompanyState['companies'] =>
  state.companies.companies;

export const companiesAsSelectOptionsSelector = createSelector<
  RootState,
  CompanyState['companies'],
  SelectOption[]
>([companiesSelector], companies => {
  return companies.map(company => ({
    value: company.id,
    label: company.name,
    image: company.companyLogo,
  }));
});
