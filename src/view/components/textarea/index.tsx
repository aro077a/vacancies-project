import classNames from 'classnames';
import React, { forwardRef, LegacyRef, useCallback } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';

import styles from './styles.scss';

type Props = {
  placeholder: string;
  label?: string;
  maxLength: number;
  className?: string;
  textAreaClassName?: string;
  name: string;
  ref: LegacyRef<HTMLTextAreaElement>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & UseControllerProps<any>;

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ placeholder, label, maxLength, className, textAreaClassName, ...controllerProps }, ref) => {
    const {
      field: { value, onChange, name },
      fieldState: { error },
    } = useController(controllerProps as UseControllerProps<Record<string, string>>);

    const textAreaClassNames = classNames(
      styles['field__textarea'],
      {
        [styles['field__textarea--error']]: error,
      },
      textAreaClassName,
    );

    const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = useCallback(
      event => {
        if (event.target.value.length <= maxLength) {
          onChange(event);
        }
      },
      [onChange, maxLength],
    );

    return (
      <div className={className}>
        <p className={styles['field__label']}>{label}</p>
        <textarea
          placeholder={placeholder}
          className={textAreaClassNames}
          value={value || ''}
          onChange={handleChange}
          maxLength={maxLength}
          name={name}
          ref={ref}
        />
        {error && <p className={styles['field__error-message']}>{error.message}</p>}
        <p className={styles['field__remaining-chars-message']}>
          {maxLength - (value?.length || 0)} characters remaining
        </p>
      </div>
    );
  },
);
