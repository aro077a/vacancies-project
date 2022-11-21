import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { JobStatus } from '~/models/common';
import {
  setSelectedLiveJob,
  toggleJobModalVisibility,
  updateSelectedLiveJobStatus,
} from '~/modules/adminLiveJobs/actions';
import { useDispatch, useSelector } from '~/store';
import { CommonRouter } from '~/utils/router';
import { Button } from '~/view/components/button';
import { Image } from '~/view/components/image';
import { RightModal } from '~/view/components/modals';
import { DropdownItem, StatusDropdown } from '~/view/components/status-dropdown';
import { Tab, Tabs } from '~/view/components/tabs';

import { Candidates } from './components/candidates';
import { Contracts } from './components/contracts';
import { Description } from './components/description';
import { Feedback } from './components/feedback';
import { MyRecords } from './components/my-records';
import styles from './styles.scss';

type Props = {
  tabs: Tab[];
};

const statusDropdownItems: DropdownItem[] = [
  { label: 'Active', value: JobStatus.ACTIVE, hasErrorColor: false },
  { label: 'Closed', value: JobStatus.CLOSED, hasErrorColor: true },
];

export const JobModal: React.FC<Props> = memo(function JobModal({ tabs }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const selectedLiveJob = useSelector(state => state.adminLiveJobs.selectedLiveJob);
  const visible = useSelector(state => state.adminLiveJobs.jobModalVisibility);
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  useEffect(() => {
    if (!visible) {
      dispatch(setSelectedLiveJob(null));
    }
  }, [dispatch, visible]);

  const handleActiveTabChange = useCallback((tabId: number) => {
    setActiveTab(tabId);
  }, []);

  const handleClose = useCallback(() => {
    if (activeTab !== tabs[0].id) {
      setActiveTab(tabs[0].id);
    }

    dispatch(toggleJobModalVisibility());
  }, [activeTab, tabs, dispatch]);

  const handleJobStatusChange = useCallback(
    (statusDropdownItem: DropdownItem) => {
      dispatch(updateSelectedLiveJobStatus.request({ status: statusDropdownItem.value }));
    },
    [dispatch],
  );

  const handleJobEdit = useCallback(() => {
    history.push(CommonRouter.editJob.getBase(selectedLiveJob?.id));
  }, [history, selectedLiveJob?.id]);

  const jobStatus = useMemo(() => {
    return (
      statusDropdownItems.find(
        statusDropdownItem => statusDropdownItem.label === selectedLiveJob?.statusName,
      ) || null
    );
  }, [selectedLiveJob?.statusName]);

  if (!selectedLiveJob) {
    return null;
  }

  return (
    <RightModal
      backTitle="< Back to jobs"
      className={styles['modal']}
      visible={visible}
      onClose={handleClose}
    >
      <div className={styles['modal__header']}>
        <div className={styles['modal__company']}>
          <Image
            type="company"
            className={styles['modal__company-image']}
            src={selectedLiveJob.companyLogo}
            alt="company"
          />
          <div>
            <p className={styles['modal__job-title']}>{selectedLiveJob.positionName}</p>
            <div className={styles['modal__company-info']}>
              <StatusDropdown
                selectedItem={jobStatus}
                items={statusDropdownItems}
                onChange={handleJobStatusChange}
              />
              <div className={styles['modal__company--name']}>{selectedLiveJob.companyName}</div>
            </div>
          </div>
        </div>
        <Button
          size="medium"
          variant="secondary"
          title="Edit job details"
          className={styles['modal__edit-job-button']}
          inlineIcon="pencil"
          inlineIconClassName={styles['modal__edit-job-button-icon']}
          onClick={handleJobEdit}
        />
      </div>
      <Tabs
        className={styles['modal__tabs']}
        tabs={tabs}
        activeTabId={activeTab}
        onChange={handleActiveTabChange}
      />
      {activeTab === 1 && <Description />}
      {activeTab === 2 && <Candidates />}
      {activeTab === 3 && <Feedback />}
      {activeTab === 4 && <MyRecords />}
      {activeTab === 5 && <Contracts />}
    </RightModal>
  );
});
