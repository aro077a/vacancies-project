import React, { memo, useCallback } from 'react';

import { getContactMessages } from '~/modules/adminContacts/actions';
import { useDispatch, useSelector } from '~/store';
import { Loader } from '~/view/components/loader';
import { usePaginatedDataScrollList } from '~/view/hooks/usePaginatedDataScrollList';

import { Card } from './components';
import styles from './styles.scss';

export const EmailsSection: React.FC = memo(function SendResumeSection() {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.adminContacts.loadingContactMessage);
  const { threads } = useSelector(state => state.adminContacts.messages);

  const { scrollListRef } = usePaginatedDataScrollList<HTMLDivElement>({
    fetchDataFn: useCallback(
      (initialFetch: boolean) => {
        dispatch(getContactMessages.init({ initialFetch }));
      },
      [dispatch],
    ),
    loadingData: loading,
  });

  if (!loading && !threads.length) {
    return (
      <div className={styles['content']}>
        <p className={styles['content__message']}>No emails found</p>
      </div>
    );
  }

  return (
    <div className={styles['content']} ref={scrollListRef}>
      {loading ? <Loader loading /> : threads.map(thread => <Card {...thread} key={thread.id} />)}
    </div>
  );
});
