import { formatDistanceToNow } from 'date-fns';
import React, { memo, useCallback, useMemo } from 'react';

import { ManagerNote } from '~/models/admin';
import { deleteManagerNote, setSelectedNoteId } from '~/modules/adminContacts/actions';
import { useDispatch } from '~/store';
import { DotsDropdown, DropdownItem } from '~/view/components/dots-dropdown';
import { Image } from '~/view/components/image';

import styles from './styles.scss';

type NoteCardProps = {
  note: ManagerNote;
  setNoteForEdit: (arg0: number) => void;
};

export const NoteCard: React.FC<NoteCardProps> = memo(function NoteCard({ note, setNoteForEdit }) {
  const { id, adminName, adminPhoto, text, updatedAt } = note;
  const dispatch = useDispatch();

  const removeManagerNote = useCallback(() => {
    dispatch(setSelectedNoteId({ selectedNoteId: id }));
    dispatch(deleteManagerNote.request({ noteId: id }));
  }, [dispatch, id]);

  const noteDropdownItems = useMemo<DropdownItem[]>(
    () => [
      {
        label: 'Edit note',
        onClick: () => setNoteForEdit(id),
      },
      {
        label: 'Delete note',
        onClick: () => removeManagerNote(),
      },
    ],
    [id, setNoteForEdit, removeManagerNote],
  );
  return (
    <div className={styles['my-notes__body']}>
      <div className={styles['my-notes__body-block']}>
        <div className={styles['my-notes__body-block-children']}>
          <div className={styles['my-notes__body-user']}>
            <div className={styles['my-notes__body-user-content']}>
              <Image
                type="candidate"
                className={styles['my-notes__body-user-image']}
                alt="candidate"
                src={adminPhoto}
              />
            </div>
            <div className={styles['my-notes__body-user-info']}>
              <div className={styles['my-notes__body-user-block']}>
                <p className={styles['my-notes__body-user-name']}>{adminName}</p>
                <p className={styles['my-notes__body-user-date']}>
                  {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
                </p>
              </div>
              <p className={styles['my-notes__body-user-message']}>{text}</p>
            </div>
          </div>
        </div>
      </div>
      <DotsDropdown className={styles['my-notes__dots-dropdown']} items={noteDropdownItems} />
    </div>
  );
});
