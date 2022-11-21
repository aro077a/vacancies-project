import React, { memo, useCallback, useEffect } from 'react';

import { Scoreboard as ScoreboardItems } from '~/models/admin';
import {
  getAdminDashboardScoreboard,
  setScoreboardItem,
  setSelectedMonth,
  setSelectedYear,
} from '~/modules/adminDashboard/actions';
import { useDispatch, useSelector } from '~/store';
import { RootState } from '~/store/types';
import { Button } from '~/view/components/button';
import { Loader } from '~/view/components/loader';

import { DatePicker } from './components/date-picker';
import { ScoreboardItem } from './components/scoreboard-item';
import styles from './styles.scss';

export const Scoreboard: React.FC<{ toggleDetailsModal: () => void }> = memo(function Scoreboard({
  toggleDetailsModal,
}) {
  const { dashboardScoreboard, loadingScoreboard, selectedYear, selectedMonth } = useSelector(
    (state: RootState) => state.adminDashboard,
  );

  const dispatch = useDispatch();

  const handleSortDateChange = useCallback(
    (date: string | number) => {
      dispatch(setSelectedMonth(date));
      if (typeof date === 'string') {
        const monthNumber = Date.parse(`${date}1, 2011`);
        if (!Number.isNaN(monthNumber)) {
          return dispatch(
            getAdminDashboardScoreboard.request({
              date: { month: new Date(monthNumber).getMonth() + 1 },
            }),
          );
        }
        return -1;
      }

      dispatch(setSelectedYear(date));
      return dispatch(
        getAdminDashboardScoreboard.request({
          date: { year: date },
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(
      getAdminDashboardScoreboard.request({
        date: { year: Number(selectedYear) },
      }),
    );
  }, [dispatch]);

  const handleScoreboardDetailsLoad = useCallback(
    (id: ScoreboardItems) => {
      dispatch(setScoreboardItem(id));
      toggleDetailsModal();
    },
    [dispatch, toggleDetailsModal],
  );

  return (
    <div className={styles['scoreboard']}>
      {loadingScoreboard ? (
        <Loader loading />
      ) : (
        <>
          <div className={styles['scoreboard__title-wrapper']}>
            <h4 className={styles['scoreboard__title']}>Scoreboard</h4>
            <div className={styles['scoreboard__sort-wrapper']}>
              <p className={styles['scoreboard__sort-text']}>Sort by</p>
              <DatePicker
                selectedDate={selectedMonth || selectedYear}
                onChange={handleSortDateChange}
              />
            </div>
          </div>
          <div className={styles['scoreboard__body-wrapper']}>
            <ScoreboardItem
              onClick={() => handleScoreboardDetailsLoad(ScoreboardItems.Jobs)}
              name="Jobs Added"
              icon="bag"
              statics={dashboardScoreboard?.jobs}
            />
            <div className={styles['scoreboard__separator']} />
            <ScoreboardItem
              onClick={() => handleScoreboardDetailsLoad(ScoreboardItems.Interviews)}
              name="Interviews Arranged"
              icon="chat"
              statics={dashboardScoreboard?.interviews}
            />
            <div className={styles['scoreboard__separator']} />
            <ScoreboardItem
              onClick={() => handleScoreboardDetailsLoad(ScoreboardItems.Placements)}
              name="Placements made"
              icon="bag-with-checkmark"
              statics={dashboardScoreboard?.placements}
            />
            <div className={styles['scoreboard__separator']} />
            <ScoreboardItem
              onClick={() => handleScoreboardDetailsLoad(ScoreboardItems.Revenues)}
              name="Revenue generated"
              icon="checkmark-in-circle"
              statics={`$ ${dashboardScoreboard?.revenue}`}
            />
            <div className={styles['scoreboard__separator']} />
            <ScoreboardItem
              onClick={() => handleScoreboardDetailsLoad(ScoreboardItems.TempWorks)}
              name="Temps working"
              icon="man-in-hat"
              statics={dashboardScoreboard?.tempsWorking}
            />
            <Button
              title="Download Report"
              size="medium"
              className={styles['scoreboard__download-report-button']}
              inlineIcon="download"
              inlineIconClassName={styles['scoreboard__download-report-icon']}
            />
          </div>
        </>
      )}
    </div>
  );
});
