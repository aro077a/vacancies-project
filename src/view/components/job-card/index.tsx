import React, { BaseSyntheticEvent, memo } from 'react';

import { FindJob } from '~/models/candidate';
import { PaymentRateType } from '~/models/common';
import { addJobToShortList, setSelectedFindJob } from '~/modules/candidateFindJobs/actions';
import { updateShortList } from '~/modules/shortlist/actions';
import { useDispatch } from '~/store';
import { Editor } from '~/view/components/editor';
import { Icon } from '~/view/components/icon';
import { Tag } from '~/view/components/tag';

import styles from './styles.scss';

type Props = {
  job: FindJob;
  onClick?: () => void;
  isShortListPage: boolean;
};

export const JobCard: React.FC<Props> = memo(function JobCard({ job, onClick, isShortListPage }) {
  const dispatch = useDispatch();
  const {
    positionName,
    projectTypeName,
    salary,
    location,
    description,
    positionTypeName,
    shortlist,
    id,
    paymentType,
  } = job;
  const prefix =
    positionTypeName === 'Permanent'
      ? 'year'
      : paymentType === PaymentRateType.DAILY
      ? 'day'
      : 'hour';

  const onCardClickHandler = (): void => {
    if (onClick) {
      dispatch(setSelectedFindJob(job));
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
    } else {
      dispatch(
        addJobToShortList.request({
          jobId: id,
          status: !shortlist,
        }),
      );
    }
  };

  return (
    <div onClick={onCardClickHandler} className={styles['card']}>
      <div className={styles['card__header']}>
        <div className={styles['card__title-wrapper']}>
          <h2 className={styles['card__title']}>{positionName}</h2>
          <button className={styles['card__shortlist-btn']} onClick={shortListHandler}>
            <Icon
              name={shortlist ? 'shortlist-filled' : 'shortlist'}
              className={styles['card__shortlist-icon']}
            />
          </button>
        </div>
        <div className={styles['card__location-info']}>
          <Icon className={styles['card__location-icon']} name="location" />
          <p className={styles['card__location']}>{location}</p>
        </div>
      </div>
      <div className={styles['card__description']}>
        <Editor rawContentState={description} readOnly />
      </div>
      <div className={styles['card__footer']}>
        <Tag variant="secondary" className={styles['card__tag']} text={projectTypeName} />
        <p className={styles['card__salary']}>
          ${salary} <span className={styles['card__salary-type']}>/{prefix}</span>
        </p>
      </div>
    </div>
  );
});
