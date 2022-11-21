import { FindJob } from '~/models/candidate';
import { MatchedCandidateDetail } from '~/models/company';
import { GetCompanyCandidatesResponse } from '~/types/responses';
import { SelectOption } from '~/view/components/select';

export type CompanyCandidatesState = {
  candidates: GetCompanyCandidatesResponse['data'];
  loadingCandidates: boolean;
  searchSelectedJobs: number[];
  searchSelectedJobGroups: number[];
  loadingSelectedCandidate: boolean;
  selectedCandidate: MatchedCandidateDetail | null;
  searchCandidateJobType: SelectOption;
  searchCandidateRegionFilter: SelectOption;
  searchCandidateCityFilter: SelectOption;
  searchCandidateByProjectType: SelectOption;
  searchCandidateByProjectValue: SelectOption;
  searchCandidateByAvailability: SelectOption[];
  searchCandidateKeyWord: string;
  searchCandidateSalaryGte: string;
  searchCandidateSalaryLte: string;
  selectedFindJob: FindJob | null;
  addingToShortList: boolean;
  interestedJobSuccessModalVisibility: boolean;
  selectedInterestedJob: string;
};
