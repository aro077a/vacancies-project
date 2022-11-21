import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useEffect } from 'react';
import { FieldPath, useFieldArray, useForm } from 'react-hook-form';
import { RouteComponentProps } from 'react-router-dom';

import { KeySkill, ProfessionalDetails, Qualifications } from '~/models/candidate';
import { UserType } from '~/models/common';
import {
  jobPositionsAsSelectOptionsSelector,
  projectTypesAsSelectOptionsSelector,
} from '~/modules/common/selectors';
import { getCompanies } from '~/modules/companies/actions';
import { companiesAsSelectOptionsSelector } from '~/modules/companies/selectors';
import { createCandidateProfessionalDetails, resetErrors } from '~/modules/createCandidate/actions';
import { useDispatch, useSelector } from '~/store';
import {
  CreateCandidateProfessionalDetailsFormValues,
  UpdateCandidateProfessionalDetailsAdminFormValues,
} from '~/types/formValues';
import { iterateOverErrorDetailsEachKey } from '~/utils/errors';
import {
  getCreateCandidateProfessionalDetails,
  updateCandidateProfessionalDetailsAdmin,
} from '~/utils/initialFormValues';
import { availabilityOptions, projectValueOptions } from '~/utils/staticData';
import {
  CreateCandidateProfessionalDetailsFormValidation,
  updateCandidateProfessionalDetailsAdminFormValidation,
} from '~/utils/validations';
import { Button } from '~/view/components/button';
import { Input } from '~/view/components/input';
import { KeyProjects } from '~/view/components/key-projects';
import { KeySkillsCard } from '~/view/components/key-skills';
import { QualificationCard } from '~/view/components/qualifications';
import { Range } from '~/view/components/range';
import { Select, SelectOption } from '~/view/components/select';
import { Textarea } from '~/view/components/textarea';
import { WorkExperience } from '~/view/components/work-experience';

import styles from './styles.scss';

export const EditProfessionalDetailsPage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const jobPositionsAsSelectOptions = useSelector(jobPositionsAsSelectOptionsSelector);
  const projectTypesAsSelectOptions = useSelector(projectTypesAsSelectOptionsSelector);
  const companiesAsSelectOptions = useSelector(companiesAsSelectOptionsSelector);
  const { editMode } = useSelector(state => state.createCandidate);
  const creatingProfessionalDetails = useSelector(
    state => state.createCandidate.creatingCandidateProfessionalDetails,
  );
  const prefillDetails = useSelector(state => state.createCandidate.prefillDataFromResume);
  const creatingProfessionalDetailsErrors = useSelector(
    state => state.createCandidate.creatingCandidateProfessionalDetailsErrors,
  );
  const candidateProfessionalDetails = useSelector(
    state => state.createCandidate.candidateProfessionalDetailsCreated,
  );
  const { companies } = useSelector(state => state.companies);
  const loggedInUserType = useSelector(state => state.user.loggedInUserType);
  const isAdmin = loggedInUserType === (UserType.ADMIN || UserType.SUPER_ADMIN);

  const { control, handleSubmit, setError, setValue, watch, register } = useForm<
    CreateCandidateProfessionalDetailsFormValues | UpdateCandidateProfessionalDetailsAdminFormValues
  >({
    defaultValues: editMode
      ? updateCandidateProfessionalDetailsAdmin(
          candidateProfessionalDetails as ProfessionalDetails & { additionalInformation: string },
        )
      : getCreateCandidateProfessionalDetails(candidateProfessionalDetails),

    resolver: yupResolver(
      editMode
        ? updateCandidateProfessionalDetailsAdminFormValidation
        : CreateCandidateProfessionalDetailsFormValidation,
    ),
  });
  useEffect(() => {
    const professionalDetailsAvailability = availabilityOptions.find(
      (item: SelectOption) => item.value === candidateProfessionalDetails?.availability,
    );
    const professionalDetailsProjectValue = projectValueOptions.find(
      (item: SelectOption) => item.value === candidateProfessionalDetails?.projectValues,
    );
    setValue('availability', professionalDetailsAvailability);
    setValue('projectValues', professionalDetailsProjectValue);
  }, [
    candidateProfessionalDetails?.availability,
    candidateProfessionalDetails?.projectValues,
    setValue,
  ]);

  useEffect(() => {
    if (prefillDetails && !editMode) {
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

  const workExps = watch('workExps');

  const convertUrlsToFiles = async (
    workExps: CreateCandidateProfessionalDetailsFormValues['workExps'],
  ): Promise<void> => {
    if (workExps.length) {
      const promises = workExps.map(workExp => {
        return new Promise<CreateCandidateProfessionalDetailsFormValues['workExps'][number]>(
          (resolve, reject) => {
            if (workExp.logo && typeof workExp.logo === 'string') {
              fetch(workExp.logo, { cache: 'no-cache' })
                .then(rawData => {
                  rawData.blob().then(blob => {
                    resolve({ ...workExp, logo: blob as File });
                  });
                })
                .catch(error => reject(error));
            }
          },
        );
      });
      Promise.all(promises).then(val => {
        setValue('workExps', val);
      });
    }
  };

  useEffect(() => {
    if (companies.length === 0) {
      dispatch(getCompanies.request());
    }
  }, [dispatch, companies]);

  useEffect(() => {
    convertUrlsToFiles(workExps);
  }, [workExps]);

  useEffect(() => {
    dispatch(resetErrors());
  }, [dispatch]);

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
        createCandidateProfessionalDetails.request({
          formValue: values,
          onSuccess: () => null,
        }),
      );
    },
    [dispatch],
  );

  const {
    fields: keySkillFields,
    append: appendKeySkillFields,
    remove: removeKeySkillFields,
  } = useFieldArray({
    control,
    name: 'keySkills',
  });

  const {
    fields: qualificationFields,
    append: appendQualifications,
    remove: removeQualifications,
  } = useFieldArray({
    control,
    name: 'qualifications',
  });

  return (
    <div className={styles['page']}>
      <div className={styles['page__header-wrapper']}>
        <h2 className={styles['page__title--edit-mode']}>Edit professional details</h2>
      </div>
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
        label="Project values worked on"
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
        label={
          isAdmin
            ? 'Companies I wouldn’t like to work at (optional)'
            : 'Never would I ever (optional)'
        }
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
      <Select
        name="availability"
        label="Availability"
        placeholder="Select availability"
        className={styles['page__field']}
        options={availabilityOptions}
        control={control}
      />
      <Input
        name="interest"
        label="Interest"
        placeholder="Interest"
        control={control}
        className={styles['page__field']}
      />
      <Input
        name="visaStatus"
        label="Visa Status"
        placeholder="Visa Status"
        control={control}
        className={styles['page__field']}
      />
      <Textarea
        name="overview"
        label="Overview"
        placeholder="Overview"
        control={control}
        className={styles['page__field']}
        maxLength={1000}
      />
      <Input
        name="professionalExperience"
        label="Professional experience"
        placeholder="Professional experience"
        control={control}
        className={styles['page__field']}
      />
      <Input
        name="references"
        label="References"
        placeholder="References"
        control={control}
        className={styles['page__field']}
      />
      <Input
        name="generalSummary"
        label="General summary"
        placeholder="General summary"
        className={styles['page__field']}
        control={control}
      />
      <div className={styles['page__field']}>
        <h2 className={styles['page__field-skills-title']}>Key Skills</h2>
        {keySkillFields.map((field: KeySkill, index: number) => {
          return (
            <KeySkillsCard
              key={field.id}
              index={index}
              control={control}
              register={register}
              setValue={setValue}
              remove={removeKeySkillFields}
            />
          );
        })}
        <div
          className={styles['page__field-add-skill']}
          onClick={() =>
            appendKeySkillFields({
              keySkills: [],
            } as Record<string, KeySkill[]>)
          }
        >
          <p>+ Add skill</p>
        </div>
      </div>
      <div className={styles['page__field']}>
        <h2 className={styles['page__field-skills-title']}>Qualifications</h2>
        {qualificationFields.map((field, index) => {
          return (
            <QualificationCard
              key={field.id}
              index={index}
              control={control}
              register={register}
              setValue={setValue}
              remove={removeQualifications}
            />
          );
        })}
        <div
          className={styles['page__field-add-skill']}
          onClick={() =>
            appendQualifications({
              qualifications: [],
            } as Record<string, Qualifications[]>)
          }
        >
          <p>+ Add qualification</p>
        </div>
      </div>
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
          variant="accent"
          title="Save changes"
          className={styles['page__form-footer-button']}
          loading={creatingProfessionalDetails}
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </div>
  );
};
