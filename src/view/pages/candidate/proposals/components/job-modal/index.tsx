import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { MatchedJobSteps } from '~/models/common';
import {
  setBoards,
  setSelectedMatchedJob,
  updateCandidateMatchedJob,
} from '~/modules/candidateProposals/actions';
import { useDispatch, useSelector } from '~/store';
import { Button } from '~/view/components/button';
import { Image } from '~/view/components/image';
import { RightModal } from '~/view/components/modals';
import { Tab, Tabs } from '~/view/components/tabs';

import { Contracts } from './components/contracts';
import { Feedback } from './components/feedback';
import { Overview } from './components/overview';
import styles from './styles.scss';

type Props = {
  visible: boolean;
  onClose: () => void;
  board: number;
};

export const MatchedJobModal: React.FC<Props> = memo(function MatchedJobModal({
  onClose,
  visible,
  board,
}) {
  const { matchedJobDetail, selectedMatchedJob, boards } = useSelector(
    state => state.candidateProposals,
  );

  const tabs: Tab[] = useMemo(
    () => [
      {
        id: 1,
        label: 'Overview',
      },
      {
        id: 2,
        label: 'My Feedback',
      },

      ...(MatchedJobSteps.WaitingForApproval === selectedMatchedJob?.step ||
      selectedMatchedJob?.approvedDate !== null
        ? [
            {
              id: 3,
              label: 'Contracts',
            },
          ]
        : []),
    ],
    [selectedMatchedJob],
  );

  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  useEffect(() => {
    if (!visible) {
      dispatch(setSelectedMatchedJob(null));
    }
  }, [visible, dispatch]);

  const handleModalClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const acceptHandler = useCallback(
    e => {
      if (selectedMatchedJob) {
        e.stopPropagation();
        const sourceBoard = boards[1];
        const destBoard = boards[2];
        const sourceItems = [...sourceBoard.items];
        const destItems = [...destBoard.items];
        const [removed] = sourceItems.splice(selectedMatchedJob.index, 1);
        destItems.unshift({ ...removed, step: MatchedJobSteps.AgreedByCandidate });
        dispatch(
          updateCandidateMatchedJob.request({
            matchedId: selectedMatchedJob.id,
            step: MatchedJobSteps.AgreedByCandidate,
            cb: () => {
              dispatch(
                setBoards({
                  ...boards,
                  1: {
                    ...sourceBoard,
                    items: sourceItems,
                  },
                  2: {
                    ...destBoard,
                    items: destItems,
                  },
                }),
              );
              onClose();
            },
          }),
        );
      }
    },
    [boards, selectedMatchedJob, dispatch, onClose],
  );

  const declineHandler = useCallback(
    e => {
      if (selectedMatchedJob) {
        e.stopPropagation();
        const sourceBoard = boards[1];
        const sourceItems = [...sourceBoard.items];
        sourceItems.splice(selectedMatchedJob.index, 1);
        dispatch(
          updateCandidateMatchedJob.request({
            matchedId: selectedMatchedJob.id,
            step: MatchedJobSteps.Canceled,
            cb: () => {
              dispatch(
                setBoards({
                  ...boards,
                  1: {
                    ...sourceBoard,
                    items: sourceItems,
                  },
                }),
              );
              onClose();
            },
          }),
        );
      }
    },
    [boards, dispatch, selectedMatchedJob, onClose],
  );

  return (
    <RightModal
      onClose={handleModalClose}
      visible={visible}
      className={styles['modal']}
      backTitle="< Back"
    >
      <div className={styles['modal__header']}>
        <Image
          className={styles['modal__company-logo']}
          src={matchedJobDetail?.companyLogo || null}
          type="company"
          alt="Company's logo"
        />
        <div className={styles['modal__job-info']}>
          <p className={styles['modal__job-position']}>{matchedJobDetail?.positionName}</p>
          <p className={styles['modal__company-site']}>{matchedJobDetail?.companySite}</p>
        </div>
        {board === 1 && (
          <div className={styles['modal__job-match']}>{matchedJobDetail?.match}% Match</div>
        )}
      </div>
      {board !== 1 && (
        <Tabs
          className={styles['modal__tabs']}
          onChange={setActiveTab}
          activeTabId={activeTab}
          tabs={tabs}
        />
      )}
      {activeTab === 1 && <Overview />}
      {activeTab === 2 && <Feedback />}
      {activeTab === 3 && <Contracts />}
      {board === 1 && (
        <div className={styles['modal__footer']}>
          <Button
            className={styles['modal__action-btn']}
            title="Accept"
            size="medium"
            variant="accent"
            onClick={acceptHandler}
          />
          <Button
            className={styles['modal__action-btn']}
            title="Decline"
            size="medium"
            variant="secondary"
            onClick={declineHandler}
          />
        </div>
      )}
    </RightModal>
  );
});
