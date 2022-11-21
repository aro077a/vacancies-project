import React, { memo } from 'react';

import { RegistrationDoneImage } from '~/view/assets/images/registration-done';
import { CenterModal } from '~/view/components/modals';

import styles from './styles.scss';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const RegistrationFinishedModal: React.FC<Props> = memo(function RegistrationFinishedModal({
  visible,
  onClose,
}) {
  return (
    <CenterModal className={styles['modal']} visible={visible} onClose={onClose}>
      <div className={styles['modal__image-wrapper']}>
        <RegistrationDoneImage />
      </div>
      <h2 className={styles['modal__title']}>Thank you for registration!</h2>
      <p className={styles['modal__subtitle']}>
        Your request is pending approval. We will email you shortly, once it will be approved.
      </p>
    </CenterModal>
  );
});
