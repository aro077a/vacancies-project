import React, { memo, useCallback } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';

import { LookingJobStatus } from '~/models/candidate';
import { RadioButton } from '~/view/components/radio-button';

import styles from './styles.scss';

type Props = {
  className: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & UseControllerProps<any>;

export const LookingJob: React.FC<Props> = memo(function LookingJob({
  className,
  ...controllerProps
}) {
  const {
    field: { value, onChange },
  } = useController(controllerProps as UseControllerProps<Record<string, LookingJobStatus>>);

  const handleStatusChange = useCallback(
    (status: LookingJobStatus) => {
      if (value !== status) {
        onChange(status);
      }
    },
    [onChange, value],
  );

  return (
    <div className={className}>
      <p className={styles['looking-job__label']}>I’m looking for a job</p>
      <div className={styles['looking-job__statuses']}>
        <div
          className={styles['looking-job__status']}
          onClick={() => handleStatusChange(LookingJobStatus.ACTIVE)}
        >
          <RadioButton checked={value === LookingJobStatus.ACTIVE} />
          <p className={styles['looking-job__status-label']}>Active</p>
        </div>
        <div
          className={styles['looking-job__status']}
          onClick={() => handleStatusChange(LookingJobStatus.PASSIVE)}
        >
          <RadioButton checked={value === LookingJobStatus.PASSIVE} />
          <p className={styles['looking-job__status-label']}>Passive</p>
        </div>
        <div
          className={styles['looking-job__status']}
          onClick={() => handleStatusChange(LookingJobStatus.NOT_LOOKING)}
        >
          <RadioButton checked={value === LookingJobStatus.NOT_LOOKING} />
          <p className={styles['looking-job__status-label']}>Not looking</p>
        </div>
      </div>
    </div>
  );
});
