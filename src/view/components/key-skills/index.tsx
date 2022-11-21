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

export const KeySkillsCard: React.FC<Props> = memo(function KeySkillsCard({
  setValue,
  control,
  index,
  remove,
  register,
}) {
  const keySkills = useWatch({
    control,
    name: `keySkills.${index}`,
  });

  useEffect(() => {
    if (!keySkills) {
      setValue(`keySkills.${index}`, [], {
        shouldValidate: true,
      });
    }
  }, [setValue, keySkills, index]);

  return (
    <div className={styles['key-skills']}>
      <Input
        label=""
        placeholder="Key Skills"
        className={styles['key-skills__field']}
        control={control}
        maxLength={255}
        {...register(`keySkills.${index}.name` as const)}
      />
      <div className={styles['key-skills__item-remove']} onClick={() => remove(index)}>
        <Icon name="trash" />
      </div>
    </div>
  );
});
