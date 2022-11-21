import classNames from 'classnames';
import { endOfISOWeek, format } from 'date-fns';
import React, { memo, useCallback } from 'react';

import { AdminTimesheet } from '~/models/admin';
import { CandidateTimesheetStatus } from '~/models/candidate';
import { TimesheetStatus } from '~/models/company';
import {
  setSelectedAdminTimesheetId,
  toggleAdminTimesheetModal,
  updateAdminTimesheetStatus,
} from '~/modules/adminTimesheet/actions';
import { useDispatch } from '~/store';
import { DotsDropdown, DropdownItem } from '~/view/components/dots-dropdown';
import { Image } from '~/view/components/image';

import styles from './styles.scss';

type Props = {
  timesheet: AdminTimesheet;
};

export const AdminTimesheetCard: React.FC<Props> = memo(function AdminTimesheetCard({ timesheet }) {
  const {
    id,
    companyLogo,
    companyName,
    jobPosition,
    contractPrice,
    contractType,
    total,
    inTotal,
    candidatePrice,
    candidate,
    status,
    week,
    candidateInTotal,
  } = timesheet;

  const dispatch = useDispatch();

  const handleAdminTimesheetApprove = useCallback(
    timesheetId => {
      dispatch(
        updateAdminTimesheetStatus.request({
          timesheetId,
          status: TimesheetStatus.APPROVED,
        }),
      );
    },
    [dispatch],
  );

  const handleAdminTimesheetReject = useCallback(
    timesheetId => {
      dispatch(
        updateAdminTimesheetStatus.request({
          timesheetId,
          status: TimesheetStatus.REJECTED,
        }),
      );
    },
    [dispatch],
  );

  const dropdownItems: DropdownItem[] = [
    {
      label: 'Approved',
      onClick: () => handleAdminTimesheetApprove(id),
    },
    {
      label: 'Rejected',
      onClick: () => handleAdminTimesheetReject(id),
    },
  ];

  const onCardClick = (): void => {
    dispatch(setSelectedAdminTimesheetId(id));
    dispatch(toggleAdminTimesheetModal());
  };

  return (
    <div className={styles['page__timesheet-content-item']} onClick={onCardClick}>
      <div className={styles['page__timesheet-content-item-img']}>
        <Image type="company" alt="company" src={companyLogo} className="" />
        <p>{companyName}</p>
      </div>
      <p className={styles['page__timesheet-content-item-candidate']}>{candidate}</p>
      <p className={styles['page__timesheet-content-item-position']}>{jobPosition}</p>
      <p className={styles['page__timesheet-content-item-price']}>
        ${Number(contractPrice).toFixed(0)}
      </p>
      <p className={styles['page__timesheet-content-item-rate']}>
        ${Number(candidatePrice).toFixed(0)}
        <span>/{contractType}</span>
      </p>
      <p className={styles['page__timesheet-content-item-hours']}>{total}&nbsp;hour/day</p>
      <p className={styles['page__timesheet-content-item-candidate-in-total']}>
        ${Number(candidateInTotal).toFixed(0)}
      </p>
      <p className={styles['page__timesheet-content-item-company-in-total']}>
        ${Number(inTotal).toFixed(0)}
      </p>
      <p className={styles['page__timesheet-content-item-week']}>
        {week &&
          `${format(new Date(week), 'dd/MM/yyyy')} -
                  ${format(new Date(week && endOfISOWeek(new Date(week))), 'dd/MM/yyyy')}`}
      </p>
      <div className={styles['page__timesheet-content-item-time']}>Review</div>
      <div className={styles['page__timesheet-content-item-dots']}>
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
        <DotsDropdown
          className={styles['page__timesheet-content-item-dropdown']}
          items={dropdownItems}
        />
      </div>
    </div>
  );
});
