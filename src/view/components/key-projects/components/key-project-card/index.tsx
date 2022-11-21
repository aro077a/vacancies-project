import React, { memo, useCallback, useMemo } from 'react';

import { useSelector } from '~/store';
import { CreateCandidateProfessionalDetailsFormValues } from '~/types/formValues';
import { formatDate } from '~/utils/helpers';
import { Icon } from '~/view/components/icon';
import { SelectOption } from '~/view/components/select';

import styles from './styles.scss';

type Props = {
  keyProject: CreateCandidateProfessionalDetailsFormValues['keyProjects'][number];
  onEdit: (keyProject: CreateCandidateProfessionalDetailsFormValues['keyProjects'][number]) => void;
};

export const KeyProjectCard: React.FC<Props> = memo(function KeyProjectCard({
  keyProject,
  onEdit,
}) {
  const { cities } = useSelector(state => state.common);
  const handleEdit = useCallback(() => {
    onEdit(keyProject);
  }, [onEdit, keyProject]);

  const location = useMemo(() => {
    if ((keyProject?.location as SelectOption)?.label) {
      return (keyProject.location as SelectOption)?.label;
    }

    if (keyProject.location) {
      return cities.find(city => city.id === Number(keyProject.location as unknown))?.name;
    }

    return null;
  }, [keyProject.location, cities]);

  return (
    <div className={styles['card']}>
      <div className={styles['card__project-wrapper']}>
        <div className={styles['card__project-info']}>
          <p className={styles['card__project-name']}>{keyProject.name}</p>
          <p className={styles['card__position']}>{keyProject.position}</p>
        </div>
        <div className={styles['card__additional-info-wrapper']}>
          <p className={styles['card__additional-info']}>{location}</p>
          <div className={styles['card__additional-info-separator']} />
          {keyProject.workStart && keyProject.workEnd && (
            <p className={styles['card__additional-info']}>
              {formatDate(keyProject.workStart, keyProject.workEnd, 'dd/MM/yyyy')}
            </p>
          )}
        </div>
      </div>
      <button className={styles['card__edit-button']} onClick={handleEdit}>
        Edit <Icon name="pencil" className={styles['card__edit-button-icon']} />
      </button>
    </div>
  );
});
