import React, { ReactElement } from 'react';

import styles from './styles.scss';

export type CardProps = {
  svg: ReactElement;
  text: string;
};

export const Card: React.FC<CardProps> = ({ svg, text }) => {
  return (
    <div className={styles['card']}>
      <div className={styles['card__label']}>{svg}</div>
      <p className={styles['card__text']}>{text}</p>
    </div>
  );
};
