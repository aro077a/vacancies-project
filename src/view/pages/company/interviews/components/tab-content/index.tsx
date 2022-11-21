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
  const { boards } = useSelector(state => state.companyInterviews);
  const isLoadingContract = useSelector(state => state.companyInterviews.gettingContract);

  const hideOnMobileClass = styles['labels__hide-on-mobile'];
  const showOnMobileClass = styles['labels__show-on-mobile'];

  const labels = useMemo(() => {
    switch (activeTab) {
      case 1:
        return (
          <div className={styles['labels']}>
            <p className={classNames(styles['labels__item'], hideOnMobileClass)}>Candidate ID</p>
            <p className={classNames(styles['labels__item'], showOnMobileClass)}>ID</p>
            <p className={classNames(styles['labels__item'], hideOnMobileClass)}>Location</p>
            <p className={classNames(styles['labels__item'], hideOnMobileClass)}>Position</p>
            <p className={styles['labels__item']}>Salary or Rate</p>
          </div>
        );
      case 2:
        return (
          <div className={styles['labels']}>
            <p className={classNames(styles['labels__item'], hideOnMobileClass)}>Candidate ID</p>
            <p className={classNames(styles['labels__item'], showOnMobileClass)}>ID</p>
            <p className={classNames(styles['labels__item'], hideOnMobileClass)}>Location</p>
            <p className={classNames(styles['labels__item'], hideOnMobileClass)}>Position</p>
            <p className={classNames(styles['labels__item'], hideOnMobileClass)}>Salary or Rate</p>
            <p className={styles['labels__item']}>Interview date</p>
            <p className={styles['labels__item']}>Interview location or link</p>
          </div>
        );
      case 4:
        return (
          <div className={styles['labels']}>
            <p className={styles['labels__item']}>Candidate</p>
            <p className={classNames(styles['labels__item'], hideOnMobileClass)}>Location</p>
            <p className={classNames(styles['labels__item'], hideOnMobileClass)}>Position</p>
            <p className={classNames(styles['labels__item'], hideOnMobileClass)}>Salary or Rate</p>
            <p className={styles['labels__item-approved']}>Approved Date</p>
          </div>
        );
      default:
        return null;
    }
  }, [activeTab, hideOnMobileClass, showOnMobileClass]);

  return (
    <>
      {isLoadingContract ? (
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
                        key={item.id}
                        activeTab={activeTab}
                        card={{ ...item, index }}
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
