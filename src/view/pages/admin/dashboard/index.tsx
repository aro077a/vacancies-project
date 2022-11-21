import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import { getAdminDashboardScoreboardBillings, resetErrors } from '~/modules/adminDashboard/actions';
import { useSelector } from '~/store';
import { RootState } from '~/store/types';
import { Button } from '~/view/components/button';
import { Loader } from '~/view/components/loader';
import { Tab, Tabs } from '~/view/components/tabs';

import { DashboardDetailsModal } from './components/dashboard-details-modal';
import { PaymentReport } from './components/payment-report';
import { Scoreboard } from './components/scoreboard';
import { SendResumeModal } from './components/send-resume-modal';
import { Tasks } from './components/tasks';
import styles from './styles.scss';

export const DashboardPage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(1);
  const [sendResumeModalVisible, setSendResumeModalVisible] = useState(false);
  const [dashboardDetailsModalVisible, setDashboardDetailsModalVisible] = useState(false);

  const { loadingScoreboardBillings, dashboardScoreboardBillings } = useSelector(
    (state: RootState) => state.adminDashboard,
  );

  useEffect(() => {
    if (!sendResumeModalVisible) {
      dispatch(resetErrors());
    }
  }, [sendResumeModalVisible, dispatch]);

  const tabs: Tab[] = [
    { id: 1, label: 'Tasks' },
    { id: 2, label: 'Payment report' },
  ];

  const handleActiveTabChange = useCallback((tabId: number) => {
    setActiveTab(tabId);
  }, []);

  const toggleSendResumeModalVisibility = useCallback(() => {
    setSendResumeModalVisible(prevValue => !prevValue);
  }, []);

  const toggleDashboardDetailsModalVisibility = useCallback(() => {
    setDashboardDetailsModalVisible(prevValue => !prevValue);
  }, []);

  useEffect(() => {
    dispatch(getAdminDashboardScoreboardBillings.request());
  }, [dispatch]);

  return (
    <div className={styles['page']}>
      <div className={styles['page__title-wrapper']}>
        <h1 className={styles['page__title']}>Dashboard</h1>
        <Button
          title="Send resume"
          variant="accent"
          onClick={toggleSendResumeModalVisibility}
          className={styles['page__send-resume-button']}
        />
      </div>
      <div className={styles['page__content-wrapper']}>
        <div className={styles['page__first-column']}>
          <div className={styles['page__billing-section']}>
            {loadingScoreboardBillings ? (
              <Loader loading />
            ) : (
              <>
                <div>
                  <p className={styles['page__billing-section-title']}>
                    Billings for the Calendar Month
                  </p>
                  <p className={styles['page__billing-section-text']}>
                    {dashboardScoreboardBillings?.monthName} - $
                    {dashboardScoreboardBillings?.monthBillings}
                  </p>
                </div>
                <div className={styles['page__billing-section-separator']} />
                <div>
                  <p className={styles['page__billing-section-title']}>Billings year to date</p>
                  <p
                    className={styles['page__billing-section-text']}
                  >{`$ ${dashboardScoreboardBillings?.yearBillings}`}</p>
                </div>
              </>
            )}
          </div>
          <Scoreboard toggleDetailsModal={toggleDashboardDetailsModalVisibility} />
        </div>
        <div className={styles['page__second-column']}>
          <Tabs
            className={styles['page__tabs']}
            tabs={tabs}
            activeTabId={activeTab}
            onChange={handleActiveTabChange}
          />
          {activeTab === 1 && <Tasks />}
          {activeTab === 2 && <PaymentReport />}
        </div>
      </div>
      <SendResumeModal visible={sendResumeModalVisible} onClose={toggleSendResumeModalVisibility} />
      {dashboardDetailsModalVisible && (
        <DashboardDetailsModal
          visible={dashboardDetailsModalVisible}
          onClose={toggleDashboardDetailsModalVisibility}
        />
      )}
    </div>
  );
};
