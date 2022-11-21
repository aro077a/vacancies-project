import classNames from 'classnames';
import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { MatchedJobSteps } from '~/models/common';
import { MatchedCandidateForMyJob } from '~/models/company';
import { CompanyRouter } from '~/utils/router';
import { Icon } from '~/view/components/icon';

import styles from './styles.scss';

export const MatchedCard: React.FC<MatchedCandidateForMyJob> = ({
  step,
  addedAt,
  candidateName,
}) => {
  const history = useHistory();

  const status: { title: string; icon: string } | null = useMemo(() => {
    switch (step) {
      case MatchedJobSteps.SentToEmployee:
        return {
          title: 'Candidate is matched',
          icon: 'puzzle',
        };
      case MatchedJobSteps.InterviewArranged:
        return {
          title: 'Interview arranged',
          icon: 'checkmark-in-circle',
        };
      case MatchedJobSteps.AcceptedByEmployee:
        return {
          title: 'Interview arranged',
          icon: 'checkmark-in-circle',
        };
      case MatchedJobSteps.PlacementApproved:
        return {
          title: 'Placement approved',
          icon: 'bag-with-checkmark',
        };
      case MatchedJobSteps.Completed:
        return {
          title: 'Placement approved',
          icon: 'bag-with-checkmark',
        };
      case MatchedJobSteps.WaitingForApproval:
        return {
          title: 'Placement approved',
          icon: 'bag-with-checkmark',
        };
      default:
        return null;
    }
  }, [step]);

  return (
    status && (
      <div className={styles['card']}>
        <div className={styles['card__body']}>
          <div className={classNames(styles['card__logo'], styles[`card__logo--${status.icon}`])}>
            <Icon className={styles['card__logo-icon']} name={status.icon} />
          </div>
          <div className={styles['card__info']}>
            <p className={styles['card__name']}>{candidateName}</p>
            <p className={styles['card__status']}>{status.title}</p>
          </div>
          <time className={styles['card__time']}>{addedAt} ago</time>
        </div>
        <div className={styles['card__footer']}>
          <button
            onClick={() => history.push(CompanyRouter.interviews)}
            className={styles['card__footer-btn']}
          >
            Show pipeline {'>'}
          </button>
        </div>
      </div>
    )
  );
};
