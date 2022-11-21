import classNames from 'classnames';
import React, { memo } from 'react';

import { Icon } from '~/view/components/icon';

import styles from './styles.scss';

export type Tab = {
  id: number;
  title: string;
  icon: string;
  count: number;
  label: string;
};

type Props = {
  tab: Tab;
  isActive: boolean;
  onTabClick: (id: number) => void;
  isLoading: boolean;
};

export const ProposalTab: React.FC<Props> = memo(function ProposalTab({
  tab,
  isActive,
  onTabClick,
  isLoading,
}) {
  const { title, icon, count, label, id } = tab;
  const iconWrapperClassName = classNames(
    styles['tab__icon-wrapper'],
    styles[`tab__icon-wrapper--${label}`],
  );

  const tabClassName = classNames(styles['tab'], {
    [styles['tab--active']]: isActive,
  });

  return (
    <div onClick={() => onTabClick(id)} className={tabClassName}>
      <div className={iconWrapperClassName}>
        <Icon className={styles['tab__icon']} name={icon} />
      </div>
      <p className={styles['tab__title']}>{title}</p>
      <span className={styles['tab__count']}>{isLoading ? '...' : count}</span>
    </div>
  );
});
