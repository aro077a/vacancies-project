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
    | CreateCandidateProfessionalDetailsFormValues['workExps'][number]
    | UpdateCandidateProfessionalDetailsAdminFormValues['workExps'][number]
    | any
  >;
  control: Control<
    | CreateCandidateProfessionalDetailsFormValues['workExps'][number]
    | UpdateCandidateProfessionalDetailsAdminFormValues['workExps'][number]
  >;
  register: UseFormRegister<
    | CreateCandidateProfessionalDetailsFormValues['workExps'][number]
    | UpdateCandidateProfessionalDetailsAdminFormValues['workExps'][number]
  >;
  remove: (index: number) => void;
};

export const WorkDetailsCard: React.FC<Props> = memo(function WorkDetailsCard({
  setValue,
  control,
  index,
  remove,
  register,
}) {
  const workDetails = useWatch({
    control,
    name: `details.${index}`,
  });

  useEffect(() => {
    if (!workDetails) {
      setValue(`details.${index}`, [], {
        shouldValidate: true,
      });
    }
  }, [setValue, workDetails, index]);

  return (
    <div className={styles['work-details']}>
      <Input
        label=""
        placeholder="Work details"
        className={styles['work-details__field']}
        control={control}
        maxLength={255}
        {...register(`details.${index}.name` as const)}
      />
      <div className={styles['work-details__item-remove']} onClick={() => remove(index)}>
        <Icon name="trash" />
      </div>
    </div>
  );
});
