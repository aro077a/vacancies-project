import React, { memo } from 'react';

import { CenterModal } from '~/view/components/modals';

import styles from './styles.scss';

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description?: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = memo(function SuccessModal({
  visible,
  onClose,
  title,
  description,
}) {
  return (
    <CenterModal title="" className={styles['modal-submitted']} visible={visible} onClose={onClose}>
      <div className={styles['modal-submitted-body']}>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </CenterModal>
  );
});
