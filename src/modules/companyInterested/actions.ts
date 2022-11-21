import { createAction } from 'deox';

import { GetCompanyCandidatesResponse } from '~/types/responses';

export const getInterestedIn = {
  init: createAction(
    'companyInterested/GET_COMPANY_INTERESTED_INIT',
    resolve => (payload: { initialFetch: boolean }) => resolve(payload),
  ),
  request: createAction('companyInterested/GET_COMPANY_INTERESTED'),
  success: createAction(
    'companyInterested/GET_COMPANY_INTERESTED_SUCCESS',
    resolve => (payload: GetCompanyCandidatesResponse) => resolve(payload),
  ),
  fail: createAction('companyInterested/GET_COMPANY_INTERESTED_FAIL'),
};
