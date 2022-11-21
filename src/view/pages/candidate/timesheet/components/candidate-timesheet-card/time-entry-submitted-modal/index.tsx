import React, { memo } from 'react';

import { TimeEntrySubmittedImage } from '~/view/assets/images/time-entry';
import { CenterModal } from '~/view/components/modals';

import styles from './styles.scss';

interface TimeEntrySubmittedModalProps {
  visible: boolean;
  onClose: () => void;
}

export const TimeEntrySubmittedModal: React.FC<TimeEntrySubmittedModalProps> = memo(
  function TimeEntrySubmittedModal({ visible, onClose }) {
    return (
      <CenterModal
        title=""
        className={styles['modal-submitted']}
        visible={visible}
        onClose={onClose}
      >
        <div className={styles['modal-submitted-body']}>
          <div className={styles['modal-submitted-body-image-wrapper']}>
            <TimeEntrySubmittedImage />
          </div>
          <h2>Time entry submitted</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </CenterModal>
    );
  },
);
