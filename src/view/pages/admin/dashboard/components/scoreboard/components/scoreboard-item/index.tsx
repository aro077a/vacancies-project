import classNames from 'classnames';
import React, { memo } from 'react';

import { Icon } from '~/view/components/icon';

import styles from './styles.scss';

type Props = {
  name: string;
  icon: 'bag' | 'chat' | 'bag-with-checkmark' | 'checkmark-in-circle' | 'man-in-hat';
  statics: number | string | undefined;
  onClick: () => void;
};

export const ScoreboardItem: React.FC<Props> = memo(function ScoreboardItem({
  name,
  icon,
  statics,
  onClick,
}) {
  return (
    <div onClick={onClick} className={styles['scoreboard-item']}>
      <div
        className={classNames(
          styles['scoreboard-item-icon-wrapper'],
          styles[`scoreboard-item-icon-wrapper--${icon}`],
        )}
      >
        <Icon name={icon} className={styles[`scoreboard-item-icon--${icon}`]} />
      </div>
      <div className={styles['scoreboard-item-info-wrapper']}>
        <div className={styles['scoreboard-item-statics-wrapper']}>
          <p className={styles['scoreboard-item-number-statics']}>{statics}</p>
        </div>
        <p className={styles['scoreboard-item-name']}>{name}</p>
      </div>
    </div>
  );
});
