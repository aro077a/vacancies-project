import React, { useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { getSentMessages } from '~/modules/adminMessaging/actions';
import { useDispatch, useSelector } from '~/store';
import { Loader } from '~/view/components/loader';
import { usePaginatedDataScrollList } from '~/view/hooks/usePaginatedDataScrollList';

// eslint-disable-next-line no-restricted-imports
import { EmailCard } from '../card';
import styles from './styles.scss';

export const SentMessages: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.adminMessaging.loadingSentMessages);
  const emails = useSelector(state => state.adminMessaging.sentMessages.threads);

  const { scrollListRef } = usePaginatedDataScrollList<HTMLDivElement>({
    loadingData: loading,
    fetchDataFn: useCallback(
      initialFetch => {
        dispatch(getSentMessages.init({ initialFetch }));
      },
      [dispatch],
    ),
  });

  return (
    <div className={styles['content']}>
      <h2 className={styles['content__title']}>Sent messages</h2>
      <div ref={scrollListRef} className={styles['content__list']}>
        {emails.map(email => (
          <EmailCard key={email.id} {...email} />
        ))}
        {loading && <Loader loading />}
      </div>
    </div>
  );
};
