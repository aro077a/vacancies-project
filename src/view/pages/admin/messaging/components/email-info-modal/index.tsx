import React, { BaseSyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { EmailPart } from '~/models/admin';
import {
  sendEmail,
  setSelectedMail,
  toggleEmailInfoModalVisibility,
} from '~/modules/adminMessaging/actions';
import { useDispatch, useSelector } from '~/store';
import { SendEmailFormValues } from '~/types/formValues';
import { Icon } from '~/view/components/icon';
import { CenterModal } from '~/view/components/modals';

import { Card, CardProps } from './components/card';
import styles from './styles.scss';

export const EmailInfoModal: React.FC = () => {
  const dispatch = useDispatch();
  const visible = useSelector(state => state.adminMessaging.emailInfoModalVisibility);
  const { showReplyInput } = useSelector(state => state.adminMessaging);
  const { selectedEmailInfo } = useSelector(state => state.adminMessaging);
  const rawData = useSelector(state => state.adminMessaging.selectedEmailInfo?.messages);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!visible) {
      dispatch(setSelectedMail(null));
    }
  }, [visible, dispatch]);

  const onClose = useCallback(() => {
    dispatch(toggleEmailInfoModalVisibility());
  }, [dispatch]);

  const hanldeInputChange = (e: BaseSyntheticEvent): void => {
    setInputValue(e.target.value);
  };

  const messages = useMemo((): CardProps[] | undefined => {
    const newArr = rawData?.map(message => {
      const time = new Date(Number(message.internalDate)).toLocaleDateString();

      const convertedArray = message.payload.parts
        ?.filter((part: EmailPart) => {
          if (
            part.mimeType !== 'multipart/alternative' &&
            part.mimeType !== 'text/html' &&
            part.mimeType !== 'text/plain'
          ) {
            return 1;
          }
          return 0;
        })
        .map((part: EmailPart) => {
          return {
            filename: part.filename,
            mimeType: part.mimeType.split('/')[1],
            body: part.body,
          };
        }) as EmailPart[];

      return {
        id: message.id,
        time,
        to: message.payload.headers.find(header => header.name === 'To' || header.name === 'to')
          ?.value as string,
        text: message.payload.body.data || message.snippet,
        from: message.payload.headers.find(
          header => header.name === 'From' || header.name === 'from',
        )?.value as string,
        subject: message.payload.headers.find(
          header => header.name === 'Subject' || header.name === 'subject',
        )?.value as string,
        parts: convertedArray,
      };
    });
    return newArr;
  }, [rawData]) as CardProps[];

  if (!messages) {
    return null;
  }

  const formValues: SendEmailFormValues = {
    messageText: inputValue,
    threadId: selectedEmailInfo?.id,
    to: messages[messages.length - 1].from,
    subject: messages[messages.length - 1].subject,
  };

  const onSubmit = (): void => {
    dispatch(
      sendEmail.request({
        formValues,
        threadId: selectedEmailInfo?.id,
        cb: () => {
          dispatch(toggleEmailInfoModalVisibility());
        },
      }),
    );
  };

  return (
    <CenterModal className={styles['modal']} onClose={onClose} visible={visible} title="Email info">
      <div className={styles['modal__list']}>
        {messages.map(message => (
          <Card {...message} key={message.text} />
        ))}
      </div>
      {showReplyInput && (
        <div className={styles['modal__reply-wrapper']}>
          <input
            onChange={hanldeInputChange}
            placeholder="Your reply..."
            className={styles['modal__reply-input']}
          />
          <button onClick={onSubmit} className={styles['modal__send-reply']}>
            <Icon className={styles['modal__send-icon']} name="send" />
          </button>
        </div>
      )}
    </CenterModal>
  );
};
