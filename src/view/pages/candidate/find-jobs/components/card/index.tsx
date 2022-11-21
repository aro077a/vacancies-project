import React, { BaseSyntheticEvent, memo } from 'react';

import { FindJob, LoggedInCandidateStatus } from '~/models/candidate';
import { PaymentRateType } from '~/models/common';
import { addJobToShortList, setSelectedFindJob } from '~/modules/candidateFindJobs/actions';
import { useDispatch, useSelector } from '~/store';
import { Editor } from '~/view/components/editor';
import { Icon } from '~/view/components/icon';
import { Image } from '~/view/components/image';

import styles from './styles.scss';

type Props = {
  job: FindJob;
  onClick?: () => void;
};

export const Card: React.FC<Props> = memo(function Card({ job, onClick }) {
  const dispatch = useDispatch();
  const { userStatus } = useSelector(state => state.candidateUser);

  const isCandidateApproved = userStatus === LoggedInCandidateStatus.APPROVED;

  const {
    positionName,
    projectTypeName,
    salary,
    location,
    description,
    positionTypeName,
    shortlist,
    id,
    companyLogo,
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
    dispatch(
      addJobToShortList.request({
        jobId: id,
        status: !shortlist,
      }),
    );
  };

  return (
    <div onClick={() => isCandidateApproved && onCardClickHandler()} className={styles['card']}>
      <div className={styles['card__header']}>
        <Image className={styles['card__logo']} alt="company" type="company" src={companyLogo} />
        <h2 className={styles['card__position-name']}>{positionName}</h2>
        <button
          className={styles['card__shortlist-btn']}
          onClick={e => isCandidateApproved && shortListHandler(e)}
        >
          <Icon
            name={shortlist ? 'shortlist-filled' : 'shortlist'}
            className={styles['card__shortlist-icon']}
          />
        </button>
      </div>
      <div className={styles['card__description']}>
        <Editor rawContentState={description} readOnly />
      </div>
      <div className={styles['card__footer']}>
        <div className={styles['card__label']}>
          <Icon className={styles['card__label-icon']} name="location" />
          <p className={styles['card__label-text']}>{location}</p>
        </div>
        <div className={styles['card__label']}>
          <Icon className={styles['card__label-icon']} name="job-type" />
          <p className={styles['card__label-text']}>{projectTypeName}</p>
        </div>
        <div className={styles['card__label']}>
          <Icon className={styles['card__label-icon']} name="pocket" />
          <p className={styles['card__label-text']}>
            ${salary} <span>/{prefix}</span>
          </p>
        </div>
      </div>
    </div>
  );
});
