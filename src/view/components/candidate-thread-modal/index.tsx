import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';

import { CandidateFeedbackReplies } from '~/models/admin';
import {
  sendCandidateFeedbackReply,
  setSelectedCandidateFeedback,
  toggleThreadModalVisibility,
} from '~/modules/adminCandidates/actions';
import { useDispatch, useSelector } from '~/store';
import { CandidateFeedbackReplyFormValidation } from '~/utils/validations';
import { FeedbackReply } from '~/view/components/feedback-reply';
import { Icon } from '~/view/components/icon';
import { RightModal } from '~/view/components/modals';

import styles from './styles.scss';

export const CandidateThreadModal: React.FC = memo(function ThreadModal() {
  const dispatch = useDispatch();
  const visible = useSelector(state => state.adminCandidates.threadModalVisibility);
  const { selectedCandidateFeedbackReplies } = useSelector(state => state.adminCandidates);
  const repliesContainerRef = useRef<HTMLDivElement>(null);
  const {
    formState: { errors },
    register,
    setValue,
    handleSubmit,
  } = useForm<{ newReply: string }>({
    defaultValues: {
      newReply: '',
    },
    resolver: yupResolver(CandidateFeedbackReplyFormValidation),
  });

  const onClose = useCallback(() => {
    dispatch(toggleThreadModalVisibility());
  }, [dispatch]);

  useEffect(() => {
    if (!visible) {
      dispatch(setSelectedCandidateFeedback(null));
    }
  }, [dispatch, visible]);

  useEffect(() => {
    if (repliesContainerRef.current) {
      repliesContainerRef.current.scrollTop = repliesContainerRef.current.scrollHeight;
    }
  }, [selectedCandidateFeedbackReplies?.replies?.length]);

  const sendNewReply = useCallback(
    (values: { newReply: string }) => {
      dispatch(sendCandidateFeedbackReply.request({ text: values.newReply }));

      setValue('newReply', '');
    },
    [dispatch, setValue],
  );

  const mainFeedback = useMemo<CandidateFeedbackReplies['replies'][number] | null>(() => {
    if (selectedCandidateFeedbackReplies) {
      return {
        id: selectedCandidateFeedbackReplies.id,
        name: selectedCandidateFeedbackReplies.companyName,
        photo: selectedCandidateFeedbackReplies.companyPhoto,
        addedAt: new Date(selectedCandidateFeedbackReplies.createdAt).toLocaleDateString(),
        text: selectedCandidateFeedbackReplies.text,
        isAdmin: false,
      };
    }

    return null;
  }, [selectedCandidateFeedbackReplies]);

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
        {selectedCandidateFeedbackReplies?.replies.map(reply => (
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
