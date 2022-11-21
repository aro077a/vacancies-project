import classNames from 'classnames';
import React, { memo, useCallback, useMemo, useState } from 'react';

import { updateLiveJobCandidateMatched } from '~/modules/adminLiveJobs/actions';
import { useDispatch, useSelector } from '~/store';
import { CandidateModal } from '~/view/components/candidate-modal';
import { SearchInput } from '~/view/components/search-input';
import { Tab } from '~/view/components/tabs';

import { CandidateCard } from './components/candidate-card';
import styles from './styles.scss';

const tabs: Tab[] = [
  { id: 1, label: 'Overview' },
  { id: 3, label: 'Additional info' },
  { id: 4, label: 'Feedback' },
  { id: 5, label: 'My records' },
];

export const Candidates: React.FC = memo(function Candidates() {
  const dispatch = useDispatch();
  const liveJobMatchedCandidates = useSelector(
    state => state.adminLiveJobs.liveJobMatchedCandidates,
  );
  const liveJobInterestedCandidates = useSelector(
    state => state.adminLiveJobs.liveJobInterestedCandidates,
  );
  const liveJobCompanyInterestedCandidates = useSelector(
    state => state.adminLiveJobs.liveJobCompanyInterestedCandidates,
  );
  const liveJobPotentialCandidates = useSelector(
    state => state.adminLiveJobs.liveJobPotentialCandidates,
  );
  const [potentialCandidatesSearchValue, setPotentialCandidatesSearchValue] = useState('');
  const [candidateModalVisibility, setCandidateModalVisibility] = useState(false);

  const toggleCandidateModalVisibility = useCallback(() => {
    setCandidateModalVisibility(prevValue => !prevValue);
  }, []);

  const handlePotentialCandidatesSearchValueChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(event => {
      setPotentialCandidatesSearchValue(event.target.value);
    }, []);

  const handleCandidateMatch = useCallback(
    (candidateId: number) => {
      dispatch(
        updateLiveJobCandidateMatched.request({
          candidateId,
          status: true,
        }),
      );
    },
    [dispatch],
  );

  const handleCandidateUnMatch = useCallback(
    (candidateId: number) => {
      dispatch(
        updateLiveJobCandidateMatched.request({
          candidateId,
          status: false,
        }),
      );
    },
    [dispatch],
  );

  const matchedCandidates = useMemo(() => {
    return liveJobMatchedCandidates.map(matchedCandidate => (
      <CandidateCard
        key={matchedCandidate.id}
        candidate={matchedCandidate}
        onMatchClick={handleCandidateMatch}
        onUnMatchClick={handleCandidateUnMatch}
      />
    ));
  }, [handleCandidateMatch, handleCandidateUnMatch, liveJobMatchedCandidates]);

  const interestedCandidates = useMemo(() => {
    return liveJobInterestedCandidates.map(interestedCandidate => (
      <CandidateCard
        key={interestedCandidate.id}
        candidate={interestedCandidate}
        onMatchClick={handleCandidateMatch}
        onUnMatchClick={handleCandidateUnMatch}
        onMoreInfoClick={toggleCandidateModalVisibility}
      />
    ));
  }, [
    handleCandidateMatch,
    handleCandidateUnMatch,
    liveJobInterestedCandidates,
    toggleCandidateModalVisibility,
  ]);

  const companyInterestedCandidates = useMemo(() => {
    return liveJobCompanyInterestedCandidates.map(companyInterestedCandidate => (
      <CandidateCard
        key={companyInterestedCandidate.id}
        candidate={companyInterestedCandidate}
        onMatchClick={handleCandidateMatch}
        onUnMatchClick={handleCandidateUnMatch}
        onMoreInfoClick={toggleCandidateModalVisibility}
      />
    ));
  }, [
    handleCandidateMatch,
    handleCandidateUnMatch,
    liveJobCompanyInterestedCandidates,
    toggleCandidateModalVisibility,
  ]);

  const potentialCandidates = useMemo(() => {
    return liveJobPotentialCandidates
      .filter(potentialCandidate => {
        const lowerCasedName = potentialCandidate.name.toLowerCase();
        const lowerCasedSearchValue = potentialCandidatesSearchValue.toLowerCase();

        if (lowerCasedName.includes(lowerCasedSearchValue)) {
          return true;
        }

        return false;
      })
      .map(potentialCandidate => (
        <CandidateCard
          key={potentialCandidate.id}
          candidate={potentialCandidate}
          onMatchClick={handleCandidateMatch}
          onUnMatchClick={handleCandidateUnMatch}
          onMoreInfoClick={toggleCandidateModalVisibility}
        />
      ));
  }, [
    handleCandidateMatch,
    handleCandidateUnMatch,
    liveJobPotentialCandidates,
    potentialCandidatesSearchValue,
    toggleCandidateModalVisibility,
  ]);

  return (
    <div className={styles['candidates']}>
      <div className={styles['candidates__section']}>
        <h4 className={styles['candidates__section-title']}>
          Matched <span>({liveJobMatchedCandidates.length})</span>
        </h4>
        <div className={styles['candidates__cards']}>{matchedCandidates}</div>
      </div>
      <div className={styles['candidates__section']}>
        <h4 className={styles['candidates__section-title']}>
          Showed their interest <span>({liveJobInterestedCandidates.length})</span>
        </h4>
        <div className={styles['candidates__cards']}>{interestedCandidates}</div>
      </div>
      <div className={styles['candidates__section']}>
        <h4 className={styles['candidates__section-title']}>
          Company is interested in <span>({liveJobCompanyInterestedCandidates.length})</span>
        </h4>
        <div className={styles['candidates__cards']}>{companyInterestedCandidates}</div>
      </div>
      <div className={styles['candidates__section']}>
        <div className={styles['candidates__section-header']}>
          <div>
            <h4
              className={classNames(
                styles['candidates__section-title'],
                styles['candidates__section-title--dark'],
              )}
            >
              Potential <span>({potentialCandidates.length})</span>
            </h4>
            <p className={styles['candidates__section-subtitle']}>
              View match percentage and match candidates to the job position
            </p>
          </div>
          <SearchInput
            className={styles['candidates__section-search-input']}
            placeholder="Search by employer or position"
            value={potentialCandidatesSearchValue}
            onChange={handlePotentialCandidatesSearchValueChange}
          />
        </div>
        {potentialCandidates.length === 0 && potentialCandidatesSearchValue.length > 0 ? (
          <p className={styles['candidates__no-candidate-found-message']}>No candidates found</p>
        ) : (
          <div className={styles['candidates__cards']}>{potentialCandidates}</div>
        )}
        <CandidateModal
          onClose={toggleCandidateModalVisibility}
          visible={candidateModalVisibility}
          tabs={tabs}
          className={styles['candidates__modal']}
        />
      </div>
    </div>
  );
});
