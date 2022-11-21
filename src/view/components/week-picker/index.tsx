import 'react-day-picker/lib/style.css';

import { addDays, endOfISOWeek, startOfISOWeek } from 'date-fns';
import React, { memo, useCallback, useState } from 'react';
import DayPicker from 'react-day-picker';
import { UseControllerProps } from 'react-hook-form';

import styles from './styles.scss';

type Props = {
  label?: string;
  className?: string;
  placeholder?: string;
  selectedDays: Date[];
  setSelectedDays: (arg0: Date[]) => void;
  setOpen: (arg0: boolean) => void;
} & UseControllerProps<any>;

export const WeekPicker: React.FC<Props> = memo(function TimePicker({
  selectedDays,
  setSelectedDays,
  setOpen,
}) {
  const [hoverRange, setHoverRange] = useState<Record<string, unknown>>();

  const getWeekDays = useCallback(
    (weekStart: Date) => {
      const days = [weekStart];
      for (let i = 1; i < 7; i += 1) {
        days.push(addDays(weekStart, i));
      }
      setOpen(false);

      return days;
    },
    [setOpen],
  );

  const getWeekRange = useCallback((date: Date) => {
    return {
      from: startOfISOWeek(new Date(date)),
      to: endOfISOWeek(new Date(date)),
    };
  }, []);

  const handleDayChange = useCallback(
    (date: Date) => {
      setSelectedDays(getWeekDays(getWeekRange(date).from));
    },
    [getWeekDays, getWeekRange, setSelectedDays],
  );

  const handleDayEnter = useCallback(
    (date: Date) => {
      setHoverRange(getWeekRange(date));
    },
    [getWeekRange],
  );

  const handleDayLeave = useCallback(
    (date: Date) => {
      setHoverRange(getWeekRange(date));
    },
    [getWeekRange],
  );

  const handleWeekClick = useCallback(
    (_, days: Date[]) => {
      setSelectedDays(days);
    },
    [setSelectedDays],
  );

  const daysAreSelected = selectedDays.length > 0;

  const modifiers = {
    hoverRange,
    selectedRange: daysAreSelected && {
      from: selectedDays[0],
      to: selectedDays[6],
    },
    hoverRangeStart: hoverRange?.from,
    hoverRangeEnd: hoverRange?.to,
    selectedRangeStart: daysAreSelected && selectedDays[0],
    selectedRangeEnd: daysAreSelected && selectedDays[6],
  } as never;

  return (
    <div className={styles['week-picker']}>
      <DayPicker
        selectedDays={selectedDays}
        showWeekNumbers
        showOutsideDays
        modifiers={modifiers}
        onDayClick={handleDayChange}
        onDayMouseEnter={handleDayEnter}
        onDayMouseLeave={handleDayLeave}
        onWeekClick={handleWeekClick}
        firstDayOfWeek={1}
      />
    </div>
  );
});
