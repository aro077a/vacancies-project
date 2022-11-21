import React, { memo, useCallback } from 'react';

import { SendResumeLog } from '~/models/admin';
import { downloadCandidateCV } from '~/modules/adminCandidates/actions';
import { useDispatch } from '~/store';
import { LicenseCard } from '~/view/components/license-card';

import styles from './styles.scss';

export const Card: React.FC<SendResumeLog> = memo(function Card({
  file,
  description,
  createdAt,
  candidate,
  jobPositionName,
  candidateName,
}) {
  const dispatch = useDispatch();

  const downloadCV = useCallback(() => {
    dispatch(downloadCandidateCV.request(candidate));
  }, [dispatch, candidate]);

  return (
    <div className={styles['card']}>
      <div className={styles['card__header']}>
        <h3 className={styles['card__title']}>{jobPositionName}</h3>
        <time className={styles['card__date']}>{new Date(createdAt).toLocaleDateString()}</time>
      </div>
      <p className={styles['card__description']}>{description}</p>
      <LicenseCard cb={downloadCV} fullWidth file={file} name={`${candidateName}'s CV`} />
    </div>
  );
});
