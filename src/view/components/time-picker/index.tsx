import './style/styles.css';

import classNames from 'classnames';
import React, { memo } from 'react';
import ReactTimePicker from 'react-datepicker';
import { useController, UseControllerProps } from 'react-hook-form';

import styles from './styles.scss';

type Props = {
  label?: string;
  className?: string;
  placeholder: string;
} & UseControllerProps<any>;

export const TimePicker: React.FC<Props> = memo(function TimePicker({
  label,
  className,
  placeholder,
  ...controllerProps
}) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController(controllerProps as UseControllerProps<Record<string, string | Date | null>>);

  const classnames = classNames(styles['time-picker'], className);

  return (
    <div className={classnames}>
      <p className={styles['time-picker__label']}>{label}</p>
      <div
        className={classNames(styles['time-picker__wrapper'], {
          [styles['time-picker--error']]: error?.message,
        })}
      >
        <ReactTimePicker
          selected={value as Date}
          onChange={onChange}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={30}
          timeCaption="Time"
          dateFormat="h:mm aa"
          placeholderText={placeholder}
          autoComplete="off"
        />
      </div>
      {error && <p className={styles['time-picker__error-message']}>{error?.message}</p>}
    </div>
  );
});
