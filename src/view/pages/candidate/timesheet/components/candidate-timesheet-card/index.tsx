import classNames from 'classnames';
import React, { memo, useCallback } from 'react';

import { CandidateTimesheet, CandidateTimesheetStatus } from '~/models/candidate';
import {
  getCandidateTimesheetContract,
  setSelectedCandidateTimesheetId,
  toggleCandidateTimesheetModal,
  toggleTimesheetReviewContractModalVisibility,
} from '~/modules/candidateTimesheet/actions';
import { useDispatch } from '~/store';
import { Image } from '~/view/components/image';

import styles from './styles.scss';

type Props = {
  timesheet: CandidateTimesheet;
};

export const CandidateTimesheetCard: React.FC<Props> = memo(function CandidateTimesheetCard({
  timesheet,
}) {
  const {
    id,
    companyLogo,
    companyName,
    jobPosition,
    contract,
    contractPrice,
    total,
    inTotal,
    status,
    contractType,
  } = timesheet;
  const dispatch = useDispatch();

  const onCardClick = (): void => {
    dispatch(setSelectedCandidateTimesheetId(id));
    dispatch(toggleCandidateTimesheetModal());
  };

  const reviewContractHandler = useCallback(
    e => {
      e.stopPropagation();
      dispatch(
        getCandidateTimesheetContract.request({
          contractId: contract,
          isReview: true,
          onSuccess: () => {
            dispatch(toggleTimesheetReviewContractModalVisibility());
          },
        }),
      );
    },
    [dispatch, contract],
  );
  return (
    <div className={styles['page__timesheet-content-item']} onClick={onCardClick}>
      <div className={styles['page__timesheet-content-item-img']}>
        <Image type="company" alt="company" src={companyLogo} className="" />
        <p>{companyName}</p>
      </div>
      <p className={styles['page__timesheet-content-item-position']}>{jobPosition}</p>
      <div
        className={styles['page__timesheet-content-item-contract']}
        onClick={reviewContractHandler}
      >
        Review contract
      </div>
      <div className={styles['page__timesheet-content-item-rate']}>
        ${Number(contractPrice).toFixed(0)}
        <span>/{contractType}</span>
      </div>
      <p className={styles['page__timesheet-content-item-hours']}>{total}</p>
      <p className={styles['page__timesheet-content-item-inTotal']}>
        ${Number(inTotal).toFixed(0)}
      </p>
      <div className={styles['page__timesheet-content-item-time']}>Review</div>
      <p
        className={classNames(
          styles['page__timesheet-content-item-status'],
          status === CandidateTimesheetStatus.APPROVED
            ? styles['page__timesheet-content-item-status--approved']
            : status === CandidateTimesheetStatus.REJECTED
            ? styles['page__timesheet-content-item-status--rejected']
            : styles['page__timesheet-content-item-status--submitted'],
        )}
      >
        {status === CandidateTimesheetStatus.APPROVED
          ? 'Approved'
          : status === CandidateTimesheetStatus.REJECTED
          ? 'Rejected'
          : 'Submitted'}
      </p>
    </div>
  );
});
