import React, { memo, useCallback } from 'react';
import Select, { StylesConfig } from 'react-select';

import { CustomSelectValueType } from '~/models/candidate';
import { SelectOption } from '~/view/components/select';
import { Option } from '~/view/components/select/components/option';
import { SingleValue } from '~/view/components/select/components/single-value';

import styles from './styles.scss';

type Props = {
  options: SelectOption[];
  onChange: (value: CustomSelectValueType) => void;
  label: string;
  defaultValue?: { value: number; label: string };
  placeholder: string;
};

export const CustomSelect: React.FC<Props> = memo(function CustomSelect({
  options,
  onChange,
  label,
  defaultValue,
  placeholder,
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
    indicatorSeparator: styles => ({
      ...styles,
      width: '0 !important',
    }),
    valueContainer: styles => ({
      ...styles,
      '&>div': {
        display: 'flex',
        alignItems: 'center',
        gap: '18px',
        fontSize: 'var(--h4-font-size)',
      },
    }),
    option: styles => ({
      ...styles,
      padding: '15px 20px',
      color: 'var(--primary-color)',
      backgroundColor: '#fff',
      display: 'flex',

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
    menuList: styles => ({
      ...styles,
      '&>div': {
        display: 'flex',
        alignItems: 'center',
        gap: '18px',
        fontSize: 'var(--h4-font-size)',
        color: 'var(--primary-color)',
      },
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
          styles={colourStyles}
          components={{ Option, SingleValue }}
          onChange={handleChange}
          defaultValue={defaultValue}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
});
