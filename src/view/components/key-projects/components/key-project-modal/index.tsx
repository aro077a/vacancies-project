import { yupResolver } from '@hookform/resolvers/yup';
import { parse } from 'date-fns';
import dateFnsFormat from 'date-fns/format';
import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { citiesAsSelectOptionsSelector } from '~/modules/common/selectors';
import { useSelector } from '~/store';
import { CreateCandidateProfessionalDetailsFormValues } from '~/types/formValues';
import { projectValueOptions } from '~/utils/staticData';
import { CreateCandidateKeyProjectFormValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { CustomDatePicker } from '~/view/components/custom-date-picker';
import { Input } from '~/view/components/input';
import { CenterModal } from '~/view/components/modals';
import { Select } from '~/view/components/select';

import styles from './styles.scss';

type Props = {
  visible: boolean;
  keyProjectToEdit: CreateCandidateProfessionalDetailsFormValues['keyProjects'][number] | null;
  onClose: () => void;
  onSave: (
    keyProjectToEdit: CreateCandidateProfessionalDetailsFormValues['keyProjects'][number],
  ) => void;
  onDelete: (id: number) => void;
};

export const KeyProjectModal: React.FC<Props> = memo(function KeyProjectModal({
  visible,
  keyProjectToEdit,
  onClose,
  onSave,
  onDelete,
}) {
  const citiesAsSelectOptions = useSelector(citiesAsSelectOptionsSelector);
  const defaultDate = useMemo(() => dateFnsFormat(new Date(), 'dd/MM/yyyy'), []);

  const { control, handleSubmit, watch, setValue } = useForm<
    CreateCandidateProfessionalDetailsFormValues['keyProjects'][number]
  >({
    defaultValues: keyProjectToEdit || {
      id: Math.random(),
      name: '',
      position: '',
      location: null,
      workStart: defaultDate,
      workEnd: null,
      value: null,
      type: '',
    },
    resolver: yupResolver(CreateCandidateKeyProjectFormValidation),
  });
  const id = watch('id');
  const workStart = watch('workStart');
  const workEnd = watch('workEnd');

  useEffect(() => {
    if (keyProjectToEdit) {
      setValue('workStart', workStart && new Date(workStart));
      setValue('workEnd', workEnd && new Date(workEnd));
      if (typeof keyProjectToEdit?.location === 'number') {
        const stateOfSelectedCity = citiesAsSelectOptions.find(
          state => state.value === keyProjectToEdit?.location,
        );
        setValue('location', stateOfSelectedCity || null, { shouldValidate: true });
      } else {
        const selectedCity = citiesAsSelectOptions.find(
          state => state.value === keyProjectToEdit?.location,
        );
        setValue('location', selectedCity?.value as number);
      }
      if (typeof keyProjectToEdit?.location === 'number') {
        const selectedProjectValue = projectValueOptions.find(
          (item: Record<string, unknown>) => item.value === keyProjectToEdit?.value,
        );
        setValue('value', selectedProjectValue || null, { shouldValidate: true });
      } else {
        const selectedProjectValue = projectValueOptions.find(
          (item: Record<string, unknown>) => item.value === keyProjectToEdit?.value,
        );
        setValue('value', selectedProjectValue?.value as number);
      }
    }
  }, [setValue, citiesAsSelectOptions, keyProjectToEdit]);

  const onSubmit = useCallback(
    (values: CreateCandidateProfessionalDetailsFormValues['keyProjects'][number]) => {
      onSave(values);
    },
    [onSave],
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
      title={`${keyProjectToEdit ? 'Edit' : 'Add'} key project`}
      visible={visible}
      onClose={onClose}
    >
      <Input
        name="name"
        label="Project Name"
        placeholder="Name"
        className={styles['modal__field']}
        control={control}
      />
      <Input
        name="position"
        label="Position"
        placeholder="Position"
        className={styles['modal__field']}
        control={control}
      />
      <Select
        searchable
        name="location"
        placeholder="Select"
        label="Location"
        className={styles['modal__field']}
        options={citiesAsSelectOptions}
        control={control}
      />
      <Select
        searchable
        name="value"
        placeholder="Select Project value"
        label="Project value (optional)"
        className={styles['modal__field']}
        options={projectValueOptions}
        control={control}
      />
      <Input
        name="type"
        label="Project type"
        placeholder="Project type"
        className={styles['modal__field']}
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
        title={`${keyProjectToEdit ? 'Save changes' : 'Save'}`}
        className={styles['modal__action-button']}
        onClick={handleSubmit(onSubmit)}
      />
      <Button
        variant="danger"
        title={`${keyProjectToEdit ? 'Delete' : 'Cancel'}`}
        className={styles['modal__action-button']}
        onClick={keyProjectToEdit ? handleDelete : onClose}
      />
    </CenterModal>
  );
});
