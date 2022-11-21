import React, { memo, useCallback } from 'react';
import Select, { StylesConfig } from 'react-select';

import { Icon } from '~/view/components/icon';
import { SelectOption } from '~/view/components/select';

import styles from './styles.scss';

type Props = {
  icon: string;
  selectOptions: SelectOption[];
  onChange: (value: SelectOption) => void;
  value: SelectOption;
};

export const CustomSelect: React.FC<Props> = memo(function CustomSelect({
  icon,
  selectOptions,
  value,
  onChange,
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
      width: 'calc(100% + 70px)',
      left: '-45px',
      zIndex: 3,
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
    indicatorSeparator: styles => ({
      ...styles,
      display: 'none',
    }),
  };

  return (
    <div className={styles['custom-select']}>
      <Icon className={styles['custom-select__icon']} name={icon} />
      <Select
        className={styles['custom-select__select']}
        onChange={handleChange}
        options={selectOptions}
        styles={colourStyles}
        value={value}
      />
    </div>
  );
});
