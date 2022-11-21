import React, { memo, useCallback, useMemo } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';
import ReactSelect, {
  GroupTypeBase,
  OptionsType,
  Props as ReactSelectProps,
  Styles,
} from 'react-select';
import AsyncSelect, { AsyncProps } from 'react-select/async';
import CreatableSelect, { CreatableProps } from 'react-select/creatable';

import { Info } from '~/view/components/info';

import { MultiValue } from './components/multi-value';
import { Option } from './components/option';
import { SingleValue } from './components/single-value';
import styles from './styles.scss';

export type SelectOption<Meta = unknown> = {
  label: string;
  value: number;
  image?: string | null;
  meta?: Meta;
  id?: number;
  matched?: number;
  isSelected?: boolean;
  actions?: boolean;
};

type Props = {
  placeholder: string;
  options: SelectOption[];
  label?: string;
  infoText?: string;
  searchable?: boolean;
  creatable?: boolean;
  async?: boolean;
  multiSelect?: boolean;
  className?: string;
  disabled?: boolean;
  clearable?: boolean;
  max?: number;
  controlStyles?: React.CSSProperties;
  valueContainerStyles?: React.CSSProperties;
  placeholderStyles?: React.CSSProperties;
  inputStyles?: React.CSSProperties;
  singleValueStyles?: React.CSSProperties;
  dropdownIndicatorStyles?: React.CSSProperties;
  loadOptions?: (inputValue: string) => Promise<SelectOption[]>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & UseControllerProps<any>;

const emptyOptions: SelectOption[] = [];

export const Select: React.FC<Props> = memo(function Select({
  placeholder,
  options,
  label,
  infoText,
  searchable = false,
  creatable = false,
  clearable = false,
  async = false,
  multiSelect = false,
  className,
  disabled = false,
  max,
  controlStyles,
  valueContainerStyles,
  placeholderStyles,
  inputStyles,
  singleValueStyles,
  dropdownIndicatorStyles,
  loadOptions,
  ...controllerProps
}) {
  const {
    field: { value, onChange, onBlur, ...restField },
    fieldState: { error },
  } = useController(
    controllerProps as UseControllerProps<Record<string, SelectOption | SelectOption[] | null>>,
  );

  const handleCreatableSelectChange = useCallback(
    (value: SelectOption | OptionsType<SelectOption> | null) => {
      if (value === null) {
        onChange(null);
      } else if (Array.isArray(value)) {
        onChange(value.map(option => ({ label: option.label, value: Math.random() })));
      } else {
        onChange({ label: (value as SelectOption).label, value: Math.random() });
      }
    },
    [onChange],
  );

  const reactSelectStyles: Partial<Styles<SelectOption, boolean, GroupTypeBase<SelectOption>>> =
    useMemo(
      () => ({
        control: (provided, state) => ({
          ...provided,
          minHeight: '60px',
          backgroundColor: state.menuIsOpen
            ? 'var(--bg-color-1)'
            : state.isDisabled
            ? 'var(--bg-color-22)'
            : 'var(--secondary-text-color)',
          border: state.menuIsOpen
            ? '1px solid var(--border-color-1)'
            : error
            ? '1px solid var(--error-color)'
            : '1px solid var(--border-light-color)',
          borderRadius: '6px',
          boxShadow: 'inset 0px 1px 5px rgba(188, 196, 208, 0.2)',
          cursor: 'pointer',
          ...controlStyles,
        }),
        indicatorSeparator: () => ({
          display: 'none',
        }),
        valueContainer: (provided, state) => ({
          ...provided,
          paddingLeft: state.isMulti ? (state.hasValue ? '7px' : '20px') : '20px',
          ...valueContainerStyles,
        }),
        placeholder: provided => ({
          ...provided,
          fontSize: 'var(--input-font-size)',
          lineHeight: 'var(--input-line-height)',
          color: 'var(--muted-text-color)',
          ...placeholderStyles,
        }),
        input: provided => ({
          ...provided,
          fontSize: 'var(--input-font-size)',
          lineHeight: 'var(--input-line-height)',
          color: 'var(--primary-color)',
          caretColor: 'var(--accent-color)',
          ...inputStyles,
        }),
        singleValue: (provided, state) => ({
          ...provided,
          fontSize: 'var(--input-font-size)',
          lineHeight: 'var(--input-line-height)',
          color: state.isDisabled ? 'var(--muted-text-color)' : 'var(--primary-color)',
          display: 'flex',
          alignItems: 'center',
          ...singleValueStyles,
        }),
        multiValue: provided => ({
          ...provided,
          backgroundColor: 'var(--bg-color-26)',
          borderRadius: '5px',
          padding: '4px 4px 4px 6px',
          margin: '5px',
        }),
        multiValueLabel: (provided, state) => ({
          ...provided,
          fontSize: 'var(--input-font-size)',
          lineHeight: 'var(--input-line-height)',
          color: state.isDisabled ? 'var(--muted-text-color)' : 'var(--primary-color)',
          marginRight: '7px',
          padding: '0px',
          borderRadius: '0px',
          display: 'flex',
          alignItems: 'center',
        }),
        multiValueRemove: provided => ({
          ...provided,
          width: '28px',
          height: '28px',
          borderRadius: '5px',
          padding: '0px',
          justifyContent: 'center',
        }),
        dropdownIndicator: (provided, state) => ({
          ...provided,
          color: 'var(--primary-color)',
          paddingRight: '23px',
          display: state.isDisabled ? 'none' : 'flex',
          ...dropdownIndicatorStyles,
        }),
        menu: provided => ({
          ...provided,
          backgroundColor: 'var(--secondary-text-color)',
          marginTop: '5px',
          borderRadius: '6px',
          boxShadow: '0px 4px 13px rgba(34, 33, 50, 0.05)',
          zIndex: 2,
        }),
        menuList: provided => ({
          ...provided,
          maxHeight: '188px',
          padding: '0px',
        }),
        option: (provided, state) => ({
          ...provided,
          height: '47px',
          fontSize: '14px',
          lineHeight: '16px',
          color: 'var(--text-color-1)',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '21px',
          transitionDuration: '0.1s',
          cursor: 'pointer',
          backgroundColor:
            state.isSelected || state.isFocused ? 'var(--bg-hover-color)' : undefined,
        }),
        noOptionsMessage: provided => ({
          ...provided,
          fontSize: '20px',
          lineHeight: '26px',
          color: 'var(--muted-text-color)',
        }),
        loadingMessage: provided => ({
          ...provided,
          fontSize: '20px',
          lineHeight: '26px',
          color: 'var(--muted-text-color)',
        }),
        loadingIndicator: provided => ({
          ...provided,
          color: 'var(--primary-color)',
        }),
      }),
      [
        controlStyles,
        dropdownIndicatorStyles,
        error,
        inputStyles,
        placeholderStyles,
        singleValueStyles,
        valueContainerStyles,
      ],
    );

  const renderValue = useCallback(
    (val: any) => {
      if (val && val.stateId) {
        return { value: val?.id, label: val?.name, meta: { stateId: val?.stateId } };
      }
      if (val && val.abbr) {
        return { value: val?.id, label: val?.name };
      }
      return val as SelectOption | SelectOption[] | null;
    },
    [value],
  );

  const reactSelectProps:
    | ReactSelectProps<SelectOption, boolean, GroupTypeBase<SelectOption>>
    | CreatableProps<SelectOption, boolean, GroupTypeBase<SelectOption>>
    | AsyncProps<SelectOption, GroupTypeBase<SelectOption>> = {
    styles: reactSelectStyles,
    isClearable: clearable,
    isSearchable:
      creatable && multiSelect
        ? max === (value as SelectOption[])?.length
          ? false
          : searchable
        : searchable,
    isMulti: multiSelect,
    isDisabled: disabled,
    placeholder: disabled ? '' : placeholder,
    options: multiSelect
      ? max === (value as SelectOption[])?.length
        ? emptyOptions
        : options
      : options,
    value: renderValue(value),
    onChange: creatable ? handleCreatableSelectChange : onChange,
    onBlur,
    loadOptions,
    components: { Option, SingleValue, MultiValue },
    noOptionsMessage:
      multiSelect && max === (value as SelectOption[])?.length
        ? () => 'Max limit achieved'
        : undefined,
    ...restField,
  };
  return (
    <div className={className}>
      {label && (
        <div className={styles['field__label-wrapper']}>
          <p className={styles['field__label']}>{label}</p>
          {infoText && <Info className={styles['field__info']} infoText={infoText} />}
        </div>
      )}
      {creatable ? (
        <CreatableSelect {...reactSelectProps} />
      ) : async ? (
        <AsyncSelect defaultOptions cacheOptions {...reactSelectProps} />
      ) : (
        <ReactSelect {...reactSelectProps} />
      )}
      {error && <p className={styles['field__error-message']}>{error.message}</p>}
    </div>
  );
});
