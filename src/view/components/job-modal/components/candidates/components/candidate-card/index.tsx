import React, { memo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { Candidate, LiveJobCandidate } from '~/models/admin';
import { setSelectedCandidate } from '~/modules/adminCandidates/actions';
import { toggleJobModalVisibility } from '~/modules/adminLiveJobs/actions';
import { useDispatch } from '~/store';
import { generateUuid } from '~/utils/helpers';
import { AdminRouter } from '~/utils/router';
import { formatAddedDate, formatSalary } from '~/utils/strings';
import { Button } from '~/view/components/button';
import { Icon } from '~/view/components/icon';
import { Image } from '~/view/components/image';

import styles from './styles.scss';

type Props = {
  candidate: LiveJobCandidate;
  onMatchClick: (candidateId: number) => void;
  onUnMatchClick: (candidateId: number) => void;
  onMoreInfoClick?: () => void;
};

export const CandidateCard: React.FC<Props> = memo(function CandidateCard({
  candidate,
  onMatchClick,
  onUnMatchClick,
  onMoreInfoClick,
}) {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleMatch = useCallback(() => {
    onMatchClick(candidate.id);
  }, [candidate.id, onMatchClick]);

  const handleUnmatch = useCallback(() => {
    onUnMatchClick(candidate.id);
  }, [candidate.id, onUnMatchClick]);

  const handleMoreInfo = useCallback(
    (
      candidate: Omit<
        Candidate,
        'status' | 'jobPositions' | 'projectTypes' | 'phone' | 'email' | 'brandedCv'
      >,
    ) => {
      dispatch(setSelectedCandidate(candidate));
      if (onMoreInfoClick) onMoreInfoClick();
    },
    [dispatch, onMoreInfoClick],
  );

  const handleShowPipeline = useCallback(() => {
    dispatch(toggleJobModalVisibility());
    history.push(AdminRouter.pipeline);
  }, [history, dispatch]);

  return (
    <div className={styles['card']}>
      <div className={styles['card__body']}>
        <Image
          type="candidate"
          className={styles['card__image']}
          src={candidate.avatar}
          alt="candidate"
        />
        <div className={styles['card__info-wrapper']}>
          <div className={styles['card__name-wrapper']}>
            <p className={styles['card__name']}>{candidate.name}</p>
            {candidate.isMatched ? (
              <p className={styles['card__date']}>{formatAddedDate(candidate.addedAt)}</p>
            ) : (
              <p className={styles['card__match-percent']}>{candidate.match}%</p>
            )}
          </div>
          <p className={styles['card__info']}>
            {candidate.isMatched
              ? candidate.step
              : `${candidate.location} | ${formatSalary(candidate.salary)}`}
          </p>
        </div>
      </div>
      <div className={styles['card__separator']} />
      <div className={styles['card__job']}>
        {candidate.positions.slice(0, 3).map((position: string) => (
          <p key={generateUuid()} className={styles['card__job--name']}>
            {position}
          </p>
        ))}
      </div>
      <div className={styles['card__separator']} />
      <div className={styles['card__footer']}>
        {candidate.isMatched ? (
          <>
            <button onClick={handleShowPipeline} className={styles['card__show-pipeline-button']}>
              Show pipeline
              <Icon name="chevron-right" className={styles['card__show-pipeline-chevron-icon']} />
            </button>
            <div className={styles['card__footer-separator']} />
            <button className={styles['card__unmatch-button']} onClick={handleUnmatch}>
              Unmatch
            </button>
          </>
        ) : (
          <>
            <Button
              size="small"
              variant="secondary"
              title="More info"
              className={styles['card__more-info-button']}
              onClick={() => handleMoreInfo(candidate)}
            />
            <Button
              size="small"
              variant="accent"
              title="Match"
              className={styles['card__match-button']}
              onClick={handleMatch}
            />
          </>
        )}
      </div>
    </div>
  );
});
