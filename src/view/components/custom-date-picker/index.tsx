import './styles.css';

import classNames from 'classnames';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import React, { BaseSyntheticEvent, memo, useCallback, useMemo, useState } from 'react';
import { DateUtils, DayPickerProps, LocaleUtils } from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import dayPickerClassNames from 'react-day-picker/src/classNames';
import { InputClassNames } from 'react-day-picker/types/ClassNames';
import { useController, UseControllerProps } from 'react-hook-form';

import { Icon } from '~/view/components/icon';

import styles from './styles.scss';

type Props = {
  placeholder: string;
  label?: string;
  className?: string;
  hintMessage?: string;
  inlineIconVisible?: boolean;
  overlayOnRight?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & UseControllerProps<any>;

type YearMonthFormType = {
  date: Date;
  localeUtils: LocaleUtils;
  onChange: (arg0: Date) => void;
};

export const CustomDatePicker: React.FC<Props> = memo(function DatePicker({
  placeholder,
  label,
  className,
  hintMessage,
  inlineIconVisible = true,
  overlayOnRight = false,
  ...controllerProps
}) {
  const {
    field: { value, onChange: onYearChange },
    fieldState: { error },
  } = useController(controllerProps as UseControllerProps<Record<string, string | Date | null>>);

  const dayPickerInputClassNames: InputClassNames = useMemo(
    () => ({
      container: classNames('DayPickerInput', styles['date-picker__control'], {
        [styles['date-picker__control--error']]: error,
      }),
      overlay: classNames('DayPickerInput-Overlay', {
        [styles['DayPickerInput-Overlay--right']]: overlayOnRight,
      }),
      overlayWrapper: 'DayPickerInput-OverlayWrapper',
    }),
    [error, overlayOnRight],
  );

  const defaultYear = useMemo(() => new Date(1980, 0, 1).getFullYear(), []);
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const fromMonth = useMemo(() => new Date(defaultYear, 0), [defaultYear]);
  const toMonth = useMemo(
    () => new Date(defaultYear + (currentYear - defaultYear), 11),
    [defaultYear, currentYear],
  );
  const [selectedMonth, setSelectedMonth] = useState<Date>(fromMonth);

  const formatDate = useCallback((date: Date, format: string) => {
    const formatParts = format.split('/');

    const formatYearPartIndex = formatParts.findIndex(formatPart =>
      formatPart.toLowerCase().includes('y'),
    );

    formatParts[formatYearPartIndex] = formatParts[formatYearPartIndex].slice(
      0,
      String(date.getFullYear()).length,
    );

    return dateFnsFormat(date, formatParts.join('/'));
  }, []);

  const parseDate = useCallback((str: string, format: string) => {
    const parsed = dateFnsParse(str, format, new Date());

    if (DateUtils.isDate(parsed)) {
      return parsed;
    }

    return undefined;
  }, []);

  const YearMonthForm = memo(function YearMonthForm({
    date,
    localeUtils,
    onChange,
  }: YearMonthFormType) {
    const months = localeUtils.getMonths();

    const years = [] as number[];
    for (let i = toMonth.getFullYear(); i > fromMonth.getFullYear(); i -= 1) {
      years.push(i);
    }

    const handleChange = (e: BaseSyntheticEvent): void => {
      const { year, month } = e.target.form;
      onChange(new Date(year.value, month.value));
      onYearChange(new Date(year.value, month.value));
    };
    return (
      <form className={styles['DayPicker-Caption']}>
        <select name="month" onChange={handleChange} value={date.getMonth()} size={15}>
          {months.map((month: string, i: number) => (
            <option key={month} value={i}>
              {month}
            </option>
          ))}
        </select>
        <select name="year" onChange={handleChange} value={date.getFullYear()} size={15}>
          {years.map(year => (
            <option key={year}>{year}</option>
          ))}
        </select>
      </form>
    );
  });

  const handleYearMonthChange = useCallback(month => {
    setSelectedMonth(month);
  }, []);

  const dayPickerProps: DayPickerProps = useMemo(
    () => ({
      classNames: {
        ...dayPickerClassNames,
        wrapper: classNames(dayPickerClassNames.wrapper, styles['date-picker__day-picker-wrapper']),
      },
      month: selectedMonth,
      fromMonth,
      toMonth,
      captionElement: ({ date, localeUtils }) => (
        <YearMonthForm date={date} localeUtils={localeUtils} onChange={handleYearMonthChange} />
      ),
    }),
    [YearMonthForm, fromMonth, toMonth, handleYearMonthChange, selectedMonth],
  );
  return (
    <div className={classNames(styles['date-picker'], className)}>
      {label && <p className={styles['date-picker__label']}>{label}</p>}
      <div className={styles['date-picker__control-wrapper']}>
        <DayPickerInput
          format="dd/MM/yyyy"
          classNames={dayPickerInputClassNames}
          placeholder={placeholder}
          formatDate={formatDate}
          parseDate={parseDate}
          value={value || undefined}
          onChange={onYearChange}
          onDayChange={onYearChange}
          dayPickerProps={dayPickerProps}
        />
        {inlineIconVisible && (
          <Icon name="calendar" className={styles['date-picker__calendar-icon']} />
        )}
      </div>
      {error && <p className={styles['date-picker__error-message']}>{error.message}</p>}
      {hintMessage && <p className={styles['date-picker__hint-message']}>{hintMessage}</p>}
    </div>
  );
});
