import { yupResolver } from '@hookform/resolvers/yup';
import React, { memo, useCallback, useEffect } from 'react';
import { FieldPath, useForm } from 'react-hook-form';

import { inviteAdmin } from '~/modules/manageAdmins/actions';
import { useDispatch, useSelector } from '~/store';
import { RootState } from '~/store/types';
import { InviteAdminFormValues } from '~/types/formValues';
import { iterateOverErrorDetailsEachKey } from '~/utils/errors';
import { InviteAdminFormValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { Input } from '~/view/components/input';
import { CenterModal } from '~/view/components/modals';

import styles from './styles.scss';

interface InviteAdminModalProps {
  visible: boolean;
  onClose: () => void;
}

export const InviteAdminModal: React.FC<InviteAdminModalProps> = memo(function InviteAdminModal({
  visible,
  onClose,
}) {
  const { inviteAdminLoading, inviteAdminErrors } = useSelector(
    (state: RootState) => state.manageAdmins,
  );
  const dispatch = useDispatch();

  const { control, handleSubmit, reset, setError } = useForm<InviteAdminFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
    resolver: yupResolver(InviteAdminFormValidation),
  });

  const onSubmit = useCallback(
    (values: InviteAdminFormValues) => {
      dispatch(
        inviteAdmin.request({
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

  useEffect(() => {
    if (inviteAdminErrors) {
      iterateOverErrorDetailsEachKey<FieldPath<InviteAdminFormValues>>(
        inviteAdminErrors,
        (key, value) => {
          setError(key, { type: 'validate', message: value });
        },
      );
    }
  }, [inviteAdminErrors, setError]);

  return (
    <CenterModal
      title="Invite Admin"
      className={styles['modal-admin']}
      visible={visible}
      onClose={onClose}
    >
      <div className={styles['modal-admin__body']}>
        <Input
          type="text"
          name="firstName"
          placeholder=""
          label="First Name"
          control={control}
          className={styles['modal-admin__body-input']}
        />
        <Input
          type="text"
          name="lastName"
          placeholder=""
          label="Last Name"
          control={control}
          className={styles['modal-admin__body-input']}
        />
        <Input
          type="text"
          name="email"
          placeholder=""
          label="Email"
          control={control}
          className={styles['modal-admin__body-input']}
        />
        <Button
          variant="accent"
          title="Send invitation"
          className={styles['modal-admin__body-button']}
          onClick={handleSubmit(onSubmit)}
          loading={inviteAdminLoading}
        />
      </div>
    </CenterModal>
  );
});
