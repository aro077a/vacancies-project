import classNames from 'classnames';
import React, { BaseSyntheticEvent, memo, useMemo } from 'react';

import { LookingJobStatus } from '~/models/candidate';
import { UserType } from '~/models/common';
import { SearchCandidate } from '~/models/company';
import { addJobToShortList } from '~/modules/candidateFindJobs/actions';
import {
  addCandidateToShortList,
  setSelectedCompanyCandidate,
} from '~/modules/companyCandidates/actions';
import { updateShortList } from '~/modules/shortlist/actions';
import { useDispatch, useSelector } from '~/store';
import { numberWithCommas } from '~/utils/helpers';
import { projectValueOptions } from '~/utils/staticData';
import { Icon } from '~/view/components/icon';
import { KeyProjectCard } from '~/view/components/key-project-card';
import { Tag } from '~/view/components/tag';

import styles from './styles.scss';

type Props = {
  candidate: SearchCandidate;
  onClick?: () => void;
  isShortListPage: boolean;
};

export const CandidateCard: React.FC<Props> = memo(function CandidateCard({
  candidate,
  onClick,
  isShortListPage,
}) {
  const dispatch = useDispatch();

  const {
    id,
    shortlist,
    companies,
    jobName,
    keyProjects,
    candidateName,
    location,
    minSalary,
    status,
  } = candidate;

  const { loggedInUserType } = useSelector(state => state.user);
  const isCompany = loggedInUserType === UserType.COMPANY || loggedInUserType === UserType.MANAGER;

  const onCardClickHandler = (): void => {
    if (onClick) {
      dispatch(setSelectedCompanyCandidate.request(id));
      onClick();
    }
  };

  const shortListHandler = (e: BaseSyntheticEvent): void => {
    e.stopPropagation();

    if (isShortListPage) {
      dispatch(
        updateShortList.request({
          jobId: id,
          status: !shortlist,
        }),
      );
    } else if (isCompany) {
      dispatch(
        addCandidateToShortList.request({
          candidateId: id,
          status: !shortlist,
        }),
      );
    } else {
      dispatch(
        addJobToShortList.request({
          jobId: id,
          status: !shortlist,
        }),
      );
    }
  };

  const candidateStatus = useMemo(() => {
    switch (status) {
      case LookingJobStatus.ACTIVE:
        return 'active';
      case LookingJobStatus.PASSIVE:
        return 'passive';
      case LookingJobStatus.NOT_LOOKING:
        return 'not-looking';
      default:
        return 'unavailable';
    }
  }, [status]);

  return (
    <div onClick={onCardClickHandler} className={styles['card']}>
      <div className={styles['card__header']}>
        <div className={styles['card__candidate-info']}>
          <div className={styles['card__candidate-name']}>
            <h2 className={styles['card__name']}>{candidateName}</h2>
            {jobName && (
              <>
                <span className={styles['circle']} />
                <p className={styles['card__job-name']}>{jobName}</p>
              </>
            )}
          </div>
          <button className={styles['card__shortlist-btn']} onClick={shortListHandler}>
            <Icon
              name={shortlist ? 'shortlist-filled' : 'shortlist'}
              className={styles['card__shortlist-icon']}
            />
          </button>
        </div>
        <div className={styles['card__bottom-info']}>
          <div className={styles['card__location-info']}>
            <Icon className={styles['card__location-icon']} name="location" />
            <p className={styles['card__location']}>{location}</p>
          </div>
          <p className={styles['card__salary']}>
            ${minSalary && numberWithCommas(minSalary)}{' '}
            <span className={styles['card__salary-type']}>/year</span>
          </p>
        </div>
      </div>
      <div className={styles['card__body']}>
        <div className={styles['card__positions-block']}>
          <p className={styles['card__positions-title']}>Companies worked at</p>
          <div className={styles['card__position-list']}>
            {companies?.slice(0, 2).map(tag => (
              <Tag className={styles['card__user-tag']} key={tag} text={tag} variant="primary" />
            ))}
            {companies?.length > 2 && (
              <Tag
                className={styles['card__user-tags--extra']}
                text={`+${companies.length - 2}`}
                variant="primary"
              />
            )}
          </div>
        </div>
        <div className={styles['card__positions-block']}>
          <p className={styles['card__positions-title']}>Projects that employer have worked on</p>
          <div className={styles['card__position-list']}>
            {keyProjects?.length ? (
              keyProjects?.slice(0, 2).map(keyProject => {
                const selectedValue = projectValueOptions.find(
                  (item: Record<string, unknown>) => item.value === keyProject.value,
                );

                return (
                  <KeyProjectCard
                    {...keyProject}
                    key={keyProject.id}
                    value={selectedValue?.label}
                  />
                );
              })
            ) : (
              <p className={styles['not-found']}>No projects found</p>
            )}
            {keyProjects?.length > 2 && (
              <div className={styles['extra-block']}>+{keyProjects.length - 2}</div>
            )}
          </div>
        </div>
      </div>
      <span
        className={classNames(styles['card__status'], styles[`card__status--${candidateStatus}`])}
      >
        {candidateStatus}
      </span>
    </div>
  );
});
