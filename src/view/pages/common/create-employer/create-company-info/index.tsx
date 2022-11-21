import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useEffect } from 'react';
import { FieldPath, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import {
  citiesAsSelectOptionsSelector,
  statesAsSelectOptionsSelector,
} from '~/modules/common/selectors';
import { createEmployerCompanyInfo, resetErrors } from '~/modules/createEmployer/actions';
import { Admin } from '~/services/api/Admin';
import { useDispatch, useSelector } from '~/store';
import { CreateNewEmployerFormValues } from '~/types/formValues';
import { iterateOverErrorDetailsEachKey } from '~/utils/errors';
import { getCreateEmployerFormValues } from '~/utils/initialFormValues';
import { CommonRouter } from '~/utils/router';
import { CreateEmployerFormValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { Input } from '~/view/components/input';
import { Select, SelectOption } from '~/view/components/select';

import styles from './styles.scss';

export const CreateEmployerCompanyInfo: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const statesAsSelectOptions = useSelector(statesAsSelectOptionsSelector);
  const citiesAsSelectOptions = useSelector(citiesAsSelectOptionsSelector);
  const {
    creatingEmployerCompanyInfoErrors,
    creatingEmployerCompanyInfo,
    employerCompanyInfoCreated,
  } = useSelector(state => state.createEmployer);
  const { control, watch, setValue, setError, handleSubmit } = useForm<CreateNewEmployerFormValues>(
    {
      defaultValues: getCreateEmployerFormValues(employerCompanyInfoCreated),
      resolver: yupResolver(CreateEmployerFormValidation),
    },
  );

  const selectedCity = watch('city') as SelectOption<{ stateId: number }>;
  const admin = watch('admin') as unknown as number;

  useEffect(() => {
    if (selectedCity) {
      const selectedCityOption = citiesAsSelectOptions.find(
        city => city.value === employerCompanyInfoCreated?.city,
      ) as SelectOption<{ stateId: number }>;
      setValue('city', selectedCityOption);
    }
  }, []);

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
    if (creatingEmployerCompanyInfoErrors) {
      iterateOverErrorDetailsEachKey<FieldPath<CreateNewEmployerFormValues>>(
        creatingEmployerCompanyInfoErrors,
        (key, value) => {
          setError(key, { type: 'validate', message: value });
        },
      );
    }
  }, [creatingEmployerCompanyInfoErrors, setError]);
  const onSubmit = useCallback(
    (values: CreateNewEmployerFormValues) => {
      dispatch(
        createEmployerCompanyInfo.request({
          formValue: values,
          onSuccess: () => {
            history.push(CommonRouter.createEmployer.createCompanyLogo);
          },
        }),
      );
    },
    [dispatch, history],
  );

  return (
    <div className={styles['page']}>
      <>
        <div className={styles['page__header-wrapper']}>
          <h1 className={styles['page__title']}>Enter main company info</h1>
          <p className={styles['page__order-number']}>
            1<span>/2</span>
          </p>
        </div>
        <p className={styles['page__subtitle']}>
          Input the basic information and your account manager will be in touch to complete your
          profile.
        </p>
      </>
      <div className={styles['wrapper']}>
        <div className={styles['page--double-column']}>
          <Input
            placeholder=""
            name="name"
            label="Company name"
            className={styles['page--field']}
            control={control}
          />
          <Select
            loadOptions={value => loadAdmins(value)}
            async
            searchable
            placeholder="Select"
            control={control}
            name="admin"
            label="Assign admin"
            className={styles['page--field']}
            options={[]}
          />
        </div>
        <div className={styles['page--double-column']}>
          <Input
            control={control}
            className={styles['page--field']}
            name="firstName"
            label="Representative name"
            placeholder="Representative name"
          />
          <Input
            control={control}
            className={styles['page--field']}
            name="lastName"
            label="Representative last name"
            placeholder="Representative last name"
          />
        </div>
        <div className={styles['page--double-column']}>
          <Select
            searchable
            name="city"
            placeholder="Select"
            label="City"
            options={citiesAsSelectOptions}
            control={control}
            className={styles['page--field']}
          />
          <Select
            disabled
            name="state"
            placeholder="Select"
            label="State/Territory"
            options={statesAsSelectOptions}
            control={control}
            className={styles['page--field']}
          />
        </div>
        <Input
          placeholder=""
          name="user.email"
          label="Account email address"
          className={styles['page--field']}
          control={control}
        />
        <Input
          name="abn"
          label="ABN number"
          placeholder="ABN number"
          className={styles['page--field']}
          control={control}
          maxLength={15}
        />
        <Input
          placeholder=""
          name="address"
          label="HQ address"
          className={styles['page--field']}
          control={control}
        />
        <p className={styles['page--address-hint']}>The address of the main company office</p>
        <Input
          type="tel"
          name="phone"
          label="Office phone (optional)"
          placeholder="+"
          mask="+"
          className={styles['page--field']}
          control={control}
        />
        <Input
          placeholder=""
          name="site"
          label="Website link (optional)"
          className={styles['page--field']}
          control={control}
        />
        <div className={styles['page--btn']}>
          <Button
            type="submit"
            title="Next"
            loading={creatingEmployerCompanyInfo}
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </div>
    </div>
  );
};
