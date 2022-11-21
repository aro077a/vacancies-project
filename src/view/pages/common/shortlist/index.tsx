import React, { useCallback, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { getShortList } from '~/modules/shortlist/actions';
import { useDispatch, useSelector } from '~/store';
import { CandidateCard } from '~/view/components/candidate-card';
import { CompanyCandidateModal } from '~/view/components/company-candidate-modal';
import { JobCard } from '~/view/components/job-card';
import { Loader } from '~/view/components/loader';
import { usePaginatedDataScrollList } from '~/view/hooks/usePaginatedDataScrollList';
import { JobModal } from '~/view/pages/candidate/find-jobs/components/job-modal';

import styles from './styles.scss';

export const ShortListPage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const { jobs, loadingJobs } = useSelector(state => state.shortList);
  const [jobModalVisibility, setJobModalVisibility] = useState(false);
  const [candidateModalVisibility, setCandidateModalVisibility] = useState(false);

  const toggleJobModalVisibility = useCallback(() => {
    setJobModalVisibility(prevValue => !prevValue);
  }, []);

  const toggleCandidateModalVisibility = useCallback(() => {
    setCandidateModalVisibility(prevValue => !prevValue);
  }, []);

  const { scrollListRef } = usePaginatedDataScrollList<HTMLDivElement>({
    useWindowScroll: true,
    loadingData: loadingJobs,
    fetchDataFn: useCallback(
      (initialFetch: boolean) => {
        dispatch(getShortList.init({ initialFetch }));
      },
      [dispatch],
    ),
  });

  return (
    <div className={styles['page']}>
      <div className={styles['page__title-wrapper']}>
        <h1 className={styles['page__title']}>Shortlist</h1>
      </div>
      <div ref={scrollListRef} className={styles['page__list']}>
        {jobs.results.map(job => {
          if ('matchedMax' in job) {
            return (
              <CandidateCard
                onClick={toggleCandidateModalVisibility}
                isShortListPage
                candidate={job}
                key={job.id}
              />
            );
          }
          return (
            <JobCard onClick={toggleJobModalVisibility} isShortListPage key={job.id} job={job} />
          );
        })}
      </div>
      {loadingJobs && <Loader loading />}
      <CompanyCandidateModal
        onClose={toggleCandidateModalVisibility}
        visible={candidateModalVisibility}
      />
      <JobModal visible={jobModalVisibility} onClose={toggleJobModalVisibility} />
    </div>
  );
};
