import React, { BaseSyntheticEvent, memo, useCallback, useEffect, useState } from 'react';

import { Candidate } from '~/models/admin';
import {
  getCandidates,
  resetCandidateFilters,
  setSelectedCandidate,
} from '~/modules/adminCandidates/actions';
import { setReceiver } from '~/modules/adminMessaging/actions';
import { useDispatch, useSelector } from '~/store';
import { Loader } from '~/view/components/loader';
import { SendEmailModal } from '~/view/components/send-email-modal';
import { usePaginatedDataScrollList } from '~/view/hooks/usePaginatedDataScrollList';
import { CandidateCard } from '~/view/pages/admin/candidates/components/CandidateCard';

import styles from './styles.scss';

type Props = {
  onCandidateClick: () => void;
  candidates: Candidate[];
};

export const CandidatesList: React.FC<Props> = memo(function CandidatesList({
  onCandidateClick,
  candidates,
}) {
  const dispatch = useDispatch();
  const candidatesLoading = useSelector(state => state.adminCandidates.loadingCandidates);
  const [emailModalVisible, setEmailModalVisible] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(resetCandidateFilters());
    };
  }, []);

  useEffect(() => {
    if (!emailModalVisible) {
      dispatch(setReceiver(null));
    }
  }, [emailModalVisible, dispatch]);

  const toggleEmailModalVisibility = useCallback(() => {
    setEmailModalVisible(prevValue => !prevValue);
  }, []);

  const handleOnMailClick = useCallback(
    (e: BaseSyntheticEvent, mail: string | undefined) => {
      e.stopPropagation();
      if (mail) {
        dispatch(setReceiver(mail));
      }
      toggleEmailModalVisibility();
    },
    [dispatch, toggleEmailModalVisibility],
  );

  const { scrollListRef } = usePaginatedDataScrollList<HTMLDivElement>({
    useWindowScroll: true,
    loadingData: candidatesLoading,
    fetchDataFn: useCallback(
      initialFetch => {
        dispatch(getCandidates.init({ initialFetch, status: 2 }));
      },
      [dispatch],
    ),
  });

  const handleCandidateClick = useCallback(
    (candidate: Candidate) => {
      dispatch(setSelectedCandidate(candidate));

      onCandidateClick();
    },
    [dispatch, onCandidateClick],
  );

  return (
    <>
      <div ref={scrollListRef} className={styles['candidate-list']}>
        {!candidatesLoading && !candidates.length && (
          <div className={styles['candidate-not-found']}>No candidates found</div>
        )}
        {candidates?.map(candidate => (
          <CandidateCard
            key={candidate.id}
            onMailClick={handleOnMailClick}
            onClick={handleCandidateClick}
            candidate={candidate}
          />
        ))}
        {candidatesLoading && <Loader loading />}
      </div>
      {emailModalVisible && (
        <SendEmailModal onClose={toggleEmailModalVisibility} visible={emailModalVisible} />
      )}
    </>
  );
});
