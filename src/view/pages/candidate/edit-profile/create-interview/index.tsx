/* eslint-disable jsx-a11y/media-has-caption */
/// <reference types="@types/dom-mediacapture-record" />
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Draggable from 'react-draggable';
import { RouteComponentProps, useHistory } from 'react-router-dom';

import { getInterviewQuestions, setVideoInterview } from '~/modules/createCandidate/actions';
import { useDispatch, useSelector } from '~/store';
import { CandidateRouter } from '~/utils/router';
import { Button } from '~/view/components/button';
import { Loader } from '~/view/components/loader';

import styles from './styles.scss';

const startRecording = (stream: MediaStream): Promise<Blob[]> => {
  const recorder = new MediaRecorder(stream);
  const data: Blob[] = [];

  recorder.ondataavailable = event => data.push(event.data);
  recorder.start();

  const stopped = new Promise((resolve, reject) => {
    recorder.onstop = resolve;
    recorder.onerror = event => reject(event);
  });

  return Promise.all([stopped]).then(() => data);
};

const stop = (stream: MediaStream): void => {
  stream.getTracks().forEach(track => {
    track.stop();
  });
};

export const VideoInterviewPage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const { interviewQuestions, generalExplanation } = useSelector(state => state.createCandidate);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [showRecorded, setShowRecorded] = useState(false);
  const history = useHistory();

  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    dispatch(getInterviewQuestions.request());
  }, [dispatch]);

  const showRecordedVideo = (url: string): void => {
    const recordedModal = document.getElementById('recorded-modal') as HTMLMediaElement;
    recordedModal.src = url;
  };

  const startVideo = useCallback((): void => {
    setPlaying(true);
    const preview = document.querySelector('#video-modal') as HTMLMediaElement;
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then(stream => {
        preview.srcObject = stream;
        return new Promise(resolve => {
          preview.onplaying = resolve;
        });
      })
      .then(() => startRecording(preview.srcObject as MediaStream))
      .then(recordedChunks => {
        setShowRecorded(true);

        const blob = new File(recordedChunks, 'Interview.mp4', {
          type: 'video/mp4',
        });

        dispatch(setVideoInterview.setAsBlob(blob));

        const url = URL.createObjectURL(blob);

        showRecordedVideo(url);

        dispatch(setVideoInterview.setAsString(url));

        history.push(CandidateRouter.editCandidate.editVideoInterview());
      })
      .catch(error => error);
  }, [dispatch, history]);

  const questions = useMemo(() => {
    if (interviewQuestions) {
      switch (activeQuestion) {
        case 0:
          return <div className={styles['page__interview-question']}>{generalExplanation}</div>;
        case 1:
          return <div className={styles['page__interview-question']}>{interviewQuestions[0]}</div>;
        case 2:
          return <div className={styles['page__interview-question']}>{interviewQuestions[1]}</div>;
        case 3:
          return <div className={styles['page__interview-question']}>{interviewQuestions[2]}</div>;
        case 4:
          return <div className={styles['page__interview-question']}>{interviewQuestions[3]}</div>;
        default:
          return null;
      }
    }
    return null;
  }, [activeQuestion, generalExplanation, interviewQuestions]);

  const stopVideo = useCallback(() => {
    setPlaying(false);
    const video = document.getElementById('video-modal') as HTMLMediaElement;

    stop(video.srcObject as MediaStream);
  }, []);

  const handleQuestionChange = useCallback(() => {
    setActiveQuestion(prevValue => prevValue + 1);
  }, []);

  const handleBackQuestion = useCallback(() => {
    setActiveQuestion(prevValue => prevValue - 1);
  }, []);

  return (
    <div className={styles['page']}>
      <div className={styles['page__interview']}>
        <div className={styles['page__interview-header']}>
          <h2 className={styles['page__interview-title']}>Video Interview</h2>
        </div>
        {interviewQuestions ? (
          <div className={styles['page__interview-questions']}>
            {questions}
            <div className={styles['page__interview-btns']}>
              {activeQuestion >= 1 && (
                <Button
                  onClick={handleBackQuestion}
                  size="medium"
                  title="Back"
                  variant="secondary"
                />
              )}
              {activeQuestion < 4 && (
                <Button
                  className={styles['page__interview-next-btn']}
                  onClick={handleQuestionChange}
                  size="medium"
                  title={activeQuestion === 0 ? 'Start' : 'Next question'}
                  variant="accent"
                />
              )}
            </div>
            {showRecorded && (
              <Draggable>
                <video
                  autoPlay
                  controls
                  id="recorded-modal"
                  className={styles['page__interview-modal']}
                />
              </Draggable>
            )}
            <Draggable>
              <video autoPlay muted id="video-modal" className={styles['page__interview-window']} />
            </Draggable>
            {playing ? (
              <Button
                className={styles['page__record-btn']}
                inlineIcon="camera"
                inlineIconClassName={styles['camera-icon']}
                variant="accent"
                title="Finish record"
                onClick={stopVideo}
              />
            ) : (
              <Button
                className={styles['page__record-btn']}
                inlineIcon="camera"
                inlineIconClassName={styles['camera-icon']}
                variant="accent"
                title="Start record"
                onClick={startVideo}
              />
            )}
          </div>
        ) : (
          <Loader loading />
        )}
      </div>
    </div>
  );
};
