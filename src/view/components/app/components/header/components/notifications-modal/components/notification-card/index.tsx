import React, { memo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { AdminNotification } from '~/models/admin';
import { Notification } from '~/models/common';
import { reviewNotification, updateNotificationStatus } from '~/modules/notifications/actions';
import { useDispatch } from '~/store';
import { Button } from '~/view/components/button';
import { Image } from '~/view/components/image';

import styles from './styles.scss';

export const NotificationCard: React.FC<Notification> = memo(function NotificationCard({
  title,
  body,
  addedAt,
  name,
  image,
  id,
  type,
  foreignObject,
}) {
  const dispatch = useDispatch();
  const history = useHistory();

  const isTaskNotification =
    type === AdminNotification.NewTaskAdded || type === AdminNotification.TaskCompleted;

  const reviewHandler = useCallback(() => {
    dispatch(
      reviewNotification.request({
        typeId: type,
        id: foreignObject,
        historyPush: url => {
          history.push(url);
        },
      }),
    );

    dispatch(updateNotificationStatus.request(id));
  }, [dispatch, id, history, foreignObject, type]);

  return (
    <div className={styles['notification']}>
      <div className={styles['notification-header']}>
        <p className={styles['notification-name']}>{title}</p>
        <p className={styles['notification-date']}>{addedAt}</p>
      </div>
      <p className={styles['notification-description']}>{body}</p>
      <div className={styles['notification-footer']}>
        {!isTaskNotification && (
          <div className={styles['notification-company-wrapper']}>
            <Image
              alt="photo"
              src={image}
              className={styles['notification-company-image']}
              type="company"
            />
            <p className={styles['notification-company-name']}>{name}</p>
          </div>
        )}

        <Button
          variant="secondary"
          size="small"
          title="Review"
          className={styles['notification-review-button']}
          onClick={reviewHandler}
        />
      </div>
    </div>
  );
});
