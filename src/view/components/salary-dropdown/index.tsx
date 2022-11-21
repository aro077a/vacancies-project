import classNames from 'classnames';
import React, { BaseSyntheticEvent, memo, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { SalaryRangeFormValues } from '~/types/formValues';
import { Button } from '~/view/components/button';
import { Checkbox } from '~/view/components/checkbox';
import { Input } from '~/view/components/input';

import styles from './styles.scss';

type Props = {
  setSalary: (salary: SalaryRangeFormValues) => void;
  visible: boolean;
  className: string;
  withAmount: boolean;
};

export const SalaryDropdown: React.FC<Props> = memo(function SalaryDropdown({
  setSalary,
  visible,
  className,
  withAmount,
}) {
  const { control, handleSubmit, reset } = useForm<SalaryRangeFormValues>({
    defaultValues: {
      salaryGte: '',
      salaryLte: '',
      withAmount: false,
    },
  });

  useEffect(() => {
    reset({ salaryGte: '', salaryLte: '', withAmount: false });
  }, [visible]);

  if (!visible) {
    return null;
  }

  const dropdownClassName = classNames(styles['dropdown'], className);

  const onSubmit = (values: SalaryRangeFormValues): void => {
    setSalary(values);
  };

  const preventBubble = (e: BaseSyntheticEvent): void => {
    e.stopPropagation();
  };

  return (
    <div onClick={preventBubble} className={dropdownClassName}>
      <p className={styles['dropdown__title']}>Salary range</p>
      {withAmount && (
        <div className={styles['dropdown__checkbox']}>
          <p>With super</p>
          <Checkbox name="withAmount" control={control} />
        </div>
      )}
      <div className={styles['dropdown__filters']}>
        <Input
          className={styles['dropdown__input']}
          control={control}
          mask="$ ****"
          name="salaryGte"
          placeholder="$ 0.00"
        />
        <div className={styles['divider']} />
        <Input
          className={styles['dropdown__input']}
          control={control}
          mask="$ ****"
          name="salaryLte"
          placeholder="$ 0.00"
        />
      </div>
      <Button
        className={styles['dropdown__apply-btn']}
        title="Apply filter"
        size="large"
        variant="accent"
        onClick={handleSubmit(onSubmit)}
      />
    </div>
  );
});
