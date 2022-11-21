import React, { memo, useCallback } from 'react';

import { markFeedbackSent } from '~/modules/companyInterviews/actions';
import { useDispatch, useSelector } from '~/store';
import { FeedbackSentImage } from '~/view/assets/images/feedback-sent';
import { CenterModal } from '~/view/components/modals';

import styles from './styles.scss';

export const FeedbackSentModal: React.FC = memo(function FeedbackSentModal() {
  const dispatch = useDispatch();
  const visible = useSelector(state => state.companyInterviews.feedbackSent);

  const handleClose = useCallback(() => {
    dispatch(markFeedbackSent(false));
  }, [dispatch]);

  return (
    <CenterModal className={styles['modal']} visible={visible} onClose={handleClose}>
      <div className={styles['modal__image-wrapper']}>
        <FeedbackSentImage />
      </div>
      <h2 className={styles['modal__title']}>Feedback sent</h2>
      <p className={styles['modal__subtitle']}>
        We appreciate your feedback, please the team some time to review and we will reach back out
        to you.
      </p>
    </CenterModal>
  );
});
