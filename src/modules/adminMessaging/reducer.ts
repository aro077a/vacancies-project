import { createReducer } from 'deox';
import produce from 'immer';

import {
  deleteEmail,
  getEmailInfo,
  getEmailSignature,
  getInboxMessages,
  getSentMessages,
  sendEmail,
  setReceiver,
  setSelectedMail,
  toggleConfirmModalVisibility,
  toggleEmailInfoModalVisibility,
  toggleForwardMailModalVisibility,
  updateEmailSignature,
} from './actions';
import { AdminMessagingState } from './types';

const initialState: AdminMessagingState = {
  confirmModalVisibility: false,
  inboxMessages: {
    threads: [],
    nextPageToken: 0,
  },
  sentMessages: {
    threads: [],
    nextPageToken: 0,
  },
  loadingInboxMessages: false,
  loadingSentMessages: false,
  sendingMessage: false,
  deletingEmail: false,
  selectedMailId: null,
  emailInfoModalVisibility: false,
  forwardEmailModalVisibility: false,
  selectedEmailInfo: null,
  loadingEmailInfo: false,
  loadingEmailSignature: false,
  emailSignature: null,
  updatingEmailSignature: false,
  showReplyInput: false,
  receiver: null,
};

export const adminMessagingReducer = createReducer(initialState, handle => [
  handle(toggleConfirmModalVisibility, state =>
    produce(state, draft => {
      draft.confirmModalVisibility = !draft.confirmModalVisibility;
    }),
  ),
  handle(toggleEmailInfoModalVisibility, state =>
    produce(state, draft => {
      draft.emailInfoModalVisibility = !draft.emailInfoModalVisibility;
    }),
  ),
  handle(toggleForwardMailModalVisibility, state =>
    produce(state, draft => {
      draft.forwardEmailModalVisibility = !draft.forwardEmailModalVisibility;
    }),
  ),
  handle(getInboxMessages.init, (state, { payload }) =>
    produce(state, draft => {
      if (payload.initialFetch) {
        Object.assign(draft.inboxMessages, initialState.inboxMessages);
      }
    }),
  ),
  handle(getInboxMessages.request, state =>
    produce(state, draft => {
      draft.loadingInboxMessages = true;
    }),
  ),
  handle(getInboxMessages.success, (state, { payload }) =>
    produce(state, draft => {
      draft.inboxMessages = {
        nextPageToken: payload.data.nextPageToken,
        threads: draft.inboxMessages.threads.concat(payload.data.threads),
      };
      draft.loadingInboxMessages = false;
    }),
  ),
  handle(getInboxMessages.fail, state =>
    produce(state, draft => {
      draft.loadingInboxMessages = false;
    }),
  ),
  handle(getSentMessages.init, (state, { payload }) =>
    produce(state, draft => {
      if (payload.initialFetch) {
        Object.assign(draft.sentMessages, initialState.sentMessages);
      }
    }),
  ),
  handle(getSentMessages.request, state =>
    produce(state, draft => {
      draft.loadingSentMessages = true;
    }),
  ),
  handle(getSentMessages.success, (state, { payload }) =>
    produce(state, draft => {
      draft.sentMessages = {
        nextPageToken: payload.data.nextPageToken,
        threads: draft.sentMessages.threads.concat(payload.data.threads),
      };
      draft.loadingSentMessages = false;
    }),
  ),
  handle(getSentMessages.fail, state =>
    produce(state, draft => {
      draft.loadingSentMessages = false;
    }),
  ),
  handle(sendEmail.request, state =>
    produce(state, draft => {
      draft.sendingMessage = true;
    }),
  ),
  handle(sendEmail.success, state =>
    produce(state, draft => {
      draft.sendingMessage = false;
    }),
  ),
  handle(sendEmail.fail, state =>
    produce(state, draft => {
      draft.sendingMessage = false;
    }),
  ),
  handle(deleteEmail.request, state =>
    produce(state, draft => {
      draft.sendingMessage = true;
    }),
  ),
  handle(deleteEmail.success, (state, { payload }) =>
    produce(state, draft => {
      const thread = draft.inboxMessages.threads.find(thread => {
        return thread.id === payload;
      });
      if (thread) {
        draft.inboxMessages = {
          ...draft.inboxMessages,
          threads: draft.inboxMessages.threads.filter(thread => thread.id !== payload),
        };
      } else {
        draft.sentMessages = {
          ...draft.sentMessages,
          threads: draft.sentMessages.threads.filter(thread => thread.id !== payload),
        };
      }
      draft.sendingMessage = false;
    }),
  ),
  handle(deleteEmail.fail, state =>
    produce(state, draft => {
      draft.sendingMessage = false;
    }),
  ),
  handle(setSelectedMail, (state, { payload }) =>
    produce(state, draft => {
      draft.selectedMailId = payload;
      if (payload === null) {
        draft.selectedEmailInfo = null;
      }
    }),
  ),
  handle(getEmailInfo.request, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingEmailInfo = true;
      draft.showReplyInput = payload.withReply;
    }),
  ),
  handle(getEmailInfo.success, (state, { payload }) =>
    produce(state, draft => {
      draft.selectedEmailInfo = payload.data;
      draft.loadingEmailInfo = false;
    }),
  ),
  handle(getEmailInfo.fail, state =>
    produce(state, draft => {
      draft.loadingEmailInfo = false;
    }),
  ),
  handle(getEmailSignature.request, state =>
    produce(state, draft => {
      draft.loadingEmailSignature = true;
    }),
  ),
  handle(getEmailSignature.success, (state, { payload }) =>
    produce(state, draft => {
      draft.emailSignature = payload.data.signature;
      draft.loadingEmailSignature = false;
    }),
  ),
  handle(getEmailSignature.fail, state =>
    produce(state, draft => {
      draft.loadingEmailSignature = false;
    }),
  ),
  handle(updateEmailSignature.request, state =>
    produce(state, draft => {
      draft.updatingEmailSignature = true;
    }),
  ),
  handle(updateEmailSignature.success, (state, { payload }) =>
    produce(state, draft => {
      draft.emailSignature = payload.data.signature;
      draft.updatingEmailSignature = false;
    }),
  ),
  handle(updateEmailSignature.fail, state =>
    produce(state, draft => {
      draft.updatingEmailSignature = false;
    }),
  ),
  handle(setReceiver, (state, { payload }) =>
    produce(state, draft => {
      draft.receiver = payload;
    }),
  ),
]);
