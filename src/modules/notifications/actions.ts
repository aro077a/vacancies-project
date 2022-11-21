import { createAction } from 'deox';

import { GetNotificationsCountResponse, GetNotificationsResponse } from '~/types/responses';

export const getNotifications = {
  request: createAction(
    'notifications/GET_NOTIFICATIONS_REQUEST',
    resolve => (payload: number | string) => resolve(payload),
  ),
  success: createAction(
    'notifications/GET_NOTIFICATIONS_SUCCESS',
    resolve => (payload: GetNotificationsResponse) => resolve(payload),
  ),
  fail: createAction('notifications/GET_NOTIFICATIONS_FAIL'),
};

export const updateNotificationStatus = {
  request: createAction(
    'notifications/UPDATE_NOTIFICATION_STATUS_REQUEST',
    resolve => (payload: number) => resolve(payload),
  ),
  success: createAction('notifications/UPDATE_NOTIFICATION_STATUS_SUCCESS'),
  fail: createAction('notifications/UPDATE_NOTIFICATION_STATUS_FAIL'),
};

export const getNotificationsCount = {
  request: createAction('notifications/GET_NOTIFICATIONS_COUNT'),
  success: createAction(
    'notifications/GET_NOTIFICATIONS_COUNT_SUCCESS',
    resolve => (payload: GetNotificationsCountResponse) => resolve(payload),
  ),
  fail: createAction('notifications/GET_NOTIFICATIONS_COUNT_FAIL'),
};

export const reviewNotification = {
  request: createAction(
    'notifications/REVIEW_NOTIFICATION',
    resolve => (payload: { id: number; historyPush: (url: string) => void; typeId: number }) =>
      resolve(payload),
  ),
  success: createAction('notifications/REVIEW_NOTIFICATION_SUCCESS'),
  fail: createAction('notifications/REVIEW_NOTIFICATION_FAIL'),
};

export const toggleNotificationModalVisibility = createAction(
  'notifications/TOGGLE_NOTIFICATIONS_MODAL_VISIBILITY',
);

export const deleteNotifications = {
  request: createAction('notifications/DELETE_NOTIFICATIONS'),
  success: createAction('notifications/DELETE_NOTIFICATIONS_SUCCESS'),
  fail: createAction('notifications/DELETE_NOTIFICATIONS_FAIL'),
};
