import React, { memo, useCallback, useEffect, useMemo } from 'react';

import {
  getCandidatePotentialJobs,
  resetPotentialJobFilters,
  setFiltersForPotentialJobs,
} from '~/modules/adminCandidates/actions';
import { useDispatch } from '~/store';
import { useSelector } from '~/store';
import { Loader } from '~/view/components/loader';
import { SearchInput } from '~/view/components/search-input';
import { usePaginatedDataScrollList } from '~/view/hooks/usePaginatedDataScrollList';

import { PotentialCard } from './components/card';
import styles from './styles.scss';

type Props = {
  onMatchClick: (id: number) => void;
  onUnmatchClick: (id: number) => void;
};

export const PotentialJobSection: React.FC<Props> = memo(function PotentialJobSection({
  onMatchClick,
  onUnmatchClick,
}) {
  const dispatch = useDispatch();
  const potentialJobSearchValue = useSelector(state => state.adminCandidates.potentialSearchValue);
  const potentialCandidateJobs = useSelector(
    state => state.adminCandidates.potentialCandidateJobs.results,
  );

  useEffect(() => {
    return () => {
      dispatch(resetPotentialJobFilters());
    };
  }, []);

  const loading = useSelector(state => state.adminCandidates.loadingPotentialCandidateJobs);

  const { scrollListRef } = usePaginatedDataScrollList<HTMLDivElement>({
    loadingData: loading,
    fetchDataFn: useCallback(
      initialFetch => {
        dispatch(getCandidatePotentialJobs.request({ initialFetch }));
      },
      [dispatch],
    ),
  });

  const handlePotentialJobSearchValueChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      event => {
        dispatch(setFiltersForPotentialJobs({ searchValue: event.target.value }));
      },
      [dispatch],
    );

  const potentialJobs = useMemo(() => {
    return potentialCandidateJobs.map(potentialCandidateJob => {
      return (
        <PotentialCard
          onMatchClick={onMatchClick}
          key={potentialCandidateJob.id}
          {...potentialCandidateJob}
        />
      );
    });
  }, [potentialCandidateJobs, onMatchClick, onUnmatchClick]);

  return (
    <div className={styles['potential-job']}>
      <div className={styles['potential-job__header']}>
        <div>
          <h4 className={styles['potential-job__title']}>
            Potential{' '}
            <span className={styles['potential-job__count']}>({potentialJobs.length})</span>
          </h4>
          <p className={styles['potential-job__description']}>
            Match with job positions from your list
          </p>
        </div>
        <SearchInput
          placeholder="Search by employer or position"
          value={potentialJobSearchValue}
          onChange={handlePotentialJobSearchValueChange}
          className={styles['potential-job__search-wrapper']}
        />
      </div>
      <div className={styles['potential-job__job-list-wrapper']} ref={scrollListRef}>
        {potentialJobs.length !== 0 && (
          <div className={styles['potential-job__job-list']}>{potentialJobs}</div>
        )}
        {!potentialJobs.length && !loading && (
          <div className={styles['potential-job__no-jobs-caption']}>No jobs found</div>
        )}
        {loading && <Loader loading />}
      </div>
    </div>
  );
});
