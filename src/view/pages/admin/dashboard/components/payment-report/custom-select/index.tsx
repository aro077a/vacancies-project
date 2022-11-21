import React, { memo, useCallback } from 'react';
import Select, { StylesConfig } from 'react-select';

import { SelectOption } from '~/view/components/select';

import styles from './styles.scss';

type Props = {
  options: SelectOption[];
  onChange: (value: SelectOption) => void;
  label?: string;
  placeholder?: string;
  defaultValue?: SelectOption | null;
};

export const CustomSelect: React.FC<Props> = memo(function CustomSelect({
  options,
  label,
  onChange,
  placeholder,
  defaultValue,
}) {
  const handleChange = useCallback(
    option => {
      onChange(option);
    },
    [onChange],
  );

  const colorStyles: StylesConfig<SelectOption, true> = {
    control: styles => ({
      ...styles,
      border: 'none !important',
      minHeight: 'none',
      boxShadow: 'none !important',
      color: 'var(--primary-color)',
      cursor: 'pointer',
    }),
    option: styles => ({
      ...styles,
      padding: '15px 20px',
      color: 'var(--primary-color)',
      backgroundColor: '#fff',
      '&:hover': {
        backgroundColor: 'var(--bg-hover-color)',
      },
      cursor: 'pointer',
    }),
    menu: styles => ({
      ...styles,
      width: 'calc(100% + 39px)',
      left: '-19px',
    }),
    dropdownIndicator: styles => ({
      ...styles,
      color: 'var(--primary-color)',
    }),
    singleValue: styles => ({
      ...styles,
      color: 'var(--primary-color)',
      fontWeight: 'var(--bold-fs)' as 'bold',
    }),
  };

  return (
    <div className={styles['select__wrapper']}>
      <p className={styles['select__label']}>{label}</p>
      <div className={styles['select__body']}>
        <Select
          className={styles['select__custom-select']}
          options={options}
          styles={colorStyles}
          components={{ IndicatorSeparator: () => null }}
          onChange={handleChange}
          placeholder={placeholder}
          defaultValue={defaultValue}
        />
      </div>
    </div>
  );
});
