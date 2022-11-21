import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { DashboardTasks, PriorityItemsType, TaskPriority } from '~/models/admin';
import {
  getAdminDashboardTasks,
  setDashboardTaskPriorityName,
  setDashboardTasksPriority,
} from '~/modules/adminDashboard/actions';
import { getListOfAdmins } from '~/modules/manageAdmins/actions';
import { useDispatch, useSelector } from '~/store';
import { RootState } from '~/store/types';
import { Button } from '~/view/components/button';
import { Loader } from '~/view/components/loader';
import { SelectOption } from '~/view/components/select';
import { usePaginatedDataScrollList } from '~/view/hooks/usePaginatedDataScrollList';

import { AddTaskModal } from './add-task-modal';
import { CustomSelect } from './custom-select';
import styles from './styles.scss';
import { TasksCard } from './tasks-card';

const priorities: PriorityItemsType[] = [
  { label: 'All tasks', value: 0 },
  { label: 'Low-priority tasks', value: 1 },
  { label: 'Medium-priority tasks', value: 2 },
  { label: 'High-priority tasks', value: 3 },
  { label: 'Done tasks', value: 4 },
];

export const Tasks: React.FC = memo(function Tasks() {
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);

  const {
    dashboardTasks,
    loadingDashboardTasks,
    dashboardTaskPriorityName,
    dashboardTaskPriority,
  } = useSelector((state: RootState) => state.adminDashboard);
  const dispatch = useDispatch();

  const { scrollListRef } = usePaginatedDataScrollList<HTMLDivElement>({
    useWindowScroll: true,
    loadingData: loadingDashboardTasks,
    fetchDataFn: useCallback(
      initialFetch => {
        dispatch(getAdminDashboardTasks.init({ initialFetch }));
      },
      [dispatch],
    ),
  });
  const filteredTasks = useMemo(
    () =>
      dashboardTasks.results.filter((item: DashboardTasks) => item.priority !== TaskPriority.Done),
    [dashboardTasks.results],
  );
  useEffect(() => {
    dispatch(getListOfAdmins.init({ initialFetch: true }));
  }, [dispatch]);

  const priorityHandler = useCallback(
    (e: SelectOption) => {
      if (e.value === 0) {
        dispatch(setDashboardTasksPriority({ priority: '' }));
        dispatch(setDashboardTaskPriorityName({ dashboardTaskPriorityName: priorities[0] }));
      } else {
        dispatch(setDashboardTasksPriority({ priority: e.value.toString() }));
        dispatch(setDashboardTaskPriorityName({ dashboardTaskPriorityName: e }));
      }
    },
    [dispatch],
  );

  const toggleAddTaskModalVisibility = useCallback(() => {
    setAddTaskModalVisible(prevValue => !prevValue);
  }, []);

  return (
    <div className={styles['tasks']}>
      <div className={styles['tasks__header']}>
        <h3 className={styles['tasks__title']}>{dashboardTasks.count} Active tasks</h3>
        <div className={styles['tasks__header-actions-wrapper']}>
          <CustomSelect
            options={priorities}
            onChange={priorityHandler}
            defaultValue={dashboardTaskPriorityName}
          />
          <Button
            size="medium"
            variant="accent"
            title="Add task"
            className={styles['tasks__add-task-button']}
            onClick={toggleAddTaskModalVisibility}
          />
        </div>
      </div>
      {!loadingDashboardTasks && !dashboardTasks.results.length ? (
        <div ref={scrollListRef} className={styles['tasks__content-not-found']}>
          No tasks found
        </div>
      ) : (
        <div ref={scrollListRef} className={styles['tasks__content-items']}>
          {dashboardTaskPriority !== ''
            ? dashboardTasks.results.map((tasks: DashboardTasks) => (
                <TasksCard key={tasks.id} tasks={tasks} visible={addTaskModalVisible} />
              ))
            : filteredTasks.map((tasks: DashboardTasks) => (
                <TasksCard key={tasks.id} tasks={tasks} visible={addTaskModalVisible} />
              ))}
          {loadingDashboardTasks && (
            <div className={styles['tasks__content-items-loader']}>
              <Loader loading />
            </div>
          )}
        </div>
      )}
      <AddTaskModal visible={addTaskModalVisible} onClose={toggleAddTaskModalVisibility} />
    </div>
  );
});
