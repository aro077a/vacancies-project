import React from 'react';

import { useSelector } from '~/store';
import { Editor } from '~/view/components/editor';
import { Icon } from '~/view/components/icon';

import styles from './styles.scss';

export const Description: React.FC = () => {
  const { selectedJob } = useSelector(state => state.companyMyJobs);

  return (
    <div className={styles['overview']}>
      <div className={styles['overview__labels']}>
        <div className={styles['overview__labels-item']}>
          <Icon name="location" className={styles['overview__labels-item-icon']} />
          <p className={styles['overview__labels-item-caption']}>
            Location:{' '}
            <span className={styles['overview__labels-item-value']}>{selectedJob?.location}</span>
          </p>
        </div>
        <div className={styles['overview__labels-item']}>
          <Icon name="pocket" className={styles['overview__labels-item-icon']} />
          <p className={styles['overview__labels-item-caption']}>
            Approx. Annual Salary:{' '}
            <span className={styles['overview__labels-item-value']}>${selectedJob?.salary}</span>
            {selectedJob?.superAmount && (
              <span className={styles['overview__labels-item-super']}>
                (super: ${selectedJob.superAmount})
              </span>
            )}
          </p>
        </div>
        <div className={styles['overview__labels-item']}>
          <Icon name="job-type" className={styles['overview__labels-item-icon']} />
          <p className={styles['overview__labels-item-caption']}>
            Project type:{' '}
            <span className={styles['overview__labels-item-value']}>
              {selectedJob?.projectTypeName}
            </span>
          </p>
        </div>
        <div className={styles['overview__labels-item']}>
          <Icon name="bag-outline" className={styles['overview__labels-item-icon']} />
          <p className={styles['overview__labels-item-caption']}>
            Position type:{' '}
            <span className={styles['overview__labels-item-value']}>
              {selectedJob?.positionTypeName}
            </span>
          </p>
        </div>
      </div>
      <div className={styles['overview__description']}>
        <h4 className={styles['overview__description-title']}>Description</h4>
        {selectedJob?.description ? (
          <Editor readOnly rawContentState={selectedJob?.description} />
        ) : (
          <p className={styles['overview__no-description-message']}>No description</p>
        )}
      </div>
    </div>
  );
};
