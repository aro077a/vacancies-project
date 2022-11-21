import { GetShortListResponse } from '~/types/responses';

export type ShortListState = {
  jobs: GetShortListResponse['data'];
  loadingJobs: boolean;
  updatingShortList: boolean;
};
