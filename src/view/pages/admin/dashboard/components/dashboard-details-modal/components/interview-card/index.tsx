import React, { memo } from 'react';

import { ScoreboardInterview } from '~/models/admin';
import { Image } from '~/view/components/image';

import styles from './styles.scss';

type Props = {
  interview: ScoreboardInterview;
  className: string;
};

export const ScoreboardInterviewCard: React.FC<Props> = memo(function ScoreboardJobCard({
  className,
  interview: { companyName, managerName, candidateName, time, date, logo, adminName, positionName },
}) {
  return (
    <div className={className}>
      <div className={styles['modal__card-company']}>
        <Image className={styles['modal__card-img']} alt="Company logo" type="company" src={logo} />
        <p>{companyName}</p>
      </div>
      <p>{positionName}</p>
      <p>{adminName}</p>
      <p>{managerName || 'No manager'}</p>
      <p>{candidateName}</p>
      <p>{time}</p>
      <time>{new Date(date).toLocaleDateString()}</time>
    </div>
  );
});
