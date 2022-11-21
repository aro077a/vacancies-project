import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useEffect } from 'react';
import { FieldPath, useForm } from 'react-hook-form';

import {
  editAdminPaymentDetails,
  getAdminPaymentDetails,
} from '~/modules/adminEditProfile/actions';
import { useDispatch, useSelector } from '~/store';
import { EditAdminPaymentDetailsFormValues } from '~/types/formValues';
import { iterateOverErrorDetailsEachKey } from '~/utils/errors';
import { AdminPaymentDetailsValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { Input } from '~/view/components/input';
import { Loader } from '~/view/components/loader';

import styles from './styles.scss';

export const PaymentDetailsPage: React.FC = () => {
  const dispatch = useDispatch();
  const {
    paymentDetails,
    gettingPaymentDetailsLoading,
    editingPaymentDetailsLoading,
    paymentDetailsEditErrors,
  } = useSelector(state => state.adminProfile);
  const { control, setValue, handleSubmit, setError } = useForm<EditAdminPaymentDetailsFormValues>({
    defaultValues: {
      abn: '',
      tfn: '',
      bsb: '',
      acc: '',
    },
    resolver: yupResolver(AdminPaymentDetailsValidation),
  });

  useEffect(() => {
    if (paymentDetails !== null) {
      const { abn, tfn, bsb, acc } = paymentDetails;
      setValue('abn', abn);
      setValue('tfn', tfn);
      setValue('bsb', bsb);
      setValue('acc', acc);
    }
  }, [paymentDetails, setValue]);

  useEffect(() => {
    dispatch(getAdminPaymentDetails.request());
  }, [dispatch]);

  useEffect(() => {
    if (paymentDetailsEditErrors) {
      iterateOverErrorDetailsEachKey<FieldPath<EditAdminPaymentDetailsFormValues>>(
        paymentDetailsEditErrors,
        (key, value) => {
          setError(key, { type: 'validate', message: value });
        },
      );
    }
  }, [paymentDetailsEditErrors, setError]);

  const onSubmit = useCallback(
    (values: EditAdminPaymentDetailsFormValues) => {
      dispatch(
        editAdminPaymentDetails.request({
          formValues: values,
        }),
      );
    },
    [dispatch],
  );

  return (
    <div className={styles['page']}>
      <div className={styles['page__header-wrapper']}>
        <h1 className={styles['page__title']}>Payment details</h1>
      </div>
      {gettingPaymentDetailsLoading ? (
        <Loader loading />
      ) : (
        <>
          <div className={styles['page__form-rows']}>
            <Input
              type="text"
              name="abn"
              placeholder=""
              label="Sole trade ABN"
              className={styles['page__form-rows-input']}
              control={control}
            />
            <Input
              type="text"
              name="tfn"
              label="TFN"
              placeholder=""
              className={styles['page__form-rows-input']}
              control={control}
            />
            <Input
              type="text"
              name="bsb"
              label="BSB number"
              placeholder=""
              className={styles['page__form-rows-input']}
              control={control}
            />
            <Input
              type="text"
              name="acc"
              label="Account number"
              placeholder=""
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
              loading={editingPaymentDetailsLoading}
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </>
      )}
    </div>
  );
};
