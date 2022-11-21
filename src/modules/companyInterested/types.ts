import { GetCompanyCandidatesResponse } from '~/types/responses';

export type CompanyInterestedInState = {
  loadingCandidates: boolean;
  candidates: GetCompanyCandidatesResponse['data'];
};
