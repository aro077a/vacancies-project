import { endOfISOWeek, format } from 'date-fns';
import React, { memo, useCallback, useEffect, useMemo } from 'react';

import {
  setSelectedAdminTimesheetId,
  toggleAdminTimesheetModal,
} from '~/modules/adminTimesheet/actions';
import { useDispatch, useSelector } from '~/store';
import { RootState } from '~/store/types';
import { Icon } from '~/view/components/icon';
import { CenterModal } from '~/view/components/modals';

import styles from './styles.scss';
import { TimesheetCard } from './timesheet-card';

export const AdminTimesheetModal: React.FC = memo(function CandidateTimesheetModal() {
  const dispatch = useDispatch();
  const { adminTimesheet, adminTimesheetModalVisibility, loadingAdminTimesheetById } = useSelector(
    (state: RootState) => state.adminTimesheet,
  );

  useEffect(() => {
    if (!adminTimesheetModalVisibility) {
      dispatch(setSelectedAdminTimesheetId(null));
    }
  }, [adminTimesheetModalVisibility, dispatch]);

  const handleClose = useCallback(() => {
    dispatch(toggleAdminTimesheetModal());
  }, [dispatch]);

  const totalHours = useMemo(
    () =>
      adminTimesheet?.rows?.reduce((acc, nestedArr) => {
        nestedArr?.hours?.forEach(hour => {
          acc += +hour;
        });
        return acc;
      }, 0),
    [adminTimesheet?.rows],
  );
  const totalDays = useMemo(
    () =>
      adminTimesheet?.rows?.reduce((acc, nestedArr) => {
        nestedArr?.days?.forEach(day => {
          acc += Number(day);
        });
        return acc;
      }, 0),

    [adminTimesheet?.rows],
  );

  return (
    <CenterModal
      title=""
      className={styles['timesheet-modal']}
      visible={adminTimesheetModalVisibility}
      onClose={handleClose}
    >
      <>
        <div className={styles['timesheet-modal__title']}>
          <h1>Timesheet</h1>
          <div className={styles['timesheet-modal__title-week']}>
            <Icon name="calendar" className={styles['timesheet-modal__title-week-icon']} />
            <p>
              {adminTimesheet?.week &&
                `${format(new Date(adminTimesheet?.week), 'dd/MM/yyyy')} -
                  ${format(
                    new Date(adminTimesheet?.week && endOfISOWeek(new Date(adminTimesheet?.week))),
                    'dd/MM/yyyy',
                  )}`}
            </p>
          </div>
        </div>
        <div className={styles['timesheet-modal__body']}>
          <div className={styles['timesheet-modal__body--content']}>
            <TimesheetCard
              adminTimesheet={adminTimesheet}
              loadingCandidateTimesheetById={loadingAdminTimesheetById}
            />
          </div>
          <div className={styles['timesheet-modal__body-footer']}>
            <div className={styles['timesheet-modal__body-footer--total']}>
              {adminTimesheet?.contractType === 'hour' ? (
                <p>
                  Total time: <span>{totalHours}h</span>
                </p>
              ) : (
                <p>
                  Total days: <span>{totalDays}d</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </>
    </CenterModal>
  );
});
