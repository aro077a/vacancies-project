import { GetAdminEmailsResponse, GetEmailInfoResponse } from '~/types/responses';

export type AdminMessagingState = {
  confirmModalVisibility: boolean;
  inboxMessages: GetAdminEmailsResponse['data'];
  loadingInboxMessages: boolean;
  sentMessages: GetAdminEmailsResponse['data'];
  loadingSentMessages: boolean;
  sendingMessage: boolean;
  deletingEmail: boolean;
  selectedMailId: string | null;
  emailInfoModalVisibility: boolean;
  selectedEmailInfo: null | GetEmailInfoResponse['data'];
  loadingEmailInfo: boolean;
  loadingEmailSignature: boolean;
  emailSignature: null | string;
  updatingEmailSignature: boolean;
  showReplyInput: boolean;
  forwardEmailModalVisibility: boolean;
  receiver: null | string;
};
