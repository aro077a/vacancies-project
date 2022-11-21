import classNames from 'classnames';
import React, { memo, useLayoutEffect, useRef } from 'react';

import styles from './styles.scss';

export type Tab = {
  id: number;
  label: string;
  badge?: number;
};

type Props = {
  tabs: Tab[];
  activeTabId: number;
  className?: string;
  onChange: (tabId: number) => void;
  variant?: 'primary' | 'secondary';
};

export const Tabs: React.FC<Props> = memo(function Tabs({
  tabs,
  activeTabId,
  className,
  onChange,
  variant = 'primary',
}) {
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (tabsRef.current && activeLineRef.current) {
      const tabElements = Array.from(tabsRef.current.children);

      const activeTabElement = tabElements.find(
        tabElement => Number(tabElement.id) === activeTabId,
      );

      if (activeTabElement) {
        const { offsetLeft, offsetWidth } = activeTabElement as HTMLButtonElement;

        activeLineRef.current.style.width = `${offsetWidth}px`;
        activeLineRef.current.style.left = `${offsetLeft}px`;
      }
    }
  }, [activeTabId]);

  const isSecondary = variant === 'secondary';

  return (
    <div className={classNames(styles['tabs-wrapper'], className)}>
      <div ref={tabsRef} className={styles['tabs-wrapper__tabs']}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            id={String(tab.id)}
            className={classNames(styles['tabs-wrapper__tab'], {
              [styles['tabs-wrapper__tab--active']]: tab.id === activeTabId,
              [styles['tabs-wrapper__tab--secondary']]: isSecondary,
              [styles['tabs-wrapper__tab--secondary-active']]:
                isSecondary && tab.id === activeTabId,
            })}
            disabled={tab.id === activeTabId}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
            {(tab.badge || tab.badge === 0) && (
              <span
                className={classNames(styles['tabs-wrapper__tab-badge'], {
                  [styles['tabs-wrapper__tab-badge--secondary']]: isSecondary,
                })}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      <div
        className={classNames(styles['tabs-wrapper__line'], {
          [styles['tabs-wrapper__line--secondary']]: isSecondary,
        })}
      >
        <div ref={activeLineRef} className={styles['tabs-wrapper__active-line']} />
      </div>
    </div>
  );
});
