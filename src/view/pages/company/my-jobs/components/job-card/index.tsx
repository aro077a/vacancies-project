import React, { memo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { PaymentRateType } from '~/models/common';
import { MyJob } from '~/models/company';
import { deleteMyJob, setSelectedJob } from '~/modules/companyMyJobs/actions';
import { useDispatch } from '~/store';
import { CommonRouter } from '~/utils/router';
import { DotsDropdown, DropdownItem } from '~/view/components/dots-dropdown';
import { Editor } from '~/view/components/editor';
import { Icon } from '~/view/components/icon';
import { Tag } from '~/view/components/tag';

import styles from './styles.scss';

type Props = {
  onClick: () => void;
  job: MyJob;
};

export const JobCard: React.FC<Props> = memo(function JobCard({ job, onClick }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    positionName,
    matchedCount,
    description,
    projectTypeName,
    salary,
    positionTypeName,
    id,
    status,
    paymentType,
  } = job;

  const prefix =
    positionTypeName === 'Permanent'
      ? 'year'
      : paymentType === PaymentRateType.DAILY
      ? 'day'
      : 'hour';

  const onCardClickHandler = (): void => {
    dispatch(setSelectedJob(job));
    onClick();
  };

  const deleteHandler = useCallback(() => {
    dispatch(deleteMyJob.request({ jobId: id, status }));
  }, [dispatch, id, status]);

  const editJobHandler = useCallback(() => {
    history.push(CommonRouter.editJob.getBase(id));
  }, [history, id]);

  const items: DropdownItem[] = [
    {
      label: 'Edit Job Details',
      icon: 'pencil',
      onClick: () => editJobHandler(),
    },
    {
      label: 'Delete Job',
      icon: 'delete',
      iconType: 'danger',
      onClick: () => deleteHandler(),
    },
  ];

  return (
    <div onClick={onCardClickHandler} className={styles['card']}>
      <div className={styles['card__body']}>
        <h2 className={styles['card__position-name']}>{positionName}</h2>
        <div className={styles['card__matched']}>
          <Icon className={styles['card__user-icon']} name="user-outline" />
          <p className={styles['card__matched-info']}>
            <span className={styles['card__matched-count']}>{matchedCount} </span>
            candidates matched
          </p>
        </div>
      </div>
      <div className={styles['card__description']}>
        <Editor rawContentState={description} readOnly />
      </div>
      <div className={styles['card__footer']}>
        <Tag className={styles['card__tag']} variant="secondary" text={projectTypeName} />
        <p className={styles['card__salary']}>
          ${salary} <span className={styles['card__salary-type']}>/{prefix}</span>
        </p>
      </div>
      <DotsDropdown className={styles['card__dropdown']} items={items} />
    </div>
  );
});
