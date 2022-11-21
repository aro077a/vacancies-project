import React, { memo, useCallback, useEffect, useState } from 'react';
import Select, { components, GroupTypeBase, OptionProps, StylesConfig } from 'react-select';

import { SelectOption } from '~/view/components/select';

import styles from './styles.scss';

type Props = {
  options: SelectOption[];
  onChange: (value: SelectOption[]) => void;
  label?: string;
  placeholder?: string;
  positionsOptions?: number[];
  regionOptions?: number[];
};

type TCompanies = {
  abbr: string;
  isSelected: boolean;
  label: string;
  value: number;
};
type TRegions = {
  image: string | null;
  isSelected: boolean;
  label: string;
  value: number;
};

export const CustomSelect: React.FC<Props> = memo(function CustomSelect({
  options,
  label,
  onChange,
  placeholder,
  positionsOptions,
  regionOptions,
}) {
  const [selectedValue, setSelectedValue] = useState<SelectOption[]>([]);
  useEffect(() => {
    const defaultSelectedOptions = options?.filter(option => option?.isSelected === true);
    setSelectedValue(prev => [...prev, ...defaultSelectedOptions]);
  }, [options]);

  const Option: React.FC<OptionProps<SelectOption, boolean, GroupTypeBase<SelectOption>>> = memo(
    function Option(props) {
      const handleSelect = useCallback(e => {
        const selectedItem = options?.find((option: SelectOption) => option.value === e);
        const filteredOptions = options.filter((item: SelectOption) => {
          if (selectedItem?.value === item.value) {
            item.isSelected = !item.isSelected;
          }
          return item.isSelected;
        });
        setSelectedValue(filteredOptions);
      }, []);
      return (
        <div className={styles['select-option']} ref={props.innerRef} {...props.innerProps}>
          <components.Option {...props}>
            <input
              type="checkbox"
              checked={props.data.isSelected}
              onChange={() => handleSelect(props.data.value)}
              className={styles['select-option__input']}
            />
            <div className={styles['select-option__name']} onClick={e => e.stopPropagation()}>
              {props.data.label}
            </div>
          </components.Option>
        </div>
      );
    },
  );

  const handleChange = useCallback(
    option => {
      onChange(option);
    },
    [onChange],
  );

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const MultiValueContainer = ({ data }: Record<string, TCompanies | TRegions>) => {
    if (
      regionOptions &&
      positionsOptions &&
      (positionsOptions?.length <= 2 || regionOptions?.length <= 2)
    ) {
      return <span className={styles['select__custom-select--value']}>{data.label}, </span>;
    }
    return (
      <span className={styles['select__custom-select--value']}>
        {data.label},{' '}
        <span>
          {' '}
          +
          {(positionsOptions && positionsOptions?.length - 2) ||
            (regionOptions && regionOptions?.length - 2)}
        </span>
      </span>
    );
  };

  const colourStyles: StylesConfig<SelectOption, true> = {
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
      paddingTop: '40px',
      display: 'inline-block',
      '&>div:first-of-type': {
        color: 'var(--muted-text-color)',
      },
    }),

    indicatorsContainer: styles => ({
      ...styles,
      '&>div:first-of-type': {
        display: `${
          (positionsOptions && positionsOptions?.length > 0) ||
          (regionOptions && regionOptions?.length > 0)
            ? 'none'
            : 'block'
        }`,
      },
    }),
    multiValueRemove: styles => ({
      ...styles,
      display: ' none',
    }),
    menu: styles => ({
      ...styles,
      top: '70%',
      left: '-21px',
      width: '348px',
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
      color: 'var(--primary-color)',
      fontWeight: 'var(--bold-fs)' as 'bold',
    }),
  };

  return (
    <div className={styles['select__wrapper']}>
      <p className={styles['select__label']}>{label}</p>
      <div className={styles['select__body']}>
        <Select
          isMulti
          className={styles['select__custom-select']}
          options={[...options]}
          styles={colourStyles}
          components={{ Option, IndicatorSeparator: () => null, MultiValueContainer }}
          onChange={handleChange}
          placeholder={placeholder}
          value={selectedValue}
          hideSelectedOptions={false}
          closeMenuOnSelect={false}
        />
      </div>
    </div>
  );
});
