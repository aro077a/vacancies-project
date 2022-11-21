import React, { useCallback, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { CandidateTimesheet } from '~/models/candidate';
import {
  getCandidateTimesheet,
  toggleTimesheetReviewContractModalVisibility,
} from '~/modules/candidateTimesheet/actions';
import { useDispatch, useSelector } from '~/store';
import { RootState } from '~/store/types';
import { Button } from '~/view/components/button';
import { Icon } from '~/view/components/icon';
import { Loader } from '~/view/components/loader';
import { usePaginatedDataScrollList } from '~/view/hooks/usePaginatedDataScrollList';

import { CandidateTimesheetCard } from './components/candidate-timesheet-card';
import { ReviewTimesheetContractModal } from './components/candidate-timesheet-card/review-contract-modal';
import { TimeEntrySubmittedModal } from './components/candidate-timesheet-card/time-entry-submitted-modal';
import { CandidateTimesheetModal } from './components/candidate-timesheet-card/timesheet-review-modal';
import { CreateEntryModal } from './components/create-entry-modal/index';
import styles from './styles.scss';

export const CandidateTimesheetPage: React.FC<RouteComponentProps> = () => {
  const [createEntryModalVisible, setCreateEntryModalVisible] = useState(false);
  const [timeEntryModalVisible, setTimeEntryModalVisible] = useState(false);
  const {
    candidateTimesheetList,
    loadingCandidateTimesheet,
    candidatePipeline,
    reviewTimesheetContractModalVisibility,
    candidateContract,
    loadingCandidateContract,
  } = useSelector((state: RootState) => state.candidateTimesheet);
  const dispatch = useDispatch();
  const { scrollListRef } = usePaginatedDataScrollList<HTMLDivElement>({
    useWindowScroll: true,
    loadingData: loadingCandidateTimesheet,
    fetchDataFn: useCallback(
      initialFetch => {
        dispatch(getCandidateTimesheet.init({ initialFetch }));
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

  const handleClose = useCallback(() => {
    dispatch(toggleTimesheetReviewContractModalVisibility());
  }, [dispatch]);

  return (
    <div className={styles['page']}>
      <div className={styles['page__header-wrapper']}>
        <h1 className={styles['page__title']}>Timesheet</h1>
        {candidatePipeline.results.length ? (
          <Button
            variant="accent"
            title="Create an entry"
            onClick={toggleCreateEntryModalVisibility}
          />
        ) : (
          <></>
        )}
      </div>
      {loadingCandidateContract ? (
        <Loader loading />
      ) : (
        <div className={styles['page__timesheet']}>
          <div className={styles['page__timesheet-header']}>
            <div className={styles['page__timesheet-header-company-name']}>
              <p>Company</p>
            </div>
            <div className={styles['page__timesheet-header-job-position']}>
              <p>Job position</p>
            </div>
            <div className={styles['page__timesheet-header-contract']}>
              <p>Contract</p>
            </div>
            <div className={styles['page__timesheet-header-rate']}>
              <p>Rate</p>
            </div>
            <div className={styles['page__timesheet-header-total-hours']}>
              <p>Total Hours</p>
              <Icon
                name="double-arrow"
                className={styles['page__timesheet-header-total-hours-arrow']}
              />
            </div>
            <div className={styles['page__timesheet-header-in-total']}>
              <p>In Total</p>
              <Icon
                name="double-arrow"
                className={styles['page__timesheet-header-in-total-arrow']}
              />
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
            {!loadingCandidateTimesheet && !candidateTimesheetList.results.length ? (
              <div ref={scrollListRef} className={styles['page__timesheet-content-not-found']}>
                No candidate timesheet found
              </div>
            ) : (
              <div ref={scrollListRef} className={styles['page__timesheet-content-items']}>
                {candidateTimesheetList.results.map((timesheet: CandidateTimesheet) => (
                  <CandidateTimesheetCard key={timesheet.id} timesheet={timesheet} />
                ))}
                {loadingCandidateTimesheet && (
                  <div className={styles['page__timesheet-content-items-loader']}>
                    <Loader loading />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      <CreateEntryModal
        visible={createEntryModalVisible}
        openSubmitModal={toggleTimeEntryModalVisibility}
        onClose={toggleCreateEntryModalVisibility}
      />
      <TimeEntrySubmittedModal
        visible={timeEntryModalVisible}
        onClose={toggleTimeEntryModalVisibility}
      />
      <CandidateTimesheetModal />
      <ReviewTimesheetContractModal
        visible={reviewTimesheetContractModalVisibility}
        onClose={handleClose}
        candidateContract={candidateContract}
      />
    </div>
  );
};
