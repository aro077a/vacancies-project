import { createSelector } from 'reselect';

import { RootState } from '~/store/types';
import { SelectOption } from '~/view/components/select';

import { CandidatesState } from './types';

const candidatesSelector = (state: RootState): CandidatesState['candidates'] =>
  state.adminCandidates.candidates;

export const candidatesAsSelectOptionsSelector = createSelector<
  RootState,
  CandidatesState['candidates'],
  SelectOption[]
>([candidatesSelector], candidates => {
  return candidates.results.map(candidate => ({
    value: candidate.id,
    label: candidate.name,
    image: candidate.avatar,
  }));
});
