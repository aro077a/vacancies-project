import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { FieldPath, useForm } from 'react-hook-form';
import { RouteComponentProps } from 'react-router-dom';

import {
  citiesAsSelectOptionsSelector,
  statesAsSelectOptionsSelector,
} from '~/modules/common/selectors';
import { createCandidateProfile, resetErrors } from '~/modules/createCandidate/actions';
import { useDispatch, useSelector } from '~/store';
import {
  CreateCandidateProfileFormValues,
  UpdateCandidateProfileFormValues,
} from '~/types/formValues';
import { iterateOverErrorDetailsEachKey } from '~/utils/errors';
import { getCreateCandidateProfileFormValue } from '~/utils/initialFormValues';
import { CandidateProfileFormValidationNoPass } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { Checkbox } from '~/view/components/checkbox';
import { Input } from '~/view/components/input';
import { Loader } from '~/view/components/loader';
import { ResumeUploader } from '~/view/components/resume-uploader';
import { Select, SelectOption } from '~/view/components/select';

import styles from './styles.scss';

export const EditCandidateInfoPage: React.FC<RouteComponentProps> = memo(
  function EditCandidateInfoPage() {
    const dispatch = useDispatch();
    const citiesAsSelectOptions = useSelector(citiesAsSelectOptionsSelector);
    const statesAsSelectOptions = useSelector(statesAsSelectOptionsSelector);
    const creatingProfile = useSelector(state => state.createCandidate.creatingCandidateProfile);
    const [loading, setLoading] = useState(false);
    const { candidateProfileCreated } = useSelector(state => state.createCandidate);
    const createdCandidateInfo = useSelector(
      state => state.createCandidate.candidateProfileCreated,
    );
    const creatingProfileErrors = useSelector(
      state => state.createCandidate.creatingCandidateProfileErrors,
    );

    const { control, watch, setValue, setError, handleSubmit } = useForm<
      CreateCandidateProfileFormValues | UpdateCandidateProfileFormValues
    >({
      defaultValues: getCreateCandidateProfileFormValue(candidateProfileCreated),
      resolver: yupResolver(CandidateProfileFormValidationNoPass),
    });

    const selectedCity = watch('city') as SelectOption<{ stateId: number }>;

    const getFileFromUrl = async (url: string): Promise<void> => {
      if (createdCandidateInfo?.linkedInResumeName) {
        setLoading(true);
        const blobFromUrl = await fetch(url).then(rawData => rawData.blob());
        const file = new File([blobFromUrl], createdCandidateInfo.linkedInResumeName, {
          type: 'application/pdf',
        });
        setValue('linkedInResume', file);
        setLoading(false);
      }
    };

    useEffect(() => {
      if (selectedCity) {
        const selectedCityOption = citiesAsSelectOptions.find(
          city => city.value === createdCandidateInfo?.city,
        ) as SelectOption<{ stateId: number }>;
        setValue('city', selectedCityOption);
      }
      getFileFromUrl(createdCandidateInfo?.linkedInResume as string);
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

    useEffect(() => {
      if (creatingProfileErrors) {
        iterateOverErrorDetailsEachKey<FieldPath<CreateCandidateProfileFormValues>>(
          creatingProfileErrors,
          (key, value) => {
            setError(key, { type: 'validate', message: value });
          },
        );
      }
    }, [creatingProfileErrors, setError]);

    const onSubmit = useCallback(
      (values: CreateCandidateProfileFormValues) => {
        dispatch(
          createCandidateProfile.request({
            formValue: values,
            onSuccess: () => null,
          }),
        );
      },
      [dispatch],
    );

    return (
      <div className={styles['page']}>
        <div className={styles['page__header-wrapper']}>
          <h2 className={styles['page__title--edit-mode']}>Edit personal information</h2>
        </div>
        {loading ? (
          <Loader loading />
        ) : (
          <ResumeUploader
            fileSize={createdCandidateInfo?.linkedInResumeSize}
            fileName={createdCandidateInfo?.linkedInResumeName}
            name="linkedInResume"
            control={control}
          />
        )}
        <div className={styles['page__separator-wrapper']}>
          <div className={styles['page__separator-line']} />
          <p className={styles['page__separator-text']}>Or fill in details below</p>
          <div className={styles['page__separator-line']} />
        </div>
        <Input
          name="firstName"
          label="First name"
          placeholder="First name"
          control={control}
          className={styles['page__form-input']}
        />
        <Input
          name="lastName"
          label="Last name"
          placeholder="Last name"
          control={control}
          className={styles['page__form-input']}
        />
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
        <div
          className={classNames(styles['page__form-row'], styles['page__form-row--address-row'])}
        >
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
            variant="accent"
            title="Save changes"
            className={styles['page__form-footer-button']}
            loading={creatingProfile}
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </div>
    );
  },
);
