import classNames from 'classnames';
import React, { memo, useCallback, useRef } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';

import { Icon } from '~/view/components/icon';

import styles from './styles.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Checkbox: React.FC<UseControllerProps<any>> = memo(function Checkbox(props) {
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const {
    field: { value: checked, ref: controlRefCallBack, ...restField },
  } = useController(props as UseControllerProps<Record<string, boolean>>);

  const handleChange = useCallback(() => {
    hiddenInputRef.current?.click();
  }, []);

  return (
    <div
      className={classNames(styles['checkbox'], {
        [styles['checkbox--checked']]: checked,
      })}
      onClick={handleChange}
    >
      {checked && <Icon name="checkmark" className={styles['checkbox__checkmark']} />}
      <input
        type="checkbox"
        className={styles['checkbox__input']}
        checked={checked}
        ref={ref => {
          hiddenInputRef.current = ref;
          controlRefCallBack(ref);
        }}
        {...restField}
      />
    </div>
  );
});
