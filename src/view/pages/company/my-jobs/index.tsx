import React, { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';

import { getClosedJobs } from '~/modules/companyMyJobs/actions';
import { useDispatch, useSelector } from '~/store';
import { CommonRouter } from '~/utils/router';
import { Button } from '~/view/components/button';
import { Tabs } from '~/view/components/tabs';

import { ActiveJobsSection } from './components/active-jobs';
import { ClosedJobsSection } from './components/closed-jobs';
import { JobModal } from './components/job-modal';
import styles from './styles.scss';

export const MyJobsPage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { tabs } = useSelector(state => state.companyMyJobs);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const toggleModalVisibility = useCallback(() => {
    setModalVisibility(prevValue => !prevValue);
  }, []);
  useEffect(() => {
    dispatch(getClosedJobs.init({ initialFetch: true }));
  }, []);
  const addJobHandler = useCallback(() => {
    history.push(CommonRouter.createJob.createJobInfo);
  }, [history]);

  const setActiveTabHandler = useCallback((tabId: number) => {
    setActiveTab(tabId);
  }, []);

  return (
    <div className={styles['page']}>
      <div className={styles['page__title-wrapper']}>
        <h1 className={styles['page__title']}>My Jobs</h1>
        <Button
          onClick={addJobHandler}
          className={styles['page__add-btn']}
          title="+ Add job"
          variant="accent"
        />
      </div>
      <Tabs
        className={styles['page__tabs']}
        tabs={tabs}
        activeTabId={activeTab}
        onChange={setActiveTabHandler}
        variant="secondary"
      />
      <div className={styles['page__content']}>
        {activeTab === 1 && <ActiveJobsSection toggleJobModalVisibility={toggleModalVisibility} />}
        {activeTab === 2 && <ClosedJobsSection toggleJobModalVisibility={toggleModalVisibility} />}
      </div>
      <JobModal onClose={toggleModalVisibility} visible={modalVisibility} />
    </div>
  );
};
