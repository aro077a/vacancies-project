import React, { memo, useCallback } from 'react';

import { getClosedJobs } from '~/modules/companyMyJobs/actions';
import { useDispatch, useSelector } from '~/store';
import { Loader } from '~/view/components/loader';
import { usePaginatedDataScrollList } from '~/view/hooks/usePaginatedDataScrollList';
import { JobCard } from '~/view/pages/company/my-jobs/components/job-card';

import styles from './styles.scss';

type Props = {
  toggleJobModalVisibility: () => void;
};

export const ClosedJobsSection: React.FC<Props> = memo(function ClosedJobsSection({
  toggleJobModalVisibility,
}) {
  const dispatch = useDispatch();
  const jobs = useSelector(state => state.companyMyJobs.closedJobs.results);
  const loading = useSelector(state => state.companyMyJobs.loadingClosedJobs);

  const { scrollListRef } = usePaginatedDataScrollList<HTMLDivElement>({
    useWindowScroll: true,
    fetchDataFn: useCallback(
      initialFetch => {
        dispatch(getClosedJobs.init({ initialFetch }));
      },
      [dispatch],
    ),
    loadingData: loading,
  });

  return (
    <div ref={scrollListRef} className={styles['section']}>
      <div className={styles['section__list']}>
        {jobs.map(job => (
          <JobCard job={job} key={job.id} onClick={toggleJobModalVisibility} />
        ))}
      </div>
      {loading && <Loader loading />}
    </div>
  );
});
