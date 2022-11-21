import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

import {
  deleteNotifications,
  getNotifications,
  toggleNotificationModalVisibility,
} from '~/modules/notifications/actions';
import { useDispatch, useSelector } from '~/store';
import { Icon } from '~/view/components/icon';
import { Loader } from '~/view/components/loader';
import { RightModal } from '~/view/components/modals';
import { Pagination } from '~/view/components/pagination';

import { NotificationCard } from './components/notification-card';
import styles from './styles.scss';

export const NotificationsModal: React.FC = memo(function NotificationsModal() {
  const dispatch = useDispatch();
  const visible = useSelector(state => state.notifications.notificationsModalVisibility);
  const { notifications, loadingNotifications } = useSelector(state => state.notifications);
  const [currentPage, setCurrentPage] = useState<number | string>(1);

  const currentPageSetHandler = useCallback((page: number | string) => {
    setCurrentPage(page);
  }, []);

  const onClose = useCallback(() => {
    dispatch(toggleNotificationModalVisibility());
  }, [dispatch]);

  const handleClear = (): void => {
    dispatch(deleteNotifications.request());
  };

  useEffect(() => {
    dispatch(getNotifications.request(currentPage));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(getNotifications.request(currentPage));
  }, [currentPage, dispatch]);

  const items = useMemo(() => {
    if (loadingNotifications) {
      return <Loader loading />;
    }

    return notifications.results.map(notification => {
      return <NotificationCard key={notification.id} {...notification} />;
    });
  }, [notifications, loadingNotifications]);

  return (
    <RightModal backTitle="< Back" className={styles['modal']} visible={visible} onClose={onClose}>
      <div className={styles['modal__header']}>
        <p className={styles['modal__title']}>Notifications</p>
        <button onClick={handleClear} className={styles['modal__clear-button']}>
          Clear
          <Icon name="delete" className={styles['modal__clear-icon']} />
        </button>
      </div>
      <div>
        {notifications.count === 0 ? (
          <p className={styles['modal__no-notifications-message']}>No new notifications</p>
        ) : (
          items
        )}
      </div>
      {notifications.count !== 0 && (
        <Pagination
          className={styles['modal__pagination']}
          setCurrentPage={currentPageSetHandler}
          itemsCount={notifications.count}
          currentPage={currentPage}
          itemsPerPage={5}
        />
      )}
    </RightModal>
  );
});
