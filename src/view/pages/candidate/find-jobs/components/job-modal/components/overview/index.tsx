import React from 'react';

import { useSelector } from '~/store';
import { Editor } from '~/view/components/editor';
import { Icon } from '~/view/components/icon';

import styles from './styles.scss';

export const Overview: React.FC = () => {
  const { jobDescription } = useSelector(state => state.candidateFindJobs);

  const prefix = jobDescription?.positionTypeName === 'Temporary' ? 'hour' : 'year';

  return (
    <div className={styles['overview']}>
      <div className={styles['overview__labels']}>
        <div className={styles['overview__labels-item']}>
          <Icon name="location" className={styles['overview__labels-item-icon']} />
          <p className={styles['overview__labels-item-caption']}>
            Location:{' '}
            <span className={styles['overview__labels-item-value']}>
              {jobDescription?.location}
            </span>
          </p>
        </div>
        <div className={styles['overview__labels-item']}>
          <Icon name="pocket" className={styles['overview__labels-item-icon']} />
          <p className={styles['overview__labels-item-caption']}>
            Approx. Annual Salary:{' '}
            <span className={styles['overview__labels-item-value']}>
              ${jobDescription?.salary}/{prefix}
            </span>
          </p>
        </div>
        <div className={styles['overview__labels-item']}>
          <Icon name="job-type" className={styles['overview__labels-item-icon']} />
          <p className={styles['overview__labels-item-caption']}>
            Project type:{' '}
            <span className={styles['overview__labels-item-value']}>
              {jobDescription?.projectTypeName}
            </span>
          </p>
        </div>
        <div className={styles['overview__labels-item']}>
          <Icon name="bag-outline" className={styles['overview__labels-item-icon']} />
          <p className={styles['overview__labels-item-caption']}>
            Position type:{' '}
            <span className={styles['overview__labels-item-value']}>
              {jobDescription?.positionTypeName}
            </span>
          </p>
        </div>
        <div className={styles['overview__labels-item']}>
          <Icon name="job-type" className={styles['overview__labels-item-icon']} />
          <p className={styles['overview__labels-item-caption']}>
            Position name:{' '}
            <span className={styles['overview__labels-item-value']}>
              {jobDescription?.positionName}
            </span>
          </p>
        </div>
      </div>
      <div className={styles['overview__description']}>
        <h4 className={styles['overview__description-title']}>Description</h4>
        {jobDescription?.description ? (
          <Editor readOnly rawContentState={jobDescription?.description} />
        ) : (
          <p className={styles['overview__no-description-message']}>No description</p>
        )}
      </div>
    </div>
  );
};
