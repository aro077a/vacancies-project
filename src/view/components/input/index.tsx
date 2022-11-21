import classNames from 'classnames';
import React, { BaseSyntheticEvent, forwardRef, LegacyRef, useCallback, useState } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';

import { formatByMask, getStaticCharsInMask, trimSpaces } from '~/utils/strings';
import { Icon } from '~/view/components/icon';

import styles from './styles.scss';

type Props = {
  placeholder: string;
  errorText?: string;
  label?: string;
  className?: string;
  type?: 'text' | 'email' | 'number' | 'password' | 'tel';
  disabled?: boolean;
  mask?: string;
  maxLength?: number;
  hintMessage?: string;
  twoDigit?: boolean;
  name: string;
  ref: LegacyRef<HTMLInputElement>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & UseControllerProps<any>;

export const Input = forwardRef<HTMLInputElement, Props>(
  (
    {
      placeholder,
      errorText,
      label,
      className,
      type = 'text',
      disabled = false,
      mask,
      maxLength,
      hintMessage,
      twoDigit,
      ...controllerProps
    },
    ref,
  ) => {
    const {
      field: { value, onChange, onBlur, name },
      fieldState: { error },
    } = useController(
      controllerProps as UseControllerProps<Record<string, string | number | undefined>>,
    );
    const [err, setErr] = useState(errorText);
    const handleChangeByMask = useCallback(
      (event: BaseSyntheticEvent) => {
        if (mask) {
          const staticChars = getStaticCharsInMask(mask);

          if (event.target.value.slice(0, staticChars.length) === staticChars) {
            const textWithoutSpaces = trimSpaces(event.target.value);

            if (textWithoutSpaces[staticChars.length] !== '0') {
              onChange(textWithoutSpaces);
            }
          }
        }
      },
      [mask, onChange],
    );

    const handleFocusByMask = useCallback(() => {
      if (mask && (value as string).length === 0) {
        const staticChars = getStaticCharsInMask(mask);
        onChange(staticChars);
      }
    }, [mask, onChange, value]);

    const handleBlurByMask = useCallback(() => {
      if (mask) {
        const staticChars = getStaticCharsInMask(mask);

        if (staticChars === value) {
          onChange('');
        }

        onBlur();
      }
    }, [mask, onBlur, onChange, value]);

    const handleOnChange = (e: BaseSyntheticEvent): void => {
      setErr('');
      if (mask) {
        handleChangeByMask(e);
      } else {
        onChange(e);
      }
    };

    const handleBlur = useCallback(() => {
      if (twoDigit) {
        if (String(value).length === 1) {
          onChange(`0${value}`);
          onBlur();
        }
      }

      onBlur();
    }, [onBlur, twoDigit, value, onChange]);
    return (
      <div className={className}>
        {label && <p className={styles['field__label']}>{label}</p>}
        <input
          className={classNames(styles['field__input'], {
            [styles['field__input--disabled']]: disabled,
            [styles['field__input--error']]: error || err,
            [styles['field__input--warning']]: error?.type === 'warning',
          })}
          placeholder={placeholder}
          type={type}
          disabled={disabled}
          maxLength={maxLength}
          value={mask ? formatByMask(value as string, mask) : value}
          onChange={handleOnChange}
          onFocus={mask ? handleFocusByMask : undefined}
          onBlur={mask ? handleBlurByMask : handleBlur}
          ref={ref}
          name={name}
        />
        {error && (
          <p
            className={classNames(styles['field__error-message'], {
              [styles['field__error-message--warning']]: error.type === 'warning',
            })}
          >
            {error.type === 'warning' && (
              <Icon name="warning" className={styles['field__error-warning-icon']} />
            )}
            {error.message}
          </p>
        )}
        {err && <p className={styles['field__error-message']}>{err}</p>}
        {hintMessage && <p className={styles['field__hint-message']}>{hintMessage}</p>}
      </div>
    );
  },
);
