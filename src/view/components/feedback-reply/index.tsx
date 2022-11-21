import React, { memo } from 'react';

import { CandidateFeedbackReplies, LiveJobFeedbackReplies } from '~/models/admin';
import { Image } from '~/view/components/image';
import { UserBadge } from '~/view/components/user-badge';

import styles from './styles.scss';

type Props = {
  reply: LiveJobFeedbackReplies['replies'][number] | CandidateFeedbackReplies['replies'][number];
};

export const FeedbackReply: React.FC<Props> = memo(function FeedbackReply({ reply }) {
  return (
    <div className={styles['reply']}>
      {reply.isAdmin ? (
        <UserBadge infoVisible={false} avatarWrapperClassName={styles['reply__admin-badge']} />
      ) : (
        <Image
          type="candidate"
          className={styles['reply__user-image']}
          src={reply.photo}
          alt="candidate"
        />
      )}
      <div className={styles['reply__info-wrapper']}>
        <div className={styles['reply__header']}>
          <h5 className={styles['reply__user-name']}>{reply.name}</h5>
          <p className={styles['reply__date']}>{reply.addedAt}</p>
        </div>
        <p className={styles['reply__text']}>{reply.text}</p>
      </div>
    </div>
  );
});
