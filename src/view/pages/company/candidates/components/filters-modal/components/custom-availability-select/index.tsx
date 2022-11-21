import React, { memo, useCallback } from 'react';
import Select, { components, GroupTypeBase, OptionProps, StylesConfig } from 'react-select';

import { Icon } from '~/view/components/icon';
import { SelectOption } from '~/view/components/select';

import styles from './styles.scss';

type Props = {
  onChange: (value: SelectOption[]) => void;
  label?: string;
  options: SelectOption[];
  icon: string;
};

export const CustomAvailabilitySelect: React.FC<Props> = memo(function CustomManagerSelect({
  label,
  onChange,
  options,
  icon,
}) {
  const Option: React.FC<OptionProps<SelectOption, boolean, GroupTypeBase<SelectOption>>> = memo(
    function Option(props) {
      const handleSelect = useCallback(e => {
        const selectedItem = options?.find((option: SelectOption) => option.value === e);
        options.filter((item: SelectOption) => {
          if (selectedItem?.value === item.value) {
            return !item.isSelected;
          }
          return item.isSelected;
        });
      }, []);

      return (
        <div className={styles['select-option']} ref={props.innerRef} {...props.innerProps}>
          <components.Option {...props}>
            <input
              type="checkbox"
              checked={props.isSelected}
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
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const ValueContainer = ({ children, ...props }: any) => {
    const { getValue } = props;

    const availabilitiesCount = getValue().length;
    if (!availabilitiesCount) {
      return <components.ValueContainer {...props}>{children}</components.ValueContainer>;
    }
    return (
      <components.ValueContainer {...props}>
        {`${availabilitiesCount} availabilities`}
      </components.ValueContainer>
    );
  };

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
      display: 'inline-block',
      '&>div:first-of-type': {
        color: 'gray',
        fontSize: 'var(--h5-font-size)',
        fontWeight: 'var(--bold-fs)' as 'bold',
        lineHeight: '39px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: 'calc(100% - 40px)',
      },
    }),
    multiValueRemove: styles => ({
      ...styles,
      display: ' none',
    }),
    menu: styles => ({
      ...styles,
      width: 'calc(100% + 62px)',
      left: '-40px',
      top: '60px',
      border: 'none',
      boxShadow: 'none',
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
    indicatorsContainer: styles => ({
      ...styles,
    }),
  };
  return (
    <div className={styles['select__wrapper']}>
      <p className={styles['select__label']}>{label}</p>
      <div className={styles['select__body']}>
        <Icon className={styles['select__body-icon']} name={icon} />
        <Select
          isMulti
          className={styles['select__custom-select']}
          options={[...options]}
          styles={colourStyles}
          components={{ Option, IndicatorSeparator: () => null, ValueContainer }}
          onChange={handleChange}
          hideSelectedOptions={false}
          closeMenuOnSelect={false}
          placeholder="Availability"
        />
      </div>
    </div>
  );
});
