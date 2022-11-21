import React, { memo, useCallback } from 'react';
import Select, { StylesConfig } from 'react-select';

import { Icon } from '~/view/components/icon';
import { SelectOption } from '~/view/components/select';

import styles from './styles.scss';

type Props = {
  options: SelectOption[];
  icon: 'bag' | 'job-type' | 'location';
  onChange: (value: SelectOption) => void;
  label: string;
  placeholder?: string;
  defaultValue: SelectOption | null;
};

export const CustomSelect: React.FC<Props> = memo(function CustomSelect({
  options,
  icon,
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

  const colourStyles: StylesConfig<SelectOption, true> = {
    control: styles => ({
      ...styles,
      border: 'none !important',
      minHeight: 'none',
      boxShadow: 'none !important',
      color: 'var(--primary-color)',
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
      width: 'calc(100% + 62px)',
      left: '-42px',
      top: '106%',
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
        <Icon className={styles['select__icon']} name={icon} />
        <Select
          className={styles['select__custom-select']}
          options={options}
          styles={colourStyles}
          components={{ IndicatorSeparator: () => null }}
          onChange={handleChange}
          placeholder={placeholder}
          defaultValue={defaultValue}
        />
      </div>
    </div>
  );
});
