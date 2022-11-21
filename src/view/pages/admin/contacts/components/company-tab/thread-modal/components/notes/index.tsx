import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import React, { memo, useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';

import { ManagerNote } from '~/models/admin';
import {
  addManagerNote,
  getManagerNotes,
  setNoteEditMode,
  setSelectedNoteId,
  updateManagerNote,
} from '~/modules/adminContacts/actions';
import { useDispatch, useSelector } from '~/store';
import { NoteFormValues } from '~/types/formValues';
import { ManagerNotesFormValidation } from '~/utils/validations';
import { Icon } from '~/view/components/icon';
import { Loader } from '~/view/components/loader';

import { NoteCard } from './components';
import styles from './styles.scss';

export const ManagerNotes: React.FC = memo(function ManagerNotes() {
  const dispatch = useDispatch();
  const { managerNotes, editMode, loadingManagerNotes } = useSelector(state => state.adminContacts);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const {
    formState: { errors },
    register,
    setValue,
    handleSubmit,
  } = useForm<NoteFormValues>({
    defaultValues: {
      note: null,
    },
    resolver: yupResolver(ManagerNotesFormValidation),
  });
  const createNote = useCallback(
    (values: { note: string }) => {
      if (editMode) {
        dispatch(updateManagerNote.request({ text: values.note }));
        dispatch(setNoteEditMode({ editMode: false }));
      } else {
        dispatch(addManagerNote.request({ text: values.note }));
      }

      setValue('note', '');
    },
    [dispatch, setValue, editMode],
  );

  useEffect(() => {
    dispatch(getManagerNotes.request());
  }, [dispatch]);

  const handleNoteFocus = useCallback(() => {
    textareaRef.current?.focus();
  }, []);

  const setNoteForEdit = useCallback(
    (id: number) => {
      dispatch(setSelectedNoteId({ selectedNoteId: id }));
      const noteForEdit = managerNotes.find((item: ManagerNote) => item.id === id);
      handleNoteFocus();
      dispatch(setNoteEditMode({ editMode: true }));
      if (noteForEdit) {
        setValue('note', noteForEdit?.text);
      }
    },
    [dispatch, managerNotes, setValue, handleNoteFocus],
  );

  const { ref: textareaFormRef, ...textareaProps } = register('note');

  return (
    <div className={styles['my-notes']}>
      {loadingManagerNotes ? (
        <Loader loading />
      ) : (
        <>
          {!managerNotes?.length ? (
            <p className={styles['my-notes-empty']}>No any notes</p>
          ) : (
            <div className={styles['my-notes-body']}>
              {managerNotes?.map((note: ManagerNote) => (
                <NoteCard note={note} key={note.id} setNoteForEdit={setNoteForEdit} />
              ))}
            </div>
          )}
          <div className={styles['my-notes__footer']}>
            <textarea
              ref={ref => {
                textareaRef.current = ref;
                textareaFormRef(ref);
              }}
              className={classNames(styles['my-notes__input'], {
                [styles['my-notes__input--error']]: errors.note,
              })}
              placeholder="Add Note..."
              onFocus={handleNoteFocus}
              {...textareaProps}
            />
            <button
              className={styles['my-notes__save-note-button']}
              onClick={handleSubmit(createNote)}
            >
              <Icon name="send" className={styles['my-notes__save-note-icon']} />
            </button>
          </div>
          {errors.note && (
            <p className={styles['my-notes__error-message']}>{errors.note.message}</p>
          )}
        </>
      )}
    </div>
  );
});
