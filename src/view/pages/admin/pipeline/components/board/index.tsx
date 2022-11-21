import React, { MouseEvent as ReactMouseEvent, useCallback, useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import { toggleJobModalVisibility } from '~/modules/adminLiveJobs/actions';
import {
  getMatchedJobPipeline,
  getUnmatchedJobPipeline,
  resetToInitial,
  setColumns,
  toggleSuccessModalVisibility,
  updateMatchedJobStep,
} from '~/modules/adminPipeline/actions';
import { useDispatch, useSelector } from '~/store';
import { CandidateModal } from '~/view/components/candidate-modal';
import { JobModal } from '~/view/components/job-modal';
import { SuccessModal } from '~/view/components/success-modal';
import { Tab } from '~/view/components/tabs';

import { Column } from './components/column';
import { ContractModal } from './components/column/components/contract-modal';
import { SendCVModal } from './components/column/components/cv-modal';
import { InterviewModal } from './components/column/components/interview-modal';
import { InvoiceModal } from './components/column/components/invoice-modal';
import { ColumnNonInteractive } from './components/column-not-droppable';
import styles from './styles.scss';

const tabs: Tab[] = [
  { id: 1, label: 'Overview' },
  { id: 2, label: 'Job position' },
  { id: 3, label: 'Additional info' },
  { id: 4, label: 'Feedback' },
  { id: 5, label: 'My records' },
];

const jobModalTabs: Tab[] = [
  { id: 1, label: 'Description' },
  { id: 2, label: 'Candidates' },
  { id: 3, label: 'Feedback' },
  { id: 4, label: 'My records' },
  { id: 5, label: 'Contracts' },
];

export const Board: React.FC = () => {
  const dispatch = useDispatch();
  const [isCandidateModalVisible, setIsCandidateModalVisible] = useState(false);
  const {
    interviewModalVisibility,
    contractModalVisibility,
    successModalVisibility,
    editInterviewMode,
  } = useSelector(state => state.adminMatchedJobsPipeline);
  const columns = useSelector(state => state.adminMatchedJobsPipeline.initialColumns);
  const {
    unmatchedJobsPipeline,
    loadingUnmatchedJobs,
    loadingMatchedJobPipeline,
    isNotesSentStatus,
  } = useSelector(state => state.adminMatchedJobsPipeline);

  const container = document.getElementById('board') as HTMLElement;

  let pos = { top: 0, left: 0, x: 0, y: 0 };

  const mouseMoveHandler = (e: MouseEvent): void => {
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;

    container.scrollTop = pos.top - dy;
    container.scrollLeft = pos.left - dx;
  };

  const mouseDownHandler = (e: ReactMouseEvent<HTMLDivElement>): void => {
    container.style.cursor = 'grabbing';
    container.style.userSelect = 'none';

    pos = {
      left: container.scrollLeft,
      top: container.scrollTop,
      x: e.clientX,
      y: e.clientY,
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  const mouseUpHandler = (): void => {
    container.style.removeProperty('cursor');
    container.style.removeProperty('user-select');

    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  const toggleCandidateModalVisibility = useCallback(() => {
    setIsCandidateModalVisible(prevValue => !prevValue);
  }, []);

  useEffect(() => {
    dispatch(getMatchedJobPipeline.request());
    dispatch(getUnmatchedJobPipeline.request());

    return () => {
      dispatch(resetToInitial());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onDragEnd = useCallback(
    (result, columns, setColumns) => {
      if (!result.destination) return;
      const { source, destination, draggableId } = result;

      if (source.droppableId !== destination.droppableId) {
        const sourceColumn = columns[source.droppableId];
        const destColumn = columns[destination.droppableId];
        const sourceItems = [...sourceColumn.items];
        const destItems = [...destColumn.items];
        const [removed] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, {
          ...removed,
          step: Number(destination.droppableId),
        });
        dispatch(
          setColumns({
            ...columns,
            [source.droppableId]: {
              ...sourceColumn,
              items: sourceItems,
            },
            [destination.droppableId]: {
              ...destColumn,
              items: destItems,
            },
          }),
        );
        dispatch(
          updateMatchedJobStep.request({
            step: Number(destColumn.id),
            cardId: draggableId,
            notes: null,
            cb: () => null,
          }),
        );
      } else {
        const column = columns[source.droppableId];
        const copiedItems = [...column.items];
        const [removed] = copiedItems.splice(source.index, 1);
        copiedItems.splice(destination.index, 0, removed);
        dispatch(
          setColumns({
            ...columns,
            [source.droppableId]: {
              ...column,
              items: copiedItems,
            },
          }),
        );
      }
    },
    [dispatch],
  );

  return (
    <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
      <div onMouseDown={mouseDownHandler} id="board" className={styles['board']}>
        <ColumnNonInteractive
          title="Unmatched job positions"
          items={unmatchedJobsPipeline}
          id={0}
          loading={loadingUnmatchedJobs}
        />
        {Object.entries(columns).map(([columnId, column]) => {
          return (
            <Column
              loading={loadingMatchedJobPipeline}
              showCandidateModal={toggleCandidateModalVisibility}
              showJobModal={toggleJobModalVisibility}
              key={columnId}
              items={column.items}
              id={column.id}
              title={column.title}
            />
          );
        })}
        <SendCVModal />
        {interviewModalVisibility && <InterviewModal />}
        <InvoiceModal />
        {contractModalVisibility && <ContractModal />}
        <CandidateModal
          visible={isCandidateModalVisible}
          onClose={toggleCandidateModalVisibility}
          tabs={tabs}
        />
        <JobModal tabs={jobModalTabs} />
        <SuccessModal
          visible={successModalVisibility}
          onClose={() => dispatch(toggleSuccessModalVisibility())}
          title={
            editInterviewMode
              ? 'Your interview successfully changed'
              : isNotesSentStatus === 'success'
              ? 'Your notes successfully sent'
              : !editInterviewMode
              ? 'Your interview successfully arranged'
              : 'Your request successfully sent'
          }
          description=""
        />
      </div>
    </DragDropContext>
  );
};
