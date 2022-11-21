import React, { memo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { UserType } from '~/models/common';
import { deleteJob, toggleDeleteJobModalVisibility } from '~/modules/createJob/actions';
import { useDispatch, useSelector } from '~/store';
import { AdminRouter } from '~/utils/router';
import { Button } from '~/view/components/button';
import { CenterModal } from '~/view/components/modals';

import styles from './styles.scss';

export const DeleteModal: React.FC = memo(function DeleteModal() {
  const history = useHistory();
  const dispatch = useDispatch();
  const deleteModalVisible = useSelector(state => state.createJob.deleteModalVisible);
  const deletingJob = useSelector(state => state.createJob.deletingJob);
  const loggedInUserType = useSelector(state => state.user.loggedInUserType);

  const handleModalClose = useCallback(() => {
    dispatch(toggleDeleteJobModalVisibility());
  }, [dispatch]);

  const handleDelete = useCallback(() => {
    dispatch(
      deleteJob.request({
        onSuccess: () => {
          if (loggedInUserType === UserType.ADMIN || loggedInUserType === UserType.SUPER_ADMIN) {
            history.push(AdminRouter.liveJobs);
          }
        },
      }),
    );
  }, [dispatch, history, loggedInUserType]);

  return (
    <CenterModal
      className={styles['modal']}
      visible={deleteModalVisible}
      onClose={handleModalClose}
    >
      <h2 className={styles['modal__title']}>Are you sure you want to delete job position?</h2>
      <div className={styles['modal__footer']}>
        <Button
          variant="secondary"
          title="Cancel"
          className={styles['modal__button']}
          onClick={handleModalClose}
        />
        <Button
          variant="danger"
          title="Yes, delete"
          className={styles['modal__button']}
          loading={deletingJob}
          onClick={handleDelete}
        />
      </div>
    </CenterModal>
  );
});
