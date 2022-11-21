import { yupResolver } from '@hookform/resolvers/yup';
import React, { memo, useCallback, useEffect } from 'react';
import { FieldPath, useForm } from 'react-hook-form';

import {
  citiesAsSelectOptionsSelector,
  hiringManagerJobPositionsAsSelectOptionsSelector,
  hiringManagerProjectTypesAsSelectOptionsSelector,
  statesAsSelectOptionsSelector,
} from '~/modules/common/selectors';
import { createHiringManager, updateHiringManager } from '~/modules/createEmployer/actions';
import { useDispatch, useSelector } from '~/store';
import { RootState } from '~/store/types';
import { CreateHiringCompanyFormValues } from '~/types/formValues';
import { iterateOverErrorDetailsEachKey } from '~/utils/errors';
import { CreateHiringManagerFormValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { Input } from '~/view/components/input';
import { CenterModal } from '~/view/components/modals';
import { Select, SelectOption } from '~/view/components/select';

import styles from './styles.scss';

interface AddManagerProps {
  visible: boolean;
  onClose: () => void;
}

export const AddManagerModal: React.FC<AddManagerProps> = memo(function AddManagerModal({
  visible,
  onClose,
}) {
  const dispatch = useDispatch();
  const {
    editMode,
    updateHiringManagerErrors,
    hiringManager,
    creatingHiringManager,
    updatingHiringManager,
    createHiringManagerErrors,
  } = useSelector((state: RootState) => state.createEmployer);
  const projectTypesAsSelectOptions = useSelector(hiringManagerProjectTypesAsSelectOptionsSelector);
  const jobPositionsAsSelectOptions = useSelector(hiringManagerJobPositionsAsSelectOptionsSelector);
  const citiesAsSelectOptions = useSelector(citiesAsSelectOptionsSelector);
  const statesAsSelectOptions = useSelector(statesAsSelectOptionsSelector);
  const { control, handleSubmit, setError, reset, setValue, watch } =
    useForm<CreateHiringCompanyFormValues>({
      defaultValues: {
        lastName: '',
        firstName: '',
        position: null,
        city: null,
        state: null,
        email: '',
        phone: '',
        project: null,
      },
      resolver: yupResolver(CreateHiringManagerFormValidation),
    });

  const selectedCity = watch('city');

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
    if (editMode && hiringManager) {
      const { lastName, firstName, position, project, office, email, phone } = hiringManager;

      if (firstName) {
        setValue('firstName', firstName);
      }

      if (lastName) {
        setValue('lastName', lastName);
      }

      const jobPosition = jobPositionsAsSelectOptions.find(
        jobPosition => jobPosition.value === position,
      ) as SelectOption;

      setValue('position', jobPosition);

      const projectType = projectTypesAsSelectOptions.find(
        prjct => prjct.value === project,
      ) as SelectOption;

      setValue('project', projectType);

      if (email) {
        setValue('email', email);
      }

      if (phone) {
        setValue('phone', phone);
      }

      if (office) {
        const city = citiesAsSelectOptions.find(city => city.value === office) as SelectOption<{
          stateId: number;
        }>;

        setValue('city', city);
      }
    } else {
      reset();
    }
  }, [
    editMode,
    hiringManager,
    setValue,
    reset,
    jobPositionsAsSelectOptions,
    projectTypesAsSelectOptions,
    citiesAsSelectOptions,
  ]);

  useEffect(() => {
    if (createHiringManagerErrors) {
      iterateOverErrorDetailsEachKey<FieldPath<CreateHiringCompanyFormValues>>(
        createHiringManagerErrors,
        (key, value) => {
          setError(key, { type: 'validate', message: value });
        },
      );
    }
    if (updateHiringManagerErrors) {
      iterateOverErrorDetailsEachKey<FieldPath<CreateHiringCompanyFormValues>>(
        updateHiringManagerErrors,
        (key, value) => {
          setError(key, { type: 'validate', message: value });
        },
      );
    }
  }, [createHiringManagerErrors, updateHiringManagerErrors, setError]);

  const onSubmit = useCallback(
    (values: CreateHiringCompanyFormValues) => {
      if (hiringManager) {
        dispatch(
          updateHiringManager.request({
            formValues: values,
            onSuccess: () => {
              reset();
              onClose();
            },
          }),
        );
      }
      if (!editMode) {
        dispatch(
          createHiringManager.request({
            formValues: values,
            onSuccess: () => {
              onClose();
              reset();
            },
          }),
        );
      }
    },
    [editMode, dispatch, onClose, reset, hiringManager],
  );

  return (
    <CenterModal
      title={editMode ? 'Edit Hiring Manager' : 'Add Hiring Manager'}
      className={styles['modal-manager']}
      visible={visible}
      onClose={onClose}
    >
      <div className={styles['modal-manager__body']}>
        <div className={styles['modal-manager__body-header']}>
          <p className={styles['modal-manager__body-header-label']}>
            Not all the fields are mandatory but we would recommend adding as much information as
            you can
          </p>
        </div>
        <Input
          name="name"
          label="Business contact name"
          placeholder=""
          control={control}
          className={styles['modal-manager__body-form-input']}
        />
        <Select
          placeholder="None selected"
          label="Business contact position (optional)"
          name="position"
          control={control}
          options={jobPositionsAsSelectOptions}
          className={styles['modal-manager__body-form-input']}
        />
        <Select
          placeholder="None selected"
          label="Business project type (optional)"
          name="project"
          control={control}
          options={projectTypesAsSelectOptions}
          className={styles['modal-manager__body-form-input']}
        />
        <div className={styles['modal-manager__body-form-input--flex']}>
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
          name="email"
          label="Business contact email"
          placeholder=""
          className={styles['modal-manager__body-form-input']}
          control={control}
        />
        <Input
          type="tel"
          name="phone"
          label="Best phone number (optional)"
          placeholder="+"
          mask="+"
          className={styles['modal-manager__body-form-input']}
          control={control}
        />
        <Button
          variant="accent"
          title={editMode ? 'Edit contact' : 'Add contact'}
          className={styles['modal-manager__body-button']}
          onClick={handleSubmit(onSubmit)}
          loading={editMode ? updatingHiringManager : creatingHiringManager}
        />
      </div>
    </CenterModal>
  );
});
