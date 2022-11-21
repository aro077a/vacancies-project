import dateFnsFormat from 'date-fns/format';
import React, { memo } from 'react';

import { KeyProject, WorkDetails, WorkExperience } from '~/models/candidate';
import { getDifferenceBetweenDates } from '~/utils/helpers';

import styles from './styles.scss';

type Props = Omit<WorkExperience, 'country'> & Omit<KeyProject, 'value' | 'type'>;

export const Card: React.FC<Props> = memo(function Card({
  name,
  logo = null,
  position,
  location,
  workStart,
  workEnd,
  details,
}) {
  return (
    <div className={styles['card']}>
      <div className={styles['card__general-info']}>
        {logo && <img className={styles['card__company-logo']} src={logo} alt="Company logo" />}
        <div className={styles['card__work-info']}>
          <h4 className={styles['card__company-name']}>{name}</h4>
          <p className={styles['card__user-position']}>{position}</p>
        </div>
      </div>
      <div className={styles['card__main-info']}>
        {location && <p className={styles['card__company-location']}>{location}</p>}
        <p className={styles['card__date']}>{`${dateFnsFormat(
          new Date(workStart),
          'dd/MM/yyyy',
        )} - ${dateFnsFormat(new Date(workEnd), 'dd/MM/yyyy')} (${getDifferenceBetweenDates(
          workStart,
          workEnd,
        )})`}</p>
      </div>
      <div className={styles['card__work-details']}>
        {details?.map((item: WorkDetails) => {
          return (
            <p className={styles['card__work-description']} key={item.id}>
              {item.name}
            </p>
          );
        })}
      </div>
    </div>
  );
});
