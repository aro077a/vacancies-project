import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { UserType } from '~/models/common';
import { getInterestedIn } from '~/modules/companyInterested/actions';
import { getCompanyJobs } from '~/modules/companyJobs/actions';
import { useDispatch, useSelector } from '~/store';
import { CandidateCard } from '~/view/components/candidate-card';
import { CompanyCandidateModal } from '~/view/components/company-candidate-modal';
import { Loader } from '~/view/components/loader';
import { usePaginatedDataScrollList } from '~/view/hooks/usePaginatedDataScrollList';

import styles from './styles.scss';

export const InterestedInPage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const { jobs } = useSelector(state => state.companyJobs);
  const { candidates, loadingCandidates } = useSelector(state => state.companyInterestedIn);
  const [candidateModalVisibility, setCandidateModalVisibility] = useState(false);
  const isCandidate = useSelector(state => state.user.loggedInUserType) === UserType.CANDIDATE;

  useEffect(() => {
    if (!jobs.results.length) {
      dispatch(getCompanyJobs.request());
    }
  }, [jobs, dispatch]);

  const toggleCandidateModalVisibility = useCallback(() => {
    setCandidateModalVisibility(prevValue => !prevValue);
  }, []);

  const { scrollListRef } = usePaginatedDataScrollList<HTMLDivElement>({
    useWindowScroll: true,
    loadingData: loadingCandidates,
    fetchDataFn: useCallback(
      (initialFetch: boolean) => {
        dispatch(getInterestedIn.init({ initialFetch }));
      },
      [dispatch],
    ),
  });

  return (
    <div className={styles['page']}>
      <div className={styles['page__title-wrapper']}>
        <h1 className={styles['page__title']}>Interested In</h1>
      </div>
      <div
        ref={scrollListRef}
        className={classNames(styles['page__list'], {
          [styles['page__list--duo']]: !isCandidate,
        })}
      >
        {candidates.results.map(candidate => (
          <CandidateCard
            key={candidate.id}
            onClick={toggleCandidateModalVisibility}
            isShortListPage
            candidate={candidate}
          />
        ))}
      </div>
      {loadingCandidates && <Loader loading />}
      <CompanyCandidateModal
        onClose={toggleCandidateModalVisibility}
        visible={candidateModalVisibility}
      />
    </div>
  );
};
