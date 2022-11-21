import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useEffect } from 'react';
import { FieldPath, useForm } from 'react-hook-form';

import { editAdminPassword } from '~/modules/adminEditProfile/actions';
import { useDispatch, useSelector } from '~/store';
import { EditPasswordFormValues } from '~/types/formValues';
import { iterateOverErrorDetailsEachKey } from '~/utils/errors';
import { ChangePasswordValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { Input } from '~/view/components/input';

import styles from './styles.scss';

export const PasswordPage: React.FC = () => {
  const { editingPasswordLoading, editPasswordErrors } = useSelector(state => state.adminProfile);
  const dispatch = useDispatch();
  const { control, setError, handleSubmit } = useForm<EditPasswordFormValues>({
    defaultValues: {
      password: '',
      newPassword: '',
      confirmPassword: '',
    },
    resolver: yupResolver(ChangePasswordValidation),
  });

  useEffect(() => {
    if (editPasswordErrors) {
      iterateOverErrorDetailsEachKey<FieldPath<EditPasswordFormValues>>(
        editPasswordErrors,
        (key, value) => {
          setError(key, { type: 'validate', message: value });
        },
      );
    }
  }, [editPasswordErrors, setError]);

  const onSubmit = useCallback(
    (values: EditPasswordFormValues) => {
      dispatch(
        editAdminPassword.request({
          formValues: values,
        }),
      );
    },
    [dispatch],
  );

  return (
    <div className={styles['page']}>
      <div className={styles['page__header-wrapper']}>
        <h1 className={styles['page__title']}>Change password</h1>
      </div>
      <div className={styles['page__form-rows']}>
        <Input
          type="password"
          name="password"
          placeholder=""
          label="Current Password"
          className={styles['page__form-rows-input']}
          control={control}
        />
        <Input
          type="password"
          name="newPassword"
          label="New Password"
          placeholder=""
          className={styles['page__form-rows-input']}
          control={control}
        />
        <Input
          type="password"
          name="confirmPassword"
          label="Repeat New Password"
          placeholder=""
          className={styles['page__form-rows-input']}
          control={control}
        />
      </div>
      <div className={styles['page__form-footer']}>
        <Button
          type="submit"
          title="Save changes"
          variant="accent"
          className={styles['page__form-footer-button']}
          loading={editingPasswordLoading}
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </div>
  );
};
