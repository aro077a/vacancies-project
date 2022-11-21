import React from 'react';

import styles from './styles.scss';

export type CardProps = {
  id: string;
  text: string;
};

export const Card: React.FC<CardProps> = ({ id, text }) => {
  return (
    <div className={styles['card']}>
      <span className={styles['card__id']}>{id}</span>
      <p className={styles['card__text']}>{text}</p>
    </div>
  );
};
