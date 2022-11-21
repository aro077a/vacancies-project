import classNames from 'classnames';
import React, { memo, useCallback } from 'react';

import { LiveJob } from '~/models/admin';
import { getLiveJobs, setSelectedLiveJob } from '~/modules/adminLiveJobs/actions';
import { useDispatch, useSelector } from '~/store';
import { formatAddedDate, formatSalary } from '~/utils/strings';
import { Icon } from '~/view/components/icon';
import { Image } from '~/view/components/image';
import { Loader } from '~/view/components/loader';
import { usePaginatedDataScrollList } from '~/view/hooks/usePaginatedDataScrollList';

import styles from './styles.scss';

type Props = {
  onJobClick: () => void;
};

export const JobsListing: React.FC<Props> = memo(function JobsListing({ onJobClick }) {
  const dispatch = useDispatch();
  const loadingLiveJobs = useSelector(state => state.adminLiveJobs.loadingLiveJobs);
  const liveJobs = useSelector(state => state.adminLiveJobs.liveJobs.results);

  const { scrollListRef } = usePaginatedDataScrollList<HTMLDivElement>({
    useWindowScroll: true,
    loadingData: loadingLiveJobs,
    fetchDataFn: useCallback(
      initialFetch => {
        dispatch(getLiveJobs.init({ initialFetch }));
      },
      [dispatch],
    ),
  });

  const handleJobClick = useCallback(
    (job: LiveJob) => {
      dispatch(setSelectedLiveJob(job));

      onJobClick();
    },
    [dispatch, onJobClick],
  );

  return (
    <div ref={scrollListRef} className={styles['jobs-listing']}>
      {liveJobs.map(liveJob => {
        const salaryPrefix =
          liveJob?.positionTypeName === 'Permanent'
            ? 'year'
            : liveJob?.paymentTypeName === 'Daily'
            ? 'day'
            : 'hour';

        return (
          <div
            key={liveJob.id}
            className={styles['jobs-listing__job']}
            onClick={() => handleJobClick(liveJob)}
          >
            <div className={styles['jobs-listing__job-header']}>
              <div className={styles['jobs-listing__job-info']}>
                <Image
                  type="company"
                  className={styles['jobs-listing__company-image']}
                  src={liveJob.companyLogo}
                  alt="company"
                />
                <div>
                  <h4 className={styles['jobs-listing__job-title']}>{liveJob.positionName}</h4>
                  <p className={styles['jobs-listing__company-name']}>
                    {liveJob.companyName} · {formatAddedDate(liveJob.addedAt)}
                  </p>
                </div>
              </div>
              <p
                className={classNames(
                  styles['jobs-listing__job-status'],
                  liveJob.statusName === 'Active'
                    ? styles['jobs-listing__job-status--active']
                    : styles['jobs-listing__job-status--closed'],
                )}
              >
                {liveJob.statusName}
              </p>
            </div>
            <p className={styles['jobs-listing__job-description']}>{liveJob.overview}</p>
            <div className={styles['jobs-listing__job-footer']}>
              <div className={styles['jobs-listing__job-info-tag']}>
                <Icon name="location" className={styles['jobs-listing__job-info-tag-icon']} />
                <p className={styles['jobs-listing__job-info-tag-text']}>{liveJob.location}</p>
              </div>
              <div className={styles['jobs-listing__job-info-tag']}>
                <Icon name="job-type" className={styles['jobs-listing__job-info-tag-icon']} />
                <p className={styles['jobs-listing__job-info-tag-text']}>
                  {liveJob.projectTypeName}
                </p>
              </div>
              <div className={styles['jobs-listing__job-info-tag']}>
                <Icon name="user-outline" className={styles['jobs-listing__job-info-tag-icon']} />
                <p className={styles['jobs-listing__job-info-tag-text']}>
                  {liveJob.candidateCount} candidates
                </p>
              </div>
              <div className={styles['jobs-listing__job-info-tag']}>
                <Icon name="pocket" className={styles['jobs-listing__job-info-tag-icon']} />
                <p className={styles['jobs-listing__job-info-tag-text']}>
                  {formatSalary(liveJob.salary)}/{salaryPrefix}
                  {liveJob.superAmount && (
                    <span className={styles['jobs-listing__job-info-super']}>
                      (super: ${liveJob.superAmount})
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        );
      })}
      {loadingLiveJobs && <Loader loading />}
    </div>
  );
});
