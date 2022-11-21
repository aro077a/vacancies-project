import { yupResolver } from '@hookform/resolvers/yup';
import React, { memo, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { MatchedJobSteps } from '~/models/common';
import {
  setColumns,
  setSelectedMatchedJob,
  toggleSendCVModalVisibility,
  toggleSuccessModalVisibility,
  updateMatchedJobStep,
} from '~/modules/adminPipeline/actions';
import { useDispatch, useSelector } from '~/store';
import { CreateMatchedJobNotes } from '~/types/formValues';
import { MatchedJobNotesValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { CenterModal } from '~/view/components/modals';
import { Textarea } from '~/view/components/textarea';

import styles from './styles.scss';

export const SendCVModal: React.FC = memo(function SendCVModal() {
  const dispatch = useDispatch();
  const modalVisibility = useSelector(state => state.adminMatchedJobsPipeline.CVModalVisibility);
  const columns = useSelector(state => state.adminMatchedJobsPipeline.initialColumns);
  const selectedMatchedJob = useSelector(
    state => state.adminMatchedJobsPipeline.selectedMatchedJob,
  );
  const updatingStatus = useSelector(
    state => state.adminMatchedJobsPipeline.updatingMatchedJobStep,
  );

  useEffect(() => {
    if (!modalVisibility) {
      dispatch(setSelectedMatchedJob(null));
    }
  }, [modalVisibility, dispatch]);

  const handleModalClose = useCallback(() => {
    dispatch(toggleSendCVModalVisibility());
  }, [dispatch]);

  const { control, setValue, handleSubmit } = useForm<CreateMatchedJobNotes>({
    defaultValues: { notes: '' },
    resolver: yupResolver(MatchedJobNotesValidation),
  });

  useEffect(() => {
    if (modalVisibility) {
      setValue('notes', selectedMatchedJob?.notes || '');
    }
  }, [modalVisibility]);

  const onSubmit = useCallback(
    values => {
      const sourceColumn = columns[2];
      const destColumn = columns[3];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(selectedMatchedJob?.index as number, 1);
      destItems.unshift({ ...removed, step: MatchedJobSteps.SentToEmployee });
      dispatch(
        updateMatchedJobStep.request({
          step: 3,
          cardId: selectedMatchedJob?.id as number,
          notes: values.notes,
          cb: () => {
            dispatch(
              setColumns({
                ...columns,
                2: {
                  ...sourceColumn,
                  items: sourceItems,
                },
                3: {
                  ...destColumn,
                  items: destItems,
                },
              }),
            );
          },
          onSuccess: () => {
            dispatch(toggleSendCVModalVisibility());
            dispatch(toggleSuccessModalVisibility());
          },
        }),
      );
    },
    [dispatch, selectedMatchedJob, columns],
  );

  return (
    <CenterModal
      title="Send CV"
      onClose={handleModalClose}
      className={styles['modal']}
      visible={modalVisibility}
    >
      <div>
        <p className={styles['modal__description']}>
          Please add additional information regarding the CV, only hiring company will see it.
        </p>
        <Textarea
          control={control}
          name="notes"
          placeholder="Add your note"
          label="Notes"
          maxLength={2000}
          textAreaClassName={styles['modal__textarea']}
        />
        <Button
          onClick={handleSubmit(onSubmit)}
          title="Send"
          variant="accent"
          className={styles['modal__submit-btn']}
          loading={updatingStatus}
        />
      </div>
    </CenterModal>
  );
});
