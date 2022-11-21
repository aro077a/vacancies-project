import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FieldPath, useForm } from 'react-hook-form';
import { RouteComponentProps } from 'react-router-dom';

import { UserType } from '~/models/common';
import { CompanyHiringManger } from '~/models/company';
import {
  citiesAsSelectOptionsSelector,
  hiringManagerJobPositionsAsSelectOptionsSelector,
  hiringManagerProjectTypesAsSelectOptionsSelector,
} from '~/modules/common/selectors';
import {
  createJobInfo,
  getHiringManagers,
  getRepresentativeManager,
  resetErrors,
  toggleDeleteJobModalVisibility,
  updateHiringManager,
  updateJobInfo,
} from '~/modules/createJob/actions';
import { useDispatch, useSelector } from '~/store';
import { CreateJobHiringManagerFormValues } from '~/types/formValues';
import { iterateOverErrorDetailsEachKey } from '~/utils/errors';
import { CommonRouter } from '~/utils/router';
import { CreateJobHiringManagerFormValidation } from '~/utils/validations';
import { BackButton } from '~/view/components/back-button';
import { Button } from '~/view/components/button';
import { RadioButton } from '~/view/components/radio-button';
import { Select } from '~/view/components/select';

import { AddManagerModal } from './components/add-manager-modal';
import styles from './styles.scss';

const permissionType = [
  { id: 1, label: 'Temporary' },
  { id: 2, label: 'Permanent' },
  { id: 3, label: 'Both' },
];

export const CreateHiringManagerPage: React.FC<RouteComponentProps> = ({ history }) => {
  const dispatch = useDispatch();
  const creatingHiringManagerErrors = useSelector(
    state => state.createJob.creatingHiringManagerErrors,
  );
  const [modalVisibility, setModalVisibility] = useState(false);
  const {
    jobHiringManagers,
    settingHiringManager,
    creatingJobInfo,
    createdJobInfo,
    representativeManager,
  } = useSelector(state => state.createJob);

  const loggedInUserType = useSelector(state => state.user.loggedInUserType);

  const currentHrManager = jobHiringManagers.find(
    (item: CompanyHiringManger) => item.id === createdJobInfo?.hiringManager,
  );
  const currentCompany = useMemo(() => createdJobInfo?.companyName, [createdJobInfo?.companyName]);

  const editMode = useSelector(state => state.createJob.editMode);
  const { control, handleSubmit, setError, formState, watch, setValue } =
    useForm<CreateJobHiringManagerFormValues>({
      defaultValues: !editMode
        ? {
            manager: null,
            representative: false,
          }
        : {
            manager: null,
            representative: createdJobInfo?.representative,
          },
      resolver: yupResolver(CreateJobHiringManagerFormValidation),
    });

  const handleRadioButtonChange = useCallback(
    (type: boolean, selectedItem: boolean, fieldName: 'representative') => {
      if (type !== selectedItem) {
        setValue(fieldName, type, { shouldDirty: true });
      }
    },
    [setValue],
  );

  const toggleModalVisibility = useCallback(() => {
    setModalVisibility(prevValue => !prevValue);
  }, []);

  const hrManager = watch('manager');
  const selectedRepresentative = watch('representative');

  useEffect(() => {
    if (selectedRepresentative) {
      dispatch(getRepresentativeManager.request({ selectedCompanyId: createdJobInfo?.company }));
    } else {
      dispatch(getHiringManagers.request());
    }
  }, [dispatch, createdJobInfo?.company, selectedRepresentative, editMode]);

  useEffect(() => {
    if (currentHrManager) {
      setValue('manager', {
        value: currentHrManager.id,
        label: `${currentHrManager.firstName} ${currentHrManager.lastName}`,
        office: currentHrManager.office,
        email: currentHrManager.email,
        position: currentHrManager.position,
        permission: currentHrManager.permission,
        phone: currentHrManager.phone,
        id: currentHrManager.id,
      });
    }
  }, [currentHrManager, setValue]);

  const managersAsSelectOptions = useMemo(
    () =>
      jobHiringManagers?.map(
        ({
          id,
          email,
          position,
          office,
          permission,
          phone,
          lastName,
          firstName,
          representative,
        }: CompanyHiringManger) => {
          return {
            value: id,
            label: `${firstName} ${lastName}`,
            email,
            position,
            phone,
            office,
            permission,
            representative,
          };
        },
      ),
    [jobHiringManagers],
  );
  useEffect(() => {
    dispatch(resetErrors());
  }, [dispatch]);

  const position = useSelector(hiringManagerJobPositionsAsSelectOptionsSelector).find(position =>
    hrManager
      ? hrManager?.position === position.value
      : currentHrManager?.position === position.value,
  );

  const projectType = useSelector(hiringManagerProjectTypesAsSelectOptionsSelector).find(project =>
    hrManager
      ? hrManager?.position === project.value
      : currentHrManager?.position === project.value,
  );

  const city = useSelector(citiesAsSelectOptionsSelector).find(city =>
    hrManager ? hrManager?.office === city.value : currentHrManager?.office === city.value,
  );

  const PermissionType = hrManager
    ? permissionType.find(type => type.id === hrManager?.permission)
    : permissionType.find(type => type.id === currentHrManager?.permission);

  useEffect(() => {
    if (creatingHiringManagerErrors) {
      iterateOverErrorDetailsEachKey<FieldPath<CreateJobHiringManagerFormValues>>(
        creatingHiringManagerErrors,
        (key, value) => {
          setError(key, { type: 'validate', message: value });
        },
      );
    }
  }, [creatingHiringManagerErrors, setError]);

  const handleGoBack = useCallback(() => {
    history.push(CommonRouter.createJob.createJobInfo);
  }, [history]);

  const handleDelete = useCallback(() => {
    dispatch(toggleDeleteJobModalVisibility());
  }, [dispatch]);

  const onSubmit = useCallback(
    ({ manager }: CreateJobHiringManagerFormValues) => {
      if (manager && !editMode) {
        dispatch(
          createJobInfo.request({
            managerId: manager.value,
            representative: selectedRepresentative,
            onSuccess: () => {
              history.push(CommonRouter.createJob.createJobDescription);
            },
            isUpdate: true,
          }),
        );
      } else if (!manager && !editMode && !selectedRepresentative) {
        setError('manager', { message: 'Manager is required!' });
        history.push(CommonRouter.createJob.createHiringManager);
      } else if (selectedRepresentative && !editMode) {
        dispatch(
          createJobInfo.request({
            representative: selectedRepresentative,
            onSuccess: () => {
              history.push(CommonRouter.createJob.createJobDescription);
            },
            isUpdate: true,
          }),
        );
      } else if (selectedRepresentative && editMode) {
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
        }: any = createdJobInfo;
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
              representative: selectedRepresentative,
            },
          }),
        );
      } else {
        dispatch(
          updateHiringManager.request({
            representative: selectedRepresentative,
            hrManagerId: hrManager?.value,
          }),
        );
      }
    },
    [
      dispatch,
      editMode,
      history,
      hrManager?.value,
      setError,
      selectedRepresentative,
      createdJobInfo,
    ],
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
          Hiring Company Info
        </h1>
        {!editMode && (
          <p className={styles['page__number']}>
            2<span>/3</span>
          </p>
        )}
      </div>
      <p className={styles['page__subtitle']}>
        Please select hiring company representative or add a new hiring manager
      </p>
      <div className={styles['page__field']}>
        <p className={styles['page__field-label']}>Company</p>
        <div className={styles['page__field-value']}>{currentCompany}</div>
      </div>
      <div className={styles['page__field']}>
        <p className={styles['page__field-label']}>Select</p>
        <div className={styles['page__position-types-wrapper']}>
          <div
            className={styles['page__position-type']}
            onClick={() => handleRadioButtonChange(true, selectedRepresentative, 'representative')}
          >
            <RadioButton checked={selectedRepresentative} />
            <p className={styles['page__position-type-label']}>Representative</p>
          </div>
          <div
            className={styles['page__position-type']}
            onClick={() => handleRadioButtonChange(false, selectedRepresentative, 'representative')}
          >
            <RadioButton checked={!selectedRepresentative} />
            <p className={styles['page__position-type-label']}>Hiring Manager</p>
          </div>
        </div>
      </div>
      {!selectedRepresentative ? (
        <>
          <div className={styles['page__field']}>
            <Select
              name="manager"
              label="Hiring manager name"
              placeholder="None selected"
              control={control}
              options={managersAsSelectOptions}
              clearable
            />
            {loggedInUserType !== UserType.MANAGER && (
              <div className={styles['page__select-hint-message']}>
                If the hiring manager doesn't exist{' '}
                <button onClick={toggleModalVisibility} className={styles['page__add-manager-btn']}>
                  Add hiring manager here
                </button>
              </div>
            )}
          </div>
          <div className={styles['page__field']}>
            <p className={styles['page__field-label']}>Hiring manager position</p>
            <div className={styles['page__field-value']}>{position?.label}</div>
          </div>
          <div className={styles['page__field']}>
            <p className={styles['page__field-label']}>Hiring manager project type</p>
            <div className={styles['page__field-value']}>{projectType?.label}</div>
          </div>
          <div className={styles['page__field']}>
            <p className={styles['page__field-label']}>Hiring manager type</p>
            <div className={styles['page__field-value']}>{PermissionType?.label}</div>
          </div>
          <div className={styles['page__field']}>
            <p className={styles['page__field-label']}>Office location</p>
            <div className={styles['page__field-value']}>{city?.label}</div>
          </div>
          <div className={styles['page__field']}>
            <p className={styles['page__field-label']}>Hiring manager email</p>
            <div className={styles['page__field-value']}>
              {hrManager?.email || currentHrManager?.email}
            </div>
          </div>
          <div className={styles['page__field']}>
            <p className={styles['page__field-label']}>Hiring manager phone number</p>
            <div className={styles['page__field-value']}>
              {hrManager?.phone || currentHrManager?.phone}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={styles['page__field']}>
            <p className={styles['page__field-label']}>Representative First Name</p>
            <div className={styles['page__field-value']}>{representativeManager?.firstName}</div>
          </div>
          <div className={styles['page__field']}>
            <p className={styles['page__field-label']}>Representative Last Name</p>
            <div className={styles['page__field-value']}>{representativeManager?.lastName}</div>
          </div>
          <div className={styles['page__field']}>
            <p className={styles['page__field-label']}>Email</p>
            <div className={styles['page__field-value']}>{representativeManager?.user.email}</div>
          </div>
          <div className={styles['page__field']}>
            <p className={styles['page__field-label']}>Phone number of the company</p>
            <div className={styles['page__field-value']}>{representativeManager?.phone}</div>
          </div>
        </>
      )}
      {editMode && <div className={styles['page__separator']} />}
      <div
        className={classNames(styles['page__footer'], {
          [styles['page__footer--edit-mode']]: editMode,
        })}
      >
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
              loading={settingHiringManager}
              onClick={handleSubmit(onSubmit)}
            />
          </>
        ) : (
          <>
            <Button
              variant="secondary"
              title="Back"
              className={styles['page__footer-back-button']}
              onClick={handleGoBack}
            />
            <Button title="Next" loading={creatingJobInfo} onClick={handleSubmit(onSubmit)} />
          </>
        )}
      </div>

      <AddManagerModal onClose={toggleModalVisibility} visible={modalVisibility} />
    </div>
  );
};
