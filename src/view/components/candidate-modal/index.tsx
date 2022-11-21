import classNames from 'classnames';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { navigateFromContacts, setSelectedCandidate } from '~/modules/adminCandidates/actions';
import { useDispatch, useSelector } from '~/store';
import { CommonRouter } from '~/utils/router';
import { Button } from '~/view/components/button';
import { Icon } from '~/view/components/icon';
import { Image } from '~/view/components/image';
import { RightModal } from '~/view/components/modals';
import { Tab, Tabs } from '~/view/components/tabs';

import { AdditionalInfo } from './components/additional-info';
import { Feedback } from './components/feedback';
import { JobPosition } from './components/job-position';
import { MyRecords } from './components/my-records';
import { Overview } from './components/overview';
import styles from './styles.scss';

type Props = {
  visible: boolean;
  onClose: () => void;
  tabs: Tab[];
  withBtns?: boolean;
  className?: string;
  onRejectClick?: (id: number) => void;
  onApproveClick?: (id: number) => void;
};

export const CandidateModal: React.FC<Props> = memo(function CandidateModal({
  visible,
  onClose,
  tabs,
  withBtns,
  onApproveClick,
  onRejectClick,
  className,
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const selectedCandidate = useSelector(state => state.adminCandidates.selectedCandidate);
  const location = useSelector(state => state.adminCandidates.candidateOverview?.location);

  const handleActiveTabChange = useCallback((tabId: number) => {
    setActiveTab(tabId);
  }, []);

  const modalClassName = classNames(className, styles['modal']);

  const statusClassName = classNames(
    selectedCandidate?.status
      ? styles['modal__candidate-status--active']
      : styles['modal__candidate-status--disable'],
  );

  useEffect(() => {
    if (!visible) {
      dispatch(setSelectedCandidate(null));
    }
  }, [dispatch, visible]);

  const handleClose = useCallback(() => {
    if (activeTab !== tabs[0].id) {
      setActiveTab(tabs[0].id);
    }

    onClose();
  }, [activeTab, onClose, tabs]);

  const selectedCandidateId = useSelector(
    state => state.adminCandidates.selectedCandidate?.id,
  ) as number;

  const handleApproveClick = useCallback(() => {
    if (onApproveClick) {
      onApproveClick(selectedCandidateId);
      onClose();
    }
  }, [onApproveClick, selectedCandidateId, onClose]);

  const handleRejectClick = useCallback(() => {
    if (onRejectClick) {
      onRejectClick(selectedCandidateId);
      onClose();
    }
  }, [onRejectClick, selectedCandidateId, onClose]);

  const handleEditClick = useCallback(() => {
    dispatch(navigateFromContacts(true));
    history.push(CommonRouter.editCandidate.getBase(selectedCandidate?.id));
  }, [dispatch, history, selectedCandidate]);

  if (!selectedCandidate) {
    return null;
  }

  if (!withBtns) {
    return (
      <RightModal
        className={modalClassName}
        onClose={handleClose}
        visible={visible}
        backTitle="< Back to candidates"
      >
        <div className={styles['modal__header']}>
          <div className={styles['modal__candidate']}>
            <Image
              type="candidate"
              className={styles['modal__candidate-image']}
              alt="candidate"
              src={selectedCandidate.avatar}
            />
            <div className={styles['modal__candidate-info']}>
              <h4 className={styles['modal__candidate-name']}>{selectedCandidate.name}</h4>
              <div className={styles['modal__candidate-location-info']}>
                <Icon name="location" className={styles['modal__candidate-location-icon']} />
                <p>{selectedCandidate.location || location}</p>
                {activeTab !== 1 && (
                  <p className={styles['modal__status-wrapper']}>
                    &#183;{' '}
                    <span className={statusClassName}>
                      {selectedCandidate.status ? selectedCandidate.status : 'Disable'}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
          <Button
            className={styles['modal__edit-profile-button']}
            inlineIconClassName={styles['modal__edit-profile-button-icon']}
            size="medium"
            variant="secondary"
            title="Edit Profile"
            inlineIcon="pencil"
            onClick={handleEditClick}
          />
        </div>
        <Tabs
          tabs={tabs}
          activeTabId={activeTab}
          className={styles['modal__tabs']}
          onChange={handleActiveTabChange}
        />
        {activeTab === 1 && <Overview />}
        {activeTab === 2 && <JobPosition />}
        {activeTab === 3 && <AdditionalInfo />}
        {activeTab === 4 && <Feedback />}
        {activeTab === 5 && <MyRecords />}
      </RightModal>
    );
  }

  const modalWithFooter = classNames(styles['modal'], styles['modal--with-footer']);

  return (
    <RightModal
      className={modalWithFooter}
      onClose={handleClose}
      visible={visible}
      backTitle="< Back to candidates"
    >
      <div className={styles['modal__header']}>
        <div className={styles['modal__candidate']}>
          <Image
            type="candidate"
            className={styles['modal__candidate-image']}
            alt="candidate"
            src={selectedCandidate.avatar}
          />
          <div className={styles['modal__candidate-info']}>
            <h4 className={styles['modal__candidate-name']}>{selectedCandidate.name}</h4>
            <div className={styles['modal__candidate-location-info']}>
              <Icon name="location" className={styles['modal__candidate-location-icon']} />
              <p>{selectedCandidate.location}</p>
              {activeTab !== 1 && (
                <p className={styles['modal__status-wrapper']}>
                  &#183;{' '}
                  <span className={statusClassName}>
                    {selectedCandidate.status ? selectedCandidate.status : 'Disable'}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Tabs
        tabs={tabs}
        activeTabId={activeTab}
        className={styles['modal__tabs']}
        onChange={handleActiveTabChange}
      />
      {activeTab === 1 && <Overview />}
      {activeTab === 2 && <JobPosition />}
      {activeTab === 3 && <AdditionalInfo />}
      {activeTab === 4 && <Feedback />}
      {activeTab === 5 && <MyRecords />}
      {withBtns && (
        <div className={styles['modal__footer']}>
          <div className={styles['modal__divider']} />
          <Button
            className={styles['modal__footer-btn']}
            title="Approve"
            size="large"
            variant="accent"
            onClick={handleApproveClick}
          />
          <Button onClick={handleRejectClick} title="Reject" size="large" variant="secondary" />
        </div>
      )}
    </RightModal>
  );
});
