import React, { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { toggleReviewContractModalVisibility } from '~/modules/candidateProposals/actions';
import {
  getCompanyMatchedCandidates,
  resetToInitial,
  setActiveTab,
} from '~/modules/companyInterviews/actions';
import { useDispatch, useSelector } from '~/store';
import { ReviewContractModal } from '~/view/components/review-contract-modal';
import { ProposalTab } from '~/view/components/tab';

import { CandidateModal } from './components/candidate-modal';
import { ContractConfirmedModal } from './components/contract-confirmed-modal';
import { FeedbackModal } from './components/feedback-modal';
import { FeedbackSentModal } from './components/feedback-sent-modal';
import { NoteModal } from './components/note-modal';
import { TabContent } from './components/tab-content';
import styles from './styles.scss';

export const InterviewsPage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const { activeTab } = useSelector(state => state.companyInterviews);
  const { boards, loadingMatchedJobs, noteModalVisibility, feedbackModalVisibility } = useSelector(
    state => state.companyInterviews,
  );
  const [matchedModalVisibility, setMatchedModalVisibility] = useState(false);
  const { reviewContractModalVisibility } = useSelector(state => state.candidateProposals);

  const toggleMatchedModalVisibility = useCallback(() => {
    setMatchedModalVisibility(prevValue => !prevValue);
  }, []);

  const handleClose = useCallback(() => {
    dispatch(toggleReviewContractModalVisibility());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCompanyMatchedCandidates.request());

    return () => {
      dispatch(resetToInitial());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeActiveTab = useCallback(
    (tabId: number) => {
      dispatch(setActiveTab(tabId));
    },
    [dispatch],
  );

  return (
    <div className={styles['page']}>
      <div className={styles['page__title-wrapper']}>
        <h1 className={styles['page__title']}>Interviews</h1>
      </div>
      <div>
        <div className={styles['page__tabs']}>
          {Object.entries(boards).map(([boardId, board]) => (
            <ProposalTab
              onTabClick={changeActiveTab}
              isActive={Number(boardId) === activeTab}
              key={boardId}
              tab={{ ...board, count: board.items.length }}
              isLoading={loadingMatchedJobs}
            />
          ))}
        </div>
        <div className={styles['page__tab-content']}>
          <TabContent
            toggleModalVisibility={toggleMatchedModalVisibility}
            activeTab={activeTab}
            isLoading={loadingMatchedJobs}
          />
        </div>
      </div>
      {noteModalVisibility && <NoteModal />}
      {feedbackModalVisibility && <FeedbackModal />}
      <CandidateModal
        currentBoard={activeTab}
        onClose={toggleMatchedModalVisibility}
        visible={matchedModalVisibility}
      />
      <FeedbackSentModal />
      <ContractConfirmedModal />
      <ReviewContractModal
        type="company"
        visible={reviewContractModalVisibility}
        onClose={handleClose}
      />
    </div>
  );
};
