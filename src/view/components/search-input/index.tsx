import classNames from 'classnames';
import React, { memo } from 'react';

import { Icon } from '~/view/components/icon';

import styles from './styles.scss';

type Props = {
  placeholder: string;
  className?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  hideIcon?: boolean;
};

export const SearchInput: React.FC<Props> = memo(function SearchInput({
  placeholder,
  className,
  value,
  onChange,
  hideIcon,
}) {
  return (
    <div className={classNames(styles['field'], className)}>
      <input
        type="text"
        className={styles['field__input']}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {!hideIcon && <Icon name="search" className={styles['field__search-icon']} />}
    </div>
  );
});
