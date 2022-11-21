import classNames from 'classnames';
import React, { useCallback, useEffect, useRef } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { UserType } from '~/models/common';
import { createDescription, toggleDeleteJobModalVisibility } from '~/modules/createJob/actions';
import { useDispatch, useSelector } from '~/store';
import { AdminRouter, CommonRouter, CompanyRouter } from '~/utils/router';
import { BackButton } from '~/view/components/back-button';
import { Button } from '~/view/components/button';
import { Editor } from '~/view/components/editor';

import styles from './styles.scss';

export const CreateJobDescriptionPage: React.FC<RouteComponentProps> = ({ history }) => {
  const dispatch = useDispatch();
  const loggedInUserType = useSelector(state => state.user.loggedInUserType);
  const creatingDescription = useSelector(state => state.createJob.creatingDescription);
  const createdDescription = useSelector(state => state.createJob.createdDescription);
  const createdJobInfo = useSelector(state => state.createJob.createdJobInfo);
  const editMode = useSelector(state => state.createJob.editMode);
  const editorRef = useRef<React.ElementRef<typeof Editor>>(null);

  useEffect(() => {
    if (!editMode && !createdJobInfo) {
      history.push(CommonRouter.createJob.createJobInfo);
    }
  }, [createdJobInfo, editMode, history]);

  const handleGoBack = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleDelete = useCallback(() => {
    dispatch(toggleDeleteJobModalVisibility());
  }, [dispatch]);

  const handleSubmit = useCallback(() => {
    if (editorRef.current) {
      dispatch(
        createDescription.request({
          requestBody: {
            description: editorRef.current.getRawValue(),
          },
          onSuccess: () => {
            if (!editMode) {
              if (
                loggedInUserType === UserType.ADMIN ||
                loggedInUserType === UserType.SUPER_ADMIN
              ) {
                history.push(AdminRouter.liveJobs);
              }
              if (loggedInUserType === UserType.COMPANY || loggedInUserType === UserType.MANAGER) {
                history.push(CompanyRouter.addJobs);
              }
            }
          },
        }),
      );
    }
  }, [dispatch, editMode, history, loggedInUserType]);

  return (
    <div className={styles['page']}>
      {!editMode && <BackButton />}
      <div className={styles['page__header']}>
        <h1
          className={classNames(styles['page__title'], {
            [styles['page__title--edit-mode']]: editMode,
          })}
        >
          Detailed job description <span>(optional)</span>
        </h1>
        {!editMode && (
          <p className={styles['page__number']}>
            3<span>/3</span>
          </p>
        )}
      </div>
      <p className={styles['page__subtitle']}>
        Please add as much details about your company and the role you are recruiting for. Connect
        with the ideal candidate
      </p>
      <Editor
        ref={editorRef}
        label="Description"
        className={styles['page__editor']}
        maxLimit={5000}
        rawContentState={createdDescription?.description}
      />
      {editMode && <div className={styles['page__separator']} />}
      <div
        className={classNames(styles['page__footer'], {
          [styles['page__footer--edit-mode']]: editMode,
        })}
      >
        {editMode ? (
          <>
            <Button
              variant="danger"
              title="Delete position"
              className={styles['page__delete-button']}
              onClick={handleDelete}
            />
            <Button
              variant="accent"
              title="Save changes"
              className={styles['page__save-changes-button']}
              loading={creatingDescription}
              onClick={handleSubmit}
            />
          </>
        ) : (
          <>
            <Button
              variant="secondary"
              title="Back"
              className={styles['page__footer-back-button']}
              onClick={handleGoBack}
            />
            <Button title="Next" loading={creatingDescription} onClick={handleSubmit} />
          </>
        )}
      </div>
    </div>
  );
};
