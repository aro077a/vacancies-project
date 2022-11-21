import './styles.css';

import classNames from 'classnames';
import React, { memo, useCallback, useState } from 'react';

import { CandidateTimesheetStatus } from '~/models/candidate';
import { CompanyTimesheet, TimesheetStatus } from '~/models/company';
import {
  setSelectedTimesheetId,
  toggleTimesheetModal,
  updateTimesheetStatus,
} from '~/modules/companyTimesheet/actions';
import { useDispatch } from '~/store';
import { DotsDropdown, DropdownItem } from '~/view/components/dots-dropdown';

import styles from './styles.scss';
import { TimesheetApprovedModal } from './time-entry-submitted-modal';

type Props = {
  timesheet: CompanyTimesheet;
};

export const CompanyTimesheetCard: React.FC<Props> = memo(function CompanyTimesheetCard({
  timesheet,
}) {
  const [timesheetApprovedVisible, setTimesheetApprovedModalVisible] = useState(false);
  const { id, candidate, location, contractPrice, total, jobPosition, status, contractType } =
    timesheet;

  const dispatch = useDispatch();

  const handleTimesheetApprove = useCallback(
    timesheetId => {
      dispatch(
        updateTimesheetStatus.request({
          timesheetId,
          status: TimesheetStatus.APPROVED,
        }),
      );
    },
    [dispatch],
  );

  const handleTimesheetReject = useCallback(
    timesheetId => {
      dispatch(
        updateTimesheetStatus.request({
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
      onClick: () => handleTimesheetApprove(id),
    },
    {
      label: 'Rejected',
      onClick: () => handleTimesheetReject(id),
    },
  ];

  const onCardClick = (): void => {
    dispatch(setSelectedTimesheetId(id));
    dispatch(toggleTimesheetModal());
  };

  const toggleTimesheetApprovedModalVisibility = useCallback(() => {
    setTimesheetApprovedModalVisible(prevValue => !prevValue);
  }, []);

  return (
    <div
      onClick={onCardClick}
      id={String(timesheet.id)}
      className={styles['page__timesheet-content-item']}
    >
      <div className={styles['page__timesheet-content-item-body']}>
        <p className={styles['page__timesheet-content-item-body-candidate']}>{candidate}</p>
        <div className={styles['page__timesheet-content-item-body-mobile']}>
          <p className={styles['page__timesheet-content-item-body-mobile-candidate']}>
            {candidate}
          </p>
          <p className={styles['page__timesheet-content-item-body-mobile-rate']}>
            ${Number(contractPrice).toFixed(0)} <span>/{contractType}</span>
          </p>
        </div>
        <p className={styles['page__timesheet-content-item-body-location']}>{location}</p>
        <p className={styles['page__timesheet-content-item-body-position']}>{jobPosition}</p>
        <p className={styles['page__timesheet-content-item-body-rate']}>
          ${Number(contractPrice).toFixed(0)}
          <span>/{contractType}</span>
        </p>
        <p className={styles['page__timesheet-content-item-body-total']}>
          {total}
          {contractType === 'day' ? 'd' : 'h'}
        </p>
      </div>
      <div className={styles['page__timesheet-content-item-review']}>Review</div>
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
      <TimesheetApprovedModal
        visible={timesheetApprovedVisible}
        onClose={toggleTimesheetApprovedModalVisibility}
      />
    </div>
  );
});
