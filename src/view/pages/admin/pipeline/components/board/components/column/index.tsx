import React, { memo } from 'react';
import { Droppable } from 'react-beautiful-dnd';

import { MatchedJob } from '~/models/admin';
import { Loader } from '~/view/components/loader';

import { ColumnCard } from './components/column-card';
import styles from './styles.scss';

export type ColumnType = {
  id: number;
  title: string;
  items: MatchedJob[];
  showCandidateModal: () => void;
  showJobModal: () => void;
  isUnmatched?: boolean;
  loading: boolean;
};

export const Column: React.FC<ColumnType> = memo(function Column({
  title,
  id,
  items,
  showCandidateModal,
  showJobModal,
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
      <Droppable droppableId={String(id)}>
        {provided => (
          <div
            className={styles['column__list']}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {items.map((candidate, index) => (
              <ColumnCard
                columnId={id}
                index={index}
                // eslint-disable-next-line react/no-array-index-key
                key={`${candidate.id}-${index}`}
                {...candidate}
                showCandidateModal={showCandidateModal}
                showJobModal={showJobModal}
              />
            ))}
            {provided.placeholder}
            {loading && <Loader loading />}
            {!items.length && !loading && (
              <p className={styles['column__no-candidates-message']}>No jobs</p>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
});
