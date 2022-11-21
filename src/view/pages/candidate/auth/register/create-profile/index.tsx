import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import React, { useCallback, useEffect } from 'react';
import { FieldPath, useForm } from 'react-hook-form';
import { RouteComponentProps } from 'react-router-dom';

import { createProfile, resetErrors } from '~/modules/candidateRegistration/actions';
import {
  citiesAsSelectOptionsSelector,
  statesAsSelectOptionsSelector,
} from '~/modules/common/selectors';
import { useDispatch, useSelector } from '~/store';
import { CreateCandidateProfileFormValues } from '~/types/formValues';
import { iterateOverErrorDetailsEachKey } from '~/utils/errors';
import { CreateCandidateProfileFormValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { Checkbox } from '~/view/components/checkbox';
import { Input } from '~/view/components/input';
import { ResumeUploader } from '~/view/components/resume-uploader';
import { Select } from '~/view/components/select';

import styles from './styles.scss';

export const CreateProfilePage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const setupPagesCount = useSelector(state => state.registration.setupPagesCount);
  const citiesAsSelectOptions = useSelector(citiesAsSelectOptionsSelector);
  const statesAsSelectOptions = useSelector(statesAsSelectOptionsSelector);
  const creatingProfile = useSelector(state => state.candidateRegistration.creatingProfile);
  const creatingProfileErrors = useSelector(
    state => state.candidateRegistration.creatingProfileErrors,
  );
  const prefillDetails = useSelector(state => state.createCandidate.prefillDataFromResume);

  const { control, watch, setValue, setError, handleSubmit } = useForm<
    Omit<CreateCandidateProfileFormValues, 'admin'>
  >({
    defaultValues: {
      user: {
        email: '',
        password: '',
        repeatPassword: '',
      },
      firstName: '',
      lastName: '',
      city: null,
      state: null,
      relocate: false,
      phone: '',
      linkedInResume: null,
    },
    resolver: yupResolver(CreateCandidateProfileFormValidation),
  });

  const selectedCity = watch('city');

  useEffect(() => {
    if (prefillDetails) {
      const { name, contact } = prefillDetails;
      setValue('firstName', name.firstName);
      setValue('lastName', name.lastName);
      setValue('user.email', contact);
    }
  }, [prefillDetails, setValue]);

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
    if (creatingProfileErrors) {
      iterateOverErrorDetailsEachKey<FieldPath<Omit<CreateCandidateProfileFormValues, 'admin'>>>(
        creatingProfileErrors,
        (key, value) => {
          setError(key, { type: 'validate', message: value });
        },
      );
    }
  }, [creatingProfileErrors, setError]);

  const onSubmit = useCallback(
    (values: CreateCandidateProfileFormValues) => {
      if (!values.linkedInResume) {
        delete values.linkedInResume;
      }
      dispatch(createProfile.request(values));
    },
    [dispatch],
  );

  return (
    <div className={styles['page']}>
      <div className={styles['page__header-wrapper']}>
        <h1 className={styles['page__title']}>Create your profile</h1>
        <p className={styles['page__order-number']}>
          2<span>/{setupPagesCount}</span>
        </p>
      </div>
      <p className={styles['page__subtitle']}>
        Please complete the form below to register with the Timbyr team, we are excited to work with
        you and achieve your career goals.
      </p>
      <ResumeUploader name="linkedInResume" control={control} />
      <div className={styles['page__separator-wrapper']}>
        <div className={styles['page__separator-line']} />
        <p className={styles['page__separator-text']}>Or fill in details below</p>
        <div className={styles['page__separator-line']} />
      </div>
      <div className={styles['page__form-row']}>
        <Input name="firstName" label="First name" placeholder="First name" control={control} />
        <Input name="lastName" label="Last name" placeholder="Last name" control={control} />
      </div>
      <div
        className={classNames(styles['page__form-row'], styles['page__form-row--single-column'])}
      >
        <Input
          type="email"
          name="user.email"
          label="Email address"
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
      <div className={classNames(styles['page__form-row'], styles['page__form-row--address-row'])}>
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
        <div className={styles['page__checkbox-wrapper']}>
          <Checkbox name="relocate" control={control} />
          <p className={styles['page__checkbox-label']}>I am ready to relocate</p>
        </div>
      </div>
      <div
        className={classNames(styles['page__form-row'], styles['page__form-row--single-column'])}
      >
        <Input
          type="tel"
          name="phone"
          label="Phone number (optional)"
          placeholder="+"
          mask="+"
          control={control}
        />
      </div>
      <div className={styles['page__form-footer']}>
        <Button
          type="submit"
          title="Next"
          className={styles['page__form-footer-button']}
          loading={creatingProfile}
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </div>
  );
};
