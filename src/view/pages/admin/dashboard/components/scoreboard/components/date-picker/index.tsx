import classNames from 'classnames';
import React, { memo, useCallback, useState } from 'react';

import { Icon } from '~/view/components/icon';
import { Switch, SwitchOption } from '~/view/components/switch';
import { useOutsideClick } from '~/view/hooks/useOutsideClick';

import styles from './styles.scss';

type Props = {
  selectedDate: number | string;
  onChange: (date: number | string) => void;
};

const switchOptions: SwitchOption[] = [
  { label: 'Month', value: 1 },
  { label: 'Year', value: 2 },
];

const years: number[] = new Array(12)
  .fill(new Date().getFullYear() - 11)
  .map((firstYear, index) => firstYear + index);

const months: string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const DatePicker: React.FC<Props> = memo(function DatePicker({ selectedDate, onChange }) {
  const [selectedSwitchOption, setSelectedSwitchOption] = useState(switchOptions[1]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const ref = useOutsideClick<HTMLDivElement>({
    handler: useCallback(() => {
      if (dropdownVisible) {
        setDropdownVisible(false);
      }
    }, [dropdownVisible]),
  });

  const showDropdown = useCallback(() => {
    if (!dropdownVisible) {
      setDropdownVisible(true);
    }
  }, [dropdownVisible]);

  const handleSwitchOptionSelect = useCallback((option: SwitchOption) => {
    setSelectedSwitchOption(option);
  }, []);

  const handleSelectedDateChange = useCallback(
    (date: string | number) => {
      if (selectedDate !== date) {
        onChange(date);
      }
    },
    [onChange, selectedDate],
  );

  const dates = selectedSwitchOption.value === 1 ? months : years;

  return (
    <div ref={ref} className={styles['field']}>
      <div className={styles['field__control']} onClick={showDropdown}>
        <div className={styles['field__date-wrapper']}>
          <Icon name="calendar" className={styles['field__calendar-icon']} />
          <p className={styles['field__selected-date']}>{selectedDate}</p>
        </div>
        <Icon name="chevron-down" className={styles['field__chevron-icon']} />
      </div>
      {dropdownVisible && (
        <div className={styles['field__dropdown']}>
          <div className={styles['field__switch-wrapper']}>
            <p className={styles['field__switch-text']}>Pick Date</p>
            <Switch
              options={switchOptions}
              selectedOption={selectedSwitchOption}
              onSelect={handleSwitchOptionSelect}
            />
          </div>
          <div className={styles['field__dropdown-dates-wrapper']}>
            {dates.map(date => (
              <div
                key={date}
                className={classNames(styles['field__dropdown-date-wrapper'], {
                  [styles['field__dropdown-date-wrapper--month']]: selectedSwitchOption.value === 1,
                  [styles['field__dropdown-date-wrapper--selected']]: selectedDate === date,
                })}
                onClick={() => handleSelectedDateChange(date)}
              >
                <p
                  className={classNames(styles['field__dropdown-date'], {
                    [styles['field__dropdown-date--selected']]: selectedDate === date,
                  })}
                >
                  {date}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
