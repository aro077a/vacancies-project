import { createAction } from 'deox';

import { GetCompaniesResponse } from '~/types/responses';

export const getCompanies = {
  request: createAction('common/GET_COMPANIES'),
  success: createAction(
    'common/GET_COMPANIES_SUCCESS',
    resolve => (payload: GetCompaniesResponse) => resolve(payload),
  ),
  fail: createAction('common/GET_COMPANIES_FAIL'),
};
