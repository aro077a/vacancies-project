import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useEffect } from 'react';
import { FieldPath, useForm } from 'react-hook-form';

import { editAdminProfileDetails, setAdminProfile } from '~/modules/adminEditProfile/actions';
import { useDispatch, useSelector } from '~/store';
import { EditAdminProfileDetailsFormValues } from '~/types/formValues';
import { iterateOverErrorDetailsEachKey } from '~/utils/errors';
import { AdminProfileDetailsValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { Input } from '~/view/components/input';
import { Loader } from '~/view/components/loader';

import styles from './styles.scss';

export const ProfileDetailsPage: React.FC = () => {
  const dispatch = useDispatch();
  const adminProfileDetails = useSelector(state => state.adminProfile);
  const { profileDetailsEditErrors, getAdminProfileLoading, profileEditingLoading } = useSelector(
    state => state.adminProfile,
  );
  const { control, setValue, handleSubmit, setError } = useForm<EditAdminProfileDetailsFormValues>({
    defaultValues: {
      user: {
        email: '',
      },
      phone: '',
    },
    resolver: yupResolver(AdminProfileDetailsValidation),
  });

  useEffect(() => {
    if (adminProfileDetails && adminProfileDetails.user !== null) {
      const { user, phone } = adminProfileDetails;
      setValue('user.email', user?.email);
      setValue('phone', phone);
    }
  }, [adminProfileDetails, setValue]);

  useEffect(() => {
    dispatch(setAdminProfile.request());
  }, [dispatch]);

  useEffect(() => {
    if (profileDetailsEditErrors) {
      iterateOverErrorDetailsEachKey<FieldPath<EditAdminProfileDetailsFormValues>>(
        profileDetailsEditErrors,
        (key, value) => {
          setError(key, { type: 'validate', message: value });
        },
      );
    }
  }, [profileDetailsEditErrors, setError]);

  const onSubmit = useCallback(
    (values: EditAdminProfileDetailsFormValues) => {
      dispatch(
        editAdminProfileDetails.request({
          formValues: values,
        }),
      );
    },
    [dispatch],
  );

  return (
    <div className={styles['page']}>
      <div className={styles['page__header-wrapper']}>
        <h1 className={styles['page__title']}>Profile details</h1>
      </div>
      {getAdminProfileLoading ? (
        <Loader loading />
      ) : (
        <>
          <div className={styles['page__form-rows']}>
            <Input
              type="email"
              name="user.email"
              label="Email address"
              placeholder="Email address"
              className={styles['page__form-rows-input']}
              control={control}
            />
            <Input
              type="tel"
              name="phone"
              label="Phone number (optional)"
              placeholder="+"
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
              loading={profileEditingLoading}
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </>
      )}
    </div>
  );
};
