import React, { memo, useCallback } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';

import { LookingCandidateStatus } from '~/models/company';
import { RadioButton } from '~/view/components/radio-button';

import styles from './styles.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LookingCandidate: React.FC<UseControllerProps<any>> = memo(function LookingCandidate(
  controllerProps,
) {
  const {
    field: { value, onChange },
  } = useController(controllerProps as UseControllerProps<Record<string, LookingCandidateStatus>>);

  const handleStatusChange = useCallback(
    (status: LookingCandidateStatus) => {
      if (value !== status) {
        onChange(status);
      }
    },
    [onChange, value],
  );

  return (
    <div>
      <p className={styles['looking-job__label']}>I’m looking for a candidate</p>
      <div className={styles['looking-job__statuses']}>
        <div
          className={styles['looking-job__status']}
          onClick={() => handleStatusChange(LookingCandidateStatus.ACTIVE)}
        >
          <RadioButton checked={value === LookingCandidateStatus.ACTIVE} />
          <p className={styles['looking-job__status-label']}>Active</p>
        </div>
        <div
          className={styles['looking-job__status']}
          onClick={() => handleStatusChange(LookingCandidateStatus.PASSIVE)}
        >
          <RadioButton checked={value === LookingCandidateStatus.PASSIVE} />
          <p className={styles['looking-job__status-label']}>Passive</p>
        </div>
        <div
          className={styles['looking-job__status']}
          onClick={() => handleStatusChange(LookingCandidateStatus.NOT_LOOKING)}
        >
          <RadioButton checked={value === LookingCandidateStatus.NOT_LOOKING} />
          <p className={styles['looking-job__status-label']}>Not looking</p>
        </div>
      </div>
    </div>
  );
});
