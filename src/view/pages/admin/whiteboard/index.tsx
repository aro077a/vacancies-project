import React, { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { WhiteboardNoteType } from '~/models/admin';
import {
  getTotalValue,
  getWhiteboardNotes,
  resetToInitial,
  toggleModalVisibility,
} from '~/modules/adminWhiteboard/actions';
import { useDispatch, useSelector } from '~/store';

import { Card } from './components/card/index';
import { NoteModal } from './components/note-modal';
import styles from './styles.scss';

export const WhiteboardPage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const [boardType, setBoardType] = useState<WhiteboardNoteType>(WhiteboardNoteType.Talent);
  const { whiteboards, loadingWhiteboardNotes, totalValue, loadingTotalValue } = useSelector(
    state => state.adminWhiteboard,
  );

  const handleSetBoardType = useCallback(
    type => {
      setBoardType(type);
      dispatch(toggleModalVisibility());
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(getWhiteboardNotes.request());
    dispatch(getTotalValue.request());

    return () => {
      dispatch(resetToInitial());
    };
  }, [dispatch]);

  return (
    <div className={styles['page']}>
      <div className={styles['page__header']}>
        <h1 className={styles['page__title']}>Whiteboard</h1>
        <div className={styles['page__total-wrapper']}>
          Total value:{' '}
          <span className={styles['page__total-count']}>
            {loadingTotalValue ? '...' : `$${totalValue}`}
          </span>
        </div>
      </div>
      <div className={styles['page__list']}>
        {Object.entries(whiteboards).map(([, board]) => (
          <Card
            openModal={handleSetBoardType}
            items={board.items}
            title={board.title}
            key={board.title}
            loading={loadingWhiteboardNotes}
          />
        ))}
      </div>
      <NoteModal boardType={boardType} />
    </div>
  );
};
