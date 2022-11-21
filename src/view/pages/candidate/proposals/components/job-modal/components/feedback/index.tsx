import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { MatchedJobFeedbackReply } from '~/models/common';
import { createReplyForFeedback } from '~/modules/candidateProposals/actions';
import { useDispatch, useSelector } from '~/store';
import { CandidateFeedbackReplyFormValidation } from '~/utils/validations';
import { FeedbackReply } from '~/view/components/feedback-reply';
import { Icon } from '~/view/components/icon';

import styles from './styles.scss';

export const Feedback: React.FC = () => {
  const dispatch = useDispatch();
  const feedback = useSelector(state => state.candidateProposals.matchedJobFeedback);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      newReply: '',
    },
    resolver: yupResolver(CandidateFeedbackReplyFormValidation),
  });

  const mainFeedback = useMemo<MatchedJobFeedbackReply | null>(() => {
    if (feedback) {
      return {
        id: feedback.id,
        isAdmin: false,
        photo: feedback.candidatePhoto,
        name: feedback.candidateName,
        addedAt: new Date(feedback.createdAt).toLocaleDateString(),
        text: feedback.text,
      };
    }
    return null;
  }, [feedback]);

  const sendNewReply = useCallback(
    (values: { newReply: string }) => {
      if (feedback) {
        dispatch(
          createReplyForFeedback.request({
            feedbackId: feedback.id,
            newReply: values.newReply,
          }),
        );
      }

      setValue('newReply', '');
    },
    [dispatch, setValue, feedback],
  );

  return (
    <div className={styles['feedback']}>
      <div className={styles['feedback__items']}>
        {mainFeedback && <FeedbackReply reply={mainFeedback} />}
        {feedback && feedback.replies.map(reply => <FeedbackReply key={reply.id} reply={reply} />)}
        {!feedback && <p className={styles['feedback__no-feedback-message']}>No feedback</p>}
      </div>
      {feedback && (
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
      )}
      {errors.newReply && (
        <p className={styles['thread-modal__error-message']}>{errors.newReply.message}</p>
      )}
    </div>
  );
};
