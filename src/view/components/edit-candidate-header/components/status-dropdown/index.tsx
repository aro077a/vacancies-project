import classNames from 'classnames';
import React, { memo, useCallback, useState } from 'react';

import { LookingJobStatus } from '~/models/candidate';
import { Icon } from '~/view/components/icon';
import { useOutsideClick } from '~/view/hooks/useOutsideClick';

import styles from './styles.scss';

export type DropdownItem = {
  label: string;
  value: LookingJobStatus;
};

type Props = {
  selectedItem: DropdownItem | null;
  items: DropdownItem[];
  className?: string;
  onChange: (selectedItem: DropdownItem) => void;
};

export const CandidateStatusDropdown: React.FC<Props> = memo(function CandidateStatusDropdown({
  selectedItem,
  items,
  className,
  onChange,
}) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const wrapperRef = useOutsideClick<HTMLDivElement>({
    handler: useCallback(() => {
      if (dropdownVisible) {
        setDropdownVisible(false);
      }
    }, [dropdownVisible]),
  });

  const showDropdown = useCallback(() => {
    if (!dropdownVisible) {
      setDropdownVisible(prevValue => !prevValue);
    }
  }, [dropdownVisible]);

  const handleSelectedItemChange = useCallback(
    (item: DropdownItem) => {
      if (selectedItem?.value !== item.value) {
        onChange(item);
      }

      setDropdownVisible(false);
    },
    [onChange, selectedItem?.value],
  );

  const statusLabelClassName = classNames(
    styles['status-wrapper__label'],
    selectedItem?.label === 'Active'
      ? styles['status-wrapper__label--active']
      : styles['status-wrapper__label--disable'],
  );

  return (
    <div
      ref={wrapperRef}
      className={classNames(styles['status-wrapper'], className)}
      onClick={showDropdown}
    >
      <div className={styles['status-wrapper__label-wrapper']}>
        <p className={styles['status-wrapper__label']}>Status:</p>
        <p className={statusLabelClassName}>{selectedItem?.label}</p>
        <Icon name="chevron-down" className={styles['status-wrapper__chevron-icon']} />
      </div>
      {dropdownVisible && (
        <div className={styles['status-wrapper__dropdown']}>
          {items.map(item => (
            <button
              onClick={() => handleSelectedItemChange(item)}
              key={item.label}
              className={classNames(styles['status-wrapper__dropdown-item'], {
                [styles['status-wrapper__dropdown-item--current']]:
                  item.label === selectedItem?.label,
              })}
            >
              <Icon
                className={
                  item.label === 'Active'
                    ? styles['middle-dot--active']
                    : styles['middle-dot--disable']
                }
                name="ellipse"
                width="5px"
                height="5px"
              />
              <p className={styles['status-wrapper__dropdown-label']}>{item.label}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
});
