import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useEffect } from 'react';
import { FieldPath, useForm } from 'react-hook-form';
import { RouteComponentProps } from 'react-router-dom';

import { LookingJobStatus } from '~/models/candidate';
import { PermissionType } from '~/models/common';
import { createProfessionalDetails, resetErrors } from '~/modules/candidateRegistration/actions';
import {
  jobPositionsAsSelectOptionsSelector,
  projectTypesAsSelectOptionsSelector,
} from '~/modules/common/selectors';
import { getCompanies } from '~/modules/companies/actions';
import { companiesAsSelectOptionsSelector } from '~/modules/companies/selectors';
import { useDispatch, useSelector } from '~/store';
import { CreateCandidateProfessionalDetailsFormValues } from '~/types/formValues';
import { iterateOverErrorDetailsEachKey } from '~/utils/errors';
import { availabilityOptions, projectValueOptions } from '~/utils/staticData';
import { CreateCandidateProfessionalDetailsFormValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { Input } from '~/view/components/input';
import { KeyProjects } from '~/view/components/key-projects';
import { LookingJob } from '~/view/components/looking-job';
import { RadioButton } from '~/view/components/radio-button';
import { Range } from '~/view/components/range';
import { Select } from '~/view/components/select';
import { WorkExperience } from '~/view/components/work-experience';

import styles from './styles.scss';

export const CreateProfessionalDetailsPage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const setupPagesCount = useSelector(state => state.registration.setupPagesCount);
  const jobPositionsAsSelectOptions = useSelector(jobPositionsAsSelectOptionsSelector);
  const projectTypesAsSelectOptions = useSelector(projectTypesAsSelectOptionsSelector);
  const companiesAsSelectOptions = useSelector(companiesAsSelectOptionsSelector);
  const { companies } = useSelector(state => state.companies);
  const prefillDetails = useSelector(state => state.createCandidate.prefillDataFromResume);
  const creatingProfessionalDetails = useSelector(
    state => state.candidateRegistration.creatingProfessionalDetails,
  );
  const creatingProfessionalDetailsErrors = useSelector(
    state => state.candidateRegistration.creatingProfessionalDetailsErrors,
  );

  const { control, handleSubmit, setError, setValue, watch } =
    useForm<CreateCandidateProfessionalDetailsFormValues>({
      defaultValues: {
        jobPositions: [],
        projectTypes: [],
        projectValues: [],
        interestedCompanies: [],
        notInterestedCompanies: [],
        yearsOfExp: 0,
        minSalary: '',
        availability: [],
        jobTitle: null,
        status: LookingJobStatus.ACTIVE,
        workExps: [],
        keyProjects: [],
        permission: PermissionType.Both,
      },
      resolver: yupResolver(CreateCandidateProfessionalDetailsFormValidation),
    });

  useEffect(() => {
    if (prefillDetails) {
      const workExps = prefillDetails.experience
        .filter((exp: any) => {
          if (exp.duration.workStart && exp.duration.workEnd) {
            return exp;
          }
          return 0;
        })
        .map((exp: any) => {
          return {
            id: Math.random(),
            name: exp.name,
            position: exp.position,
            workStart: exp.duration.workStart,
            workEnd: exp.duration.workEnd,
            location: exp.location,
          };
        });
      setValue('workExps', workExps);
    }
  }, []);

  const selectedPermissionType = watch('permission');

  useEffect(() => {
    dispatch(resetErrors());
  }, [dispatch]);

  useEffect(() => {
    if (companies.length === 0) {
      dispatch(getCompanies.request());
    }
  }, [dispatch, companies]);

  useEffect(() => {
    if (creatingProfessionalDetailsErrors) {
      iterateOverErrorDetailsEachKey<FieldPath<CreateCandidateProfessionalDetailsFormValues>>(
        creatingProfessionalDetailsErrors,
        (key, value) => {
          setError(key, { type: 'validate', message: value });
        },
      );
    }
  }, [creatingProfessionalDetailsErrors, setError]);
  const onSubmit = useCallback(
    (values: CreateCandidateProfessionalDetailsFormValues) => {
      dispatch(
        createProfessionalDetails.request({
          formValues: values,
        }),
      );
    },
    [dispatch],
  );

  const handleRadioButtonChange = useCallback(
    (type: PermissionType, selectedItem: PermissionType) => {
      if (type !== selectedItem) {
        setValue('permission', type, { shouldDirty: true });
      }
    },
    [setValue],
  );

  return (
    <div className={styles['page']}>
      <div className={styles['page__header-wrapper']}>
        <h1 className={styles['page__title']}>Add your professional details</h1>
        <p className={styles['page__order-number']}>
          3<span>/{setupPagesCount}</span>
        </p>
      </div>
      <p className={styles['page__subtitle']}>
        We are one step closer, that career isn't far away.
      </p>
      <Select
        searchable
        name="jobTitle"
        label="Job title"
        placeholder="Select"
        className={styles['page__field']}
        options={jobPositionsAsSelectOptions}
        control={control}
      />
      <Select
        searchable
        multiSelect
        name="jobPositions"
        label="Preferable job positions"
        placeholder="Select"
        className={styles['page__field']}
        max={5}
        options={jobPositionsAsSelectOptions}
        control={control}
      />
      <Select
        searchable
        multiSelect
        name="projectTypes"
        label="Preferable project types"
        placeholder="Select"
        className={styles['page__field']}
        max={5}
        options={projectTypesAsSelectOptions}
        control={control}
      />
      <Select
        searchable
        name="projectValues"
        label="Project values worked on (optional)"
        placeholder="Project values"
        className={styles['page__field']}
        options={projectValueOptions}
        control={control}
      />
      <Select
        searchable
        multiSelect
        name="interestedCompanies"
        label="Preferable companies (optional)"
        infoText="Companies you would like to work for"
        placeholder="Search"
        className={styles['page__field']}
        options={companiesAsSelectOptions}
        control={control}
      />
      <Select
        searchable
        multiSelect
        name="notInterestedCompanies"
        label="Never would I ever (optional)"
        infoText="Companies you are not interested in"
        placeholder="Search"
        className={styles['page__field']}
        options={companiesAsSelectOptions}
        control={control}
      />
      <Range
        name="yearsOfExp"
        label="Years of experience"
        unit="years"
        className={styles['page__field']}
        min={0}
        max={30}
        step={1}
        control={control}
      />
      <Input
        name="minSalary"
        label="Min. annual salary"
        placeholder="$ 0,00"
        mask="$ ****"
        className={styles['page__field']}
        control={control}
      />
      <div className={styles['page__field']}>
        <p className={styles['page__field-label']}>Position type</p>
        <div className={styles['page__position-types-wrapper']}>
          <div
            className={styles['page__position-type']}
            onClick={() => handleRadioButtonChange(PermissionType.Both, selectedPermissionType)}
          >
            <RadioButton checked={selectedPermissionType === PermissionType.Both} />
            <p className={styles['page__position-type-label']}>Both</p>
          </div>
          <div
            className={styles['page__position-type']}
            onClick={() =>
              handleRadioButtonChange(PermissionType.Permanent, selectedPermissionType)
            }
          >
            <RadioButton checked={selectedPermissionType === PermissionType.Permanent} />
            <p className={styles['page__position-type-label']}>Permanent</p>
          </div>
          <div
            className={styles['page__position-type']}
            onClick={() =>
              handleRadioButtonChange(PermissionType.Temporary, selectedPermissionType)
            }
          >
            <RadioButton checked={selectedPermissionType === PermissionType.Temporary} />
            <p className={styles['page__position-type-label']}>Temporary</p>
          </div>
        </div>
      </div>
      <Select
        name="availability"
        label="Availability"
        placeholder="Select availability"
        className={styles['page__field']}
        options={availabilityOptions}
        control={control}
      />
      <LookingJob name="status" className={styles['page__field']} control={control} />
      <WorkExperience
        name="workExps"
        className={styles['page__field']}
        titleClassName={styles['page__section-title']}
        addButtonClassName={styles['page__section-add-button']}
        addButtonIconClassName={styles['page__section-add-button-icon']}
        errorMessageClassName={styles['page__section-error-message']}
        control={control}
      />
      <KeyProjects
        name="keyProjects"
        className={styles['page__field']}
        titleClassName={styles['page__section-title']}
        addButtonClassName={styles['page__section-add-button']}
        addButtonIconClassName={styles['page__section-add-button-icon']}
        errorMessageClassName={styles['page__section-error-message']}
        control={control}
      />
      <div className={styles['page__form-footer']}>
        <Button
          type="submit"
          title="Next"
          className={styles['page__form-footer-button']}
          loading={creatingProfessionalDetails}
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </div>
  );
};
