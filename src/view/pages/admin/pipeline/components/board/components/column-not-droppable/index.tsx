import React, { memo } from 'react';

import { UnmatchedJob } from '~/models/admin';
import { Loader } from '~/view/components/loader';

import { ColumnCardNonInteractive } from './components';
import styles from './styles.scss';

export type ColumnType = {
  id: number;
  title: string;
  items: UnmatchedJob[];
  isUnmatched?: boolean;
  loading: boolean;
};

export const ColumnNonInteractive: React.FC<ColumnType> = memo(function Column({
  title,
  id,
  items,
  loading,
}) {
  return (
    <div className={styles['column']}>
      <h2 className={styles['column__title']}>
        {title}{' '}
        <span className={styles['column__candidates-count']}>
          ({loading ? '...' : items.length})
        </span>
      </h2>
      <div className={styles['column__list']}>
        {items.map((candidate, index) => (
          <ColumnCardNonInteractive
            columnId={id}
            index={index}
            // eslint-disable-next-line react/no-array-index-key
            key={`${candidate.id}-${index}`}
            {...candidate}
          />
        ))}
        {loading && <Loader loading />}
        {!items.length && !loading && (
          <p className={styles['column__no-candidates-message']}>No jobs</p>
        )}
      </div>
    </div>
  );
});
