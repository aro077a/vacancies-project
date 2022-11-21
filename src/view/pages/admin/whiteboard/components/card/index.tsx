import React, { memo, useCallback } from 'react';

import { WhiteboardNote, WhiteboardNoteType } from '~/models/admin';
import {
  deleteWhiteboardNote,
  setEditMode,
  setSelectedNote,
  toggleModalVisibility,
} from '~/modules/adminWhiteboard/actions';
import { useDispatch } from '~/store';
import { Button } from '~/view/components/button';
import { Loader } from '~/view/components/loader';

import { DotsDropdown } from './components/dropdown';
import styles from './styles.scss';

export type Props = {
  title: WhiteboardNoteType;
  items: WhiteboardNote[];
  openModal: (type: WhiteboardNoteType) => void;
  loading: boolean;
};

export const Card: React.FC<Props> = memo(function Card({ title, items, openModal, loading }) {
  const dispatch = useDispatch();

  const handleAddNote = useCallback(() => {
    openModal(title);
  }, [openModal, title]);

  const dotItems = [
    {
      label: 'Edit note',
      icon: 'pencil',
      onClick: useCallback(() => {
        dispatch(setEditMode(true));
        dispatch(toggleModalVisibility());
      }, [dispatch]),
    },
    {
      label: 'Delete note',
      icon: 'trash',
      iconType: 'danger',
      onClick: useCallback(() => {
        dispatch(deleteWhiteboardNote.request());
      }, [dispatch]),
    },
  ];

  return (
    <div className={styles['card']}>
      <div className={styles['card__header']}>
        <p className={styles['card__title']}>{title}</p>
        <Button
          size="small"
          variant="secondary"
          className={styles['card__btn']}
          title="+ Add note"
          onClick={handleAddNote}
        />
      </div>
      <div className={styles['card__list']}>
        {loading && <Loader loading />}
        {items.map(item => (
          <div className={styles['card__list-item']} key={item.id}>
            <p className={styles['card__list-item-text']}>{item.description}</p>
            <span className={styles['card__value']}>{item.value ? `$${item.value}` : 'N/A'}</span>
            <DotsDropdown
              onClick={() => dispatch(setSelectedNote(item))}
              className={styles['card__dots']}
              items={dotItems}
            />
          </div>
        ))}
      </div>
    </div>
  );
});
