import dateFnsFormat from 'date-fns/format';
import React, { memo, useCallback } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';

import { Icon } from '~/view/components/icon';

import styles from './styles.scss';

type Props = {
  onChange: (date: Date) => void;
  value: Date | undefined;
};

export const CustomDayPicker: React.FC<Props> = memo(function DayPicker({ onChange, value }) {
  const formatDate = useCallback((date: Date, format: string) => {
    const formatParts = format.split('/');

    const formatYearPartIndex = formatParts.findIndex(formatPart =>
      formatPart.toLowerCase().includes('y'),
    );

    formatParts[formatYearPartIndex] = formatParts[formatYearPartIndex].slice(
      0,
      String(date.getFullYear()).length,
    );

    return dateFnsFormat(date, formatParts.join('/'));
  }, []);

  return (
    <div className={styles['date-picker']}>
      <Icon className={styles['date-picker__icon']} name="calendar" />
      <DayPickerInput
        onDayChange={onChange}
        placeholder="Select a date"
        formatDate={formatDate}
        format="dd/MM/yyyy"
        value={value}
      />
    </div>
  );
});
