import React from 'react';

import { useSelector } from '~/store';

import { MatchedCard } from './components/card';
import styles from './styles.scss';

export const Candidates: React.FC = (): React.ReactElement => {
  const matched = useSelector(state => state.companyMyJobs.selectedJob?.matched);

  return (
    <div className={styles['description']}>
      <h4 className={styles['description__title']}>
        Matched <span className={styles['description__count']}>({matched?.length})</span>
      </h4>
      <div className={styles['description__matched-list']}>
        {matched?.map(match => (
          <MatchedCard key={match.id} {...match} />
        ))}
      </div>
    </div>
  );
};
