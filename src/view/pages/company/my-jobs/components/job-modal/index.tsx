import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { JobStatus } from '~/models/common';
import { setSelectedFindJob } from '~/modules/candidateFindJobs/actions';
import { updateJobStatus } from '~/modules/companyMyJobs/actions';
import { useDispatch, useSelector } from '~/store';
import { CommonRouter } from '~/utils/router';
import { Button } from '~/view/components/button';
import { Image } from '~/view/components/image';
import { RightModal } from '~/view/components/modals';
import { DropdownItem, StatusDropdown } from '~/view/components/status-dropdown';
import { Tab, Tabs } from '~/view/components/tabs';

import { Candidates } from './components/candidates';
import { Description } from './components/overview/description';
import styles from './styles.scss';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const tabs: Tab[] = [
  {
    id: 1,
    label: 'Candidates',
  },
  {
    id: 2,
    label: 'Description',
  },
];

const statusDropdownItems: DropdownItem[] = [
  { label: 'Active', value: JobStatus.ACTIVE, hasErrorColor: false },
  { label: 'Closed', value: JobStatus.CLOSED, hasErrorColor: true },
];

export const JobModal: React.FC<Props> = memo(function MatchedJobModal({ onClose, visible }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const { selectedJob } = useSelector(state => state.companyMyJobs);

  useEffect(() => {
    if (!visible) {
      dispatch(setSelectedFindJob(null));
    }
  }, [visible, dispatch]);

  const changeTabHandler = useCallback((id: number) => {
    setActiveTab(id);
  }, []);

  const handleJobStatusChange = useCallback(
    (statusDropdownItem: DropdownItem) => {
      dispatch(updateJobStatus.request(statusDropdownItem.value));
    },
    [dispatch],
  );

  const handleClose = useCallback(() => {
    if (activeTab !== tabs[0].id) {
      setActiveTab(tabs[0].id);
    }

    onClose();
  }, [activeTab, onClose]);

  const jobStatus = useMemo(() => {
    return (
      statusDropdownItems.find(
        statusDropdownItem => statusDropdownItem.value === selectedJob?.status,
      ) || null
    );
  }, [selectedJob]);

  const handleJobEdit = useCallback(() => {
    history.push(CommonRouter.editJob.getBase(selectedJob?.id));
  }, [history, selectedJob?.id]);

  return (
    <RightModal
      onClose={handleClose}
      visible={visible}
      className={styles['modal']}
      backTitle="< Back"
    >
      <div className={styles['modal__header']}>
        <Image
          className={styles['modal__company-logo']}
          src={null}
          type="company"
          alt="Company's logo"
        />
        <div className={styles['modal__job-info']}>
          <p className={styles['modal__job-position']}>{selectedJob?.positionName}</p>
          <StatusDropdown
            selectedItem={jobStatus}
            items={statusDropdownItems}
            onChange={handleJobStatusChange}
          />
        </div>
        <Button
          className={styles['modal__edit-btn']}
          title="Edit job details"
          variant="secondary"
          inlineIcon="pencil"
          size="medium"
          inlineIconClassName={styles['modal__edit-btn-icon']}
          onClick={handleJobEdit}
        />
      </div>
      <Tabs
        className={styles['modal__tabs']}
        tabs={tabs}
        activeTabId={activeTab}
        onChange={changeTabHandler}
      />
      {activeTab === 1 && <Candidates />}
      {activeTab === 2 && <Description />}
    </RightModal>
  );
});
