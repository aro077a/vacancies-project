import classNames from 'classnames';
import React, { BaseSyntheticEvent, memo, useCallback, useState } from 'react';

import { Icon } from '~/view/components/icon';
import { useOutsideClick } from '~/view/hooks/useOutsideClick';

import styles from './styles.scss';

export type DropdownItem = {
  label: string;
  icon?: string;
  iconType?: string;
  onClick?: () => void;
};

type Props = {
  items: DropdownItem[];
  className?: string;
  wrapperClassName?: string;
  dropdownMenuModalVisible?: boolean;
  onClick?: () => void;
};

export const DotsDropdown: React.FC<Props> = memo(function DotsDropdown({
  items,
  className,
  wrapperClassName,
  onClick,
}) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const wrapperRef = useOutsideClick<HTMLDivElement>({
    handler: useCallback(() => {
      if (dropdownVisible) {
        setDropdownVisible(false);
      }
    }, [dropdownVisible]),
  });

  const showDropdown = useCallback(
    (e: BaseSyntheticEvent) => {
      e.stopPropagation();
      if (onClick) {
        onClick();
      }
      if (!dropdownVisible) {
        setDropdownVisible(prevValue => !prevValue);
      }
    },
    [dropdownVisible, onClick],
  );

  return (
    <div
      ref={wrapperRef}
      className={classNames(styles['dots-wrapper'], className)}
      onClick={showDropdown}
    >
      <button className={styles['dots-wrapper__dots-button']}>
        <Icon name="vertical-dots" className={styles['dots-wrapper__dots-icon']} />
      </button>
      {dropdownVisible && (
        <div className={classNames(styles['dots-wrapper__dropdown-wrapper'], wrapperClassName)}>
          {items.map((item, index) => (
            <div key={item.label} onClick={onClick}>
              <button
                className={styles['dots-wrapper__dropdown-item']}
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                    setDropdownVisible(false);
                  }
                }}
              >
                {item.icon && (
                  <Icon
                    name={item.icon}
                    className={classNames(
                      styles['dots-wrapper__dropdown-item-icon'],
                      styles[`dots-wrapper__dropdown-item-icon--${item.iconType}`],
                    )}
                  />
                )}
                {item.label}
              </button>
              {index !== items.length - 1 && <div className={styles['dots-wrapper__separator']} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
