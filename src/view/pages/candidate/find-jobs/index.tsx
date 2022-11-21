import React, { useCallback, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { getFindJobs } from '~/modules/candidateFindJobs/actions';
import { useDispatch, useSelector } from '~/store';
import { Loader } from '~/view/components/loader';
import { usePaginatedDataScrollList } from '~/view/hooks/usePaginatedDataScrollList';

import { Card } from './components/card';
import { FilterModal } from './components/filters-modal';
import { JobModal } from './components/job-modal';
import { SearchInput } from './components/search-input';
import { CompaniesWithJobsCount } from './components/sidebar';
import styles from './styles.scss';

const isTablet = window.outerWidth <= 768;

export const FindJobsPage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const { loadingFindJobs, findJobs } = useSelector(state => state.candidateFindJobs);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [filterModalVisibility, setFilterModalVisibility] = useState(false);

  const toggleModalVisibility = useCallback(() => {
    setModalVisibility(prevValue => !prevValue);
  }, []);

  const toggleFilterModalVisibility = useCallback(() => {
    setFilterModalVisibility(prevValue => !prevValue);
  }, []);

  const { scrollListRef } = usePaginatedDataScrollList<HTMLDivElement>({
    useWindowScroll: true,
    loadingData: loadingFindJobs,
    fetchDataFn: useCallback(
      (initialFetch: boolean) => {
        dispatch(getFindJobs.init({ initialFetch }));
      },
      [dispatch],
    ),
  });

  return (
    <div className={styles['page']}>
      <div className={styles['page__title-wrapper']}>
        <h1 className={styles['page__title']}>Find jobs</h1>
        <span className={styles['page__divider']}>|</span>
        <span className={styles['page__vacancies-count']}>
          {findJobs.count} vacancies available
        </span>
      </div>
      <SearchInput toggleFilterModal={toggleFilterModalVisibility} />
      <div className={styles['page__content']}>
        {!isTablet && <CompaniesWithJobsCount />}
        <div ref={scrollListRef} className={styles['page__job-list']}>
          {findJobs.results.map(job => (
            <Card onClick={toggleModalVisibility} key={job.id} job={job} />
          ))}
          <Loader loading={loadingFindJobs} />
        </div>
      </div>
      <JobModal onClose={toggleModalVisibility} visible={modalVisibility} />
      {isTablet && (
        <FilterModal onClose={toggleFilterModalVisibility} visible={filterModalVisibility} />
      )}
    </div>
  );
};
