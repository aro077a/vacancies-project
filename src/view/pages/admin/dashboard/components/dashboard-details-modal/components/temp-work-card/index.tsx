import React, { memo } from 'react';

import { ScoreboardTempWork } from '~/models/admin';
import { PaymentType } from '~/models/common';
import { Image } from '~/view/components/image';

import styles from './styles.scss';

type Props = {
  tempWork: ScoreboardTempWork;
  className: string;
};

export const ScoreboardTempWorkCard: React.FC<Props> = memo(function ScoreboardJobCard({
  className,
  tempWork: {
    companyName,
    candidateName,
    total,
    logo,
    adminName,
    positionName,
    paymentType,
    totalWorkCount,
  },
}) {
  const isHourly = paymentType === PaymentType.Hourly;

  return (
    <div className={className}>
      <div className={styles['modal__card-company']}>
        <Image className={styles['modal__card-img']} alt="Company logo" type="company" src={logo} />
        <p>{companyName}</p>
      </div>
      <p>{positionName}</p>
      <p>{adminName}</p>
      <p>{candidateName}</p>
      <p>${total}</p>
      <p>{isHourly ? `${totalWorkCount}/hour` : `${totalWorkCount}/day`}</p>
    </div>
  );
});
