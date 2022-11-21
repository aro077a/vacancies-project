import React, { useCallback, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { useSelector } from '~/store';
import { Button } from '~/view/components/button';
import { Video } from '~/view/components/video';

import styles from './styles.scss';

export const UploadInterviewPage: React.FC<RouteComponentProps> = () => {
  const { candidateVideoInterview } = useSelector(state => state.createCandidate);
  const [videoSource, setVideoSource] = useState(candidateVideoInterview);

  const handleDeleteClick = useCallback(() => {
    setVideoSource(null);
  }, []);

  return (
    <div className={styles['page']}>
      <div className={styles['page__header-wrapper']}>
        <h2 className={styles['page__title']}>Video interview</h2>
      </div>
      {videoSource ? (
        <Video withDelete onDeleteClick={handleDeleteClick} url={videoSource} />
      ) : (
        <p className={styles['page__no-video-message']}>No video interview</p>
      )}
      <Button
        className={styles['page__save-btn']}
        title="Save changes"
        variant="accent"
        size="large"
      />
    </div>
  );
};
