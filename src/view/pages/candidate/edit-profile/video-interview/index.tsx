import React, { useCallback } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';

import { toggleConfirmModalVisibility } from '~/modules/createCandidate/actions';
import { useDispatch, useSelector } from '~/store';
import { CandidateRouter } from '~/utils/router';
import { Button } from '~/view/components/button';
import { Icon } from '~/view/components/icon';
import { Video } from '~/view/components/video';

import { ConfirmModal } from './components/confirm-modal';
import styles from './styles.scss';

export const EditVideoInterviewPage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const { candidateVideoInterview, candidateNewVideoRecorded } = useSelector(
    state => state.createCandidate,
  );
  const history = useHistory();

  const handleDeleteClick = useCallback(() => {
    dispatch(toggleConfirmModalVisibility(false));
  }, [dispatch]);

  const handleStartInterview = useCallback(() => {
    history.push(CandidateRouter.interview);
  }, [history]);

  const showConfirmModal = useCallback(() => {
    dispatch(toggleConfirmModalVisibility(true));
  }, [dispatch]);

  const recordVideoHandler = useCallback(() => {
    history.push(CandidateRouter.interview);
  }, [history]);

  return (
    <div className={styles['page']}>
      <div className={styles['page__header-wrapper']}>
        <h2 className={styles['page__title']}>Video interview</h2>
      </div>
      {candidateVideoInterview ? (
        <>
          <Video withDelete onDeleteClick={handleDeleteClick} url={candidateVideoInterview} />
          <div className={styles['page__interview-buttons']}>
            <Button
              className={styles['page__record-btn']}
              inlineIconClassName={styles['page__record-icon']}
              onClick={recordVideoHandler}
              inlineIcon="camera"
              variant="secondary"
              title="Record new video"
            />
            {candidateNewVideoRecorded && (
              <Button
                className={styles['page__save-changes-btn']}
                variant="accent"
                onClick={showConfirmModal}
                title="Confirm"
              />
            )}
          </div>
        </>
      ) : (
        <div className={styles['page__interview']}>
          <Icon name="interview" className={styles['page__interview-icon']} />
          <p className={styles['page__interview-info']}>
            Please click the button below to start recording your interview. You will need to answer
            on 4 simple questions, shown on the screen.
          </p>
          <Button
            className={styles['page__start-interview-btn']}
            title="Start interview"
            variant="accent"
            size="large"
            inlineIcon="camera"
            inlineIconClassName={styles['page__start-interview-btn-icon']}
            onClick={handleStartInterview}
          />
        </div>
      )}
      <ConfirmModal />
    </div>
  );
};
