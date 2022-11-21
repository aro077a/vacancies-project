import { yupResolver } from '@hookform/resolvers/yup';
import React, { memo, useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { MatchedJobSteps } from '~/models/common';
import {
  createFeedbackForCandidate,
  markFeedbackSent,
  setBoards,
  toggleNoteModalVisibility,
  updateMatchedCandidateStatus,
} from '~/modules/companyInterviews/actions';
import { useDispatch, useSelector } from '~/store';
import { MatchedJobNotesValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { CenterModal } from '~/view/components/modals';
import { Textarea } from '~/view/components/textarea';

import styles from './styles.scss';

export const NoteModal: React.FC = memo(function NoteModal() {
  const dispatch = useDispatch();
  const {
    isAccept,
    noteModalVisibility,
    boards,
    selectedMatchedCandidate,
    updatingMatchedCandidateStatus,
  } = useSelector(state => state.companyInterviews);
  const handleModalClose = useCallback(() => {
    dispatch(toggleNoteModalVisibility(false));
  }, [dispatch]);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      note: '',
    },
    resolver: yupResolver(MatchedJobNotesValidation),
  });

  const onSubmit = useCallback(
    notes => {
      if (selectedMatchedCandidate) {
        const sourceBoard = boards[1];
        const sourceItems = [...boards[1].items];
        const [removed] = sourceItems.splice(selectedMatchedCandidate?.index, 1);

        const { job, candidate } = selectedMatchedCandidate;

        const cb = (): void => {
          if (!isAccept) {
            dispatch(
              setBoards({
                ...boards,
                1: {
                  ...sourceBoard,
                  items: [...sourceItems],
                },
              }),
            );
            return;
          }
          const destBoard = boards[2];
          const destItems = [...destBoard.items];
          destItems.unshift({ ...removed, step: MatchedJobSteps.AcceptedByEmployee });
          dispatch(
            setBoards({
              ...boards,
              1: {
                ...sourceBoard,
                items: [...sourceItems],
              },
              2: {
                ...destBoard,
                items: [...destItems],
              },
            }),
          );
        };

        if (isAccept) {
          dispatch(
            updateMatchedCandidateStatus.request({
              matchedId: selectedMatchedCandidate.id,
              formValues: {
                note: notes,
                step: MatchedJobSteps.AcceptedByEmployee,
              },
              cb: () => {
                cb();
                dispatch(toggleNoteModalVisibility(true));
                dispatch(markFeedbackSent(true));
              },
            }),
          );
        } else {
          dispatch(
            updateMatchedCandidateStatus.request({
              matchedId: selectedMatchedCandidate.id,
              formValues: {
                step: MatchedJobSteps.Canceled,
              },
              cb: () => {
                cb();
                dispatch(toggleNoteModalVisibility(true));
                dispatch(markFeedbackSent(true));
              },
            }),
          );
          dispatch(
            createFeedbackForCandidate.request({
              data: { text: notes.note, candidate, job },
              cb: () => {
                cb();
                dispatch(markFeedbackSent(true));
              },
            }),
          );
        }
      }
    },
    [selectedMatchedCandidate, boards, dispatch, isAccept],
  );

  return (
    <CenterModal
      title={
        isAccept
          ? `Accept Candidate ID ${selectedMatchedCandidate?.id}`
          : `Decline Candidate ID ${selectedMatchedCandidate?.id}`
      }
      className={styles['modal']}
      onClose={handleModalClose}
      visible={noteModalVisibility}
    >
      <div>
        {isAccept ? (
          <p className={styles['modal__description']}>
            Please leave your notes about upcoming interview date, time and location
          </p>
        ) : (
          <p className={styles['modal__description']}>
            Please leave your feedback for candidate and his resume
          </p>
        )}
        <Textarea
          control={control}
          name="note"
          placeholder="Your note"
          label="Your feedback"
          maxLength={500}
          textAreaClassName={styles['modal__textarea']}
        />
        <Button
          variant="accent"
          className={styles['modal__submit-btn']}
          title={isAccept ? 'Accept and send' : 'Decline and send'}
          onClick={handleSubmit(onSubmit)}
          loading={updatingMatchedCandidateStatus}
        />
      </div>
    </CenterModal>
  );
});
