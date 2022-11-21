import { yupResolver } from '@hookform/resolvers/yup';
import React, { memo, useCallback } from 'react';
import { useForm } from 'react-hook-form';

import {
  createFeedbackForJob,
  toggleFeedbackModalVisibility,
} from '~/modules/candidateProposals/actions';
import { useDispatch, useSelector } from '~/store';
import { MatchedJobFeedbackValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { CenterModal } from '~/view/components/modals';
import { Textarea } from '~/view/components/textarea';

import styles from './styles.scss';

export const FeedbackModal: React.FC = memo(function FeedbackModal() {
  const dispatch = useDispatch();
  const { feedbackModalVisibility, selectedMatchedJob, creatingFeedbackForJob } = useSelector(
    state => state.candidateProposals,
  );
  const { control, handleSubmit } = useForm({
    defaultValues: { feedback: '' },
    resolver: yupResolver(MatchedJobFeedbackValidation),
  });

  const handleModalClose = useCallback(() => {
    dispatch(toggleFeedbackModalVisibility());
  }, [dispatch]);

  const onSubmit = useCallback(
    feedback => {
      if (selectedMatchedJob) {
        dispatch(
          createFeedbackForJob.request({
            data: { text: feedback.feedback, job: selectedMatchedJob.job },
            cb: () => {
              dispatch(toggleFeedbackModalVisibility());
            },
          }),
        );
      }
    },
    [dispatch, selectedMatchedJob],
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
          Please leave your feedback for Company ABC on Project Engineer position. Your feedback
          will be visible only for administrator.
        </p>
        <Textarea
          control={control}
          label="Your feedback"
          placeholder="Your note"
          maxLength={2000}
          name="feedback"
          textAreaClassName={styles['modal__textarea']}
        />
        <Button
          variant="accent"
          title="Send"
          className={styles['modal__submit-btn']}
          onClick={handleSubmit(onSubmit)}
          loading={creatingFeedbackForJob}
        />
      </div>
    </CenterModal>
  );
});
