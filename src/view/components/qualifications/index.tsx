import React, { memo, useEffect } from 'react';
import { Control, UseFormRegister, UseFormSetValue, useWatch } from 'react-hook-form';

import {
  CreateCandidateProfessionalDetailsFormValues,
  UpdateCandidateProfessionalDetailsAdminFormValues,
} from '~/types/formValues';
import { Icon } from '~/view/components/icon';
import { Input } from '~/view/components/input';

import styles from './styles.scss';

type Props = {
  index: number;
  setValue: UseFormSetValue<
    | CreateCandidateProfessionalDetailsFormValues
    | UpdateCandidateProfessionalDetailsAdminFormValues
    | any
  >;
  control: Control<
    CreateCandidateProfessionalDetailsFormValues | UpdateCandidateProfessionalDetailsAdminFormValues
  >;
  register: UseFormRegister<
    CreateCandidateProfessionalDetailsFormValues | UpdateCandidateProfessionalDetailsAdminFormValues
  >;
  remove: (index: number) => void;
};

export const QualificationCard: React.FC<Props> = memo(function QualificationCard({
  setValue,
  control,
  index,
  remove,
  register,
}) {
  const qualifications = useWatch({
    control,
    name: `qualifications.${index}`,
  });

  useEffect(() => {
    if (!qualifications) {
      setValue(`qualifications.${index}`, [], {
        shouldValidate: true,
      });
    }
  }, [setValue, qualifications, index]);

  return (
    <div className={styles['qualifications']}>
      <Input
        label=""
        placeholder="Qualifications"
        className={styles['qualifications__field']}
        control={control}
        maxLength={255}
        {...register(`qualifications.${index}.name` as const)}
      />
      <div className={styles['qualifications__item-remove']} onClick={() => remove(index)}>
        <Icon name="trash" />
      </div>
    </div>
  );
});
