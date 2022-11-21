import classNames from 'classnames';
import React from 'react';

import styles from './styles.scss';

interface StatusButtonProps {
  status?: 'Active' | 'disable';
}

export const StatusButton: React.FC<StatusButtonProps> = ({ status }: StatusButtonProps) => {
  const btnClassName = classNames(
    styles['status-btn'],
    status === 'Active' ? styles['status-btn--active'] : styles['status-btn--disable'],
  );

  return (
    <div>
      {status === 'Active' ? (
        <div className={btnClassName}>Active</div>
      ) : (
        <div className={btnClassName}>Disable</div>
      )}
    </div>
  );
};
