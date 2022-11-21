import React, { memo } from 'react';

import { Button } from '~/view/components/button';
import { CenterModal } from '~/view/components/modals';

import styles from './styles.scss';

interface CancelSignupModalProps {
  visible: boolean;
  onClose: () => void;
  handleRemoveAdmin: () => void;
}

export const ConfirmDeleteAdminModal: React.FC<CancelSignupModalProps> = memo(
  function ConfirmDeleteAdminModal({ visible, onClose, handleRemoveAdmin }) {
    return (
      <CenterModal
        title=""
        className={styles['modal-remove-admin']}
        visible={visible}
        onClose={onClose}
      >
        <div className={styles['modal-remove-admin__body']}>
          <div className={styles['modal-remove-admin__body-title']}>
            <h2>Are you sure want to delete admin from the list?</h2>
          </div>
          <div className={styles['modal-remove-admin__body-buttons']}>
            <Button
              variant="secondary"
              title="Cancel"
              className={styles['modal-remove-admin__body-buttons-button']}
              onClick={onClose}
            />
            <Button
              variant="accent"
              title="Confirm"
              className={styles['modal-remove-admin__body-buttons-button']}
              onClick={handleRemoveAdmin}
            />
          </div>
        </div>
      </CenterModal>
    );
  },
);
