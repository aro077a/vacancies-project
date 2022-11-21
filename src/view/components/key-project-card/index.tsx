import React, { memo } from 'react';

import { CandidateKeyProject } from '~/models/company';

import styles from './styles.scss';

export const KeyProjectCard: React.FC<CandidateKeyProject> = memo(function KeyProjectCard({
  value,
  type,
  name,
}) {
  return (
    <div className={styles['card']}>
      <div className={styles['card__name']}>{name}</div>
      <div className={styles['card__info']}>
        <p className={styles['card__type']}>
          <span className={styles['card__label']}>Type:</span>
          {type || 'N/A'}
        </p>
        <span className={styles['divider']}>|</span>
        <p className={styles['card__value']}>
          <span className={styles['card__label']}>Value:</span>
          {value || 'N/A'}
        </p>
      </div>
    </div>
  );
});
