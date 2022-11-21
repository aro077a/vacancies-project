import classNames from 'classnames';
import React, { memo } from 'react';

import { FileCardType } from '~/models/company';
import { download } from '~/utils/helpers';
import { Icon } from '~/view/components/icon';

import styles from './styles.scss';

export const FilesCard: React.FC<FileCardType> = memo(function LicenseCard({
  file,
  name,
  fullWidth,
}) {
  const fileType = file.split('.').reverse()[0];

  const fileImgClassName = classNames(
    styles['file-card__file-type'],
    styles[`file-card__file-type--${fileType}`],
  );

  const cardClassName = classNames(
    styles['file-card'],
    fullWidth && styles['file-card--full-width'],
  );

  return (
    <div className={cardClassName}>
      <div className={fileImgClassName}>
        <span>{fileType}</span>
      </div>
      <div className={styles['file-card__file-info']}>
        <p className={styles['file-card__name']}>{name}</p>
      </div>
      <button className={styles['file-card__download-btn']} onClick={() => download(file, '')}>
        <Icon name="download" width="20px" height="20px" />
      </button>
    </div>
  );
});
