import React, { memo, useCallback } from 'react';

import { LiveJobFeedback } from '~/models/admin';
import {
  setSelectedLiveJobFeedback,
  toggleThreadModalVisibility,
} from '~/modules/adminLiveJobs/actions';
import { useDispatch, useSelector } from '~/store';
import { DotsDropdown } from '~/view/components/dots-dropdown';
import { Image } from '~/view/components/image';
import { UserBadge } from '~/view/components/user-badge';

import styles from './styles.scss';

export const Feedback: React.FC = memo(function Feedback() {
  const dispatch = useDispatch();
  const liveJobFeedbacks = useSelector(state => state.adminLiveJobs.liveJobFeedbacks);

  const handleFeedbackClick = useCallback(
    (feedback: LiveJobFeedback) => {
      dispatch(setSelectedLiveJobFeedback(feedback));

      dispatch(toggleThreadModalVisibility());
    },
    [dispatch],
  );

  return (
    <>
      <div className={styles['feedbacks']}>
        {liveJobFeedbacks.length > 0 ? (
          liveJobFeedbacks.map(feedback => (
            <div key={feedback.id} className={styles['feedbacks__feedback']}>
              <Image
                type="candidate"
                className={styles['feedbacks__user-image']}
                src={feedback.candidatePhoto}
                alt="candidate"
              />
              <div className={styles['feedbacks__feedback-info-wrapper']}>
                <div className={styles['feedbacks__feedback-header']}>
                  <h5 className={styles['feedbacks__user-name']}>{feedback.candidateName}</h5>
                </div>
                <p className={styles['feedbacks__feedback-text']}>{feedback.text}</p>
                <div
                  className={styles['feedbacks__feedback-footer']}
                  onClick={() => handleFeedbackClick(feedback)}
                >
                  <div className={styles['feedbacks__feedback-replies-wrapper']}>
                    <UserBadge
                      infoVisible={false}
                      avatarWrapperClassName={styles['feedbacks__feedback-replier-badge']}
                      avatarTextClassName={styles['feedbacks__feedback-replier-badge-text']}
                    />
                    <p className={styles['feedbacks__feedback-replies']}>
                      {feedback.repliesCount > 0 ? `${feedback.repliesCount} reply` : 'Reply'}
                    </p>
                    <p className={styles['feedbacks__feedback-reply-date']}>
                      {feedback.latestReplyDate}
                    </p>
                  </div>
                  <p className={styles['feedbacks__feedback-reply-date']}>
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <DotsDropdown className={styles['feedbacks__feedback-dots']} items={[]} />
            </div>
          ))
        ) : (
          <p className={styles['feedbacks__no-feedback-message']}>No any feedback</p>
        )}
      </div>
    </>
  );
});
