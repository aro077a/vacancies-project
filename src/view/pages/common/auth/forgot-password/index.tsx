import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RouteComponentProps } from 'react-router-dom';

import { forgotPassword, resetErrors } from '~/modules/user/actions';
import { useDispatch, useSelector } from '~/store';
import { RootState } from '~/store/types';
import { ForgotPasswordFormValues } from '~/types/formValues';
import { CommonRouter } from '~/utils/router';
import { ForgotPasswordFormValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { Input } from '~/view/components/input';
import { SuccessModal } from '~/view/components/success-modal';

import { InfoModal } from './info-modal';
import styles from './styles.scss';

export const ForgotPasswordPage: React.FC<RouteComponentProps> = ({ history }) => {
  const [infoModalVisible, setInfoModalVisible] = useState<boolean>(false);
  const [successModalVisible, setSuccessModalVisible] = useState<boolean>(false);
  const [isResetPassword, setIsResetPassword] = useState<boolean>(false);

  const { forgotPasswordErrors, loadingForgotPassword } = useSelector(
    (state: RootState) => state.user,
  );

  const dispatch = useDispatch();
  const { control, handleSubmit, setError, clearErrors } = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: '',
    },
    resolver: yupResolver(ForgotPasswordFormValidation),
  });

  useEffect(() => {
    dispatch(resetErrors());
  }, [dispatch]);

  const toggleInfoModalVisibility = useCallback(() => {
    setInfoModalVisible(prevValue => !prevValue);
  }, []);

  const toggleSuccessModalVisibility = useCallback(() => {
    setSuccessModalVisible(prevValue => !prevValue);
  }, []);

  const handleReset = useCallback(() => {
    setSuccessModalVisible(false);
    setIsResetPassword(false);
    history.push(CommonRouter.auth.login);
  }, [history]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isResetPassword) {
        handleReset();
      }
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [handleReset, isResetPassword]);

  const onSubmit = useCallback(
    (values: ForgotPasswordFormValues) => {
      dispatch(
        forgotPassword.request({
          formValues: values,
          onSuccess: () => {
            setSuccessModalVisible(true);
            setIsResetPassword(true);
          },
        }),
      );
    },
    [dispatch, setSuccessModalVisible],
  );

  useEffect(() => {
    if (forgotPasswordErrors) {
      setError('email', { type: 'warning', message: forgotPasswordErrors as string });
    } else {
      clearErrors('email');
    }
  }, [clearErrors, forgotPasswordErrors, setError]);

  return (
    <div className={styles['page']}>
      <h1 className={styles['page__title']}>Forgot password</h1>
      <p className={styles['page__subtitle']}>
        Ooh no, looks like you forgot your password. Let us help you find it again, enter your email
        linked to your account below. Hope you're better at building than you are at remembering
        passwords 😊
      </p>
      <Input
        type="email"
        label="Email address"
        placeholder="example@gmail.com"
        className={styles['page__email-input']}
        name="email"
        control={control}
      />
      <div className={styles['page__button-wrapper']}>
        <Button
          className={styles['page__button-wrapper-reset']}
          title="Reset password"
          onClick={handleSubmit(onSubmit)}
          loading={loadingForgotPassword}
        />
      </div>
      <InfoModal visible={infoModalVisible} onClose={toggleInfoModalVisibility} />
      <SuccessModal
        visible={successModalVisible}
        onClose={toggleSuccessModalVisibility}
        title="Password reset success"
        description="The recovery link was sent to your email"
      />
    </div>
  );
};
