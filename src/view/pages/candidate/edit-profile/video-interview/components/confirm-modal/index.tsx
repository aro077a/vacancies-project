import React, { memo, useCallback } from 'react';

import {
  deleteVideoInterview,
  toggleConfirmModalVisibility,
  uploadVideoInterview,
} from '~/modules/createCandidate/actions';
import { useDispatch, useSelector } from '~/store';
import { Button } from '~/view/components/button';
import { CenterModal } from '~/view/components/modals';

import styles from './styles.scss';

export const ConfirmModal: React.FC = memo(function ConfirmModal() {
  const dispatch = useDispatch();
  const { confirmModalVisibility, isUpload, deletingVideoInterview, uploadingVideoInterview } =
    useSelector(state => state.createCandidate);

  const handleClose = useCallback(() => {
    dispatch(toggleConfirmModalVisibility(false));
  }, [dispatch]);

  const handleDelete = useCallback(() => {
    dispatch(deleteVideoInterview.request());
  }, [dispatch]);

  const handleUpload = useCallback(() => {
    dispatch(uploadVideoInterview.request());
  }, [dispatch]);

  if (isUpload) {
    return (
      <CenterModal
        className={styles['modal']}
        onClose={handleClose}
        title="Are you sure you want to upload video interview?"
        visible={confirmModalVisibility}
      >
        <div className={styles['modal__buttons-wrapper']}>
          <Button
            onClick={handleClose}
            className={styles['modal__button']}
            title="Cancel"
            variant="secondary"
          />
          <Button
            onClick={handleUpload}
            className={styles['modal__button']}
            title="Yes, upload"
            variant="accent"
            loading={uploadingVideoInterview}
          />
        </div>
      </CenterModal>
    );
  }

  return (
    <CenterModal
      className={styles['modal']}
      onClose={handleClose}
      title="Are you sure you want to delete video interview?"
      visible={confirmModalVisibility}
    >
      <div className={styles['modal__buttons-wrapper']}>
        <Button
          onClick={handleClose}
          className={styles['modal__button']}
          title="Cancel"
          variant="secondary"
        />
        <Button
          onClick={handleDelete}
          className={styles['modal__button']}
          title="Yes, delete"
          variant="danger"
          loading={deletingVideoInterview}
        />
      </div>
    </CenterModal>
  );
});
