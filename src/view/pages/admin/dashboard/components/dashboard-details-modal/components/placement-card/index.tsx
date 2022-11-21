import React, { memo } from 'react';

import { ScoreboardPlacement } from '~/models/admin';
import { Image } from '~/view/components/image';

import styles from './styles.scss';

type Props = {
  placement: ScoreboardPlacement;
  className: string;
};

export const ScoreboardPlacementCard: React.FC<Props> = memo(function ScoreboardJobCard({
  className,
  placement: {
    companyName,
    managerName,
    candidateName,
    createdAt,
    approvedDate,
    logo,
    adminName,
    positionName,
  },
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
      <p>{new Date(createdAt).toLocaleDateString()}</p>
      <time>{new Date(approvedDate).toLocaleDateString()}</time>
    </div>
  );
});
