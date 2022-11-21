import './styles.css';

import React, { memo, useCallback, useMemo } from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { MatchedJob } from '~/models/admin';
import { MatchedJobSteps } from '~/models/common';
import {
  editInterviewMode,
  setSelectedMatchedJob,
  toggleContractModalVisibility,
  toggleInterviewModalVisibility,
  toggleInvoiceModalVisibility,
  toggleSendCVModalVisibility,
} from '~/modules/adminPipeline/actions';
import { useDispatch } from '~/store';
import { Button } from '~/view/components/button';
import { Image } from '~/view/components/image';

import { DropdownType, PipelineStatusDropdown } from './components/dots-dropdown';
import styles from './styles.scss';

type Props = {
  index: number;
  columnId: MatchedJobSteps;
  showCandidateModal: () => void;
  showJobModal: () => void;
};

const dropdownItems: DropdownType[] = [
  {
    id: 1,
    title: 'Candidate is matched',
  },
  {
    id: 2,
    title: 'Candidate agreed to submittal',
  },
  {
    id: 3,
    title: 'CV is sent',
  },
  {
    id: 4,
    title: 'Employer accepted the candidate',
  },
  {
    id: 5,
    title: 'Interview arranged',
  },
  {
    id: 6,
    title: 'Placement approved',
  },
  {
    id: 7,
    title: 'Successfully passed',
  },
];

export const ColumnCard: React.FC<MatchedJob & Props> = memo(function ColumnCard(matchedJob) {
  const {
    id,
    index,
    positionName,
    salary,
    avatar,
    location,
    candidateName,
    columnId,
    positionTypeName,
    step,
    candidate,
    job,
    superAmount,
    showCandidateModal,
    showJobModal,
  } = matchedJob;

  const dispatch = useDispatch();

  const isTemporary = positionTypeName === 'Temporary';

  const sendResumeHandler = useCallback(() => {
    dispatch(setSelectedMatchedJob(matchedJob));
    dispatch(toggleSendCVModalVisibility());
  }, [dispatch, matchedJob]);

  const arrangeInterviewHandler = useCallback(() => {
    dispatch(setSelectedMatchedJob(matchedJob));
    dispatch(toggleInterviewModalVisibility());
  }, [dispatch, matchedJob]);

  const createInvoiceHandler = useCallback(() => {
    dispatch(setSelectedMatchedJob(matchedJob));
    dispatch(toggleInvoiceModalVisibility());
  }, [dispatch, matchedJob]);

  const createContractHandler = useCallback(() => {
    dispatch(setSelectedMatchedJob(matchedJob));
    dispatch(toggleContractModalVisibility());
  }, [dispatch, matchedJob]);

  const editHandler = useCallback(() => {
    dispatch(setSelectedMatchedJob(matchedJob));
    dispatch(editInterviewMode(true));
    dispatch(toggleInterviewModalVisibility());
  }, [dispatch, matchedJob]);

  const isAnyFooter = useMemo(() => {
    switch (step) {
      case MatchedJobSteps.CandidateMatched:
        return null;
      case MatchedJobSteps.AgreedByCandidate:
        return (
          <div className={styles['card__footer']}>
            <Button
              className={styles['card__btn']}
              variant="secondary"
              size="small"
              title="Send CV"
              onClick={sendResumeHandler}
            />
          </div>
        );
      case MatchedJobSteps.SentToEmployee:
        return null;
      case MatchedJobSteps.AcceptedByEmployee:
        return (
          <div className={styles['card__footer']}>
            <Button
              className={styles['card__btn']}
              variant="secondary"
              size="small"
              title="Arrange interview"
              onClick={arrangeInterviewHandler}
            />
          </div>
        );
      case MatchedJobSteps.InterviewArranged:
        return (
          <div className={styles['card__footer']}>
            <div className={styles['card__interview-info']}>
              <div className={styles['card__footer-body']}>
                <div className={styles['card__footer-interview-label']}>
                  Date:{' '}
                  <p className={styles['card__footer-interview-date']}>
                    {matchedJob.interview?.date}{' '}
                    <span className={styles['card__footer-interview-time']}>
                      {matchedJob.interview?.time}
                    </span>
                  </p>
                </div>
                <div className={styles['card__footer-interview-label']}>
                  Place{' '}
                  <p className={styles['card__footer-interview-location']}>
                    {matchedJob.interview?.location}
                  </p>
                </div>
              </div>
              <Button
                className={styles['card__footer-edit-btn']}
                title="Edit"
                size="small"
                variant="secondary"
                onClick={editHandler}
              />
            </div>
          </div>
        );
      case MatchedJobSteps.PlacementApproved:
        return (
          <div className={styles['card__footer']}>
            <Button
              className={styles['card__btn']}
              variant="secondary"
              size="small"
              title={isTemporary ? 'Send contract' : 'Create invoice'}
              onClick={isTemporary ? createContractHandler : createInvoiceHandler}
            />
          </div>
        );
      case MatchedJobSteps.WaitingForApproval:
        return (
          <div className={styles['card__footer']}>
            <Button
              className={styles['card__btn--waiting']}
              variant="secondary"
              size="small"
              title="Waiting for approval"
            />
          </div>
        );
      default:
        return null;
    }
  }, [
    createInvoiceHandler,
    createContractHandler,
    arrangeInterviewHandler,
    sendResumeHandler,
    isTemporary,
    matchedJob,
    step,
    editHandler,
  ]);

  return (
    <Draggable draggableId={String(id)} index={index}>
      {provided => {
        return (
          <div
            onMouseDown={e => e.stopPropagation()}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={styles['card']}
            id={`${id}`}
          >
            <div className={styles['card__body']}>
              <div className={styles['card__job-info']}>
                <h4 className={styles['card__job-name']}>{positionName}</h4>
                <span className={styles['card__job-location']}>{location}</span> |{' '}
                <span className={styles['card__job-salary']}>${salary}</span>
                {superAmount && (
                  <span className={styles['card__job-super']}>(super: ${superAmount})</span>
                )}
              </div>
              <div className={styles['card__candidate-info']}>
                <Image
                  className={styles['card__candidate-photo']}
                  type="candidate"
                  src={avatar}
                  alt={`${candidateName}'s photo`}
                />
                <p className={styles['card__candidate-name']}>{candidateName}</p>
              </div>
            </div>
            {isAnyFooter}
            <PipelineStatusDropdown
              cardId={id}
              index={index}
              columnId={columnId}
              items={dropdownItems}
              onOpenCandidateClick={showCandidateModal}
              onOpenJobClick={showJobModal}
              candidateId={candidate}
              jobId={job}
              candidateName={candidateName}
              avatar={avatar}
            />
          </div>
        );
      }}
    </Draggable>
  );
});
