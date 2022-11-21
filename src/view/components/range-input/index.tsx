import classNames from 'classnames';
import React, { memo, useEffect, useRef } from 'react';
import { ControllerRenderProps } from 'react-hook-form';

import styles from './styles.scss';

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'step' | 'min' | 'max'> & {
  className?: string;
  controllerRenderProps?: Partial<ControllerRenderProps>;
  step: number;
  min: number;
  max: number;
};

export const RangeInput: React.FC<Props> = memo(function RangeInput({
  className,
  controllerRenderProps,
  step,
  min,
  max,
  value,
  ...restProps
}) {
  const filledProgressRef = useRef<HTMLDivElement>(null);
  const emptyProgressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      filledProgressRef.current &&
      emptyProgressRef.current &&
      value !== undefined &&
      min !== undefined &&
      max !== undefined
    ) {
      const progressPercent =
        (((value as number) - (min as number)) / ((max as number) - (min as number))) * 100;

      filledProgressRef.current.style.width = `${progressPercent}%`;
      emptyProgressRef.current.style.width = `${100 - progressPercent}%`;
    }
  }, [max, min, value]);

  return (
    <div className={classNames(styles['range'], className)}>
      <input
        type="range"
        className={styles['range__input']}
        step={step}
        min={min}
        max={max}
        value={value}
        {...controllerRenderProps}
        {...restProps}
      />
      <div
        ref={filledProgressRef}
        className={classNames(styles['range__progress'], styles['range__progress--filled'])}
      />
      <div
        ref={emptyProgressRef}
        className={classNames(styles['range__progress'], styles['range__progress--empty'])}
      />
    </div>
  );
});
