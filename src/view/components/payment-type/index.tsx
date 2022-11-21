import React, { memo, useCallback } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';

import { PaymentType } from '~/models/common';
import { RadioButton } from '~/view/components/radio-button';

import styles from './styles.scss';

type Props = {
  className: string;
} & UseControllerProps<any>;

export const PaymentTypeComponent: React.FC<Props> = memo(function PaymentTypeComponent({
  className,
  ...controllerProps
}) {
  const {
    field: { value, onChange },
  } = useController(controllerProps as UseControllerProps<Record<string, PaymentType>>);

  const handlePaymentTypeChange = useCallback(
    (type: PaymentType) => {
      if (type !== value) {
        onChange(type);
      }
    },
    [onChange, value],
  );

  return (
    <div className={className}>
      <p className={styles['payment-type__title']}>Contract Payment type</p>
      <div className={styles['payment-type__labels']}>
        <div
          className={styles['payment-type__label']}
          onClick={() => handlePaymentTypeChange(PaymentType.Hourly)}
        >
          <RadioButton checked={value === PaymentType.Hourly} />
          <p className={styles['payment-type__label-text']}>Hourly</p>
        </div>
        <div
          className={styles['payment-type__label']}
          onClick={() => handlePaymentTypeChange(PaymentType.Daily)}
        >
          <RadioButton checked={value === PaymentType.Daily} />
          <p className={styles['payment-type__label-text']}>Daily</p>
        </div>
      </div>
    </div>
  );
});
