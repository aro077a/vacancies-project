import { endOfISOWeek, format } from 'date-fns';
import React, { memo, useCallback, useEffect, useMemo } from 'react';

import {
  setSelectedCandidateTimesheetId,
  toggleCandidateTimesheetModal,
} from '~/modules/candidateTimesheet/actions';
import { useDispatch, useSelector } from '~/store';
import { RootState } from '~/store/types';
import { Icon } from '~/view/components/icon';
import { CenterModal } from '~/view/components/modals';

import styles from './styles.scss';
import { TimesheetCard } from './timesheet-card';

export const CandidateTimesheetModal: React.FC = memo(function CandidateTimesheetModal() {
  const dispatch = useDispatch();
  const { candidateTimesheet, candidateTimesheetModalVisibility, loadingCandidateTimesheetById } =
    useSelector((state: RootState) => state.candidateTimesheet);

  useEffect(() => {
    if (!candidateTimesheetModalVisibility) {
      dispatch(setSelectedCandidateTimesheetId(null));
    }
  }, [candidateTimesheetModalVisibility, dispatch]);

  const handleClose = useCallback(() => {
    dispatch(toggleCandidateTimesheetModal());
  }, [dispatch]);

  const totalHours = useMemo(
    () =>
      candidateTimesheet?.rows?.reduce((acc, nestedArr) => {
        nestedArr?.hours?.forEach(hour => {
          acc += +hour;
        });
        return acc;
      }, 0),
    [candidateTimesheet?.rows],
  );
  const totalDays = useMemo(
    () =>
      candidateTimesheet?.rows?.reduce((acc, nestedArr) => {
        nestedArr?.days?.forEach(day => {
          acc += Number(day);
        });
        return acc;
      }, 0),

    [candidateTimesheet?.rows],
  );

  return (
    <CenterModal
      title=""
      className={styles['timesheet-modal']}
      visible={candidateTimesheetModalVisibility}
      onClose={handleClose}
    >
      <>
        <div className={styles['timesheet-modal__title']}>
          <h1>Timesheet</h1>
          <div className={styles['timesheet-modal__title-week']}>
            <Icon name="calendar" className={styles['timesheet-modal__title-week-icon']} />
            <p>
              {candidateTimesheet?.week &&
                `${format(new Date(candidateTimesheet?.week), 'dd/MM/yyyy')} -
                  ${format(
                    new Date(
                      candidateTimesheet?.week && endOfISOWeek(new Date(candidateTimesheet?.week)),
                    ),
                    'dd/MM/yyyy',
                  )}`}
            </p>
          </div>
        </div>
        <div className={styles['timesheet-modal__body']}>
          <div className={styles['timesheet-modal__body--content']}>
            <TimesheetCard
              candidateTimesheet={candidateTimesheet}
              loadingCandidateTimesheetById={loadingCandidateTimesheetById}
            />
          </div>
          <div className={styles['timesheet-modal__body-footer']}>
            <div className={styles['timesheet-modal__body-footer--total']}>
              {candidateTimesheet?.contractType === 'hour' ? (
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
