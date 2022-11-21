import classNames from 'classnames';
import React, { useEffect } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';

import { getCompanies } from '~/modules/companies/actions';
import { companiesAsSelectOptionsSelector } from '~/modules/companies/selectors';
import { useDispatch, useSelector } from '~/store';
import { SelectOption } from '~/view/components/select';
import { Option } from '~/view/components/select/components/option';
import { SingleValue } from '~/view/components/select/components/single-value';

import styles from './styles.scss';

export const CompanySelect: React.FC<UseControllerProps<any>> = ({ ...controllerProps }) => {
  const dispatch = useDispatch();
  const companiesAsSelectOptions = useSelector(companiesAsSelectOptionsSelector);
  const { companies } = useSelector(state => state.companies);

  useEffect(() => {
    if (companies.length === 0) {
      dispatch(getCompanies.request());
    }
  }, [dispatch, companies]);

  const {
    field: { onBlur, onChange, value },
    fieldState: { error },
  } = useController(controllerProps);

  const colorStyles: StylesConfig<SelectOption, true> = {
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
        color: 'var(--muted-text-color)',
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
    <div className={styles['wrapper']}>
      <p className={styles['label']}>Select hiring company</p>
      <div
        className={classNames(styles['body'], {
          [styles['body--error']]: Boolean(error),
        })}
      >
        <Select
          className={styles['custom-select']}
          options={companiesAsSelectOptions}
          onBlur={onBlur}
          value={value}
          styles={colorStyles}
          components={{ Option, SingleValue }}
          onChange={onChange}
          placeholder="None"
        />
      </div>
      {error && <p className={styles['error-message']}>{error.message}</p>}
    </div>
  );
};
