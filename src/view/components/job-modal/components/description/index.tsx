import React, { memo } from 'react';

import { useSelector } from '~/store';
import { formatSalary } from '~/utils/strings';
import { Editor } from '~/view/components/editor';
import { Icon } from '~/view/components/icon';

import styles from './styles.scss';

export const Description: React.FC = memo(function Description() {
  const selectedLiveJob = useSelector(state => state.adminLiveJobs.selectedLiveJob);

  const salaryPrefix =
    selectedLiveJob?.positionTypeName === 'Permanent'
      ? 'year'
      : selectedLiveJob?.paymentTypeName === 'Daily'
      ? 'day'
      : 'hour';

  const isTemporary = selectedLiveJob?.positionTypeName === 'Temporary';

  return (
    <div className={styles['description']}>
      <div className={styles['description__info-wrapper']}>
        <div className={styles['description__info-column']}>
          <div className={styles['description__info-item']}>
            <Icon name="location" className={styles['description__info-icon']} />
            <p className={styles['description__info']}>
              Location:
              <span>{selectedLiveJob?.location}</span>
            </p>
          </div>
          <div className={styles['description__info-item']}>
            <Icon name="job-type" className={styles['description__info-icon']} />
            <p className={styles['description__info']}>
              Project type:
              <span>{selectedLiveJob?.projectTypeName}</span>
            </p>
          </div>
          <div className={styles['description__info-item']}>
            <Icon name="job-type" className={styles['description__info-icon']} />
            <p className={styles['description__info']}>
              Position name:
              <span>{selectedLiveJob?.positionName}</span>
            </p>
          </div>
        </div>
        <div className={styles['description__info-column']}>
          <div className={styles['description__info-item']}>
            <Icon name="pocket" className={styles['description__info-icon']} />
            <p className={styles['description__info']}>
              {isTemporary ? 'Daily/Hourly rate:' : 'Approx. Annual Salary:'}
              <span>
                {formatSalary(selectedLiveJob?.salary)}/{salaryPrefix}
              </span>
              {selectedLiveJob?.superAmount && (
                <span className={styles['description__super-info']}>
                  (super: ${selectedLiveJob?.superAmount})
                </span>
              )}
            </p>
          </div>
          <div className={styles['description__info-item']}>
            <Icon name="bag-outline" className={styles['description__info-icon']} />
            <p className={styles['description__info']}>
              Position type:
              <span>{selectedLiveJob?.positionTypeName}</span>
            </p>
          </div>
        </div>
      </div>
      <div className={styles['description__separator']} />
      <h4 className={styles['description__title']}>Job Overview</h4>
      <p className={styles['description__text']}>{selectedLiveJob?.overview}</p>
      <div className={styles['description__separator']} />
      <h4 className={styles['description__title']}>Description</h4>
      <Editor readOnly rawContentState={selectedLiveJob?.jobDetail || undefined} />
    </div>
  );
});
