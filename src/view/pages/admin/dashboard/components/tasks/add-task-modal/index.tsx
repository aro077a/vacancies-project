import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import { format, parseISO } from 'date-fns';
import React, { memo, MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { FieldPath, useForm } from 'react-hook-form';

import { DashboardTasks, PriorityItemsType, TaskPriority } from '~/models/admin';
import {
  createAdminDashboardTask,
  updateAdminDashboardTask,
} from '~/modules/adminDashboard/actions';
import { adminsAsSelectOptionsSelector } from '~/modules/manageAdmins/selectors';
import { useDispatch, useSelector } from '~/store';
import { RootState } from '~/store/types';
import { CreateTaskFormValues } from '~/types/formValues';
import { iterateOverErrorDetailsEachKey } from '~/utils/errors';
import { CreateTaskValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { DatePicker } from '~/view/components/date-picker';
import { Input } from '~/view/components/input';
import { Loader } from '~/view/components/loader';
import { CenterModal } from '~/view/components/modals';
import { Select, SelectOption } from '~/view/components/select';
import { Textarea } from '~/view/components/textarea';

import styles from './styles.scss';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const priorityItems: PriorityItemsType[] = [
  { label: 'High', value: TaskPriority.High },
  { label: 'Medium', value: TaskPriority.Medium },
  { label: 'Low', value: TaskPriority.Low },
];

export const AddTaskModal: React.FC<Props> = memo(function AddTaskModal({ visible, onClose }) {
  const [activeButton, setActiveButton] = useState<string>('High');
  const adminsAsSelectOptions = useSelector(adminsAsSelectOptionsSelector);

  const assignedAdmins = useMemo(() => {
    return adminsAsSelectOptions.filter((item: SelectOption) => item.actions === true);
  }, [adminsAsSelectOptions]);

  const {
    createdDashboardTaskErrors,
    dashboardTasks,
    editMode,
    loadingDashboardTaskById,
    taskId,
    updatedDashboardTaskErrors,
    creatingDashboardTask,
    updatingDashboardTask,
  } = useSelector((state: RootState) => state.adminDashboard);

  const { control, setValue, handleSubmit, setError, reset } = useForm<CreateTaskFormValues>({
    defaultValues: {
      title: '',
      description: '',
      dueDate: format(new Date(), 'dd/MM/yyyy'),
      priority: TaskPriority.High,
      admin: null,
    },
    resolver: yupResolver(CreateTaskValidation),
  });

  const dispatch = useDispatch();

  const handleChoosePriority = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      const priority = e.target as HTMLElement;
      const selectedPriority = priorityItems?.find(
        (priorityItem: PriorityItemsType) => priorityItem.label === priority.innerText,
      );
      setActiveButton(priority.innerText);
      setValue('priority', selectedPriority?.value);
    },
    [setValue],
  );

  useEffect(() => {
    const selectedTask = dashboardTasks.results.find((item: DashboardTasks) => item.id === taskId);
    if (editMode && selectedTask) {
      const { title, description, dueDate, priority } = selectedTask;
      const selectedAdmin = assignedAdmins?.find(
        (item: SelectOption) => item.value === selectedTask?.admin,
      );
      setValue('title', title);
      setValue('description', description);
      setValue('dueDate', format(parseISO(dueDate), 'dd/MM/yyyy'));
      if (selectedAdmin) {
        setValue('admin', selectedAdmin);
      }
      if (priority === TaskPriority.High) {
        setActiveButton('High');
        setValue('priority', TaskPriority.High);
      } else if (priority === TaskPriority.Medium) {
        setActiveButton('Medium');
        setValue('priority', TaskPriority.Medium);
      } else if (priority === TaskPriority.Low) {
        setActiveButton('Low');
        setValue('priority', TaskPriority.Low);
      }
    } else if (!editMode) {
      reset();
      setActiveButton('High');
      setValue('priority', TaskPriority.High);
    }
  }, [dashboardTasks.results, taskId, setValue, editMode, reset, assignedAdmins]);

  useEffect(() => {
    if (createdDashboardTaskErrors) {
      iterateOverErrorDetailsEachKey<FieldPath<CreateTaskFormValues>>(
        createdDashboardTaskErrors,
        (key, value) => {
          setError(key, { type: 'validate', message: value });
        },
      );
    }
  }, [createdDashboardTaskErrors, setError]);

  useEffect(() => {
    if (updatedDashboardTaskErrors) {
      iterateOverErrorDetailsEachKey<FieldPath<CreateTaskFormValues>>(
        updatedDashboardTaskErrors,
        (key, value) => {
          setError(key, { type: 'validate', message: value });
        },
      );
    }
  }, [updatedDashboardTaskErrors, setError]);

  const onSubmit = useCallback(
    (values: CreateTaskFormValues) => {
      if (taskId && editMode) {
        dispatch(
          updateAdminDashboardTask.request({
            formValues: {
              ...values,
              admin: values?.admin?.value,
            },
            taskId,
            onSuccess: () => {
              reset();
              onClose();
            },
          }),
        );
      }
      if (!editMode) {
        dispatch(
          createAdminDashboardTask.request({
            formValues: {
              ...values,
              admin: values?.admin?.value,
            },
            onSuccess: () => {
              onClose();
              reset();
            },
          }),
        );
      }
    },
    [dispatch, editMode, taskId, onClose, reset],
  );
  return (
    <CenterModal
      title={editMode ? 'Edit task' : 'Add task'}
      className={editMode ? styles['modal-task-edit'] : styles['modal-task']}
      visible={visible}
      onClose={onClose}
    >
      {loadingDashboardTaskById ? (
        <Loader loading />
      ) : (
        <>
          <Input
            type="text"
            name="title"
            placeholder=""
            label="Title"
            className={styles['modal-task__input']}
            control={control}
          />
          <Textarea
            name="description"
            placeholder=""
            maxLength={1023}
            label="Description"
            className={styles['modal-task__textarea']}
            control={control}
          />
          <Select
            name="admin"
            label="Admin"
            placeholder="Choose admin"
            className={styles['modal-unassign-admin__select']}
            options={assignedAdmins}
            control={control}
          />
          <DatePicker
            className={styles['modal-task__date-picker']}
            label="Due Date"
            name="dueDate"
            placeholder="Choose a date"
            control={control}
          />
          <div className={styles['modal-task__priorities']}>
            <div className={styles['modal-task__priorities-priority']}>Priority</div>
            <div className={styles['modal-task__priorities-buttons']}>
              <Button
                title="Low"
                onClick={e => handleChoosePriority(e)}
                className={classNames(
                  activeButton === 'Low'
                    ? styles['modal-task__priorities-buttons-button-low--active']
                    : styles['modal-task__priorities-buttons-button-low'],
                )}
              />
              <Button
                title="Medium"
                onClick={e => handleChoosePriority(e)}
                className={classNames(
                  activeButton === 'Medium'
                    ? styles['modal-task__priorities-buttons-button-medium--active']
                    : styles['modal-task__priorities-buttons-button-medium'],
                )}
              />
              <Button
                title="High"
                onClick={e => handleChoosePriority(e)}
                className={classNames(
                  activeButton === 'High'
                    ? styles['modal-task__priorities-buttons-button-high--active']
                    : styles['modal-task__priorities-buttons-button-high'],
                )}
              />
            </div>
          </div>
          <Button
            variant="accent"
            title={editMode ? 'Edit task' : 'Add task'}
            className={styles['modal-task__submit-btn']}
            onClick={handleSubmit(onSubmit)}
            loading={!editMode ? creatingDashboardTask : updatingDashboardTask}
          />
        </>
      )}
    </CenterModal>
  );
});
