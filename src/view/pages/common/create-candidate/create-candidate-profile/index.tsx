import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { FieldPath, useForm } from 'react-hook-form';
import { RouteComponentProps } from 'react-router-dom';

import { UserType } from '~/models/common';
import {
  citiesAsSelectOptionsSelector,
  statesAsSelectOptionsSelector,
} from '~/modules/common/selectors';
import { createCandidateProfile, resetErrors } from '~/modules/createCandidate/actions';
import { Admin } from '~/services/api/Admin';
import { useDispatch, useSelector } from '~/store';
import {
  CreateCandidateProfileFormValues,
  UpdateCandidateProfileFormValues,
} from '~/types/formValues';
import { iterateOverErrorDetailsEachKey } from '~/utils/errors';
import { getCreateCandidateProfileFormValue } from '~/utils/initialFormValues';
import { CommonRouter } from '~/utils/router';
import { CandidateProfileFormValidationNoPass } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { Checkbox } from '~/view/components/checkbox';
import { Input } from '~/view/components/input';
import { Loader } from '~/view/components/loader';
import { ResumeUploader } from '~/view/components/resume-uploader';
import { Select, SelectOption } from '~/view/components/select';

import styles from './styles.scss';

export const CreateCandidateInfoPage: React.FC<RouteComponentProps> = ({ history }) => {
  const dispatch = useDispatch();
  const citiesAsSelectOptions = useSelector(citiesAsSelectOptionsSelector);
  const statesAsSelectOptions = useSelector(statesAsSelectOptionsSelector);
  const creatingProfile = useSelector(state => state.createCandidate.creatingCandidateProfile);
  const { editMode } = useSelector(state => state.createCandidate);
  const [loading, setLoading] = useState(false);
  const { candidateProfileCreated } = useSelector(state => state.createCandidate);
  const creatingProfileErrors = useSelector(
    state => state.createCandidate.creatingCandidateProfileErrors,
  );
  const loggedInUserType = useSelector(state => state.user.loggedInUserType);
  const prefillDetails = useSelector(state => state.createCandidate.prefillDataFromResume);
  const isAdmin = loggedInUserType === (UserType.ADMIN || UserType.SUPER_ADMIN);

  const { control, watch, setValue, setError, handleSubmit, reset } = useForm<
    CreateCandidateProfileFormValues | UpdateCandidateProfileFormValues
  >({
    defaultValues: getCreateCandidateProfileFormValue(candidateProfileCreated),
    resolver: yupResolver(CandidateProfileFormValidationNoPass),
  });

  const admin = watch('admin');

  useEffect(() => {
    if (prefillDetails && !editMode) {
      const { name, contact } = prefillDetails;
      setValue('firstName', name.firstName);
      setValue('lastName', name.lastName);
      setValue('user.email', contact);
    }
  }, [prefillDetails, setValue]);

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

  const selectedCity = watch('city') as SelectOption<{ stateId: number }>;

  const getFileFromUrl = async (url: string): Promise<void> => {
    if (candidateProfileCreated?.linkedInResumeName) {
      setLoading(true);
      const blobFromUrl = await fetch(url).then(rawData => rawData.blob());
      const file = new File([blobFromUrl], candidateProfileCreated.linkedInResumeName, {
        type: 'application/pdf',
      });
      setValue('linkedInResume', file);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCity) {
      const selectedCityOption = citiesAsSelectOptions.find(
        city => city.value === candidateProfileCreated?.city,
      ) as SelectOption<{ stateId: number }>;
      setValue('city', selectedCityOption);
    }
    getFileFromUrl(candidateProfileCreated?.linkedInResume as string);
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
          onSuccess: () => {
            if (editMode) {
              reset(values);
            } else {
              history.push(CommonRouter.createCandidate.createCandidateDetails);
            }
          },
        }),
      );
    },
    [dispatch, editMode, history, reset],
  );

  return (
    <div className={styles['page']}>
      {!editMode ? (
        <>
          <div className={styles['page__header-wrapper']}>
            <h1 className={styles['page__title']}>Create your profile</h1>
            <p className={styles['page__order-number']}>
              1<span>/5</span>
            </p>
          </div>
          <p className={styles['page__subtitle']}>
            Input the basic information and your account manager will be in touch to complete your
            profile.
          </p>
        </>
      ) : (
        <div className={styles['page__header-wrapper']}>
          <h2 className={styles['page__title--edit-mode']}>Edit personal information</h2>
        </div>
      )}
      {loading ? (
        <Loader loading />
      ) : (
        <ResumeUploader
          fileSize={candidateProfileCreated?.linkedInResumeSize}
          fileName={candidateProfileCreated?.linkedInResumeName}
          name="linkedInResume"
          control={control}
        />
      )}
      <div className={styles['page__separator-wrapper']}>
        <div className={styles['page__separator-line']} />
        <p className={styles['page__separator-text']}>Or fill in details below</p>
        <div className={styles['page__separator-line']} />
      </div>
      <div className={styles['page__form-row']}>
        <Input name="firstName" label="First name" placeholder="First name" control={control} />
        <Input name="lastName" label="Last name" placeholder="Last name" control={control} />
      </div>
      <div className={styles['page__form-row']}>
        <Input
          type="email"
          name="user.email"
          label="Email address"
          placeholder="Email address"
          control={control}
        />
        <Select
          loadOptions={value => loadAdmins(value)}
          async
          searchable
          control={control}
          name="admin"
          label="Assign admin"
          placeholder="Select"
          options={[]}
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
          <p className={styles['page__checkbox-label']}>
            {isAdmin ? 'Candidate is ready to relocate' : 'I am ready to relocate'}
          </p>
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
          variant={editMode ? 'accent' : undefined}
          title={editMode ? 'Save changes' : 'Next'}
          className={styles['page__form-footer-button']}
          loading={creatingProfile}
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </div>
  );
};
