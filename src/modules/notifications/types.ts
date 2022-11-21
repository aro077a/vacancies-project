import { GetNotificationsResponse } from '~/types/responses';

export type NotificationState = {
  loadingNotifications: boolean;
  notifications: GetNotificationsResponse['data'];
  updatingNotificationStatus: boolean;
  isUpToDate: boolean;
  notificationsCount: number;
  notificationsModalVisibility: boolean;
  deletingNotifications: boolean;
};
