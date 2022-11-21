import React, { memo, useCallback } from 'react';

import { getSentResumes } from '~/modules/adminContacts/actions';
import { useDispatch, useSelector } from '~/store';
import { Loader } from '~/view/components/loader';
import { usePaginatedDataScrollList } from '~/view/hooks/usePaginatedDataScrollList';

import { Card } from './components/card';
import styles from './styles.scss';

export const SendResumeSection: React.FC = memo(function SendResumeSection() {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.adminContacts.loadingSentResumes);
  const resumes = useSelector(state => state.adminContacts.sentResumes.results);

  const { scrollListRef } = usePaginatedDataScrollList<HTMLDivElement>({
    fetchDataFn: useCallback(
      (initialFetch: boolean) => {
        dispatch(getSentResumes.init({ initialFetch }));
      },
      [dispatch],
    ),
    loadingData: loading,
  });

  if (!loading && !resumes.length) {
    return (
      <div className={styles['content']}>
        <p className={styles['content__message']}>No sent resumes found</p>
      </div>
    );
  }

  return (
    <div ref={scrollListRef} className={styles['content']}>
      {loading ? (
        <Loader loading />
      ) : (
        resumes.map(resume => (
          <Card {...resume} file={`${resume.candidateName}'s CV.pdf`} key={resume.id} />
        ))
      )}
    </div>
  );
});
