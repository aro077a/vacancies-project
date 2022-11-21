import React, { memo, useCallback } from 'react';

import { CandidateMatched } from '~/models/admin';
import { Button } from '~/view/components/button';
import { Editor } from '~/view/components/editor';
import { Icon } from '~/view/components/icon';
import { Image } from '~/view/components/image';

import styles from './styles.scss';

type Props = {
  onMatchClick: (id: number) => void;
};

export const PotentialCard: React.FC<CandidateMatched & Props> = memo(function PotentialCard({
  match,
  companyLogo,
  positionName,
  companyName,
  addedAt,
  jobDetail,
  location,
  projectTypeName,
  candidateCount,
  salary,
  id,
  onMatchClick,
}) {
  const handleMatchClick = useCallback(() => {
    onMatchClick(id);
  }, [id, onMatchClick]);

  return (
    <div className={styles['potential-card']}>
      <div className={styles['potential-card__header']}>
        <Image
          alt="Company logo"
          className={styles['potential-card__logo']}
          type="company"
          src={companyLogo}
        />
        <div className={styles['potential-card__company-info']}>
          <h4 className={styles['potential-card__position-name']}>{positionName}</h4>
          <div className={styles['potential-card__job-info']}>
            <p className={styles['potential-card__company-name']}>{companyName} </p>
            <span className={styles['middledot']}>&#183;</span>
            {addedAt && (
              <span className={styles['potential-card__added-time']}> Added {addedAt}</span>
            )}
          </div>
        </div>
        <Button
          className={styles['potential-card__match-btn']}
          onClick={handleMatchClick}
          variant="secondary"
          size="small"
          title="Match"
        />
      </div>
      <Editor readOnly rawContentState={jobDetail || undefined} />
      <div className={styles['potential-card__footer']}>
        <div className={styles['potential-card__project-info']}>
          <div className={styles['potential-card__caption-wrapper']}>
            <Icon className={styles['potential-card__icon']} name="location" />
            <p>{location}</p>
          </div>
          <div className={styles['potential-card__caption-wrapper']}>
            <Icon className={styles['potential-card__icon']} name="job-type" />
            <p>{projectTypeName}</p>
          </div>
          <div className={styles['potential-card__caption-wrapper']}>
            <Icon className={styles['potential-card__icon']} name="user-outline" />
            <p>{candidateCount} candidates</p>
          </div>
          <div className={styles['potential-card__caption-wrapper']}>
            <Icon className={styles['potential-card__icon']} name="pocket" />
            <p>{salary}/year</p>
          </div>
        </div>
        <div className={styles['potential-card__match-status-caption']}>{match}% Match</div>
      </div>
    </div>
  );
});
