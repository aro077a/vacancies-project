import classNames from 'classnames';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import React, { memo, useCallback, useMemo } from 'react';
import { DateUtils, DayPickerProps } from 'react-day-picker';
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
  setResizable?: (arg0: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & UseControllerProps<any>;

export const DatePicker: React.FC<Props> = memo(function DatePicker({
  placeholder,
  label,
  className,
  hintMessage,
  inlineIconVisible = true,
  overlayOnRight = false,
  setResizable,
  ...controllerProps
}) {
  const {
    field: { value, onBlur, onChange, name, ref },
    fieldState: { error },
  } = useController(controllerProps as UseControllerProps<Record<string, string | Date | null>>);
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

  const handleDayChange = useCallback(
    (day: Date | undefined) => {
      if (day) {
        onChange(day);
      } else {
        onChange(null);
      }
    },
    [onChange],
  );

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

  const dayPickerProps: DayPickerProps = useMemo(
    () => ({
      classNames: {
        ...dayPickerClassNames,
        wrapper: classNames(dayPickerClassNames.wrapper, styles['date-picker__day-picker-wrapper']),
      },
    }),
    [],
  );

  const inputProps: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > = useMemo(
    () => ({
      name,
      ref,
      onBlur,
      autoComplete: 'off',
    }),
    [name, onBlur, ref],
  );
  const defaultDate = useMemo(() => dateFnsFormat(new Date(), 'dd/MM/yyyy'), []);

  return (
    <div className={classNames(styles['date-picker'], className)}>
      {label && <p className={styles['date-picker__label']}>{label}</p>}
      <div className={styles['date-picker__control-wrapper']}>
        <DayPickerInput
          clickUnselectsDay
          format="dd/MM/yyyy"
          classNames={dayPickerInputClassNames}
          placeholder={placeholder}
          formatDate={formatDate}
          parseDate={parseDate}
          value={value || defaultDate || undefined}
          inputProps={inputProps}
          onDayChange={handleDayChange}
          dayPickerProps={dayPickerProps}
          onDayPickerShow={() => setResizable?.(true)}
          onDayPickerHide={() => setResizable?.(false)}
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
