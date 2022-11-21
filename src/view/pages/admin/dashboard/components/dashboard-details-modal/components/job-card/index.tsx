import React, { memo } from 'react';

import { ScoreboardJob } from '~/models/admin';
import { Image } from '~/view/components/image';

import styles from './styles.scss';

type Props = {
  job: ScoreboardJob;
  className: string;
};

export const ScoreboardJobCard: React.FC<Props> = memo(function ScoreboardJobCard({
  className,
  job: { companyName, managerName, createdAt, logo, adminName, positionName },
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
      <time>{new Date(createdAt).toLocaleDateString()}</time>
    </div>
  );
});
