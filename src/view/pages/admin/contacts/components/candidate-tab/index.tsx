import React, { memo, useCallback, useEffect, useState } from 'react';

import { ContactCandidates } from '~/models/admin';
import { getContactCandidates, resetContactSearchFilters } from '~/modules/adminContacts/actions';
import { useDispatch, useSelector } from '~/store';
import { RootState } from '~/store/types';
import { CandidateModal } from '~/view/components/candidate-modal';
import { Loader } from '~/view/components/loader';
import { Tab } from '~/view/components/tabs';
import { usePaginatedDataScrollList } from '~/view/hooks/usePaginatedDataScrollList';

import { CandidatesList } from './contact-candidates-list';
import styles from './styles.scss';

const tabs: Tab[] = [
  { id: 1, label: 'Overview' },
  { id: 2, label: 'Job position' },
  { id: 3, label: 'Additional info' },
  { id: 4, label: 'Feedback' },
  { id: 5, label: 'My records' },
];

export const CandidateTab: React.FC = memo(function CandidateTab() {
  const candidates = useSelector((state: RootState) => state.adminContacts.candidates.results);
  const [candidateModalVisibility, setCandidateModalVisibility] = useState(false);
  const { loadingCandidates } = useSelector((state: RootState) => state.adminContacts);

  const dispatch = useDispatch();

  const { scrollListRef } = usePaginatedDataScrollList<HTMLDivElement>({
    useWindowScroll: true,
    loadingData: loadingCandidates,
    fetchDataFn: useCallback(
      initialFetch => {
        dispatch(getContactCandidates.init({ initialFetch }));
      },
      [dispatch],
    ),
  });

  const toggleModalVisibility = useCallback(() => {
    setCandidateModalVisibility(prevValue => !prevValue);
  }, []);

  useEffect(
    () => () => {
      dispatch(resetContactSearchFilters());
    },
    [dispatch],
  );

  return (
    <>
      {!loadingCandidates && !candidates.length ? (
        <div ref={scrollListRef} className={styles['page__content-not-found']}>
          No candidates found
        </div>
      ) : (
        <div ref={scrollListRef} className={styles['page__content-body']}>
          {candidates.map((candidate: ContactCandidates) => (
            <CandidatesList
              onClick={toggleModalVisibility}
              key={candidate.id}
              candidate={candidate}
            />
          ))}
          {loadingCandidates && <Loader loading />}
        </div>
      )}
      <CandidateModal
        tabs={tabs}
        visible={candidateModalVisibility}
        onClose={toggleModalVisibility}
      />
    </>
  );
});
