import { FindJob } from '~/models/candidate';
import {
  GetCompaniesWithLiveJobsCountResponse,
  GetFindJobsResponse,
  GetMatchedJobDetailResponse,
} from '~/types/responses';
import { SelectOption } from '~/view/components/select';

export type CandidateFindJobsState = {
  findJobs: GetFindJobsResponse['data'];
  selectedCompanyId: number | null;
  loadingFindJobs: boolean;
  searchJobByLocationFilter: SelectOption;
  searchJobByJobType: SelectOption;
  searchJobByPositionType: SelectOption;
  searchProjectByProjectType: SelectOption;
  searchJobByCompany: SelectOption;
  searchJobByKeyWord: string;
  searchJobBySalaryGte: string;
  searchJobBySalaryLte: string;
  selectedFindJob: FindJob | null;
  loadingJobDescription: boolean;
  jobDescription: GetMatchedJobDetailResponse['data'] | null;
  settingJobInterest: boolean;
  addingJobToShortList: boolean;
  loadingCompaniesWithJobs: boolean;
  companiesWithJobs: GetCompaniesWithLiveJobsCountResponse['data'];
  searchWithSuper: boolean | undefined;
  searchSelectedJobs: number[];
  searchSelectedJobGroups: number[];
};
