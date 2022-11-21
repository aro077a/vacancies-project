import React, { useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { CompanyTimesheet } from '~/models/company';
import { getCompanyTimesheet } from '~/modules/companyTimesheet/actions';
import { useDispatch, useSelector } from '~/store';
import { RootState } from '~/store/types';
import { Icon } from '~/view/components/icon';
import { Loader } from '~/view/components/loader';
import { usePaginatedDataScrollList } from '~/view/hooks/usePaginatedDataScrollList';

import { CompanyTimesheetCard } from './components/company-timesheet-card';
import { TimesheetModal } from './components/company-timesheet-card/timesheet-modal';
import styles from './styles.scss';

export const CompanyTimesheetPage: React.FC<RouteComponentProps> = () => {
  const { companyTimesheetList, loadingCompanyTimesheetList } = useSelector(
    (state: RootState) => state.companyTimesheet,
  );
  const dispatch = useDispatch();
  const { scrollListRef } = usePaginatedDataScrollList<HTMLDivElement>({
    useWindowScroll: true,
    loadingData: loadingCompanyTimesheetList,
    fetchDataFn: useCallback(
      initialFetch => {
        dispatch(getCompanyTimesheet.init({ initialFetch }));
      },
      [dispatch],
    ),
  });

  return (
    <div className={styles['page']}>
      <div className={styles['page__header-wrapper']}>
        <h1>Timesheet</h1>
      </div>
      <div className={styles['page__timesheet']}>
        <div className={styles['page__timesheet-header']}>
          <div className={styles['page__timesheet-header-candidate']}>
            <p>Candidate</p>
            <Icon
              name="double-arrow"
              className={styles['page__timesheet-header-candidate-arrow']}
            />
          </div>
          <div className={styles['page__timesheet-header-location']}>
            <p>Location</p>
            <Icon name="double-arrow" className={styles['page__timesheet-header-location-arrow']} />
          </div>
          <div className={styles['page__timesheet-header-position']}>
            <p>Position</p>
            <Icon name="double-arrow" className={styles['page__timesheet-header-position-arrow']} />
          </div>
          <div className={styles['page__timesheet-header-rate']}>
            <p>Rate</p>
          </div>
          <div className={styles['page__timesheet-header-total-hours']}>
            <p>Total time</p>
          </div>
          <div className={styles['page__timesheet-header-review']}>
            <p>Timesheet</p>
          </div>
          <div className={styles['page__timesheet-header-status']}>
            <p>Status</p>
            <Icon name="double-arrow" className={styles['page__timesheet-header-status-arrow']} />
          </div>
        </div>
        <div className={styles['page__timesheet-content']}>
          {!loadingCompanyTimesheetList && !companyTimesheetList.results.length ? (
            <div ref={scrollListRef} className={styles['page__timesheet-content-not-found']}>
              No company timesheet found
            </div>
          ) : (
            <div ref={scrollListRef} className={styles['page__timesheet-content-items']}>
              {companyTimesheetList.results.map((timesheet: CompanyTimesheet) => (
                <CompanyTimesheetCard key={timesheet.id} timesheet={timesheet} />
              ))}
              {loadingCompanyTimesheetList && (
                <div className={styles['page__timesheet-content-items-loader']}>
                  <Loader loading />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <TimesheetModal />
    </div>
  );
};
