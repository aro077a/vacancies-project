import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useEffect } from 'react';
import { FieldPath, useForm } from 'react-hook-form';

import { editClientDetails } from '~/modules/companyEditProfile/actions';
import { resetErrors } from '~/modules/createEmployer/actions';
import { useDispatch, useSelector } from '~/store';
import { CreateEmployerBusinessFormValues } from '~/types/formValues';
import { iterateOverErrorDetailsEachKey } from '~/utils/errors';
import { getCreateBusinessEmployerFormValues } from '~/utils/initialFormValues';
import { CreateEmployerBusinessFormValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { Input } from '~/view/components/input';

import styles from './styles.scss';

export const CompanyClientContactDetailsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { clientDetails, updateCLientDetailsErrors, updatingCLientDetailsLoading } = useSelector(
    state => state.companyProfile,
  );
  const { control, setError, handleSubmit } = useForm<CreateEmployerBusinessFormValues>({
    defaultValues: getCreateBusinessEmployerFormValues(clientDetails),
    resolver: yupResolver(CreateEmployerBusinessFormValidation),
  });

  useEffect(() => {
    dispatch(resetErrors());
  }, [dispatch]);

  useEffect(() => {
    if (updateCLientDetailsErrors) {
      iterateOverErrorDetailsEachKey<FieldPath<CreateEmployerBusinessFormValues>>(
        updateCLientDetailsErrors,
        (key, value) => {
          setError(key, { type: 'validate', message: value });
        },
      );
    }
  }, [updateCLientDetailsErrors, setError]);

  const onSubmit = useCallback(
    (values: CreateEmployerBusinessFormValues) => {
      dispatch(
        editClientDetails.request({
          formValues: values,
        }),
      );
    },
    [dispatch],
  );

  return (
    <div className={styles['page']}>
      <div className={styles['page__header-wrapper']}>
        <h1 className={styles['page__title']}>Edit client contact details</h1>
      </div>
      <div className={styles['page__form-row']}>
        <Input
          placeholder=""
          name="name"
          label="Business contact name"
          className={styles['page__form-row-input']}
          control={control}
        />
        <Input
          placeholder=""
          name="position"
          label="Business contact position (optional)"
          className={styles['page__form-row-input']}
          control={control}
        />
        <Input
          placeholder=""
          name="email"
          label="Business contact email"
          className={styles['page__form-row-input']}
          control={control}
        />
        <Input
          placeholder=""
          name="phone"
          label="Best phone number"
          className={styles['page__form-row-input']}
          control={control}
        />
        <div className={styles['page__form-footer']}>
          <Button
            type="submit"
            variant="accent"
            title="Save changes"
            className={styles['page__form-footer-button']}
            loading={updatingCLientDetailsLoading}
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </div>
    </div>
  );
};
