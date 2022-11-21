import React, { useCallback, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { useSelector } from '~/store';
import { CommonRouter } from '~/utils/router';
import { Button } from '~/view/components/button';
import { CandidateModal } from '~/view/components/candidate-modal';
import { Tab } from '~/view/components/tabs';

import { CandidatesList } from './components/Candidates-list/index';
import { SearchInput } from './components/search-input';
import styles from './styles.scss';

const tabs: Tab[] = [
  { id: 1, label: 'Overview' },
  { id: 2, label: 'Job position' },
  { id: 3, label: 'Additional info' },
  { id: 4, label: 'Feedback' },
  { id: 5, label: 'My records' },
];

export const CandidatesPage: React.FC<RouteComponentProps> = ({ history }) => {
  const [isCandidateModalVisible, setIsCandidateModalVisible] = useState(false);
  const { candidates } = useSelector(state => state.adminCandidates);

  const addCandidateHandle = useCallback(() => {
    history.push(CommonRouter.createCandidate.createCandidateInfo);
  }, [history]);

  const toggleCandidateModalVisibility = useCallback(() => {
    setIsCandidateModalVisible(prevValue => !prevValue);
  }, []);

  return (
    <div className={styles['page']}>
      <div className={styles['page__title-wrapper']}>
        <h1 className={styles['page__title']}>Candidates</h1>
        <Button onClick={addCandidateHandle} variant="accent" title="+ Add candidate" />
      </div>
      <SearchInput />
      <p className={styles['page__result-count']}>{candidates.count} results found</p>
      <CandidatesList
        candidates={candidates.results}
        onCandidateClick={toggleCandidateModalVisibility}
      />
      <CandidateModal
        tabs={tabs}
        visible={isCandidateModalVisible}
        onClose={toggleCandidateModalVisibility}
      />
    </div>
  );
};
