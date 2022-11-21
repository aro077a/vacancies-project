import React from 'react';
import { Control } from 'react-hook-form';

import { SendResumeFormValues } from '~/types/formValues';
import { Icon } from '~/view/components/icon';

import { CompanySelect } from './components/company-select';
import { ManagerSelect } from './components/manager-select';
import styles from './styles.scss';

interface Props {
  index: number;
  control: Control<SendResumeFormValues>;
  handleRemove: () => void;
}

export const Card: React.FC<Props> = ({ index, control, handleRemove }) => {
  return (
    <div className={styles['container']}>
      <CompanySelect control={control} name={`companies.${index}.id`} />
      <ManagerSelect index={index} control={control} name={`companies.${index}.hiringManagers`} />
      <div className={styles['remove-icon']} onClick={handleRemove}>
        <Icon name="trash" />
      </div>
    </div>
  );
};
