/* eslint-disable jsx-a11y/media-has-caption */
import classNames from 'classnames';
import React, { useCallback } from 'react';

import { Icon } from '~/view/components/icon';

import styles from './styles.scss';

type Props = {
  className?: string;
  url: string;
  onDeleteClick: () => void;
  withDelete: boolean;
};

export const Video: React.FC<Props> = ({ className, url, onDeleteClick, withDelete }) => {
  const wrapperClassName = classNames(className, styles['video-player']);

  const handleDelete = useCallback(() => {
    onDeleteClick();
  }, [onDeleteClick]);

  return (
    <div className={wrapperClassName}>
      <video className={styles['video-player__control']} src={url} controls />
      {withDelete && (
        <button onClick={handleDelete}>
          <Icon name="trash" className={styles['video-player__delete-icon']} />
        </button>
      )}
    </div>
  );
};
