import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useController, UseControllerProps, useWatch } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';

import { CompanyHiringManger } from '~/models/company';
import { Common } from '~/services/api/Common';
import { SelectOption } from '~/view/components/select';

import { ValueContainer } from './components/multi-value-container';
import { Option } from './components/option';
import styles from './styles.scss';

type Props = {
  index: number;
} & UseControllerProps<any>;

export const ManagerSelect: React.VFC<Props> = ({ index, ...controllerProps }) => {
  const [options, setOptions] = useState<SelectOption[]>([]);

  const {
    field: { onBlur, onChange, value },
    fieldState: { error },
  } = useController(controllerProps);

  const companyId: SelectOption = useWatch({
    control: controllerProps.control,
    name: `companies.${index}.id`,
  });

  useEffect(() => {
    const loadManagers = async (id: number): Promise<void> => {
      const {
        data: { data },
      } = (await Common.getCompanyHiringManagers(id)) as unknown as {
        data: {
          data: CompanyHiringManger[];
        };
      };

      const managersAsSelectOptions = data.map(
        ({ id, firstName, lastName }: CompanyHiringManger) => ({
          label: `${firstName} ${lastName}`,
          value: id,
        }),
      );

      setOptions(managersAsSelectOptions);
    };

    if (companyId) {
      loadManagers(companyId.value);
    }
  }, [companyId]);

  const colorStyles: StylesConfig<SelectOption, true> = {
    control: styles => ({
      ...styles,
      border: 'none !important',
      minHeight: 'none',
      boxShadow: 'none !important',
      backgroundColor: 'none !important',
      color: 'var(--primary-color)',
      cursor: 'pointer',
      justifyContent: 'space-between',
    }),
    container: styles => ({
      ...styles,
      width: '100%',
    }),
    option: styles => ({
      ...styles,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '15px 20px',
      lineHeight: 'var(--label-line-height)',
      color: 'var(--primary-color)',
      fontSize: 'var(--h4-font-size)',
      backgroundColor: 'var(--secondary-text-color)',
      '&:hover': {
        backgroundColor: 'var(--bg-hover-color)',
      },
      cursor: 'pointer',
    }),
    valueContainer: styles => ({
      ...styles,
      lineHeight: 'var(--label-line-height)',
      color: 'var(--primary-color)',
      fontSize: 'var(--h4-font-size)',
      maxWidth: '80%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      top: '20px',
      position: 'unset',
      display: 'inline-block',
      '&>div:first-of-type': {
        color: 'var(--muted-text-color)',
      },
    }),
    multiValueRemove: styles => ({
      ...styles,
      display: ' none',
    }),
    menu: styles => ({
      ...styles,
      width: 'calc(100% + 39px)',
      left: '-19px',
    }),
    menuList: styles => ({
      ...styles,
      maxHeight: '170px',
    }),
    dropdownIndicator: styles => ({
      ...styles,
      color: 'var(--primary-color)',
    }),
    singleValue: styles => ({
      ...styles,
      fontSize: 'var(--h4-font-size)',
      color: 'var(--primary-color)',
    }),
  };

  return (
    <div className={styles['wrapper']}>
      <p className={styles['label']}>Select hiring manager</p>
      <div
        className={classNames(styles['body'], {
          [styles['body--error']]: Boolean(error),
        })}
      >
        <Select
          placeholder="None"
          isMulti
          styles={colorStyles}
          components={{ Option, ValueContainer, IndicatorsContainer: () => null }}
          options={options}
          onBlur={onBlur}
          onChange={onChange}
          value={value}
          isSearchable={false}
          hideSelectedOptions={false}
          closeMenuOnSelect={false}
          isClearable={false}
        />
      </div>
      {error && <p className={styles['error-message']}>{error.message}</p>}
    </div>
  );
};
