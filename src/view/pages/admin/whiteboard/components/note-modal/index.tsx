import { yupResolver } from '@hookform/resolvers/yup';
import React, { memo, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { WhiteboardNoteType } from '~/models/admin';
import {
  createWhiteboardNote,
  setEditMode,
  setSelectedNote,
  toggleModalVisibility,
  updateWhiteboardNote,
} from '~/modules/adminWhiteboard/actions';
import { useDispatch, useSelector } from '~/store';
import { WhiteboardNoteFormValues } from '~/types/formValues';
import { CreateNoteValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { Input } from '~/view/components/input';
import { CenterModal } from '~/view/components/modals';
import { Textarea } from '~/view/components/textarea';

import styles from './styles.scss';

type Props = {
  boardType: WhiteboardNoteType;
};

export const NoteModal: React.FC<Props> = memo(function NoteModal({ boardType }) {
  const dispatch = useDispatch();
  const { creatingNote, modalVisibility, selectedNote, editMode } = useSelector(
    state => state.adminWhiteboard,
  );

  const handleClose = useCallback(() => {
    dispatch(toggleModalVisibility());
  }, [dispatch]);

  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      value: '',
      description: '',
    },
    resolver: yupResolver(CreateNoteValidation),
  });

  useEffect(() => {
    if (!modalVisibility) {
      dispatch(setSelectedNote(null));
      dispatch(setEditMode(false));
      reset();
    }
  }, [modalVisibility, dispatch]);

  useEffect(() => {
    if (editMode) {
      if (selectedNote?.description) {
        setValue('description', selectedNote.description);
      }

      if (selectedNote?.value) {
        setValue('value', `$${selectedNote.value}`);
      }
    }
  }, [editMode, selectedNote, setValue]);

  const onSubmit = useCallback(
    (values: WhiteboardNoteFormValues) => {
      if (editMode) {
        dispatch(
          updateWhiteboardNote.request({
            ...values,
          }),
        );
      } else {
        dispatch(
          createWhiteboardNote.request({
            ...values,
            type: boardType,
          }),
        );
      }
    },
    [boardType, dispatch, editMode],
  );

  return (
    <CenterModal
      onClose={handleClose}
      visible={modalVisibility}
      className={styles['modal']}
      title="Add note"
    >
      <Input name="value" mask="$ *****" placeholder="$ 0,00" label="Value" control={control} />
      <Textarea
        className={styles['modal__description']}
        label="Description"
        placeholder="Your description"
        name="description"
        maxLength={1000}
        control={control}
      />
      <Button
        onClick={handleSubmit(onSubmit)}
        variant="accent"
        className={styles['modal__submit-btn']}
        title="Add note"
        loading={creatingNote}
      />
    </CenterModal>
  );
});
