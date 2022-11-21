import React, { memo, useCallback } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';

import { PayOption } from '~/models/common';
import { RadioButton } from '~/view/components/radio-button';

import styles from './styles.scss';

type Props = {
  className: string;
} & UseControllerProps<any>;

export const PayOptionComponent: React.FC<Props> = memo(function PaymentTypeComponent({
  className,
  ...controllerProps
}) {
  const {
    field: { value, onChange },
  } = useController(controllerProps as UseControllerProps<Record<string, PayOption>>);

  const handlePaymentTypeChange = useCallback(
    (type: PayOption) => {
      if (type !== value) {
        onChange(type);
      }
    },
    [onChange, value],
  );

  return (
    <div className={className}>
      <p className={styles['payment-type__title']}>Payment option</p>
      <div className={styles['payment-type__labels']}>
        <div
          className={styles['payment-type__label']}
          onClick={() => handlePaymentTypeChange(PayOption.ABN)}
        >
          <RadioButton checked={value === PayOption.ABN} />
          <p className={styles['payment-type__label-text']}>ABN</p>
        </div>
        <div
          className={styles['payment-type__label']}
          onClick={() => handlePaymentTypeChange(PayOption.PAYG)}
        >
          <RadioButton checked={value === PayOption.PAYG} />
          <p className={styles['payment-type__label-text']}>PAYG</p>
        </div>
      </div>
    </div>
  );
});
