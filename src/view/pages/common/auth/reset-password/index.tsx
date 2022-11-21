import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { RouteComponentProps, useLocation } from 'react-router-dom';

import { resetPassword, setResetPasswordToken } from '~/modules/user/actions';
import { useDispatch, useSelector } from '~/store';
import { RootState } from '~/store/types';
import { ResetPasswordFormValues } from '~/types/formValues';
import { CommonRouter } from '~/utils/router';
import { ResetPasswordFormValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { Input } from '~/view/components/input';

import styles from './styles.scss';

export const ResetPasswordPage: React.FC<RouteComponentProps> = ({ history }) => {
  const { loadingResetPassword } = useSelector((state: RootState) => state.user);
  const { control, handleSubmit } = useForm<ResetPasswordFormValues>({
    defaultValues: {
      password: '',
    },
    resolver: yupResolver(ResetPasswordFormValidation),
  });

  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(setResetPasswordToken({ token: location.search.split('=')[1] }));
  }, [dispatch, location.search]);

  const onSubmit = useCallback(
    (values: ResetPasswordFormValues) => {
      dispatch(
        resetPassword.request({
          formValues: values,
          onSuccess: () => {
            history.push(CommonRouter.auth.login);
          },
        }),
      );
    },
    [dispatch, history],
  );
  return (
    <>
      <div className={styles['page']}>
        <h1 className={styles['page__title']}>Create new password</h1>
        <p className={styles['page__subtitle']}>
          Please create a new password for your account. Admin create a one-time password to login
          to the platform and now you can change it and use for login next time.
        </p>
        <Input
          type="password"
          name="password"
          label="New Password"
          placeholder="Password"
          className={styles['page__input-field']}
          control={control}
        />
        <Input
          type="password"
          name="repeatPassword"
          label="Repeat New Password"
          placeholder="Repeat password"
          className={styles['page__input-field']}
          control={control}
        />
      </div>
      <div className={styles['page__button-wrapper']}>
        <Button
          className={styles['page__button-wrapper-reset']}
          title="Save and continue"
          onClick={handleSubmit(onSubmit)}
          loading={loadingResetPassword}
        />
      </div>
    </>
  );
};
