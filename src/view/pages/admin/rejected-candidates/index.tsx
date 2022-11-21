import React, { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { getCandidates } from '~/modules/adminCandidates/actions';
import { useDispatch, useSelector } from '~/store';
import { CandidateModal } from '~/view/components/candidate-modal';
import { Tab } from '~/view/components/tabs';
import useDebounce from '~/view/hooks/useDebounce';

import { RejectedCandidatesList } from './components/RejectedCandidatesList';
import { SearchInput } from './components/search-input';
import styles from './styles.scss';

const tabs: Tab[] = [
  { id: 1, label: 'Overview' },
  { id: 2, label: 'Job position' },
  { id: 3, label: 'Additional info' },
  { id: 4, label: 'Feedback' },
  { id: 5, label: 'My records' },
];

export const RejectedCandidatesPage: React.FC<RouteComponentProps> = () => {
  const candidates = useSelector(state => state.adminCandidates.candidates.results);
  const [isCandidateModalVisible, setIsCandidateModalVisible] = useState(false);
  const { searchCandidateKeyWord } = useSelector(state => state.adminCandidates);
  const debouncedValue = useDebounce(searchCandidateKeyWord, 200);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCandidates.init({ initialFetch: true, status: 3 }));
  }, [dispatch, debouncedValue]);

  const toggleCandidateModalVisibility = useCallback(() => {
    setIsCandidateModalVisible(prevValue => !prevValue);
  }, []);

  return (
    <div className={styles['page']}>
      <h1 className={styles['page__title']}>Rejected candidates</h1>
      <SearchInput />
      <RejectedCandidatesList
        candidates={candidates}
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
