import { createReducer } from 'deox';
import produce from 'immer';

import {
  deleteNotifications,
  getNotifications,
  getNotificationsCount,
  toggleNotificationModalVisibility,
  updateNotificationStatus,
} from './actions';
import { NotificationState } from './types';

const initialState: NotificationState = {
  notifications: {
    count: 0,
    previous: null,
    next: null,
    results: [],
  },
  loadingNotifications: false,
  updatingNotificationStatus: false,
  isUpToDate: true,
  notificationsCount: 0,
  notificationsModalVisibility: false,
  deletingNotifications: false,
};

export const notificationReducer = createReducer(initialState, handle => [
  handle(getNotifications.request, state =>
    produce(state, draft => {
      draft.loadingNotifications = true;
    }),
  ),
  handle(getNotifications.success, (state, { payload }) =>
    produce(state, draft => {
      draft.notifications = {
        ...payload.data,
      };
      if (draft.notifications.count === draft.notificationsCount) {
        draft.isUpToDate = true;
      }
      draft.loadingNotifications = false;
    }),
  ),
  handle(getNotifications.fail, state =>
    produce(state, draft => {
      draft.loadingNotifications = false;
    }),
  ),
  handle(updateNotificationStatus.request, state =>
    produce(state, draft => {
      draft.updatingNotificationStatus = true;
    }),
  ),
  handle(updateNotificationStatus.success, state =>
    produce(state, draft => {
      draft.updatingNotificationStatus = false;
    }),
  ),
  handle(updateNotificationStatus.fail, state =>
    produce(state, draft => {
      draft.updatingNotificationStatus = false;
    }),
  ),
  handle(getNotificationsCount.success, (state, { payload }) =>
    produce(state, draft => {
      if (draft.notifications.count !== payload.data.count) {
        draft.notificationsCount = payload.data.count;
        draft.isUpToDate = false;
      }
    }),
  ),
  handle(toggleNotificationModalVisibility, state =>
    produce(state, draft => {
      draft.notificationsModalVisibility = !draft.notificationsModalVisibility;
    }),
  ),
  handle(deleteNotifications.request, state =>
    produce(state, draft => {
      draft.deletingNotifications = true;
    }),
  ),
  handle(deleteNotifications.success, state =>
    produce(state, draft => {
      Object.assign(draft.notifications, initialState.notifications);
      draft.notificationsCount = 0;
      draft.deletingNotifications = false;
    }),
  ),
  handle(deleteNotifications.fail, state =>
    produce(state, draft => {
      draft.deletingNotifications = false;
    }),
  ),
]);
