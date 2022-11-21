import classNames from 'classnames';
import React, { memo, useMemo } from 'react';

import { useSelector } from '~/store';
import { Loader } from '~/view/components/loader';

import { BoardCard } from './components/card';
import styles from './styles.scss';

type Props = {
  activeTab: number;
  isLoading: boolean;
  toggleModalVisibility: () => void;
};

export const TabContent: React.FC<Props> = memo(function TabContent({
  activeTab,
  isLoading,
  toggleModalVisibility,
}) {
  const { boards, gettingContract } = useSelector(state => state.candidateProposals);
  const hideOnMobileClass = styles['hide-on-mobile'];

  const labels = useMemo(() => {
    switch (activeTab) {
      case 1:
        return (
          <div className={classNames(styles['labels'], styles['labels--offers-view'])}>
            <p className={styles['labels__item']}>Job title</p>
            <p className={classNames(styles['labels__item'], hideOnMobileClass)}>Job type</p>
            <p className={classNames(styles['labels__item'], hideOnMobileClass)}>Location</p>
            <p className={styles['labels__item']}>Salary or Rate</p>
          </div>
        );
      case 2:
        return (
          <div className={classNames(styles['labels'], styles['labels--vacancies-view'])}>
            <p className={styles['labels__item']}>Job title</p>
            <p className={classNames(styles['labels__item'], hideOnMobileClass)}>Job type</p>
            <p className={classNames(styles['labels__item'], hideOnMobileClass)}>Location</p>
            <p className={classNames(styles['labels__item'], hideOnMobileClass)}>Salary or Rate</p>
            <p className={classNames(styles['labels__item'], styles['labels__item--status'])}>
              Status
            </p>
          </div>
        );
      case 3:
        return (
          <div className={classNames(styles['labels'], styles['labels--interviews-view'])}>
            <p className={styles['labels__item']}>Job title</p>
            <p className={classNames(styles['labels__item'], hideOnMobileClass)}>Job type</p>
            <p className={classNames(styles['labels__item'], hideOnMobileClass)}>Location</p>
            <p className={classNames(styles['labels__item'], hideOnMobileClass)}>Salary or Rate</p>
            <p className={classNames(styles['labels__item'], hideOnMobileClass)}>
              Interview location or link
            </p>
            <p className={styles['labels__item']}>Interview Date</p>
          </div>
        );
      case 4:
        return (
          <div className={classNames(styles['labels'], styles['labels--placements-view'])}>
            <p className={styles['labels__item']}>Job title</p>
            <p className={classNames(styles['labels__item'], hideOnMobileClass)}>Job type</p>
            <p className={classNames(styles['labels__item'], hideOnMobileClass)}>Location</p>
            <p className={classNames(styles['labels__item'], hideOnMobileClass)}>Salary or Rate</p>
            <p
              className={classNames(
                styles['labels__item--placement'],
                styles['labels__item-approved'],
              )}
            >
              Approved Date
            </p>
          </div>
        );
      default:
        return null;
    }
  }, [activeTab, hideOnMobileClass]);

  return (
    <>
      {gettingContract ? (
        <Loader loading />
      ) : (
        <div className={styles['tab-content']}>
          {labels}
          <div className={styles['tab-content__job-list']}>
            {isLoading && <Loader loading />}
            {Object.entries(boards).map(([boardId, board]) => {
              if (Number(boardId) === activeTab) {
                if (board.items.length) {
                  return board.items.map((item, index) => {
                    return (
                      <BoardCard
                        onCardClick={toggleModalVisibility}
                        index={index}
                        key={item.id}
                        activeTab={activeTab}
                        card={item}
                      />
                    );
                  });
                }
                return (
                  <p key={boardId} className={styles['tab-content__no-matched-message']}>
                    No matched jobs
                  </p>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
    </>
  );
});
