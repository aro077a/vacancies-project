import { MyJob } from '~/models/company';
import { GetCompanyMyJobsResponse } from '~/types/responses';
import { Tab } from '~/view/components/tabs';

export type MyJobsState = {
  tabs: (Omit<Tab, 'badge'> & { badge: number })[];
  activeJobs: GetCompanyMyJobsResponse['data'];
  loadingActiveJobs: boolean;
  closedJobs: GetCompanyMyJobsResponse['data'];
  loadingClosedJobs: boolean;
  selectedJob: MyJob | null;
  updatingJobStatus: boolean;
  deletingMyJob: boolean;
};
