import React, { memo } from 'react';

import { CandidateFeedback } from '~/models/admin';
import { DotsDropdown } from '~/view/components/dots-dropdown';
import { Image } from '~/view/components/image';
import { UserBadge } from '~/view/components/user-badge';

import styles from './styles.scss';

type Props = {
  onFeedbackClick: (feedback: CandidateFeedback) => void;
  feedback: CandidateFeedback;
};

export const FeedbackCard: React.FC<Props> = memo(function FeedbackCard({
  feedback,
  onFeedbackClick,
}) {
  const { companyName, jobName, companyPhoto, text, repliesCount, createdAt, latestReplyDate } =
    feedback;
  const formatedDate = new Date(createdAt).toLocaleDateString();

  return (
    <div className={styles['feedback-card']}>
      <Image
        src={companyPhoto}
        type="company"
        alt="Company logo"
        className={styles['feedback-card__company-logo']}
      />
      <div className={styles['feedback-card__body']}>
        <div className={styles['feedback-card__header']}>
          <h4 className={styles['feedback-card__company-name']}>{companyName}</h4>
          &#183;
          <p className={styles['feedback-card__job-position']}>{jobName}</p>
        </div>
        <p className={styles['feedback-card__text']}>{text}</p>
        <div className={styles['feedback-card__footer']}>
          <div
            onClick={() => onFeedbackClick(feedback)}
            className={styles['feedback-card__reply-section']}
          >
            {repliesCount ? (
              <>
                <UserBadge infoVisible={false} className={styles['feedback-card__user-badge']} />
                <p className={styles['feedback-card__reply-btn']}>
                  <span className={styles['feedback-card__reply-count']}>{repliesCount}</span> reply
                </p>
                <time className={styles['feedback-card__reply-time']}>{latestReplyDate}</time>
              </>
            ) : (
              <p className={styles['feedback-card__reply-btn']}>Reply</p>
            )}
          </div>
          <p className={styles['feedback-card__created-time']}>{formatedDate}</p>
        </div>
      </div>
      <DotsDropdown items={[]} />
    </div>
  );
});
