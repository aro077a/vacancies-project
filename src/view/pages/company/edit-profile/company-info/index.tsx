import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import React, { useCallback, useEffect } from 'react';
import { FieldPath, useForm } from 'react-hook-form';
import { RouteComponentProps } from 'react-router-dom';

import {
  citiesAsSelectOptionsSelector,
  statesAsSelectOptionsSelector,
} from '~/modules/common/selectors';
import { editCompanyInfo } from '~/modules/companyEditProfile/actions';
import { resetErrors } from '~/modules/companyRegistration/actions';
import { useDispatch, useSelector } from '~/store';
import { EnterCompanyMainInfoFormValues, UpdateCompanyInfoFormValues } from '~/types/formValues';
import { iterateOverErrorDetailsEachKey } from '~/utils/errors';
import { getCompanyFormValues } from '~/utils/initialFormValues';
import { UpdateCompanyInfoFormValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { Input } from '~/view/components/input';
import { Select, SelectOption } from '~/view/components/select';
import { LookingCandidate } from '~/view/pages/company/auth/register/enter-main-info/components/looking-candidate';

import styles from './styles.scss';

export const EditCompanyInfoPage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const citiesAsSelectOptions = useSelector(citiesAsSelectOptionsSelector);
  const statesAsSelectOptions = useSelector(statesAsSelectOptionsSelector);
  const { companyInfo, updatingCompanyInfoLoading, updateCompanyInfoErrors } = useSelector(
    state => state.companyProfile,
  );
  const { control, handleSubmit, setError, watch, setValue } =
    useForm<EnterCompanyMainInfoFormValues>({
      defaultValues: getCompanyFormValues(companyInfo),
      resolver: yupResolver(UpdateCompanyInfoFormValidation),
    });
  const selectedCity = watch('city') as SelectOption<{ stateId: number }>;

  useEffect(() => {
    dispatch(resetErrors());
  }, [dispatch]);

  useEffect(() => {
    if (companyInfo !== null) {
      const { user } = companyInfo;
      setValue('user.email', user.email);
    }
  }, [companyInfo, setValue]);

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
    if (selectedCity) {
      const selectedCityOption = citiesAsSelectOptions.find(
        city => city.value === companyInfo?.city,
      ) as SelectOption<{ stateId: number }>;
      setValue('city', selectedCityOption);
    }
  }, []);

  useEffect(() => {
    if (updateCompanyInfoErrors) {
      iterateOverErrorDetailsEachKey<FieldPath<EnterCompanyMainInfoFormValues>>(
        updateCompanyInfoErrors,
        (key, value) => {
          setError(key, { type: 'validate', message: value });
        },
      );
    }
  }, [updateCompanyInfoErrors, setError]);

  const onSubmit = useCallback(
    (values: UpdateCompanyInfoFormValues) => {
      dispatch(
        editCompanyInfo.request({
          formValues: values,
        }),
      );
    },
    [dispatch],
  );

  return (
    <div className={styles['page']}>
      <div className={styles['page__header-wrapper']}>
        <h1 className={styles['page__title']}>Enter company info</h1>
      </div>
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
      <div
        className={classNames(styles['page__form-row'], styles['page__form-row--single-column'])}
      >
        <Input
          type="text"
          name="abn"
          label="ABN number"
          placeholder="ABN number"
          control={control}
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
          title="Save changes"
          variant="accent"
          className={styles['page__form-footer-button']}
          loading={updatingCompanyInfoLoading}
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </div>
  );
};
