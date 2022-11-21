import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { useSelector } from '~/store';
import { MyRecords } from '~/view/components/candidate-modal/components/my-records';
import { Loader } from '~/view/components/loader';

import styles from './styles.scss';

export const EditCandidateRecordsPage: React.FC<RouteComponentProps> = () => {
  const loadingRecords = useSelector(state => state.adminCandidates.loadingCandidateRecord);
  return (
    <div className={styles['page']}>
      <div className={styles['page__header-wrapper']}>
        <h2 className={styles['page__title']}>
          My records about candidate{' '}
          <span className={styles['page__title-caption']}>(Visible on to you)</span>
        </h2>
      </div>
      <div className={styles['page__records']}>
        {loadingRecords ? <Loader loading /> : <MyRecords />}
      </div>
    </div>
  );
};
