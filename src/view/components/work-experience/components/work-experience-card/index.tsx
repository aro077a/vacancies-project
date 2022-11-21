import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { useSelector } from '~/store';
import { CreateCandidateProfessionalDetailsFormValues } from '~/types/formValues';
import { getDifferenceBetweenDates } from '~/utils/helpers';
import { Icon } from '~/view/components/icon';
import { Image } from '~/view/components/image';
import { SelectOption } from '~/view/components/select';

import styles from './styles.scss';

type Props = {
  workExperience: CreateCandidateProfessionalDetailsFormValues['workExps'][number];
  onEdit: (field: CreateCandidateProfessionalDetailsFormValues['workExps'][number]) => void;
};

export const WorkExperienceCard: React.FC<Props> = memo(function WorkExperienceCard({
  workExperience,
  onEdit,
}) {
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState(null as any);
  const { cities, countries } = useSelector(state => state.common);

  const convertToBlob = useCallback(
    async (url: string | null | File): Promise<void> => {
      if (url && typeof url === 'string') {
        setLoading(true);
        const blob = await fetch(url, { cache: 'no-cache' }).then(data => data.blob());
        setLoading(false);
        setLogo(blob);
        return;
      }
      setLogo(workExperience.logo);
    },
    [workExperience.logo],
  );

  useEffect(() => {
    convertToBlob(workExperience.logo);
  }, [workExperience.logo, convertToBlob]);

  const location = useMemo(() => {
    if ((workExperience?.location as SelectOption)?.label) {
      return (workExperience.location as SelectOption)?.label;
    }

    if (workExperience.location) {
      return cities.find(city => city.id === Number(workExperience.location as unknown))?.name;
    }

    return null;
  }, [workExperience.location, cities]);

  const country = useMemo(() => {
    if ((workExperience?.country as SelectOption)?.label) {
      return (workExperience.country as SelectOption)?.label;
    }

    if (workExperience.country) {
      return countries.find(country => country.id === Number(workExperience.country as unknown))
        ?.name;
    }

    return null;
  }, [workExperience, countries]);

  const handleEdit = useCallback(() => {
    onEdit({
      ...workExperience,
      logo,
      workStart: workExperience.workStart ? new Date(workExperience.workStart) : null,
      workEnd: workExperience.workEnd ? new Date(workExperience.workEnd) : null,
    });
  }, [workExperience, onEdit, logo]);

  return (
    <div className={styles['card']}>
      <div className={styles['card__company-wrapper']}>
        <div className={styles['card__company-info-wrapper']}>
          <div className={styles['card__company-image-wrapper']}>
            {loading ? (
              '...'
            ) : (
              <Image
                type="company"
                className={styles['card__company-image']}
                src={logo ? URL.createObjectURL(logo) : null}
                alt="company"
              />
            )}
          </div>
          <div className={styles['card__info-wrapper']}>
            <p className={styles['card__company-name']}>{workExperience.name}</p>
            <p className={styles['card__position']}>{workExperience.position}</p>
          </div>
        </div>
        <div className={styles['card__additional-info-wrapper']}>
          <p className={styles['card__additional-info']}>{location}</p>
          {location && (workExperience.workStart || workExperience.workEnd) && (
            <div className={styles['card__additional-info-separator']} />
          )}
          {country && <p className={styles['card__additional-info']}>{country}</p>}
          {country && (workExperience.workStart || workExperience.workEnd) && (
            <div className={styles['card__additional-info-separator']} />
          )}
          {workExperience.workStart && workExperience.workEnd && (
            <p className={styles['card__additional-info']}>
              ({getDifferenceBetweenDates(workExperience.workStart, workExperience.workEnd)})
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
