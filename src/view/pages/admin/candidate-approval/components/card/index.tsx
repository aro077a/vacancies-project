import React, { memo, useCallback } from 'react';

import { Candidate } from '~/models/admin';
import { Button } from '~/view/components/button';
import { Image } from '~/view/components/image';

import styles from './styles.scss';

type Props = {
  candidate: Candidate;
  onClick: (candidate: Candidate) => void;
  onRejectClick: (id: number) => void;
  onApproveClick: (id: number) => void;
};

export const CandidateCard: React.FC<Props> = memo(function CandidateCard({
  candidate,
  onRejectClick,
  onApproveClick,
  onClick,
}) {
  const { avatar, location, name, id } = candidate;

  const handleApproveClick = useCallback(() => {
    onApproveClick(id);
  }, [id, onApproveClick]);

  const handleRejectClick = useCallback(() => {
    onRejectClick(id);
  }, [onRejectClick, id]);

  return (
    <div className={styles['card']}>
      <div className={styles['card__candidate-info']}>
        <Image
          alt="Candidate photo"
          className={styles['card__candidate-photo']}
          src={avatar}
          type="candidate"
        />
        <h4 className={styles['card__candidate-name']}>{name}</h4>
      </div>
      <div className={styles['card__candidate-location']}>
        <p>{location}</p>
      </div>
      <div className={styles['card__candidate-status']}>
        <Button
          className={styles['card__actn-btn']}
          size="small"
          variant="accent"
          title="Approve"
          onClick={handleApproveClick}
        />
        <Button
          className={styles['card__actn-btn']}
          size="small"
          variant="secondary"
          title="Reject"
          onClick={handleRejectClick}
        />
      </div>
      <div onClick={() => onClick(candidate)} className={styles['card__overlay']} />
    </div>
  );
});
