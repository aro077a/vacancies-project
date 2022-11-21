import React, { memo } from 'react';

import { JobState } from '~/models/admin';
import { formatSalary } from '~/utils/strings';
import { Icon } from '~/view/components/icon';
import { Image } from '~/view/components/image';

import styles from './styles.scss';

type Props = {
  job: JobState;
  jobLogo: string;
};

export const EmployerJobCard: React.FC<Props> = memo(function EmployerModal({ job, jobLogo }) {
  return (
    <div className={styles['jobs-listing__job']}>
      <div className={styles['jobs-listing__job-header']}>
        <div className={styles['jobs-listing__job-info']}>
          <Image
            type="company"
            className={styles['jobs-listing__company-image']}
            src={jobLogo}
            alt="company"
          />
          <div>
            <h4 className={styles['jobs-listing__job-title']}>{job.position.name}</h4>
          </div>
        </div>
      </div>
      <div className={styles['jobs-listing__job-footer']}>
        <div className={styles['jobs-listing__job-info-tag']}>
          <Icon name="location" className={styles['jobs-listing__job-info-tag-icon']} />
          <p
            className={styles['jobs-listing__job-info-tag-text']}
          >{`${job?.city?.name} , ${job?.state?.abbr}`}</p>
        </div>
        <div className={styles['jobs-listing__job-info-tag']}>
          <Icon name="job-type" className={styles['jobs-listing__job-info-tag-icon']} />
          <p className={styles['jobs-listing__job-info-tag-text']}>{job.projectType.name}</p>
        </div>
        <div className={styles['jobs-listing__job-info-tag']}>
          <Icon name="pocket" className={styles['jobs-listing__job-info-tag-icon']} />
          <p className={styles['jobs-listing__job-info-tag-text']}>
            {formatSalary(job.salary)}/year
          </p>
          {job?.superAmount && (
            <span className={styles['jobs__listing-job-super']}>(super: ${job?.superAmount})</span>
          )}
        </div>
      </div>
    </div>
  );
});
