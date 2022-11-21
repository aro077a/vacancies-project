import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';

import {
  createFeedbackForCandidate,
  markFeedbackSent,
  toggleFeedbackModalVisibility,
} from '~/modules/companyInterviews/actions';
import { useDispatch, useSelector } from '~/store';
import { MatchedJobFeedbackValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { CenterModal } from '~/view/components/modals';
import { Textarea } from '~/view/components/textarea';

import styles from './styles.scss';

export const FeedbackModal: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedMatchedCandidate, feedbackModalVisibility, creatingFeedbackForCandidate } =
    useSelector(state => state.companyInterviews);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      feedback: '',
    },
    resolver: yupResolver(MatchedJobFeedbackValidation),
  });

  const handleModalClose = useCallback(() => {
    dispatch(toggleFeedbackModalVisibility());
  }, [dispatch]);

  const onSubmit = useCallback(
    feedback => {
      if (selectedMatchedCandidate) {
        const { candidate, job } = selectedMatchedCandidate;
        dispatch(
          createFeedbackForCandidate.request({
            data: { text: feedback.feedback, candidate, job },
            cb: () => {
              dispatch(toggleFeedbackModalVisibility());
              dispatch(markFeedbackSent(true));
            },
          }),
        );
      }
    },
    [dispatch, selectedMatchedCandidate],
  );

  return (
    <CenterModal
      visible={feedbackModalVisibility}
      onClose={handleModalClose}
      className={styles['modal']}
      title="Send feedback"
    >
      <div>
        <p className={styles['modal__description']}>
          Please leave your feedback for candidate {selectedMatchedCandidate?.id}. Your feedback
          will be visible only for administrator.
        </p>
        <Textarea
          textAreaClassName={styles['modal__textarea']}
          label="Your feedback"
          placeholder="Your note"
          name="feedback"
          maxLength={1000}
          control={control}
        />
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="accent"
          title="Send"
          className={styles['modal__submit-btn']}
          loading={creatingFeedbackForCandidate}
        />
      </div>
    </CenterModal>
  );
};
