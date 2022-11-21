import React, { memo, useCallback } from 'react';

import { CandidateFeedback } from '~/models/admin';
import {
  setSelectedCandidateFeedback,
  toggleThreadModalVisibility,
} from '~/modules/adminCandidates/actions';
import { useDispatch, useSelector } from '~/store';

import { FeedbackCard } from './components/FeedbackCard';
import styles from './styles.scss';

export const Feedback: React.FC = memo(function Feedback() {
  const dispatch = useDispatch();
  const { candidateFeedbacks } = useSelector(state => state.adminCandidates);

  const handleFeedbackClick = useCallback(
    (feedback: CandidateFeedback) => {
      dispatch(setSelectedCandidateFeedback(feedback));
      dispatch(toggleThreadModalVisibility());
    },
    [dispatch],
  );

  return (
    <div className={styles['feedback']}>
      {candidateFeedbacks.length > 0 ? (
        candidateFeedbacks.map(feedback => (
          <FeedbackCard
            onFeedbackClick={handleFeedbackClick}
            key={feedback.id}
            feedback={feedback}
          />
        ))
      ) : (
        <p className={styles['feedback__no-feedback-message']}>No any feedback</p>
      )}
    </div>
  );
});
