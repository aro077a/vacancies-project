import React, { memo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { CandidateMatched } from '~/models/admin';
import {
  getLiveJob,
  setSelectedLiveJob,
  toggleJobModalVisibility,
} from '~/modules/adminLiveJobs/actions';
import { useDispatch } from '~/store';
import { AdminRouter } from '~/utils/router';
import { Button } from '~/view/components/button';
import { Icon } from '~/view/components/icon';

import styles from './styles.scss';

type Props = {
  onMatchClick: (id: number) => void;
  onUnmatchClick: (id: number) => void;
} & CandidateMatched;

export const Card: React.FC<Props> = memo(function MatchedCard({
  positionName,
  companyName,
  addedAt,
  isMatched,
  match,
  step,
  onMatchClick,
  onUnmatchClick,
  id,
}) {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleMatch = useCallback(() => {
    onMatchClick(id);
  }, [id, onMatchClick]);

  const handleUnmatch = useCallback(() => {
    onUnmatchClick(id);
  }, [id, onUnmatchClick]);

  const showMoreInfo = useCallback(() => {
    dispatch(
      getLiveJob.request({
        jobId: id,
        cb: job => {
          dispatch(setSelectedLiveJob(job));
          dispatch(toggleJobModalVisibility());
        },
      }),
    );
  }, [dispatch, id]);

  return (
    <div className={styles['card']}>
      <div className={styles['card__header']}>
        <div className={styles['card__body']}>
          <p className={styles['card__position-name']}>{positionName}</p>
          <p className={styles['card__company-name']}>{companyName}</p>
        </div>
        {isMatched ? (
          <time className={styles['card__date']}>{addedAt}</time>
        ) : (
          <p className={styles['card__match-procentage']}>{match}%</p>
        )}
      </div>
      {step && <p className={styles['card__match-status']}>{step}</p>}
      <div className={styles['card__footer']}>
        {isMatched ? (
          <>
            <button
              onClick={() => history.push(AdminRouter.pipeline)}
              className={styles['card__show-pipeline-btn']}
            >
              Show pipeline{' '}
              <Icon
                width="7"
                height="7"
                name="chevron-right"
                className={styles['card__chevron-right-icon']}
              />
            </button>
            <div className={styles['card__vertical-separator']}>|</div>
            <button onClick={handleUnmatch} className={styles['card__unmatch-button']}>
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
              onClick={showMoreInfo}
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
