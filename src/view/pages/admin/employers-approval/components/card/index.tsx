import React, { memo, useCallback } from 'react';

import { Employers } from '~/models/admin';
import { Button } from '~/view/components/button';
import { Image } from '~/view/components/image';

import styles from './styles.scss';

type Props = {
  employer: Employers;
  onClick: (employer: Employers) => void;
  onRejectClick: (id: number) => void;
  onApproveClick: (id: number) => void;
};

export const EmployerCard: React.FC<Props> = memo(function CandidateCard({
  employer,
  onRejectClick,
  onApproveClick,
  onClick,
}) {
  const { companyLogo, city, state, name, id } = employer;

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
          src={companyLogo}
          type="company"
        />
        <h4 className={styles['card__candidate-name']}>{name.slice(0, 30)}</h4>
      </div>
      <div className={styles['card__candidate-location']}>
        <p>{`${city?.name} , ${state?.abbr}`}</p>
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
      <div onClick={() => onClick(employer)} className={styles['card__overlay']} />
    </div>
  );
});
