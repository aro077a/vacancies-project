import classNames from 'classnames';
import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import {
  getCompaniesWithLiveJobsCount,
  setSelectedCompanyId,
} from '~/modules/adminLiveJobs/actions';
import { useDispatch, useSelector } from '~/store';
import { Image } from '~/view/components/image';
import { Loader } from '~/view/components/loader';
import { usePaginatedDataScrollList } from '~/view/hooks/usePaginatedDataScrollList';

import styles from './styles.scss';

export const CompaniesWithLiveJobsCount: React.FC = memo(function CompaniesWithLiveJobsCount() {
  const dispatch = useDispatch();
  const selectedCompanyId = useSelector(state => state.adminLiveJobs.selectedCompanyId);
  const loadingCompaniesWithLiveJobsCount = useSelector(
    state => state.adminLiveJobs.loadingCompaniesWithLiveJobsCount,
  );
  const totalJobsCount = useSelector(
    state => state.adminLiveJobs.companiesWithLiveJobsCount.countJobs,
  );
  const companiesWithLiveJobsCount = useSelector(
    state => state.adminLiveJobs.companiesWithLiveJobsCount.results,
  );
  const { scrollListRef } = usePaginatedDataScrollList<HTMLDivElement>({
    loadingData: loadingCompaniesWithLiveJobsCount,
    fetchDataFn: useCallback(
      initialFetch => {
        dispatch(getCompaniesWithLiveJobsCount.init({ initialFetch }));
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
      {companiesWithLiveJobsCount.map(companyWithLiveJobsCount => (
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
      {loadingCompaniesWithLiveJobsCount && <Loader loading />}
    </div>
  );
});
