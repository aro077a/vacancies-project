import { yupResolver } from '@hookform/resolvers/yup';
import { parse } from 'date-fns';
import dateFnsFormat from 'date-fns/format';
import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import {
  citiesAsSelectOptionsSelector,
  countriesAsSelectOptionsSelector,
} from '~/modules/common/selectors';
import { useSelector } from '~/store';
import { CreateCandidateProfessionalDetailsFormValues } from '~/types/formValues';
import { CreateCandidateWorkExperienceFormValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { CustomDatePicker } from '~/view/components/custom-date-picker';
import { Input } from '~/view/components/input';
import { CenterModal } from '~/view/components/modals';
import { Select } from '~/view/components/select';

import { LogoUploader } from './components/logo-uploader';
import styles from './styles.scss';

type Props = {
  visible: boolean;
  workExperienceToEdit: CreateCandidateProfessionalDetailsFormValues['workExps'][number] | null;
  onClose: () => void;
  onSave: (
    workExperience: CreateCandidateProfessionalDetailsFormValues['workExps'][number],
  ) => void;
  onDelete: (id: number) => void;
};

export const WorkExperienceModal: React.FC<Props> = memo(function WorkExperienceModal({
  visible,
  workExperienceToEdit,
  onClose,
  onSave,
  onDelete,
}) {
  const citiesAsSelectOptions = useSelector(citiesAsSelectOptionsSelector);
  const countriesAsSelectOptions = useSelector(countriesAsSelectOptionsSelector);

  const defaultDate = useMemo(() => dateFnsFormat(new Date(), 'dd/MM/yyyy'), []);

  const { control, handleSubmit, watch, setValue } = useForm<
    CreateCandidateProfessionalDetailsFormValues['workExps'][number]
  >({
    defaultValues: workExperienceToEdit || {
      id: Math.random(),
      logo: null,
      name: '',
      position: '',
      location: null,
      workStart: defaultDate,
      workEnd: null,
      details: [],
    },
    resolver: yupResolver(CreateCandidateWorkExperienceFormValidation),
  });
  const id = watch('id');
  const logo = watch('logo');

  useEffect(() => {
    if (workExperienceToEdit) {
      if (typeof workExperienceToEdit?.location === 'number') {
        const stateOfSelectedCity = citiesAsSelectOptions.find(
          state => state.value === workExperienceToEdit?.location,
        );
        setValue('location', stateOfSelectedCity || null, { shouldValidate: true });
      } else {
        const selectedCity = citiesAsSelectOptions.find(
          state => state.value === workExperienceToEdit?.location,
        );
        setValue('location', selectedCity?.value as number);
      }
    }
  }, [setValue, citiesAsSelectOptions, workExperienceToEdit]);

  useEffect(() => {
    if (workExperienceToEdit) {
      if (typeof workExperienceToEdit?.country === 'number') {
        const countryOfSelected = countriesAsSelectOptions.find(
          state => state.value === workExperienceToEdit?.country,
        );
        setValue('country', countryOfSelected || null, { shouldValidate: true });
      } else {
        const selectedCountry = countriesAsSelectOptions.find(
          state => state.value === workExperienceToEdit?.location,
        );
        setValue('country', selectedCountry?.value as number);
      }
    }
  }, [setValue, countriesAsSelectOptions, workExperienceToEdit]);

  const onSubmit = useCallback(
    (values: CreateCandidateProfessionalDetailsFormValues['workExps'][number]) => {
      onSave({ ...values, logo });
    },
    [logo, onSave],
  );

  const handleDelete = useCallback(() => {
    onDelete(id);
  }, [id, onDelete]);

  const handleSetCurrentDate = useCallback(() => {
    const currentDate = dateFnsFormat(new Date(), 'dd/MM/yyyy');
    setValue('workEnd', parse(currentDate, 'dd/MM/yyyy', new Date()));
  }, [setValue]);

  return (
    <CenterModal
      className={styles['modal']}
      title={`${workExperienceToEdit ? 'Edit' : 'Add'} work experience`}
      visible={visible}
      onClose={onClose}
    >
      <div className={styles['modal__field']}>
        <p className={styles['modal__field-label']}>Company logo (max limit 20MB) and name</p>
        <div className={styles['modal__name-and-logo-fields']}>
          <LogoUploader name="logo" control={control} />
          <Input name="name" placeholder="Name" control={control} />
        </div>
      </div>
      <Input
        name="position"
        label="Position"
        placeholder="Position"
        className={styles['modal__field']}
        control={control}
      />
      <Select
        clearable
        searchable
        name="location"
        placeholder="Select"
        label="Location (optional)"
        className={styles['modal__field']}
        options={citiesAsSelectOptions}
        control={control}
      />
      <Select
        clearable
        searchable
        name="country"
        placeholder="Select"
        label="Country (optional)"
        className={styles['modal__field']}
        options={countriesAsSelectOptions}
        control={control}
      />
      <div className={styles['modal__field']}>
        <p className={styles['modal__field-label']}>Work experience</p>
        <div className={styles['modal__date-fields']}>
          <CustomDatePicker
            name="workStart"
            placeholder="Start date"
            className={styles['modal__date-picker']}
            inlineIconVisible={false}
            control={control}
          />
          <div className={styles['modal__date-picker-separator']} />
          <CustomDatePicker
            overlayOnRight
            name="workEnd"
            placeholder="End date"
            className={styles['modal__date-picker']}
            inlineIconVisible={false}
            control={control}
          />
        </div>
        <div className={styles['modal__field-current']}>
          <Button
            variant="primary"
            title="Current Day"
            className={styles['modal__action-button--current']}
            onClick={handleSetCurrentDate}
          />
        </div>
      </div>
      <Button
        type="submit"
        variant="accent"
        title={`${workExperienceToEdit ? 'Save changes' : 'Save'}`}
        className={styles['modal__action-button']}
        onClick={handleSubmit(onSubmit)}
      />
      <Button
        variant="danger"
        title={`${workExperienceToEdit ? 'Delete' : 'Cancel'}`}
        className={styles['modal__action-button']}
        onClick={workExperienceToEdit ? handleDelete : onClose}
      />
    </CenterModal>
  );
});
