import classNames from 'classnames';
import React, { memo } from 'react';

import styles from './styles.scss';

type Props = {
  loading: boolean;
  light?: boolean;
};

export const Loader: React.FC<Props> = memo(function Loader({ loading, light = false }) {
  if (!loading) {
    return null;
  }

  return (
    <div className={styles['loader']}>
      <div
        className={classNames(styles['loader__dot'], { [styles['loader__dot--light']]: light })}
      />
      <div
        className={classNames(styles['loader__dot'], { [styles['loader__dot--light']]: light })}
      />
      <div
        className={classNames(styles['loader__dot'], { [styles['loader__dot--light']]: light })}
      />
      <div
        className={classNames(styles['loader__dot'], { [styles['loader__dot--light']]: light })}
      />
    </div>
  );
});
