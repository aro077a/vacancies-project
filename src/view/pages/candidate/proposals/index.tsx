import React, { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import {
  getCandidateMatchedJobs,
  resetToInitial,
  setActiveTab,
  toggleReviewContractModalVisibility,
} from '~/modules/candidateProposals/actions';
import { useDispatch, useSelector } from '~/store';
import { ReviewContractModal } from '~/view/components/review-contract-modal';
import { ProposalTab } from '~/view/components/tab';

import { FeedbackModal } from './components/feedback-modal';
import { MatchedJobModal } from './components/job-modal';
import { TabContent } from './components/tab-content';
import styles from './styles.scss';

export const ProposalsPage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const { activeTab } = useSelector(state => state.candidateProposals);
  const { boards, loadingCandidateMatchedJobs, reviewContractModalVisibility } = useSelector(
    state => state.candidateProposals,
  );
  const [matchedJobModalVisibility, setMatchedJobModalVisibility] = useState(false);

  useEffect(() => {
    dispatch(getCandidateMatchedJobs.request());

    return () => {
      dispatch(resetToInitial());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMatchedJobModalVisibility = useCallback(() => {
    setMatchedJobModalVisibility(prevValue => !prevValue);
  }, []);

  const handleClose = useCallback(() => {
    dispatch(toggleReviewContractModalVisibility());
  }, [dispatch]);

  const changeActiveTab = useCallback(
    tabId => {
      dispatch(setActiveTab(tabId));
    },
    [dispatch],
  );

  return (
    <div className={styles['page']}>
      <div className={styles['page__title-wrapper']}>
        <h1 className={styles['page__title']}>Opportunities</h1>
      </div>
      <div>
        <div className={styles['page__tabs']}>
          {Object.entries(boards).map(([boardId, board]) => (
            <ProposalTab
              onTabClick={changeActiveTab}
              isActive={Number(boardId) === activeTab}
              key={boardId}
              tab={{ ...board, count: board.items.length }}
              isLoading={loadingCandidateMatchedJobs}
            />
          ))}
        </div>
        <div className={styles['page__tab-content']}>
          <TabContent
            toggleModalVisibility={toggleMatchedJobModalVisibility}
            activeTab={activeTab}
            isLoading={loadingCandidateMatchedJobs}
          />
        </div>
      </div>
      <FeedbackModal />
      <MatchedJobModal
        onClose={toggleMatchedJobModalVisibility}
        visible={matchedJobModalVisibility}
        board={activeTab}
      />
      <ReviewContractModal
        type="candidate"
        visible={reviewContractModalVisibility}
        onClose={handleClose}
      />
    </div>
  );
};
