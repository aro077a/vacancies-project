import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';

import { LiveJobFeedbackReplies } from '~/models/admin';
import {
  sendLiveJobFeedbackReply,
  setSelectedLiveJobFeedback,
  toggleThreadModalVisibility,
} from '~/modules/adminLiveJobs/actions';
import { useDispatch, useSelector } from '~/store';
import { LiveJobFeedbackReplyFormValidation } from '~/utils/validations';
import { FeedbackReply } from '~/view/components/feedback-reply';
import { Icon } from '~/view/components/icon';
import { RightModal } from '~/view/components/modals';

import styles from './styles.scss';

export const JobThreadModal: React.FC = memo(function ThreadModal() {
  const dispatch = useDispatch();
  const liveJobFeedbackReplies = useSelector(state => state.adminLiveJobs.liveJobFeedbackReplies);
  const repliesContainerRef = useRef<HTMLDivElement>(null);
  const visible = useSelector(state => state.adminLiveJobs.threadModalVisibility);
  const {
    formState: { errors },
    register,
    setValue,
    handleSubmit,
  } = useForm<{ newReply: string }>({
    defaultValues: {
      newReply: '',
    },
    resolver: yupResolver(LiveJobFeedbackReplyFormValidation),
  });

  const onClose = useCallback(() => {
    dispatch(toggleThreadModalVisibility());
  }, [dispatch]);

  useEffect(() => {
    if (!visible) {
      dispatch(setSelectedLiveJobFeedback(null));
    }
  }, [dispatch, visible]);

  useEffect(() => {
    if (repliesContainerRef.current) {
      repliesContainerRef.current.scrollTop = repliesContainerRef.current.scrollHeight;
    }
  }, [liveJobFeedbackReplies?.replies.length]);

  const sendNewReply = useCallback(
    (values: { newReply: string }) => {
      dispatch(sendLiveJobFeedbackReply.request({ text: values.newReply }));

      setValue('newReply', '');
    },
    [dispatch, setValue],
  );

  const mainFeedback = useMemo<LiveJobFeedbackReplies['replies'][number] | null>(() => {
    if (liveJobFeedbackReplies) {
      return {
        id: liveJobFeedbackReplies.id,
        name: liveJobFeedbackReplies.candidateName,
        photo: liveJobFeedbackReplies.candidatePhoto,
        addedAt: new Date(liveJobFeedbackReplies.createdAt).toLocaleDateString(),
        text: liveJobFeedbackReplies.text,
        isAdmin: false,
      };
    }

    return null;
  }, [liveJobFeedbackReplies]);

  return (
    <RightModal
      backTitle="< Back"
      className={styles['thread-modal']}
      visible={visible}
      onClose={onClose}
    >
      <p className={styles['thread-modal__title']}>Thread</p>
      <div ref={repliesContainerRef} className={styles['thread-modal__body']}>
        {mainFeedback && <FeedbackReply reply={mainFeedback} />}
        {liveJobFeedbackReplies?.replies.map(reply => (
          <FeedbackReply key={reply.id} reply={reply} />
        ))}
      </div>
      <div className={styles['thread-modal__footer']}>
        <textarea
          className={classNames(styles['thread-modal__input'], {
            [styles['thread-modal__input--error']]: errors.newReply,
          })}
          placeholder="| Reply..."
          {...register('newReply')}
        />
        <button
          className={styles['thread-modal__send-feedback-button']}
          onClick={handleSubmit(sendNewReply)}
        >
          <Icon name="send" className={styles['thread-modal__send-feedback-icon']} />
        </button>
      </div>
      {errors.newReply && (
        <p className={styles['thread-modal__error-message']}>{errors.newReply.message}</p>
      )}
    </RightModal>
  );
});
