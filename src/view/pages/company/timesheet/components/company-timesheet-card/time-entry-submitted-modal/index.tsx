import React, { memo } from 'react';

import { TimesheetApprovedImage } from '~/view/assets/images/timesheet-approved';
import { CenterModal } from '~/view/components/modals';

import styles from './styles.scss';

interface TimesheetApprovedModalProps {
  visible: boolean;
  onClose: () => void;
}

export const TimesheetApprovedModal: React.FC<TimesheetApprovedModalProps> = memo(
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
            <TimesheetApprovedImage />
          </div>
          <h2>Timesheet approved</h2>
          <p>Timesheet has been approved, thank you.</p>
        </div>
      </CenterModal>
    );
  },
);
