import React, { BaseSyntheticEvent, useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { Candidate, CandidateStatus } from '~/models/admin';
import {
  getCandidates,
  resetCandidateFilters,
  setSearchValue,
  setSelectedCandidate,
  updateCandidateStatus,
} from '~/modules/adminCandidates/actions';
import { useDispatch, useSelector } from '~/store';
import { CandidateModal } from '~/view/components/candidate-modal';
import { Icon } from '~/view/components/icon';
import { Loader } from '~/view/components/loader';
import { Tab } from '~/view/components/tabs';
import useDebounce from '~/view/hooks/useDebounce';
import { usePaginatedDataScrollList } from '~/view/hooks/usePaginatedDataScrollList';

import { CandidateCard } from './components/card';
import styles from './styles.scss';

const tabs: Tab[] = [
  { id: 1, label: 'Overview' },
  { id: 2, label: 'Job position' },
  { id: 3, label: 'Additional info' },
];

export const CandidatesApprovalPage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const candidates = useSelector(state => state.adminCandidates.candidates.results);
  const candidatesLoading = useSelector(state => state.adminCandidates.loadingCandidates);
  const [candidateModalVisibility, setCandidateModalVisibility] = useState(false);
  const { searchCandidateKeyWord } = useSelector(state => state.adminCandidates);
  const debouncedValue = useDebounce(searchCandidateKeyWord, 200);

  useEffect(() => {
    dispatch(getCandidates.init({ initialFetch: true, status: 1 }));
  }, [debouncedValue]);

  const handleModalVisibilityToggle = useCallback(() => {
    setCandidateModalVisibility(prevValue => !prevValue);
  }, []);

  const { scrollListRef } = usePaginatedDataScrollList<HTMLDivElement>({
    useWindowScroll: true,
    loadingData: candidatesLoading,
    fetchDataFn: useCallback(
      (initialFetch: boolean) => {
        dispatch(getCandidates.init({ initialFetch, status: 1 }));
      },
      [dispatch],
    ),
  });

  const handleCandidateClick = useCallback(
    (candidate: Candidate) => {
      dispatch(setSelectedCandidate(candidate));

      handleModalVisibilityToggle();
    },
    [dispatch, handleModalVisibilityToggle],
  );

  const handleCandidateApprove = useCallback(
    candidateId => {
      dispatch(
        updateCandidateStatus.request({
          candidateId,
          status: CandidateStatus.Approved,
        }),
      );
    },
    [dispatch],
  );

  const handleCandidateReject = useCallback(
    candidateId => {
      dispatch(
        updateCandidateStatus.request({
          candidateId,
          status: CandidateStatus.Rejected,
        }),
      );
    },
    [dispatch],
  );

  const handleInputChange = (e: BaseSyntheticEvent): void => {
    dispatch(setSearchValue(e.target.value));
  };

  useEffect(() => {
    return () => {
      dispatch(resetCandidateFilters());
    };
  }, []);

  return (
    <>
      <div className={styles['page']}>
        <h1 className={styles['page__title']}>Pending approval</h1>
        <div className={styles['page__search-box']}>
          <input
            onChange={handleInputChange}
            className={styles['page__search-input']}
            placeholder="Search candidates by keywords"
          />
        </div>
        <div className={styles['candidates']}>
          <div className={styles['candidates__search-filters']}>
            <div className={styles['candidates__user-name-filter']}>
              <p>User name</p>
            </div>
            <div className={styles['candidates__user-location-filter']}>
              <p>Location</p>
              <Icon name="double-arrow" className={styles['candidates__filter-arrow']} />
            </div>
            <div className={styles['candidates__user-status-filter']}>
              <p>Action or status</p>
              <Icon name="double-arrow" className={styles['candidates__filter-arrow']} />
            </div>
          </div>
          <div ref={scrollListRef} className={styles['candidates__list']}>
            {candidates.map(candidate => (
              <CandidateCard
                onRejectClick={handleCandidateReject}
                onApproveClick={handleCandidateApprove}
                onClick={handleCandidateClick}
                key={candidate.id}
                candidate={candidate}
              />
            ))}
          </div>
          {candidatesLoading && <Loader loading />}
        </div>
      </div>
      <CandidateModal
        tabs={tabs}
        visible={candidateModalVisibility}
        onClose={handleModalVisibilityToggle}
        withBtns
        onRejectClick={handleCandidateReject}
        onApproveClick={handleCandidateApprove}
      />
    </>
  );
};
