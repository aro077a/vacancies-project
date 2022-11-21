import classNames from 'classnames';
import React, { Fragment, memo, useCallback, useState } from 'react';

import { Icon } from '~/view/components/icon';
import { useOutsideClick } from '~/view/hooks/useOutsideClick';

import styles from './styles.scss';

export type DropdownItem = {
  label: string;
  value: number;
  hasErrorColor?: boolean;
};

type Props = {
  selectedItem: DropdownItem | null;
  items: DropdownItem[];
  className?: string;
  onChange: (selectedItem: DropdownItem) => void;
};

export const StatusDropdown: React.FC<Props> = memo(function StatusDropdown({
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

  return (
    <div
      ref={wrapperRef}
      className={classNames(styles['status-wrapper'], className)}
      onClick={showDropdown}
    >
      <div className={styles['status-wrapper__label-wrapper']}>
        <p className={styles['status-wrapper__label']}>Status:</p>
        <p
          className={classNames(
            styles['status-wrapper__label'],
            selectedItem?.hasErrorColor
              ? [styles['status-wrapper__label--error']]
              : [styles['status-wrapper__label--success']],
          )}
        >
          {selectedItem?.label}
        </p>
        <Icon name="chevron-down" className={styles['status-wrapper__chevron-icon']} />
      </div>
      {dropdownVisible && (
        <div className={styles['status-wrapper__dropdown']}>
          {items.map((item, index) => (
            <Fragment key={item.label}>
              <button
                className={classNames(
                  styles['status-wrapper__dropdown-item'],
                  item.hasErrorColor
                    ? [styles['status-wrapper__dropdown-item--error']]
                    : [styles['status-wrapper__dropdown-item--success']],
                )}
                onClick={() => handleSelectedItemChange(item)}
              >
                {item.label}
              </button>
              {index !== items.length - 1 && (
                <div className={styles['status-wrapper__separator']} />
              )}
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
});
