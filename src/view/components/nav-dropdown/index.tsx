import classNames from 'classnames';
import React, { memo, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import { Icon } from '~/view/components/icon';

import styles from './styles.scss';

export type NavDropdownProps = {
  icon?: string;
  text: string;
  count?: number;
  path: string;
};

type Props = {
  items: NavDropdownProps[];
  className: string;
  cb?: () => void;
};

export const NavDropdown: React.FC<Props> = memo(function Dropdown({ items, className, cb }) {
  const dropDownClassName = classNames(styles['dropdown'], className);

  useEffect(() => {
    if (cb) {
      cb();
    }
  }, []);

  return (
    <ul className={dropDownClassName}>
      <span className={styles['dropdown__cone']} />
      {items.map(({ icon, count, text, path }) => (
        <NavLink key={path} to={path} className={styles['dropdown__item']}>
          {icon && <Icon className={styles['dropdown__item-icon']} name={icon} />}
          <p>{text}</p>
          {(count || count === 0) && (
            <span className={styles['dropdown__item-count']}>({count})</span>
          )}
        </NavLink>
      ))}
    </ul>
  );
});
