import { ActionType, getType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { call, put, select, takeLatest } from 'typed-redux-saga';

import { Admin } from '~/services/api/Admin';
import { RootState } from '~/store/types';
import { GetAdminMessagesRequestParams } from '~/types/requests';

import {
  deleteEmail,
  downloadMailAttachment,
  getEmailInfo,
  getEmailSignature,
  getInboxMessages,
  getSentMessages,
  sendEmail,
  toggleConfirmModalVisibility,
  toggleEmailInfoModalVisibility,
  toggleForwardMailModalVisibility,
  updateEmailSignature,
} from './actions';

function* getInboxMessagesSaga({
  payload,
}: ActionType<typeof getInboxMessages.init>): SagaIterator {
  try {
    const { nextPageToken } = yield* select(
      (state: RootState) => state.adminMessaging.inboxMessages,
    );

    if (payload.initialFetch || nextPageToken) {
      yield* put(getInboxMessages.request());

      const requestParams: GetAdminMessagesRequestParams = {
        maxResults: 4,
        pageToken: nextPageToken,
      };

      if (!nextPageToken) {
        delete requestParams.pageToken;
      }

      const { data } = yield* call(Admin.getInboxMessages, requestParams);

      yield* put(getInboxMessages.success(data));
    }
  } catch (error) {
    yield* put(getInboxMessages.fail());
  }
}

function* getSentMessagesSaga({ payload }: ActionType<typeof getSentMessages.init>): SagaIterator {
  try {
    const { nextPageToken } = yield* select(
      (state: RootState) => state.adminMessaging.sentMessages,
    );

    if (payload.initialFetch || nextPageToken) {
      yield* put(getSentMessages.request());

      const requestParams: GetAdminMessagesRequestParams = {
        maxResults: 4,
        pageToken: nextPageToken,
      };

      if (!nextPageToken) {
        delete requestParams.pageToken;
      }

      const { data } = yield* call(Admin.getSentMessages, requestParams);

      yield* put(getSentMessages.success(data));
    }
  } catch (error) {
    yield* put(getSentMessages.fail());
  }
}

function* sendMessageSaga({ payload }: ActionType<typeof sendEmail.request>): SagaIterator {
  try {
    const { formValues, cb, threadId } = payload;

    const convertedArray = formValues.to.split(',').map(item => {
      return item.trim();
    });

    const formData = new FormData();

    formData.append('subject', formValues.subject);

    convertedArray.forEach(receiver => {
      formData.append('to', receiver);
    });

    if (formValues.files?.length) {
      formValues.files.forEach(file => {
        formData.append('files', file);
      });
    }

    formData.append('message_text', formValues.messageText);

    if (threadId) {
      formData.append('thread_id', threadId);
    }

    yield* call(Admin.sendMail, formData);

    if (cb) {
      cb();
    }

    yield* put(sendEmail.success());
  } catch (error) {
    yield* put(sendEmail.fail());
  }
}

function* deleteMessageSaga(): SagaIterator {
  try {
    const mailId = yield* select((state: RootState) => state.adminMessaging.selectedMailId);

    yield* call(Admin.deleteMail, mailId!);

    yield* put(toggleConfirmModalVisibility());

    yield* put(deleteEmail.success(mailId!));
  } catch (error) {
    yield* put(deleteEmail.fail());
  }
}

function* getEmailInfoSaga({ payload }: ActionType<typeof getEmailInfo.request>): SagaIterator {
  try {
    const mailId = yield* select((state: RootState) => state.adminMessaging.selectedMailId);

    const { data } = yield* call(Admin.getEmailInfo, mailId!);

    yield* put(getEmailInfo.success(data));

    if (payload.isForward) {
      yield* put(toggleForwardMailModalVisibility());
    } else {
      yield* put(toggleEmailInfoModalVisibility());
    }
  } catch (error) {
    yield* put(getEmailInfo.fail());
  }
}

function* getEmailSignatureSaga(): SagaIterator {
  try {
    const { data } = yield* call(Admin.getEmailSignature);

    yield* put(getEmailSignature.success(data));
  } catch (error) {
    yield* put(getEmailSignature.fail());
  }
}

function* updateEmailSignatureSaga({
  payload,
}: ActionType<typeof updateEmailSignature.request>): SagaIterator {
  try {
    const { data } = yield* call(Admin.updateEmailSignature, { signature: payload });

    yield* put(updateEmailSignature.success(data));
  } catch (error) {
    yield* put(updateEmailSignature.fail());
  }
}

function* downloadMailAttachmentSaga({
  payload,
}: ActionType<typeof downloadMailAttachment>): SagaIterator {
  const { messageId, attachmentId, fileName } = payload;

  const requestParams = {
    messageId,
    attachmentId,
  };

  const { data } = yield* call(Admin.downloadAttachment, requestParams);

  const link = document.createElement('a');

  link.href = `data:application/octet-stream;base64,${data.data.data}`;

  link.download = fileName;

  link.click();
}

export function* watchAdminMessaging(): SagaIterator {
  yield* takeLatest(getType(getInboxMessages.init), getInboxMessagesSaga);
  yield* takeLatest(getType(getSentMessages.init), getSentMessagesSaga);
  yield* takeLatest(getType(getEmailInfo.request), getEmailInfoSaga);

  yield* takeLatest(getType(getEmailSignature.request), getEmailSignatureSaga);
  yield* takeLatest(getType(updateEmailSignature.request), updateEmailSignatureSaga);

  yield* takeLatest(getType(sendEmail.request), sendMessageSaga);
  yield* takeLatest(getType(deleteEmail.request), deleteMessageSaga);

  yield* takeLatest(getType(downloadMailAttachment), downloadMailAttachmentSaga);
}
