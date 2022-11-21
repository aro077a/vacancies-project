import React, { memo, useCallback, useState } from 'react';

import { MatchedCandidateFeedback } from '~/models/company';
import { setSelectedMatchedCandidateFeedback } from '~/modules/companyInterviews/actions';
import { useDispatch, useSelector } from '~/store';

import { FeedbackCard } from './components/FeedbackCard';
import { ThreadModal } from './components/thread-modal';
import styles from './styles.scss';

export const Feedback: React.FC = memo(function Feedback() {
  const dispatch = useDispatch();
  const [modalVisibility, setModalVisibility] = useState(false);
  const feedbacks = useSelector(state => state.companyInterviews.matchedCandidateFeedbacks);

  const handleFeedbackClick = useCallback(
    (feedback: MatchedCandidateFeedback) => {
      dispatch(setSelectedMatchedCandidateFeedback(feedback));

      setModalVisibility(prevValue => !prevValue);
    },
    [dispatch],
  );

  const toggleModalVisibility = useCallback(() => {
    setModalVisibility(prevValue => !prevValue);
  }, []);

  return (
    <div className={styles['feedback']}>
      {feedbacks.length > 0 ? (
        feedbacks.map(feedback => (
          <FeedbackCard
            onFeedbackClick={handleFeedbackClick}
            key={feedback.id}
            feedback={feedback}
          />
        ))
      ) : (
        <p className={styles['feedback__no-feedback-message']}>No any feedback</p>
      )}
      <ThreadModal visible={modalVisibility} onClose={toggleModalVisibility} />
    </div>
  );
});
