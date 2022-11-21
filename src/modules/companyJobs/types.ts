import { MyJob } from '~/models/company';
import { CompanyInterestResponse, GetCompanyJobs } from '~/types/responses';

export type CompanyJobsState = {
  jobs: GetCompanyJobs['data'];
  jobsLoading: boolean;
  selectedJob: Nullable<MyJob>;
  updatingInterestedCandidateStatus: boolean;
  companyInterest: Nullable<CompanyInterestResponse['data']>;
};
