import React, { memo, useCallback, useEffect } from 'react';
import { FieldPath, useForm } from 'react-hook-form';

import { assignJobToAdmin, getListOfAdmins } from '~/modules/manageAdmins/actions';
import { adminsAsSelectOptionsSelector } from '~/modules/manageAdmins/selectors';
import { useDispatch, useSelector } from '~/store';
import { RootState } from '~/store/types';
import { AssignJobToAdminFormValues } from '~/types/formValues';
import { iterateOverErrorDetailsEachKey } from '~/utils/errors';
import { Button } from '~/view/components/button';
import { CenterModal } from '~/view/components/modals';
import { Select } from '~/view/components/select';

import styles from './styles.scss';

interface AssignToOnlyAdminProps {
  visible: boolean;
  onClose: (arg0?: number) => void;
}

export const AssignToOnlyAdminModal: React.FC<AssignToOnlyAdminProps> = memo(
  function AssignToOnlyAdminModal({ visible, onClose }) {
    const adminsAsSelectOptions = useSelector(adminsAsSelectOptionsSelector);
    const { jobId, assignJobToAdminErrors, assignJobToAdminLoading } = useSelector(
      (state: RootState) => state.manageAdmins,
    );

    const dispatch = useDispatch();

    const { control, handleSubmit, setValue, reset, setError } =
      useForm<AssignJobToAdminFormValues>({
        defaultValues: {
          job: 0,
          admin: 0,
        },
      });

    useEffect(() => {
      if (assignJobToAdminErrors) {
        iterateOverErrorDetailsEachKey<FieldPath<AssignJobToAdminFormValues>>(
          assignJobToAdminErrors,
          (key, value) => {
            setError(key, { type: 'validate', message: value });
          },
        );
      }
    }, [assignJobToAdminErrors, setError]);

    useEffect(() => {
      dispatch(getListOfAdmins.init({ initialFetch: true }));
    }, [dispatch, setValue, jobId]);

    const onSubmit = useCallback(
      (values: AssignJobToAdminFormValues) => {
        dispatch(
          assignJobToAdmin.request({
            formValues: values,
            onSuccess: () => {
              onClose();
              reset();
            },
          }),
        );
      },
      [dispatch, onClose, reset],
    );

    return (
      <CenterModal
        title="Assign to admin"
        className={styles['modal-unassign-admin']}
        visible={visible}
        onClose={onClose}
      >
        <div className={styles['modal-unassign-admin__body']}>
          <Select
            name="admin"
            label="Select Admin"
            placeholder="Select"
            className={styles['modal-unassign-admin__select']}
            options={adminsAsSelectOptions}
            control={control}
          />
          <Button
            variant="accent"
            title="Confirm and assign"
            className={styles['modal-unassign-admin__button']}
            onClick={handleSubmit(onSubmit)}
            loading={assignJobToAdminLoading}
          />
        </div>
      </CenterModal>
    );
  },
);
