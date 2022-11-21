import React, { BaseSyntheticEvent, useCallback, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { sendEmail, toggleForwardMailModalVisibility } from '~/modules/adminMessaging/actions';
import { useDispatch, useSelector } from '~/store';
import { SendEmailFormValues } from '~/types/formValues';
import { Button } from '~/view/components/button';
import { Input } from '~/view/components/input';
import { CenterModal } from '~/view/components/modals';

import styles from './styles.scss';

const inlineStyles = {
  label: {
    color: '#706f91',
    fontWeight: 500,
  },
  caption: {
    fontSize: '14px',
    lineHeight: '20px',
    color: '#110f48',
  },
  forwardedMessage: {
    marginTop: '15px',
    paddingLeft: '15px',
    borderLeft: '2px solid #e3e8f1',
  },
  message: {
    marginBottom: '10px',
    borderBottom: '1px solid #e3e8f1',
    paddingBottom: '10px',
  },
};

export const ForwardMailModal: React.FC = () => {
  const dispatch = useDispatch();
  const visible = useSelector(state => state.adminMessaging.forwardEmailModalVisibility);
  const mailInfo = useSelector(state => state.adminMessaging.selectedEmailInfo);
  const divRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');
  const { control, handleSubmit } = useForm<SendEmailFormValues>({
    defaultValues: {
      to: '',
      subject: '',
      messageText: '',
    },
  });

  const handleInputChange = (e: BaseSyntheticEvent): void => {
    setInputValue(e.target.value);
  };

  const onSubmit = useCallback(
    (values: SendEmailFormValues) => {
      dispatch(
        sendEmail.request({
          formValues: {
            to: values.to,
            subject: values.subject,
            messageText: `<div>${inputValue}</div> ${divRef.current?.outerHTML}`,
          },
          cb: () => {
            dispatch(toggleForwardMailModalVisibility());
          },
        }),
      );
    },
    [dispatch, inputValue],
  );

  const messages = useMemo(() => {
    return mailInfo?.messages.map(message => {
      const time = new Date(Number(message.internalDate)).toLocaleDateString();

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
      };
    });
  }, [mailInfo]);

  const onClose = useCallback(() => {
    dispatch(toggleForwardMailModalVisibility());
  }, [dispatch]);

  return (
    <CenterModal
      title="Forward email"
      visible={visible}
      onClose={onClose}
      className={styles['modal']}
    >
      <Input
        hintMessage="Add comma to separate receivers email"
        label="Forward to"
        placeholder="Type receiver`s email"
        name="to"
        control={control}
      />
      <Input
        className={styles['modal__input']}
        control={control}
        name="subject"
        placeholder="Type subject"
        label="Subject:"
      />
      <div className={styles['modal__content-wrapper']}>
        <input
          className={styles['modal__content-input']}
          placeholder="Your message..."
          type="Text"
          onChange={handleInputChange}
        />
        <div ref={divRef} style={inlineStyles.forwardedMessage}>
          {messages?.map(message => (
            <div style={inlineStyles.message} key={message.id}>
              <p style={inlineStyles.caption}>
                <span style={inlineStyles.label}>From:</span> {message.from}
              </p>
              <p style={inlineStyles.caption}>
                <span style={inlineStyles.label}>To:</span> {message.to}
              </p>
              <time style={inlineStyles.caption}>
                <span style={inlineStyles.label}>Date:</span> {message.time}
              </time>
              <div dangerouslySetInnerHTML={{ __html: message.text }} />
            </div>
          ))}
        </div>
      </div>
      <Button
        onClick={handleSubmit(onSubmit)}
        className={styles['modal__submit-btn']}
        title="Forward email"
        variant="accent"
      />
    </CenterModal>
  );
};
