import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import React, { useCallback, useEffect } from 'react';
import { FieldPath, useForm } from 'react-hook-form';
import { RouteComponentProps } from 'react-router-dom';

import { PaymentRateType, PositionType, SuperType, UserType } from '~/models/common';
import {
  citiesAsSelectOptionsSelector,
  jobPositionsAsSelectOptionsSelector,
  projectTypesAsSelectOptionsSelector,
  statesAsSelectOptionsSelector,
} from '~/modules/common/selectors';
import { getCompanies } from '~/modules/companies/actions';
import { companiesAsSelectOptionsSelector } from '~/modules/companies/selectors';
import {
  createJobInfo,
  resetErrors,
  saveJobInfo,
  toggleDeleteJobModalVisibility,
  updateJobInfo,
} from '~/modules/createJob/actions';
import { adminsAsSelectOptionsSelector } from '~/modules/manageAdmins/selectors';
import { Admin } from '~/services/api/Admin';
import { useDispatch, useSelector } from '~/store';
import { CreateJobInfoFormValues } from '~/types/formValues';
import { iterateOverErrorDetailsEachKey } from '~/utils/errors';
import { getCreateJobInfoFormValues } from '~/utils/initialFormValues';
import { CommonRouter } from '~/utils/router';
import {
  CreateJobInfoAdminRoleFormValidation,
  CreateJobInfoFormValidation,
} from '~/utils/validations';
import { BackButton } from '~/view/components/back-button';
import { Button } from '~/view/components/button';
import { Checkbox } from '~/view/components/checkbox';
import { Input } from '~/view/components/input';
import { RadioButton } from '~/view/components/radio-button';
import { Select, SelectOption } from '~/view/components/select';
import { Textarea } from '~/view/components/textarea';

import styles from './styles.scss';

export const CreateJobInfoPage: React.FC<RouteComponentProps> = ({ history }) => {
  const dispatch = useDispatch();
  const jobPositionsAsSelectOptions = useSelector(jobPositionsAsSelectOptionsSelector);
  const projectTypesAsSelectOptions = useSelector(projectTypesAsSelectOptionsSelector);
  const citiesAsSelectOptions = useSelector(citiesAsSelectOptionsSelector);
  const statesAsSelectOptions = useSelector(statesAsSelectOptionsSelector);
  const companiesAsSelectOptions = useSelector(companiesAsSelectOptionsSelector);
  const adminsAsSelectOptions = useSelector(adminsAsSelectOptionsSelector);
  const editMode = useSelector(state => state.createJob.editMode);
  const creatingJobInfo = useSelector(state => state.createJob.creatingJobInfo);
  const updatingJobInfo = useSelector(state => state.createJob.updatingJobInfo);
  const creatingJobInfoErrors = useSelector(state => state.createJob.creatingJobInfoErrors);
  const saveCreatedJobInfo = useSelector(state => state.createJob.saveCreatedJobInfo?.formValues);
  const createdJobInfo = useSelector(state => state.createJob.createdJobInfo);
  const selectedCompany = useSelector(state => state.adminEmployers.selectedEmployer);
  const loggedInUserType = useSelector(state => state.user.loggedInUserType);
  const { companies } = useSelector(state => state.companies);
  const isCompany = loggedInUserType === UserType.COMPANY || loggedInUserType === UserType.MANAGER;
  const { control, watch, setValue, handleSubmit, setError, formState } =
    useForm<CreateJobInfoFormValues>({
      defaultValues: !editMode
        ? getCreateJobInfoFormValues(saveCreatedJobInfo)
        : getCreateJobInfoFormValues(createdJobInfo),
      resolver: yupResolver(
        isCompany ? CreateJobInfoFormValidation : CreateJobInfoAdminRoleFormValidation,
      ),
    });

  const selectedPositionType = watch('positionType');
  const selectedSuperType = watch('superType');
  const selectedCity = watch('city');
  const selectedPaymentType = watch('paymentType');
  const selectedAdmin = watch('admin') as unknown as number;
  useEffect(() => {
    dispatch(resetErrors());
  }, [dispatch]);

  useEffect(() => {
    if (companies.length === 0) {
      dispatch(getCompanies.request());
    }
  }, [dispatch, companies]);

  useEffect(() => {
    if (creatingJobInfoErrors) {
      iterateOverErrorDetailsEachKey<FieldPath<CreateJobInfoFormValues>>(
        creatingJobInfoErrors,
        (key, value) => {
          setError(key, { type: 'validate', message: value });
        },
      );
    }
  }, [creatingJobInfoErrors, setError]);

  const showCompanySelect = isCompany ? false : !editMode;

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

  const handleRadioButtonChange = useCallback(
    (
      type: PositionType | SuperType | PaymentRateType,
      selectedItem: PositionType | SuperType | PaymentRateType,
      fieldName: 'superType' | 'positionType' | 'paymentType',
    ) => {
      if (type !== selectedItem) {
        setValue(fieldName, type, { shouldDirty: true });
      }
    },
    [setValue],
  );

  const loadAdmins = useCallback(
    async (value: string): Promise<SelectOption[]> => {
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

      setValue('admin', admins.find(admn => admn.value === selectedAdmin) as SelectOption);

      return admins;
    },
    [selectedAdmin, setValue],
  );

  useEffect(() => {
    if (selectedCompany) {
      const newObject = {
        value: selectedCompany.id,
        label: selectedCompany.name,
      };
      setValue('company', newObject);
    }
  }, [selectedCompany, setValue]);

  const handleDelete = useCallback(() => {
    dispatch(toggleDeleteJobModalVisibility());
  }, [dispatch]);

  const onSubmit = useCallback(
    (values: CreateJobInfoFormValues) => {
      if (editMode) {
        if (selectedSuperType === SuperType.INCLUDING) {
          values.superAmount = null;
        }

        const {
          disclose,
          company,
          position,
          positionType,
          superAmount,
          projectType,
          overview,
          city,
          salary,
          state,
          paymentType,
          admin,
          address,
          projectNumber,
          representative,
        } = values;

        dispatch(
          updateJobInfo.request({
            formValues: {
              disclose,
              company,
              position,
              positionType,
              superAmount,
              projectType,
              salary,
              city,
              overview,
              state,
              paymentType,
              admin,
              projectNumber,
              address,
              representative,
            },
          }),
        );
      } else {
        dispatch(
          saveJobInfo({
            formValues: values,
          }),
        );
        dispatch(
          createJobInfo.request({
            onSuccess: () => {
              history.push(CommonRouter.createJob.createHiringManager);
            },
            isUpdate: Boolean(createdJobInfo),
          }),
        );
        history.push(CommonRouter.createJob.createHiringManager);
      }
    },
    [dispatch, history, editMode, selectedSuperType, createdJobInfo],
  );

  return (
    <div className={styles['page']}>
      {!editMode && <BackButton />}
      <div className={styles['page__header']}>
        <h1
          className={classNames(styles['page__title'], {
            [styles['page__title--edit-mode']]: editMode,
          })}
        >
          Basic information about job position
        </h1>
        {!editMode && (
          <p className={styles['page__number']}>
            1<span>/3</span>
          </p>
        )}
      </div>
      <p className={styles['page__subtitle']}>
        This information will be used on the job listing visible to all users
      </p>
      {showCompanySelect && (
        <Select
          searchable
          name="company"
          placeholder="Choose company"
          label="Select company"
          className={styles['page__field']}
          options={companiesAsSelectOptions}
          control={control}
        />
      )}
      <div className={classNames(styles['page__field'], styles['page__field--double-row'])}>
        <Select
          searchable
          name="position"
          placeholder="Choose job position"
          label="Job position title"
          options={jobPositionsAsSelectOptions}
          control={control}
        />
        <Select
          searchable
          name="projectType"
          placeholder="Choose project type"
          label="Project type"
          options={projectTypesAsSelectOptions}
          control={control}
        />
      </div>
      {!isCompany && (
        <Select
          loadOptions={value => loadAdmins(value)}
          async
          searchable
          label="Assign admin"
          placeholder="Select"
          name="admin"
          control={control}
          options={adminsAsSelectOptions}
          className={styles['page__field']}
        />
      )}
      <Textarea
        name="overview"
        placeholder="Type short  job description"
        label="Job overview"
        className={styles['page__field']}
        maxLength={300}
        control={control}
      />
      <div className={styles['page__field']}>
        <p className={styles['page__field-label']}>Position type</p>
        <div className={styles['page__position-types-wrapper']}>
          <div
            className={styles['page__position-type']}
            onClick={() =>
              handleRadioButtonChange(PositionType.PERMANENT, selectedPositionType, 'positionType')
            }
          >
            <RadioButton checked={selectedPositionType === PositionType.PERMANENT} />
            <p className={styles['page__position-type-label']}>Permanent</p>
          </div>
          <div
            className={styles['page__position-type']}
            onClick={() =>
              handleRadioButtonChange(PositionType.TEMPORARY, selectedPositionType, 'positionType')
            }
          >
            <RadioButton checked={selectedPositionType === PositionType.TEMPORARY} />
            <p className={styles['page__position-type-label']}>Temporary</p>
          </div>
        </div>
      </div>
      <div className={classNames(styles['page__field'], styles['page__field--double-row'])}>
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
      <Input
        className={styles['page__field']}
        label="Site address"
        placeholder="Type site address"
        control={control}
        name="address"
      />
      {selectedPositionType === PositionType.PERMANENT && (
        <>
          <div className={styles['page__field']}>
            <p className={styles['page__field-label']}>Superannuation</p>
            <div className={styles['page__position-types-wrapper']}>
              <div
                className={styles['page__position-type']}
                onClick={() =>
                  handleRadioButtonChange(SuperType.INCLUDING, selectedSuperType, 'superType')
                }
              >
                <RadioButton checked={selectedSuperType === SuperType.INCLUDING} />
                <p className={styles['page__position-type-label']}>Including super</p>
              </div>
              <div
                className={styles['page__position-type']}
                onClick={() =>
                  handleRadioButtonChange(SuperType.EXCLUDING, selectedSuperType, 'superType')
                }
              >
                <RadioButton checked={selectedSuperType === SuperType.EXCLUDING} />
                <p className={styles['page__position-type-label']}>Excluding super</p>
              </div>
            </div>
          </div>
          <Input
            name="salary"
            label="Approx. annual salary"
            placeholder="$ 0,00"
            mask="$ ****"
            className={styles['page__field']}
            control={control}
          />
          {selectedSuperType === SuperType.EXCLUDING && (
            <Input
              name="superAmount"
              label="Superannuation"
              placeholder="$ 0,00"
              mask="$ ****"
              className={styles['page__field']}
              control={control}
            />
          )}
        </>
      )}
      {selectedPositionType === PositionType.TEMPORARY && (
        <>
          <div className={styles['page__field']}>
            <p className={styles['page__field-label']}>Hourly/Daily rate</p>
            <div className={styles['page__position-types-wrapper']}>
              <div
                className={styles['page__position-type']}
                onClick={() =>
                  handleRadioButtonChange(PaymentRateType.DAILY, selectedPaymentType, 'paymentType')
                }
              >
                <RadioButton checked={selectedPaymentType === PaymentRateType.DAILY} />
                <p className={styles['page__position-type-label']}>Daily</p>
              </div>
              <div
                className={styles['page__position-type']}
                onClick={() =>
                  handleRadioButtonChange(
                    PaymentRateType.HOURLY,
                    selectedPaymentType,
                    'paymentType',
                  )
                }
              >
                <RadioButton checked={selectedPaymentType === PaymentRateType.HOURLY} />
                <p className={styles['page__position-type-label']}>Hourly</p>
              </div>
            </div>
          </div>
          <Input
            name="salary"
            label={selectedPaymentType === PaymentRateType.DAILY ? 'Daily rate' : 'Hourly rate'}
            placeholder="$ 0,00"
            mask="$ ****"
            className={styles['page__field']}
            control={control}
          />
        </>
      )}
      <Input
        className={styles['page__field']}
        label="Project number"
        placeholder="Type project number"
        control={control}
        name="projectNumber"
      />
      <div className={styles['page__disclose-info-field']}>
        <Checkbox name="disclose" control={control} />
        <p className={styles['page__disclose-info']}>Disclose my identity to all candidates</p>
      </div>
      {editMode && <div className={styles['page__separator']} />}
      <div className={styles['page__footer']}>
        {editMode ? (
          <>
            <Button
              variant="danger"
              title="Delete position"
              className={styles['page__delete-button']}
              onClick={handleDelete}
            />
            <Button
              variant="accent"
              title="Save changes"
              className={styles['page__save-changes-button']}
              disabled={!formState.isDirty}
              loading={updatingJobInfo}
              onClick={handleSubmit(onSubmit)}
            />
          </>
        ) : (
          <Button
            title="Next"
            className={styles['page__next-button']}
            loading={creatingJobInfo}
            onClick={handleSubmit(onSubmit)}
          />
        )}
      </div>
    </div>
  );
};
