import React, { memo, useCallback, useEffect } from 'react';

import { Candidate } from '~/models/admin';
import {
  getCandidates,
  resetCandidateFilters,
  setSelectedCandidate,
} from '~/modules/adminCandidates/actions';
import { useDispatch, useSelector } from '~/store';
import { Loader } from '~/view/components/loader';
import { usePaginatedDataScrollList } from '~/view/hooks/usePaginatedDataScrollList';
import { RejectedCandidatesCard } from '~/view/pages/admin/rejected-candidates/components/RejectedCandidatesCard';

import styles from './styles.scss';

type Props = {
  onCandidateClick: () => void;
  candidates: Candidate[];
};

export const RejectedCandidatesList: React.FC<Props> = memo(function CandidatesList({
  onCandidateClick,
  candidates,
}) {
  const dispatch = useDispatch();

  const candidatesLoading = useSelector(state => state.adminCandidates.loadingCandidates);

  useEffect(() => {
    return () => {
      dispatch(resetCandidateFilters());
    };
  }, [dispatch]);

  const { scrollListRef } = usePaginatedDataScrollList<HTMLDivElement>({
    useWindowScroll: true,
    loadingData: candidatesLoading,
    fetchDataFn: useCallback(
      initialFetch => {
        dispatch(getCandidates.init({ initialFetch, status: 3 }));
      },
      [dispatch],
    ),
  });

  const handleCandidateClick = useCallback(
    (candidate: Candidate) => {
      dispatch(setSelectedCandidate(candidate));

      onCandidateClick();
    },
    [dispatch, onCandidateClick],
  );

  return (
    <div ref={scrollListRef} className={styles['candidate-list']}>
      {!candidatesLoading && !candidates.length && (
        <div className={styles['candidate-not-found']}>No candidates found</div>
      )}
      {candidates?.map(candidate => (
        <RejectedCandidatesCard
          key={candidate.id}
          onClick={handleCandidateClick}
          candidate={candidate}
        />
      ))}
      {candidatesLoading && <Loader loading />}
    </div>
  );
});
