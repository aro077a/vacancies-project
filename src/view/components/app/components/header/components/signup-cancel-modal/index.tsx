import React, { memo } from 'react';

import { Button } from '~/view/components/button';
import { CenterModal } from '~/view/components/modals';

import styles from './styles.scss';

interface CancelSignupModalProps {
  visible: boolean;
  onClose: () => void;
  handleLeavePage: () => void;
}

export const CancelSignupModal: React.FC<CancelSignupModalProps> = memo(function CancelSignupModal({
  visible,
  onClose,
  handleLeavePage,
}) {
  return (
    <CenterModal title="" className={styles['modal-cancel']} visible={visible} onClose={onClose}>
      <div className={styles['modal-cancel__body']}>
        <div className={styles['modal-cancel__body-title']}>
          <h2>
            All inputted data within registration process will be lost, are you sure you want to
            leave the page?
          </h2>
        </div>
        <div className={styles['modal-cancel__body-buttons']}>
          <Button
            variant="secondary"
            title="Cancel"
            className={styles['modal-cancel__body-buttons-button']}
            onClick={onClose}
          />
          <Button
            variant="accent"
            title="Leave page"
            className={styles['modal-cancel__body-buttons-button']}
            onClick={handleLeavePage}
          />
        </div>
      </div>
    </CenterModal>
  );
});
