import classNames from 'classnames';
import React, { memo } from 'react';

import styles from './styles.scss';

type Props = {
  checked: boolean;
};

export const RadioButton: React.FC<Props> = memo(function RadioButton({ checked }) {
  const radioButtonClassName = classNames(styles['radio-button'], {
    [styles['radio-button--checked']]: checked,
  });

  return (
    <div className={radioButtonClassName}>
      {checked && <div className={styles['radio-button__indicator']} />}
    </div>
  );
});
