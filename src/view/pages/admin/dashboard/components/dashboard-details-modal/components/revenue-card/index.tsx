import React, { memo } from 'react';

import { ScoreboardRevenue } from '~/models/admin';
import { PositionType } from '~/models/common';
import { Image } from '~/view/components/image';

import styles from './styles.scss';

type Props = {
  revenue: ScoreboardRevenue;
  className: string;
};

export const ScoreboardRevenueCard: React.FC<Props> = memo(function ScoreboardJobCard({
  className,
  revenue: { companyName, candidateName, type, total, createdAt, logo, adminName, positionName },
}) {
  return (
    <div className={className}>
      <div className={styles['modal__card-company']}>
        <Image className={styles['modal__card-img']} alt="Company logo" type="company" src={logo} />
        <p>{companyName}</p>
      </div>
      <p>{positionName}</p>
      <p>{adminName}</p>
      <p>{type === PositionType.PERMANENT ? 'Permanent' : 'Temporary'}</p>
      <p>{candidateName}</p>
      <p>${total}</p>
      <time>{new Date(createdAt).toLocaleDateString()}</time>
    </div>
  );
});
