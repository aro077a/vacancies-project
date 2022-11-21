import React, { BaseSyntheticEvent, memo } from 'react';

import styles from './styles.scss';

type Props = {
  label?: string;
  name: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

export const Input: React.FC<Props> = memo(function Input({ label, name, placeholder, onChange }) {
  const handleInputChange = (e: BaseSyntheticEvent): void => {
    onChange(e.target.value);
  };

  return (
    <div className={styles['input-wrapper']}>
      {label && <span className={styles['input__label']}>{label}</span>}
      <input
        onChange={handleInputChange}
        className={styles['input']}
        name={name}
        placeholder={placeholder || undefined}
      />
    </div>
  );
});
