import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useEffect } from 'react';
import { FieldPath, useForm } from 'react-hook-form';

import { editTermsAndConditions, getTermsAndConditions } from '~/modules/adminEditProfile/actions';
import { useDispatch, useSelector } from '~/store';
import { TermsAndConditionsFormValues } from '~/types/formValues';
import { iterateOverErrorDetailsEachKey } from '~/utils/errors';
import { TermsAndConditionsValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { Loader } from '~/view/components/loader';
import { Textarea } from '~/view/components/textarea';

import styles from './styles.scss';

export const TermsAndConditionsPage: React.FC = () => {
  const dispatch = useDispatch();
  const {
    text,
    gettingTermsAndConditionsLoading,
    editingTermsAndConditionsLoading,
    termsAndConditionsEditErrors,
  } = useSelector(state => state.adminProfile);
  const { control, setValue, handleSubmit, setError } = useForm<{ text: string }>({
    defaultValues: {
      text: '',
    },
    resolver: yupResolver(TermsAndConditionsValidation),
  });

  useEffect(() => {
    if (text) {
      setValue('text', text);
    }
  }, [text, setValue]);

  useEffect(() => {
    dispatch(getTermsAndConditions.request());
  }, [dispatch]);

  useEffect(() => {
    if (termsAndConditionsEditErrors) {
      iterateOverErrorDetailsEachKey<FieldPath<{ text: string }>>(
        termsAndConditionsEditErrors,
        (key, value) => {
          setError(key, { type: 'validate', message: value });
        },
      );
    }
  }, [termsAndConditionsEditErrors, setError]);

  const onSubmit = useCallback(
    (values: TermsAndConditionsFormValues) => {
      dispatch(
        editTermsAndConditions.request({
          formValues: values,
        }),
      );
    },
    [dispatch],
  );

  return (
    <div className={styles['page']}>
      <div className={styles['page__header-wrapper']}>
        <h1 className={styles['page__title']}>Terms & Conditions</h1>
      </div>
      {gettingTermsAndConditionsLoading ? (
        <Loader loading />
      ) : (
        <>
          <div className={styles['page__form-rows']}>
            <Textarea
              name="text"
              placeholder=""
              maxLength={50000}
              label=""
              defaultValue={text}
              control={control}
            />
          </div>
          <div className={styles['page__form-footer']}>
            <Button
              type="submit"
              title="Save changes"
              variant="accent"
              className={styles['page__form-footer-button']}
              loading={editingTermsAndConditionsLoading}
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </>
      )}
    </div>
  );
};
