import classNames from 'classnames';
import React, { memo } from 'react';

import styles from './styles.scss';

export type SwitchOption = {
  label: string;
  value: number;
};

type Props = {
  options: SwitchOption[];
  selectedOption: SwitchOption;
  onSelect: (option: SwitchOption) => void;
};

export const Switch: React.FC<Props> = memo(function Switch({ options, selectedOption, onSelect }) {
  return (
    <div className={styles['block']}>
      {options.map(option => (
        <button
          key={option.value}
          disabled={option.value === selectedOption.value}
          className={classNames(styles['block__option'], {
            [styles['block__option--selected']]: option.value === selectedOption.value,
          })}
          onClick={() => onSelect(option)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
});
