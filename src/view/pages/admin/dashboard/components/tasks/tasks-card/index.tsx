import classNames from 'classnames';
import { format } from 'date-fns';
import React, { memo, useMemo } from 'react';

import {
  AdminsList,
  DashboardTasks,
  TaskPriority,
  TaskPriorityString,
  TasksDropdownType,
} from '~/models/admin';
import { useSelector } from '~/store';
import { RootState } from '~/store/types';

import styles from './styles.scss';
import { TaskStatusDropdown } from './task-dropdown';

type RequestCardProps = {
  tasks: DashboardTasks;
  visible: boolean;
};

const dropdownItems: TasksDropdownType[] = [
  {
    id: 1,
    title: 'Low priority tasks',
  },
  {
    id: 2,
    title: 'Medium priority tasks',
  },
  {
    id: 3,
    title: 'High priority tasks',
  },
  {
    id: 4,
    title: 'Done',
  },
];

export const TasksCard: React.FC<RequestCardProps> = memo(function Requests({ tasks }) {
  const { listOfAdmins } = useSelector((state: RootState) => state.manageAdmins);

  const taskAdmin = useMemo(() => {
    return listOfAdmins.results.find((admin: AdminsList) => admin.id === tasks.admin);
  }, [listOfAdmins.results, tasks.admin]);

  const isOverdue = new Date(tasks?.dueDate).getTime() < new Date().getTime();

  return (
    <div
      className={classNames(
        styles['tasks__task'],
        tasks.priority === TaskPriority.High
          ? styles['tasks__task-high']
          : tasks.priority === TaskPriority.Medium
          ? styles['tasks__task-medium']
          : tasks.priority === TaskPriority.Low
          ? styles['tasks__task-low']
          : styles['tasks__task-done'],
      )}
    >
      <TaskStatusDropdown items={dropdownItems} dropdownTaskId={tasks.id} />
      <p className={styles['tasks__task-admin']}>
        {taskAdmin ? `${taskAdmin?.firstName} ${taskAdmin?.lastName}` : 'no admin'}
      </p>
      <p className={styles['tasks__task-title']}>{tasks.title}</p>
      <p className={styles['tasks__task-description']}>{tasks.description}</p>
      {tasks.author && (
        <p className={styles['tasks__task-author']}>
          Created by: <span className={styles['tasks__task-author-name']}>{tasks.author}</span>
        </p>
      )}
      <div className={styles['tasks__footer']}>
        <div className={styles['tasks__task-info-wrapper']}>
          <div className={styles['tasks__task-due-date-wrapper']}>
            <p className={styles['tasks__task-due-date']}>
              Due {format(new Date(tasks.dueDate), 'dd MMM')}
            </p>
          </div>
          <div
            className={classNames(
              styles['tasks__task-priority-wrapper'],
              tasks.priority === TaskPriority.High
                ? styles['tasks__task-priority-wrapper--high']
                : tasks.priority === TaskPriority.Medium
                ? styles['tasks__task-priority-wrapper--medium']
                : tasks.priority === TaskPriority.Low
                ? styles['tasks__task-priority-wrapper--low']
                : styles['tasks__task-priority-wrapper--done'],
            )}
          >
            <p
              className={classNames(
                styles['tasks__task-priority'],
                tasks.priority === TaskPriority.High
                  ? styles['tasks__task-priority--high']
                  : tasks.priority === TaskPriority.Medium
                  ? styles['tasks__task-priority--medium']
                  : tasks.priority === TaskPriority.Low
                  ? styles['tasks__task-priority--low']
                  : styles['tasks__task-priority--done'],
              )}
            >
              {tasks.priority === TaskPriority.High
                ? TaskPriorityString.High
                : tasks.priority === TaskPriority.Medium
                ? TaskPriorityString.Medium
                : tasks.priority === TaskPriority.Low
                ? TaskPriorityString.Low
                : TaskPriorityString.Done}
            </p>
          </div>
          {isOverdue && tasks.priority !== TaskPriority.Done && (
            <div className={styles['tasks__task-overdue-wrapper']}>
              <p className={styles['tasks__task-overdue']}>Overdue</p>
            </div>
          )}
        </div>
        <p className={styles['tasks__task-date']}>
          {format(new Date(tasks?.createdAt), 'dd.MM.yyyy')}
        </p>
      </div>
    </div>
  );
});
