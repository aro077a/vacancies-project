import React, { memo, useCallback } from 'react';

import { deleteEmail, toggleConfirmModalVisibility } from '~/modules/adminMessaging/actions';
import { useDispatch, useSelector } from '~/store';
import { Button } from '~/view/components/button';
import { CenterModal } from '~/view/components/modals';

import styles from './styles.scss';

export const ConfirmModal: React.FC = memo(function ConfirmModal() {
  const dispatch = useDispatch();
  const visible = useSelector(state => state.adminMessaging.confirmModalVisibility);

  const closeHandler = useCallback(() => {
    dispatch(toggleConfirmModalVisibility());
  }, [dispatch]);

  const deleteHandler = useCallback(() => {
    dispatch(deleteEmail.request());
  }, [dispatch]);

  return (
    <CenterModal
      className={styles['modal']}
      title="Are you sure that you want to delete this email?"
      onClose={closeHandler}
      visible={visible}
    >
      <div className={styles['modal__body']}>
        <Button
          onClick={closeHandler}
          className={styles['modal__button']}
          title="Cancel"
          variant="secondary"
        />
        <Button
          onClick={deleteHandler}
          className={styles['modal__button']}
          title="Delete"
          variant="danger"
        />
      </div>
    </CenterModal>
  );
});
