import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import React, { useCallback, useEffect } from 'react';
import { FieldPath, useForm } from 'react-hook-form';
import { RouteComponentProps } from 'react-router-dom';

import {
  citiesAsSelectOptionsSelector,
  statesAsSelectOptionsSelector,
} from '~/modules/common/selectors';
import { resetErrors } from '~/modules/companyRegistration/actions';
import { editEmployerInfo } from '~/modules/createEmployer/actions';
import { Admin } from '~/services/api/Admin';
import { useDispatch, useSelector } from '~/store';
import { EnterCompanyMainInfoFormValues, UpdateCompanyInfoFormValues } from '~/types/formValues';
import { iterateOverErrorDetailsEachKey } from '~/utils/errors';
import { getCompanyFormValues } from '~/utils/initialFormValues';
import { UpdateCompanyInfoFormValidationAdminRole } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { Input } from '~/view/components/input';
import { Select, SelectOption } from '~/view/components/select';
import { LookingCandidate } from '~/view/pages/company/auth/register/enter-main-info/components/looking-candidate';

import styles from './styles.scss';

export const EditEmployerInfoPage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const citiesAsSelectOptions = useSelector(citiesAsSelectOptionsSelector);
  const statesAsSelectOptions = useSelector(statesAsSelectOptionsSelector);
  const { employerInfo, updatingEmployerInfo, updateEmployerInfoErrors } = useSelector(
    state => state.createEmployer,
  );

  const { control, handleSubmit, setError, watch, setValue } =
    useForm<EnterCompanyMainInfoFormValues>({
      defaultValues: getCompanyFormValues(employerInfo),
      resolver: yupResolver(UpdateCompanyInfoFormValidationAdminRole),
    });
  const selectedCity = watch('city') as SelectOption<{ stateId: number }>;
  const admin = watch('admin') as unknown as number;

  useEffect(() => {
    dispatch(resetErrors());
  }, [dispatch]);

  useEffect(() => {
    if (employerInfo !== null) {
      const { user } = employerInfo;
      setValue('user.email', user.email);
    }
  }, [employerInfo, setValue]);

  const loadAdmins = useCallback(
    async (value): Promise<SelectOption[]> => {
      const {
        data: { data },
      } = await Admin.getAllAdmins({
        offset: 0,
        limit: 10,
        search: value,
      });

      const admins = data.results.map(admin => ({
        value: admin.id,
        label: `${admin.firstName} ${admin.lastName}`,
      }));

      setValue('admin', admins.find(admn => admn.value === admin) as SelectOption);

      return admins;
    },
    [admin, setValue],
  );

  useEffect(() => {
    if (selectedCity === null) {
      setValue('state', null);
    } else {
      const stateOfSelectedCity = statesAsSelectOptions.find(
        state => state.value === selectedCity?.meta?.stateId,
      );

      setValue('state', stateOfSelectedCity || null, { shouldValidate: true });
    }
  }, [selectedCity, setValue, statesAsSelectOptions]);

  useEffect(() => {
    if (selectedCity) {
      const selectedCityOption = citiesAsSelectOptions.find(
        city => city.value === employerInfo?.city,
      ) as SelectOption<{ stateId: number }>;
      setValue('city', selectedCityOption);
    }
  }, []);

  useEffect(() => {
    if (updateEmployerInfoErrors) {
      iterateOverErrorDetailsEachKey<FieldPath<EnterCompanyMainInfoFormValues>>(
        updateEmployerInfoErrors,
        (key, value) => {
          setError(key, { type: 'validate', message: value });
        },
      );
    }
  }, [updateEmployerInfoErrors, setError]);

  const onSubmit = useCallback(
    (values: UpdateCompanyInfoFormValues) => {
      dispatch(
        editEmployerInfo.request({
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
      <div className={styles['page__form-row']}>
        <Input name="name" label="Company name" placeholder="Company name" control={control} />
        <Select
          loadOptions={value => loadAdmins(value)}
          async
          searchable
          name="admin"
          label="Assign admin"
          placeholder="Select"
          control={control}
          options={[]}
        />
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
          loading={updatingEmployerInfo}
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </div>
  );
};
