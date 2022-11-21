import React, { memo, useCallback } from 'react';

import { getActiveJobs } from '~/modules/companyMyJobs/actions';
import { useDispatch, useSelector } from '~/store';
import { Loader } from '~/view/components/loader';
import { usePaginatedDataScrollList } from '~/view/hooks/usePaginatedDataScrollList';
import { JobCard } from '~/view/pages/company/my-jobs/components/job-card';

import styles from './styles.scss';

type Props = {
  toggleJobModalVisibility: () => void;
};

export const ActiveJobsSection: React.FC<Props> = memo(function ActiveJobsSection({
  toggleJobModalVisibility,
}) {
  const dispatch = useDispatch();
  const jobs = useSelector(state => state.companyMyJobs.activeJobs.results);
  const loading = useSelector(state => state.companyMyJobs.loadingActiveJobs);

  const { scrollListRef } = usePaginatedDataScrollList<HTMLDivElement>({
    useWindowScroll: true,
    fetchDataFn: useCallback(
      initialFetch => {
        dispatch(getActiveJobs.init({ initialFetch }));
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
