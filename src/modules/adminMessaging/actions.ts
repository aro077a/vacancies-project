import { createAction } from 'deox';

import { SendEmailFormValues } from '~/types/formValues';
import {
  GetAdminEmailsResponse,
  GetEmailInfoResponse,
  GetEmailSignatureResponse,
} from '~/types/responses';

export const getInboxMessages = {
  init: createAction(
    'adminMessaging/GET_INBOX_MESSAGES_INIT',
    resolve => (payload: { initialFetch: boolean }) => resolve(payload),
  ),
  request: createAction('adminMessaging/GET_INBOX_MESSAGES_REQUEST'),
  success: createAction(
    'adminMessaging/GET_INBOX_MESSAGES_SUCCESS',
    resolve => (payload: GetAdminEmailsResponse) => resolve(payload),
  ),
  fail: createAction('adminMessaging/GET_INBOX_MESSAGES_FAIL'),
};

export const getSentMessages = {
  init: createAction(
    'adminMessaging/GET_SENT_MESSAGES_INIT',
    resolve => (payload: { initialFetch: boolean }) => resolve(payload),
  ),
  request: createAction('adminMessaging/GET_SENT_MESSAGES_REQUEST'),
  success: createAction(
    'adminMessaging/GET_SENT_MESSAGES_SUCCESS',
    resolve => (payload: GetAdminEmailsResponse) => resolve(payload),
  ),
  fail: createAction('adminMessaging/GET_SENT_MESSAGES_FAIL'),
};

export const sendEmail = {
  request: createAction(
    'adminMessaging/SEND_EMAIL',
    resolve =>
      (payload: {
        formValues: SendEmailFormValues & { files?: File[] };
        cb: () => void;
        threadId?: string;
      }) =>
        resolve(payload),
  ),
  success: createAction('adminMessaging/SEND_EMAIL_SUCCESS'),
  fail: createAction('adminMessaging/SEND_EMAIL_FAILI'),
};

export const deleteEmail = {
  request: createAction('adminMessaging/DELETE_EMAIL'),
  success: createAction(
    'adminMessaging/DELETE_EMAIL_SUCCESS',
    resolve => (payload: string) => resolve(payload),
  ),
  fail: createAction('adminMessaging/DELETE_EMAIL_FAIL'),
};

export const getEmailInfo = {
  request: createAction(
    'adminMessaging/GET_EMAIL_INFO',
    resolve => (payload: { withReply: boolean; isForward: boolean }) => resolve(payload),
  ),
  success: createAction(
    'adminMessaging/GET_EMAIL_INFO_SUCCESS',
    resolve => (payload: GetEmailInfoResponse) => resolve(payload),
  ),
  fail: createAction('adminMessaging/GET_EMAIL_INFO_FAIL'),
};

export const getEmailSignature = {
  request: createAction('adminMessaging/GET_EMAIL_SIGNATURE'),
  success: createAction(
    'adminMessaging/GET_EMAIL_SIGNATURE_SUCCESS',
    resolve => (payload: GetEmailSignatureResponse) => resolve(payload),
  ),
  fail: createAction('adminMessaging/GET_EMAIL_SIGNATURE_FAIL'),
};

export const updateEmailSignature = {
  request: createAction(
    'adminMessaging/UPDATE_EMAIL_SIGNATURE',
    resolve => (payload: string) => resolve(payload),
  ),
  success: createAction(
    'adminMessaging/UPDATE_EMAIL_SIGNATURE_SUCCESS',
    resolve => (payload: GetEmailSignatureResponse) => resolve(payload),
  ),
  fail: createAction('adminMessaging/UPDATE_EMAIL_SIGNATURE_FAIL'),
};

export const toggleConfirmModalVisibility = createAction(
  'adminMessaging/TOGGLE_CONFIRM_MODAL_VISIBILITY',
);

export const toggleEmailInfoModalVisibility = createAction(
  'adminMessaging/TOGGLE_EMAIL_INFO_MODAL_VISIBILITY',
);

export const setSelectedMail = createAction(
  'adminMessaging/SET_SELECTED_MAIL',
  resolve => (payload: string | null) => resolve(payload),
);

export const downloadMailAttachment = createAction(
  'adminMessaging/DOWNLOAD_MAIL_ATTACHMENT',
  resolve => (payload: { messageId: string; attachmentId: string; fileName: string }) =>
    resolve(payload),
);

export const toggleForwardMailModalVisibility = createAction(
  'adminMessaging/TOGGLE_FORWARD_MAIL_VISIBILITY',
);

export const setReceiver = createAction(
  'adminMessaging/SET_RECEIVER',
  resolve => (payload: string | null) => resolve(payload),
);
