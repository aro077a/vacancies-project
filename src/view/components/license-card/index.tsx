import classNames from 'classnames';
import React, { memo } from 'react';

import { License } from '~/models/candidate';
import { download } from '~/utils/helpers';
import { Icon } from '~/view/components/icon';

import styles from './styles.scss';

type Props = {
  fullWidth?: boolean;
  cb?: () => void;
  expirationDate?: string;
};

export const LicenseCard: React.FC<License & Props> = memo(function LicenseCard({
  file,
  size,
  name,
  fullWidth = false,
  cb,
  expirationDate,
}) {
  const fileType = file?.split('.').reverse()[0];

  const fileImgClassName = classNames(
    styles['license-card__file-type'],
    styles[`license-card__file-type--${fileType}`],
  );

  const cardClassName = classNames(
    styles['license-card'],
    fullWidth && styles['license-card--full-width'],
  );

  const fileName = classNames(
    styles['license-card__name'],
    fullWidth && styles['license-card__name--full-width'],
  );

  const handleDownload = (): void => {
    if (cb) {
      cb();
      return;
    }
    download(file, name);
  };

  return (
    <div className={cardClassName}>
      <div className={fileImgClassName}>
        <span>{fileType}</span>
      </div>
      <div className={styles['license-card__file-info']}>
        <p className={fileName}>{name}</p>
        {size && <span className={styles['license-card__size']}>{size}</span>}
      </div>
      {expirationDate && (
        <>
          <p className={styles['license-card__expiration-label']}>Expiry date:&nbsp;</p>
          <p className={styles['license-card__expiration-date']}>17/06/2022</p>
        </>
      )}
      <button className={styles['license-card__download-btn']} onClick={handleDownload}>
        <Icon name="download" width="20px" height="20px" />
      </button>
    </div>
  );
});
