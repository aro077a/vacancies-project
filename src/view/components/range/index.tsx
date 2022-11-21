import classNames from 'classnames';
import React, { memo } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';

import { RangeInput } from '~/view/components/range-input';

import styles from './styles.scss';

type Props = {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & UseControllerProps<any>;

export const Range: React.FC<Props> = memo(function Range({
  label,
  unit,
  min,
  max,
  step,
  className,
  ...controllerProps
}) {
  const {
    field: { value, ...restField },
  } = useController(controllerProps as UseControllerProps<Record<string, number | undefined>>);

  return (
    <div className={classNames(styles['range'], className)}>
      <p className={styles['range__label']}>{label}</p>
      <div className={styles['range__control']}>
        <p className={styles['range__value']}>{value}</p>
        <p className={styles['range__value']}>{unit}</p>
      </div>
      <RangeInput
        className={styles['range__input']}
        min={min}
        max={max}
        step={step}
        value={value}
        controllerRenderProps={restField}
      />
    </div>
  );
});
