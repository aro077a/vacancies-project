import classNames from 'classnames';
import React, { memo, useCallback, useState } from 'react';

import { Candidate } from '~/models/admin';
import { MatchedJobSteps } from '~/models/common';
import { setSelectedCandidate } from '~/modules/adminCandidates/actions';
import {
  getLiveJob,
  setSelectedLiveJob,
  toggleJobModalVisibility,
} from '~/modules/adminLiveJobs/actions';
import { setColumns, updateMatchedJobStep } from '~/modules/adminPipeline/actions';
import { useDispatch, useSelector } from '~/store';
import { Icon } from '~/view/components/icon';
import { useOutsideClick } from '~/view/hooks/useOutsideClick';

import styles from './styles.scss';

export type DropdownType = {
  id: number;
  title: string;
};

type Props = {
  items: DropdownType[];
  columnId: number;
  cardId: number;
  index: number;
  onOpenCandidateClick: () => void;
  onOpenJobClick: () => void;
  candidateId: number;
  avatar: string | null;
  candidateName: string;
  jobId: number;
};

export const PipelineStatusDropdown: React.FC<Props> = memo(function PipelineStatusDropdown({
  items,
  columnId,
  cardId,
  index,
  onOpenCandidateClick,
  candidateId,
  onOpenJobClick,
  avatar,
  candidateName,
  jobId,
}) {
  const dispatch = useDispatch();
  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  const [innerDropdownVisibility, setInnerDropdownVisibility] = useState(false);
  const columns = useSelector(state => state.adminMatchedJobsPipeline.initialColumns);

  const dropdownRef = useOutsideClick<HTMLDivElement>({
    handler: useCallback(() => {
      if (dropdownVisibility) {
        setDropdownVisibility(false);
        setInnerDropdownVisibility(false);
      }
    }, [dropdownVisibility]),
  });

  const toggleDropdownVisibility = useCallback(() => {
    setDropdownVisibility(prevValue => !prevValue);
  }, []);

  const toggleInnerDropdownVisibility = useCallback(() => {
    setInnerDropdownVisibility(prevValue => !prevValue);
  }, []);

  const openCandidateModalClick = useCallback(() => {
    dispatch(setSelectedCandidate({ id: candidateId, avatar, name: candidateName } as Candidate));
    onOpenCandidateClick();
    toggleDropdownVisibility();
  }, [
    onOpenCandidateClick,
    toggleDropdownVisibility,
    candidateName,
    candidateId,
    avatar,
    dispatch,
  ]);

  const openJobModalClick = useCallback(() => {
    dispatch(
      getLiveJob.request({
        jobId,
        cb: job => {
          dispatch(setSelectedLiveJob(job));
          dispatch(toggleJobModalVisibility());
          onOpenJobClick();
          toggleDropdownVisibility();
        },
      }),
    );
  }, [jobId, dispatch, onOpenJobClick, toggleDropdownVisibility]);

  const closeDealHandler = useCallback(() => {
    const sourceColumn = columns[columnId];
    const sourceItems = [...sourceColumn.items];
    sourceItems.splice(index, 1);
    dispatch(
      updateMatchedJobStep.request({
        step: MatchedJobSteps.Canceled,
        cardId,
        notes: null,
        cb: () =>
          dispatch(
            setColumns({
              ...columns,
              [columnId]: {
                ...sourceColumn,
                items: sourceItems,
              },
            }),
          ),
      }),
    );
  }, [cardId, dispatch, columnId, columns, index]);

  const dropdownItemClickHandler = useCallback(
    itemId => {
      if (itemId !== columnId) {
        const sourceColumn = columns[columnId];
        const destColumn = columns[itemId];
        const sourceItems = [...sourceColumn.items];
        const destItems = [...destColumn.items];
        const [removed] = sourceItems.splice(index, 1);
        destItems.unshift({ ...removed, step: destColumn.id });
        dispatch(
          updateMatchedJobStep.request({
            step: Number(destColumn.id),
            cardId,
            notes: null,
            cb: () =>
              dispatch(
                setColumns({
                  ...columns,
                  [columnId]: {
                    ...sourceColumn,
                    items: sourceItems,
                  },
                  [itemId]: {
                    ...destColumn,
                    items: destItems,
                  },
                }),
              ),
          }),
        );
      }
    },
    [cardId, columnId, columns, dispatch, index],
  );

  return (
    <div ref={dropdownRef} className={styles['dropdown']}>
      <button onClick={toggleDropdownVisibility} className={styles['dropdown__dots']}>
        <Icon width="3px" height="15px" name="vertical-dots" />
      </button>
      {dropdownVisibility && (
        <div className={styles['dropdown__content']}>
          <p className={styles['dropdown__header']}>Options</p>
          <div
            className={classNames(styles['dropdown__status-change'], {
              [styles['dropdown__status-change--active']]: innerDropdownVisibility,
            })}
          >
            <button
              className={styles['dropdown__status-change-btn']}
              onClick={toggleInnerDropdownVisibility}
            >
              <p className={styles['dropdown__status-title']}>Change status</p>
              <Icon
                className={styles['dropdown__status-arrow']}
                width="10px"
                height="6px"
                name="arrow-up"
              />
            </button>
            {innerDropdownVisibility && (
              <ul className={styles['dropdown__inner-dropdown']}>
                {items.map(item => (
                  <li className={styles['dropdown__inner-dropdown-item']} key={item.id}>
                    <button
                      onClick={() => dropdownItemClickHandler(item.id)}
                      className={styles['dropdown__inner-dropdown-btn']}
                    >
                      <span>{item.title}</span>
                      {columnId === item.id && (
                        <Icon width="16px" height="16px" name="checkmark-outline" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button onClick={() => closeDealHandler()} className={styles['dropdown__close-deal']}>
            Close deal
          </button>
          <button onClick={openJobModalClick} className={styles['dropdown__open-btn']}>
            Open job
          </button>
          <button onClick={openCandidateModalClick} className={styles['dropdown__open-btn']}>
            Open candidate
          </button>
        </div>
      )}
    </div>
  );
});
