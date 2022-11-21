import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import React, { useCallback, useEffect } from 'react';
import { FieldPath, useForm } from 'react-hook-form';
import { RouteComponentProps } from 'react-router-dom';

import { LookingCandidateStatus } from '~/models/company';
import {
  citiesAsSelectOptionsSelector,
  statesAsSelectOptionsSelector,
} from '~/modules/common/selectors';
import { enterInfo, resetErrors } from '~/modules/companyRegistration/actions';
import { useDispatch, useSelector } from '~/store';
import { EnterCompanyMainInfoFormValues } from '~/types/formValues';
import { iterateOverErrorDetailsEachKey } from '~/utils/errors';
import { EnterCompanyMainInfoFormValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { Input } from '~/view/components/input';
import { Select } from '~/view/components/select';

import { LookingCandidate } from './components/looking-candidate';
import styles from './styles.scss';

export const EnterMainInfoPage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const setupPagesCount = useSelector(state => state.registration.setupPagesCount);
  const citiesAsSelectOptions = useSelector(citiesAsSelectOptionsSelector);
  const statesAsSelectOptions = useSelector(statesAsSelectOptionsSelector);
  const enteringMainInfo = useSelector(state => state.companyRegistration.enteringMainInfo);
  const enteringMainInfoErrors = useSelector(
    state => state.companyRegistration.enteringMainInfoErrors,
  );
  const { control, handleSubmit, setError, watch, setValue } =
    useForm<EnterCompanyMainInfoFormValues>({
      defaultValues: {
        name: '',
        firstName: '',
        lastName: '',
        city: null,
        state: null,
        user: {
          email: '',
          password: '',
          repeatPassword: '',
        },
        status: LookingCandidateStatus.ACTIVE,
        address: '',
        phone: '',
        site: '',
        abn: '',
      },
      resolver: yupResolver(EnterCompanyMainInfoFormValidation),
    });
  const selectedCity = watch('city');

  useEffect(() => {
    dispatch(resetErrors());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCity === null) {
      setValue('state', null);
    } else {
      const stateOfSelectedCity = statesAsSelectOptions.find(
        state => state.value === selectedCity.meta?.stateId,
      );

      setValue('state', stateOfSelectedCity || null, { shouldValidate: true });
    }
  }, [selectedCity, setValue, statesAsSelectOptions]);

  useEffect(() => {
    if (enteringMainInfoErrors) {
      iterateOverErrorDetailsEachKey<FieldPath<EnterCompanyMainInfoFormValues>>(
        enteringMainInfoErrors,
        (key, value) => {
          setError(key, { type: 'validate', message: value });
        },
      );
    }
  }, [enteringMainInfoErrors, setError]);

  const onSubmit = useCallback(
    (values: EnterCompanyMainInfoFormValues) => {
      dispatch(enterInfo.request(values));
    },
    [dispatch],
  );

  return (
    <div className={styles['page']}>
      <div className={styles['page__header-wrapper']}>
        <h1 className={styles['page__title']}>Enter main company info</h1>
        <p className={styles['page__order-number']}>
          2<span>/{setupPagesCount}</span>
        </p>
      </div>
      <p className={styles['page__subtitle']}>
        Please complete the form below to register with the Timbyr team, we are excited to work with
        you and link you with top talent.
      </p>
      <div
        className={classNames(styles['page__form-row'], styles['page__form-row--single-column'])}
      >
        <Input name="name" label="Company name" placeholder="Company name" control={control} />
      </div>
      <div className={styles['page__form-row']}>
        <Input
          control={control}
          name="firstName"
          label="Representative name"
          placeholder="Representative name"
        />
        <Input
          control={control}
          name="lastName"
          label="Representative last name"
          placeholder="Representative last name"
        />
      </div>
      <div className={styles['page__form-row']}>
        <Select
          searchable
          name="city"
          placeholder="Select"
          label="City"
          options={citiesAsSelectOptions}
          control={control}
        />
        <Select
          disabled
          name="state"
          placeholder="Select"
          label="State/Territory"
          options={statesAsSelectOptions}
          control={control}
        />
      </div>
      <div
        className={classNames(styles['page__form-row'], styles['page__form-row--single-column'])}
      >
        <Input
          type="email"
          name="user.email"
          label="Account email address"
          placeholder="Email address"
          control={control}
        />
      </div>
      <div className={styles['page__form-row']}>
        <Input
          type="password"
          name="user.password"
          label="Password"
          placeholder="Password"
          control={control}
        />
        <Input
          type="password"
          name="user.repeatPassword"
          label="Repeat Password"
          placeholder="Repeat password"
          control={control}
        />
      </div>
      <div
        className={classNames(styles['page__form-row'], styles['page__form-row--single-column'])}
      >
        <Input
          name="abn"
          label="ABN number"
          placeholder="ABN number"
          control={control}
          maxLength={15}
        />
      </div>
      <div
        className={classNames(styles['page__form-row'], styles['page__form-row--single-column'])}
      >
        <LookingCandidate name="status" control={control} />
      </div>
      <div
        className={classNames(styles['page__form-row'], styles['page__form-row--single-column'])}
      >
        <Input
          name="address"
          label="HQ address"
          placeholder="HQ address"
          hintMessage="The address of the main company office"
          control={control}
        />
      </div>
      <div
        className={classNames(styles['page__form-row'], styles['page__form-row--single-column'])}
      >
        <Input
          type="tel"
          name="phone"
          label="Office phone (optional)"
          placeholder="+"
          mask="+"
          control={control}
        />
      </div>
      <div
        className={classNames(styles['page__form-row'], styles['page__form-row--single-column'])}
      >
        <Input
          name="site"
          label="Website link (optional)"
          placeholder="https://example.com"
          control={control}
        />
      </div>
      <div className={styles['page__form-footer']}>
        <Button
          type="submit"
          title="Next"
          className={styles['page__form-footer-button']}
          loading={enteringMainInfo}
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </div>
  );
};
