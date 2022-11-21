import React, { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { AdminTimesheet } from '~/models/admin';
import { CandidateTimesheetStatus } from '~/models/candidate';
import {
  getAdminTimesheet,
  getCandidatesAndCompaniesWithTimesheet,
  resetTimesheetFilters,
  setCandidate,
  setCompany,
  setStatus,
  setWeek,
} from '~/modules/adminTimesheet/actions';
import { useDispatch, useSelector } from '~/store';
import { RootState } from '~/store/types';
import { Button } from '~/view/components/button';
import { Icon } from '~/view/components/icon';
import { Loader } from '~/view/components/loader';
import { SelectOption } from '~/view/components/select';
import { usePaginatedDataScrollList } from '~/view/hooks/usePaginatedDataScrollList';

import { AdminTimesheetCard } from './components/admin-timesheet-card';
import { CreateEntryModal } from './components/create-entry-modal';
import { CustomSelect } from './components/custom-select';
import { CustomDayPicker } from './components/day-picker';
import { TimeEntrySubmittedModal } from './components/time-entry-submitted-modal';
import { AdminTimesheetModal } from './components/timesheet-review-modal';
import styles from './styles.scss';

const statusOptions: SelectOption[] = [
  {
    value: CandidateTimesheetStatus.APPROVED,
    label: 'Approved',
  },
  {
    value: CandidateTimesheetStatus.REJECTED,
    label: 'Rejected',
  },
  {
    value: CandidateTimesheetStatus.SUBMITTED,
    label: 'Submitted',
  },
];

export const AdminTimesheetPage: React.FC<RouteComponentProps> = () => {
  const [createEntryModalVisible, setCreateEntryModalVisible] = useState(false);
  const [timeEntryModalVisible, setTimeEntryModalVisible] = useState(false);
  const {
    adminTimesheetList,
    loadingAdminTimesheet,
    searchByTimesheetStatus,
    searchByCompany,
    companiesWithTimesheet,
    candidatesWithTimesheet,
    searchByCandidate,
    searchByWeek,
  } = useSelector((state: RootState) => state.adminTimesheet);
  const dispatch = useDispatch();
  const { scrollListRef } = usePaginatedDataScrollList<HTMLDivElement>({
    useWindowScroll: true,
    loadingData: loadingAdminTimesheet,
    fetchDataFn: useCallback(
      initialFetch => {
        dispatch(getAdminTimesheet.init({ initialFetch }));
      },
      [dispatch],
    ),
  });

  const toggleCreateEntryModalVisibility = useCallback(() => {
    setCreateEntryModalVisible(prevValue => !prevValue);
  }, []);

  const toggleTimeEntryModalVisibility = useCallback(() => {
    setTimeEntryModalVisible(prevValue => !prevValue);
  }, []);

  const handleStatusChange = useCallback(
    (option: SelectOption) => {
      dispatch(setStatus(option));
      dispatch(getAdminTimesheet.init({ initialFetch: true }));
    },
    [dispatch],
  );

  const handleCompanyChange = useCallback(
    (option: SelectOption) => {
      dispatch(setCompany(option));
      dispatch(getAdminTimesheet.init({ initialFetch: true }));
    },
    [dispatch],
  );

  const handleCandidateChange = useCallback(
    (option: SelectOption) => {
      dispatch(setCandidate(option));
      dispatch(getAdminTimesheet.init({ initialFetch: true }));
    },
    [dispatch],
  );

  const handleDateChange = useCallback(
    (date: Date) => {
      dispatch(setWeek(date));
      dispatch(getAdminTimesheet.init({ initialFetch: true }));
    },
    [dispatch],
  );

  const handleClear = useCallback(() => {
    dispatch(resetTimesheetFilters());
    dispatch(getAdminTimesheet.init({ initialFetch: true }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCandidatesAndCompaniesWithTimesheet());
  }, [dispatch]);

  return (
    <div className={styles['page']}>
      <div className={styles['page__header-wrapper']}>
        <h1 className={styles['page__title']}>Timesheet</h1>
        {candidatesWithTimesheet.length > 0 && (
          <Button
            variant="accent"
            title="Create an entry"
            onClick={toggleCreateEntryModalVisibility}
          />
        )}
      </div>
      <div className={styles['page__filters']}>
        <CustomSelect
          onChange={handleStatusChange}
          icon="job-type"
          defaultValue={searchByTimesheetStatus}
          selectOptions={statusOptions}
          value={searchByTimesheetStatus}
        />
        <CustomSelect
          onChange={handleCompanyChange}
          icon="building"
          defaultValue={searchByCompany}
          selectOptions={companiesWithTimesheet}
          value={searchByCompany}
        />
        <CustomSelect
          onChange={handleCandidateChange}
          icon="user"
          defaultValue={searchByCandidate}
          selectOptions={candidatesWithTimesheet}
          value={searchByCandidate}
        />
        <CustomDayPicker value={searchByWeek} onChange={handleDateChange} />
        <Button
          onClick={handleClear}
          className={styles['page__clear-btn']}
          title="Clear"
          variant="secondary"
        />
      </div>
      <div className={styles['page__timesheet']}>
        <div className={styles['page__timesheet-header']}>
          <div className={styles['page__timesheet-header-company-name']}>
            <p>Company</p>
          </div>
          <div className={styles['page__timesheet-header-contract']}>
            <p>Candidate</p>
          </div>
          <div className={styles['page__timesheet-header-job-position']}>
            <p>Job position</p>
          </div>
          <div className={styles['page__timesheet-header-price']}>
            <p>Company rate</p>
          </div>
          <div className={styles['page__timesheet-header-rate']}>
            <p>Candidate rate</p>
          </div>
          <div className={styles['page__timesheet-header-total-hours']}>
            <p>Total</p>
            <Icon
              name="double-arrow"
              className={styles['page__timesheet-header-total-hours-arrow']}
            />
          </div>
          <div className={styles['page__timesheet-header-candidate-in-total']}>
            <p>Candidate In Total</p>
            <Icon
              name="double-arrow"
              className={styles['page__timesheet-header-candidate-in-total-arrow']}
            />
          </div>
          <div className={styles['page__timesheet-header-company-in-total']}>
            <p>Company In Total</p>
            <Icon
              name="double-arrow"
              className={styles['page__timesheet-header-company-in-total-arrow']}
            />
          </div>
          <div className={styles['page__timesheet-header-week']}>
            <p>Week</p>
            <Icon name="double-arrow" className={styles['page__timesheet-header-week-arrow']} />
          </div>
          <div className={styles['page__timesheet-header-time']}>
            <p>Timesheet</p>
          </div>
          <div className={styles['page__timesheet-header-status']}>
            <p>Status</p>
            <Icon name="double-arrow" className={styles['page__timesheet-header-status-arrow']} />
          </div>
        </div>
        <div className={styles['page__timesheet-content']}>
          {!loadingAdminTimesheet && !adminTimesheetList.results.length ? (
            <div ref={scrollListRef} className={styles['page__timesheet-content-not-found']}>
              No timesheet found
            </div>
          ) : (
            <div ref={scrollListRef} className={styles['page__timesheet-content-items']}>
              {adminTimesheetList.results.map((timesheet: AdminTimesheet) => (
                <AdminTimesheetCard key={timesheet.id} timesheet={timesheet} />
              ))}
              {loadingAdminTimesheet && (
                <div className={styles['page__timesheet-content-items-loader']}>
                  <Loader loading />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <AdminTimesheetModal />
      <CreateEntryModal
        visible={createEntryModalVisible}
        openSubmitModal={toggleTimeEntryModalVisibility}
        onClose={toggleCreateEntryModalVisibility}
      />
      <TimeEntrySubmittedModal
        visible={timeEntryModalVisible}
        onClose={toggleTimeEntryModalVisibility}
      />
    </div>
  );
};
