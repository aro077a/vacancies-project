import React, { BaseSyntheticEvent, memo } from 'react';

import { Thread } from '~/models/admin';
import {
  getEmailInfo,
  setSelectedMail,
  toggleConfirmModalVisibility,
} from '~/modules/adminMessaging/actions';
import { useDispatch } from '~/store';
import { Icon } from '~/view/components/icon';

import styles from './styles.scss';

export const EmailCard: React.FC<Thread> = memo(function EmailCard({ id, snippet }) {
  const dispatch = useDispatch();

  const deleteHandler = (e: BaseSyntheticEvent): void => {
    e.stopPropagation();
    dispatch(setSelectedMail(id));
    dispatch(toggleConfirmModalVisibility());
  };

  const onCardClickHandler = (): void => {
    dispatch(setSelectedMail(id));
    dispatch(getEmailInfo.request({ withReply: false, isForward: false }));
  };

  const onReplyClickHandler = (e: BaseSyntheticEvent): void => {
    e.stopPropagation();
    dispatch(setSelectedMail(id));
    dispatch(getEmailInfo.request({ withReply: true, isForward: false }));
  };

  const onForwardClickHandler = (e: BaseSyntheticEvent): void => {
    e.stopPropagation();
    dispatch(setSelectedMail(id));
    dispatch(getEmailInfo.request({ withReply: false, isForward: true }));
  };

  return (
    <div onClick={onCardClickHandler} className={styles['card']}>
      <p className={styles['card__text']} dangerouslySetInnerHTML={{ __html: snippet }} />
      <div className={styles['card__btns']}>
        <button onClick={onReplyClickHandler} className={styles['card__btn']}>
          <Icon className={styles['card__reply-icon']} name="share" />
          Reply
        </button>
        <button onClick={onForwardClickHandler} className={styles['card__btn']}>
          <Icon className={styles['card__forward-icon']} name="share" />
          Forward
        </button>
        <button className={styles['card__btn']} onClick={deleteHandler}>
          <Icon className={styles['card__urn-icon']} name="urn" />
          Delete
        </button>
      </div>
    </div>
  );
});
