import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, RouteComponentProps } from 'react-router-dom';

import { UserType } from '~/models/common';
import { login, resetErrors } from '~/modules/user/actions';
import { useDispatch, useSelector } from '~/store';
import { LoginRequestBody } from '~/types/requests';
import { AdminRouter, CandidateRouter, CommonRouter, CompanyRouter } from '~/utils/router';
import { LoginPageFormValidation } from '~/utils/validations';
import company1 from '~/view/assets/images/company-1.svg';
import company2 from '~/view/assets/images/company-2.svg';
import company3 from '~/view/assets/images/company-3.svg';
import company4 from '~/view/assets/images/company-4.svg';
import company5 from '~/view/assets/images/company-5.svg';
import company6 from '~/view/assets/images/company-6.svg';
import { Button } from '~/view/components/button';
import { Input } from '~/view/components/input';
import { useAutoScroll } from '~/view/hooks/useAutoScroll';

import styles from './styles.scss';

export const LoginPage: React.FC<RouteComponentProps> = ({ history }) => {
  const dispatch = useDispatch();
  const { loggingIn, loggingInError } = useSelector(state => state.user);
  const autoScrollableElementRef = useAutoScroll<HTMLDivElement>();
  const { control, handleSubmit, setError, clearErrors } = useForm<LoginRequestBody>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(LoginPageFormValidation),
  });

  useEffect(() => {
    dispatch(resetErrors());
  }, [dispatch]);

  useEffect(() => {
    if (loggingInError) {
      setError('email', { type: 'warning', message: loggingInError });
    } else {
      clearErrors('email');
    }
  }, [clearErrors, loggingInError, setError]);

  const onSubmit = useCallback(
    (values: LoginRequestBody) => {
      dispatch(
        login.request({
          formValues: values,
          onSuccess: (loggedInUserType: string) => {
            if (loggedInUserType === UserType.ADMIN || loggedInUserType === UserType.SUPER_ADMIN) {
              history.push(AdminRouter.dashboard);
            } else if (loggedInUserType === UserType.CANDIDATE) {
              history.push(CandidateRouter.findJobs);
            } else {
              history.push(CompanyRouter.addJobs);
            }
          },
        }),
      );
    },
    [dispatch, history],
  );

  return (
    <div className={styles['page']}>
      <h1 className={styles['page__title']}>Login to Timbyr</h1>
      <p className={styles['page__subtitle']}>
        Find top talent on construction vacancies: Contract administrators, Site supervisors,
        Estimators, Project managers, Design managers, Hse advisors, Forepersons, Construction
        managers, Cadets and juniors.
      </p>
      <Input
        type="email"
        label="Email address"
        placeholder="example@gmail.com"
        className={styles['page__email-input']}
        name="email"
        control={control}
      />
      <Input
        type="password"
        label="Password"
        placeholder="Your password"
        className={styles['page__password-input']}
        name="password"
        control={control}
      />
      <div className={styles['page__forgot-password-wrapper']}>
        <Link to={CommonRouter.auth.forgotPassword} className={styles['page__forgot-password']}>
          Forgot password?
        </Link>
      </div>
      <Button
        className={styles['page__login-button']}
        title="Login"
        loading={loggingIn}
        onClick={handleSubmit(onSubmit)}
      />
      <div className={styles['page__horizontal-separator']} />
      <h3 className={styles['page__companies-title']}>
        Connect with Construction Companies currently hiring
      </h3>
      <div className={styles['page__companies-wrapper']} ref={autoScrollableElementRef}>
        <img className={styles['page__company-logo']} src={company1} alt="company logo" />
        <img className={styles['page__company-logo']} src={company2} alt="company logo" />
        <img className={styles['page__company-logo']} src={company3} alt="company logo" />
        <img className={styles['page__company-logo']} src={company4} alt="company logo" />
        <img className={styles['page__company-logo']} src={company5} alt="company logo" />
        <img className={styles['page__company-logo']} src={company6} alt="company logo" />
        <img className={styles['page__company-logo']} src={company1} alt="company logo" />
        <img className={styles['page__company-logo']} src={company2} alt="company logo" />
        <img className={styles['page__company-logo']} src={company3} alt="company logo" />
        <img className={styles['page__company-logo']} src={company4} alt="company logo" />
        <img className={styles['page__company-logo']} src={company5} alt="company logo" />
        <img className={styles['page__company-logo']} src={company6} alt="company logo" />
      </div>
    </div>
  );
};
