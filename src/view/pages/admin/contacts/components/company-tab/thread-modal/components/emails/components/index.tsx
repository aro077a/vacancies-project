import React, { memo } from 'react';

import { Thread } from '~/models/admin';

import styles from './styles.scss';

export const Card: React.FC<Thread> = memo(function Card({ snippet }) {
  return (
    <div className={styles['card']}>
      <p className={styles['card__text']} dangerouslySetInnerHTML={{ __html: snippet }} />
    </div>
  );
});
