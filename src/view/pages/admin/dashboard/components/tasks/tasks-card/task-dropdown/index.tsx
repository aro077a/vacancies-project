import classNames from 'classnames';
import React, { memo, useCallback, useState } from 'react';

import { DashboardTasks, TaskPriority } from '~/models/admin';
import {
  closeDashBoardTask,
  deleteDashBoardTask,
  setDashboardTaskEdit,
  setDashboardTaskId,
  updateDashBoardTaskPriority,
} from '~/modules/adminDashboard/actions';
import { useDispatch, useSelector } from '~/store';
import { Icon } from '~/view/components/icon';
import { useOutsideClick } from '~/view/hooks/useOutsideClick';

// eslint-disable-next-line no-restricted-imports
import { AddTaskModal } from '../../add-task-modal';
import styles from './styles.scss';

export type DropdownType = {
  id: number;
  title: string;
};

type Props = {
  items?: DropdownType[];
  dropdownTaskId: number;
};

export const TaskStatusDropdown: React.FC<Props> = memo(function TaskStatusDropdown({
  items,
  dropdownTaskId,
}) {
  const dispatch = useDispatch();
  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [innerDropdownVisibility, setInnerDropdownVisibility] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<DashboardTasks | undefined>();
  const { dashboardTasks, taskId } = useSelector(state => state.adminDashboard);

  const dropdownRef = useOutsideClick<HTMLDivElement>({
    handler: useCallback(() => {
      if (dropdownVisibility) {
        setDropdownVisibility(false);
        setInnerDropdownVisibility(false);
      }
    }, [dropdownVisibility]),
  });

  const toggleDropdownVisibility = useCallback(
    taskId => {
      const selectedTaskPriority = dashboardTasks.results.find(task => task.id === taskId);
      setSelectedPriority(selectedTaskPriority);
      setDropdownVisibility(prevValue => !prevValue);
      dispatch(setDashboardTaskId({ taskId: selectedTaskPriority?.id }));
    },
    [dispatch, dashboardTasks.results],
  );

  const toggleInnerDropdownVisibility = useCallback(() => {
    setInnerDropdownVisibility(prevValue => !prevValue);
  }, []);

  const toggleEditModalVisibility = useCallback(() => {
    const selectedTask = dashboardTasks.results.find(task => task.id === taskId);
    if (selectedTask?.id === taskId) {
      setTaskModalVisible(true);
      dispatch(setDashboardTaskEdit({ editMode: true }));
    }
  }, [dispatch, dashboardTasks.results, taskId]);

  const toggleCloseEditModalVisibility = useCallback(() => {
    dispatch(setDashboardTaskEdit({ editMode: false }));
    setTaskModalVisible(false);
  }, [dispatch]);

  const updatePriority = useCallback(
    (taskId: number, taskPriority: number) => {
      dispatch(
        updateDashBoardTaskPriority.request({
          taskId,
          priority: { priority: taskPriority },
        }),
      );
      setInnerDropdownVisibility(false);
      setDropdownVisibility(false);
    },
    [dispatch],
  );

  const deleteTask = useCallback(
    (taskId: number) => {
      dispatch(
        deleteDashBoardTask.request({
          taskId,
        }),
      );
      setDropdownVisibility(false);
    },
    [dispatch],
  );

  const closeTask = useCallback(
    taskId => {
      dispatch(
        closeDashBoardTask.request({
          taskId,
          priority: { priority: TaskPriority.Done },
        }),
      );
      setDropdownVisibility(false);
    },
    [dispatch],
  );

  return (
    <div ref={dropdownRef} className={styles['dropdown']}>
      <button
        onClick={() => toggleDropdownVisibility(dropdownTaskId)}
        className={styles['dropdown__dots']}
      >
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
              className={styles['dropdown__open-btn']}
              onClick={() => toggleEditModalVisibility()}
            >
              Edit task
            </button>
            {selectedPriority?.priority !== TaskPriority.Done && (
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
            )}
            {innerDropdownVisibility && (
              <ul className={styles['dropdown__inner-dropdown']}>
                {items?.map(item => {
                  return (
                    <li className={styles['dropdown__inner-dropdown-item']} key={item.id}>
                      <button
                        onClick={() => updatePriority(dropdownTaskId, item.id)}
                        className={styles['dropdown__inner-dropdown-btn']}
                      >
                        <span>{item.title}</span>
                        {selectedPriority?.priority === item.id && (
                          <Icon width="16px" height="16px" name="checkmark-outline" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          {selectedPriority?.priority !== TaskPriority.Done && (
            <>
              <button
                className={styles['dropdown__open-btn']}
                onClick={() => closeTask(dropdownTaskId)}
              >
                Close task
              </button>
              <button
                className={styles['dropdown__close-deal']}
                onClick={() => deleteTask(dropdownTaskId)}
              >
                Delete task
              </button>
            </>
          )}
        </div>
      )}
      <AddTaskModal visible={taskModalVisible} onClose={toggleCloseEditModalVisibility} />
    </div>
  );
});
