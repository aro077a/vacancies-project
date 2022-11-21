import React, { memo } from 'react';

import styles from './styles.scss';

type Props = {
  items: string[];
  date: string;
};

export const Dropdown: React.FC<Props> = memo(function Dropdown({ items, date }) {
  return (
    <div className={styles['dropdown']}>
      <div className={styles['dropdown__label']}>
        <span className={styles['dropdown__label-title']}>To:</span>
        <ul className={styles['dropdown__list']}>
          {items.map(item => (
            <li className={styles['dropdown__list-item']} key={item}>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles['dropdown__label']}>
        <span className={styles['dropdown__label-title']}>Date:</span>
        <p>{date}</p>
      </div>
    </div>
  );
});
