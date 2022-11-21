import classNames from 'classnames';
import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { getCompaniesWithJobs, setSelectedCompanyId } from '~/modules/candidateFindJobs/actions';
import { useDispatch, useSelector } from '~/store';
import { Image } from '~/view/components/image';
import { Loader } from '~/view/components/loader';
import { usePaginatedDataScrollList } from '~/view/hooks/usePaginatedDataScrollList';

import styles from './styles.scss';

export const CompaniesWithJobsCount: React.FC = memo(function CompaniesWithLiveJobsCount() {
  const dispatch = useDispatch();

  const selectedCompanyId = useSelector(state => state.candidateFindJobs.selectedCompanyId);
  const loadingCompaniesWithJobsCount = useSelector(
    state => state.candidateFindJobs.loadingCompaniesWithJobs,
  );
  const totalJobsCount = useSelector(state => state.candidateFindJobs.companiesWithJobs.countJobs);
  const companiesWithJobsCount = useSelector(
    state => state.candidateFindJobs.companiesWithJobs.results,
  );

  const { scrollListRef } = usePaginatedDataScrollList<HTMLDivElement>({
    loadingData: loadingCompaniesWithJobsCount,
    fetchDataFn: useCallback(
      initialFetch => {
        dispatch(getCompaniesWithJobs.init({ initialFetch }));
      },
      [dispatch],
    ),
  });

  const location = useLocation();
  const locationState = useMemo(() => location?.state as Record<string, number>, [location?.state]);

  const handleCompanyClick = useCallback(
    (id: number | null) => {
      if (selectedCompanyId !== id) {
        dispatch(setSelectedCompanyId(id));
      }
    },
    [dispatch, selectedCompanyId],
  );

  useEffect(() => {
    if (locationState) {
      dispatch(setSelectedCompanyId(locationState?.companyId));
    }
  }, [dispatch, locationState]);

  return (
    <div ref={scrollListRef} className={styles['jobs']}>
      <div className={styles['jobs__job']} onClick={() => handleCompanyClick(null)}>
        {selectedCompanyId === null && <div className={styles['jobs__active-job-indicator']} />}
        <div className={styles['jobs__company-wrapper']}>
          <p
            className={classNames(styles['jobs__company-name'], {
              [styles['jobs__company-name--selected']]: selectedCompanyId === null,
            })}
          >
            All Jobs
          </p>
        </div>
        <p
          className={classNames(styles['jobs__jobs-count'], {
            [styles['jobs__jobs-count--selected']]: selectedCompanyId === null,
          })}
        >
          {totalJobsCount}
        </p>
      </div>
      {companiesWithJobsCount.map(companyWithLiveJobsCount => (
        <div
          key={companyWithLiveJobsCount.id}
          className={styles['jobs__job']}
          onClick={() => handleCompanyClick(companyWithLiveJobsCount.id)}
        >
          {selectedCompanyId === companyWithLiveJobsCount.id && (
            <div className={styles['jobs__active-job-indicator']} />
          )}
          <div className={styles['jobs__company-wrapper']}>
            <Image
              type="company"
              src={companyWithLiveJobsCount.companyLogo}
              className={styles['jobs__company-image']}
              alt="company"
            />
            <p
              className={classNames(styles['jobs__company-name'], {
                [styles['jobs__company-name--selected']]:
                  selectedCompanyId === companyWithLiveJobsCount.id,
              })}
            >
              {companyWithLiveJobsCount.name}
            </p>
          </div>
          <p
            className={classNames(styles['jobs__jobs-count'], {
              [styles['jobs__jobs-count--selected']]:
                selectedCompanyId === companyWithLiveJobsCount.id,
            })}
          >
            {companyWithLiveJobsCount.jobCount}
          </p>
        </div>
      ))}
      {loadingCompaniesWithJobsCount && <Loader loading />}
    </div>
  );
});
