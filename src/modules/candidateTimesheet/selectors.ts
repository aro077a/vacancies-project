import { createSelector } from 'reselect';

import { TimesheetPipeline } from '~/models/candidate';
import { MatchedJobSteps } from '~/models/common';
import { RootState } from '~/store/types';
import { SelectOption } from '~/view/components/select';

import { CandidateTimesheetState } from './types';

const candidatePipelineSelector = (
  state: RootState,
): CandidateTimesheetState['candidatePipeline'] => state.candidateTimesheet.candidatePipeline;

export const companiesAndPositionsAsSelectOptionsSelector = createSelector<
  RootState,
  CandidateTimesheetState['candidatePipeline'],
  SelectOption[]
>([candidatePipelineSelector], companyInfo => {
  const filteredCompanyInfo = companyInfo?.results.filter(
    (item: TimesheetPipeline) => item.step === MatchedJobSteps.TemporaryWorkers,
  );
  return filteredCompanyInfo.map(company => ({
    label: `${company?.companyName} — ${company?.positionName}`,
    value: company?.id,
    paymentType: company?.contract?.paymentType,
    contractPrice: company?.contract?.candidateRate,
    matched: company?.id,
    image: company?.avatar,
  }));
});
