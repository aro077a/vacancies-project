import { endOfISOWeek, format } from 'date-fns';
import React, { memo, useCallback, useEffect } from 'react';

import { TimesheetStatus } from '~/models/company';
import {
  setSelectedTimesheetId,
  toggleTimesheetModal,
  updateTimesheetStatus,
} from '~/modules/companyTimesheet/actions';
import { useDispatch, useSelector } from '~/store';
import { RootState } from '~/store/types';
import { Button } from '~/view/components/button';
import { Icon } from '~/view/components/icon';
import { CenterModal } from '~/view/components/modals';

import styles from './styles.scss';
import { TimesheetCard } from './timesheet-card';

export const TimesheetModal: React.FC = memo(function TimesheetModal() {
  const dispatch = useDispatch();
  const {
    companyTimesheet,
    loadingCompanyTimesheet,
    timesheetModalVisibility,
    selectedTimesheetId,
    updatingTimesheetStatusAsApprovedLoading,
    updatingTimesheetStatusAsRejectedLoading,
  } = useSelector((state: RootState) => state.companyTimesheet);

  useEffect(() => {
    if (!timesheetModalVisibility) {
      dispatch(setSelectedTimesheetId(null));
    }
  }, [timesheetModalVisibility, dispatch]);

  const handleClose = useCallback(() => {
    dispatch(toggleTimesheetModal());
  }, [dispatch]);

  const handleTimesheetApprove = useCallback(() => {
    dispatch(
      updateTimesheetStatus.request({
        timesheetId: selectedTimesheetId!,
        status: TimesheetStatus.APPROVED,
      }),
    );
  }, [dispatch, selectedTimesheetId]);

  const handleTimesheetReject = useCallback(() => {
    dispatch(
      updateTimesheetStatus.request({
        timesheetId: selectedTimesheetId!,
        status: TimesheetStatus.REJECTED,
      }),
    );
  }, [dispatch, selectedTimesheetId]);

  return (
    <CenterModal
      title=""
      className={styles['timesheet-modal']}
      visible={timesheetModalVisibility}
      onClose={handleClose}
    >
      <>
        <div className={styles['timesheet-modal__title']}>
          <h1>Timesheet</h1>
          <div className={styles['timesheet-modal__title-week']}>
            <Icon name="calendar" className={styles['timesheet-modal__title-week-icon']} />
            <p>
              {companyTimesheet?.week &&
                `${format(new Date(companyTimesheet?.week), 'dd/MM/yyyy')} -
                  ${format(
                    new Date(
                      companyTimesheet?.week && endOfISOWeek(new Date(companyTimesheet?.week)),
                    ),
                    'dd/MM/yyyy',
                  )}`}
            </p>
          </div>
        </div>
        <div className={styles['timesheet-modal__body']}>
          <div className={styles['timesheet-modal__body--content']}>
            <TimesheetCard
              companyTimesheet={companyTimesheet}
              loadingCompanyTimesheet={loadingCompanyTimesheet}
            />
          </div>
          <div className={styles['timesheet-modal__body-footer']}>
            <div className={styles['timesheet-modal__body-footer--total']}>
              {companyTimesheet?.contractType === 'hour' ? (
                <p>
                  Total time: <span>{companyTimesheet?.total}h</span>
                </p>
              ) : (
                <p>
                  Total days: <span>{companyTimesheet?.total}d</span>
                </p>
              )}
            </div>
            <div className={styles['timesheet-modal__body-footer--buttons']}>
              <Button
                loading={updatingTimesheetStatusAsApprovedLoading}
                title="Approve"
                variant="accent"
                onClick={handleTimesheetApprove}
              />
              <Button
                loading={updatingTimesheetStatusAsRejectedLoading}
                title="Reject"
                variant="secondary"
                onClick={handleTimesheetReject}
              />
            </div>
          </div>
        </div>
      </>
    </CenterModal>
  );
});
