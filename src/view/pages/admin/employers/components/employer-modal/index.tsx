import React, { memo } from 'react';

import { useSelector } from '~/store';
import { Icon } from '~/view/components/icon';
import { Image } from '~/view/components/image';
import { RightModal } from '~/view/components/modals';

import { EmployerJobCard } from './employer-jobs';
import styles from './styles.scss';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const EmployerModal: React.FC<Props> = memo(function EmployerModal({ visible, onClose }) {
  const selectedEmployer = useSelector(state => state.adminEmployers.selectedEmployer);
  return (
    <RightModal
      className="modal"
      onClose={onClose}
      visible={visible}
      backTitle="< Back to employers"
    >
      <div className={styles['modal__header']}>
        <div className={styles['modal__employer']}>
          <Image
            type="candidate"
            className={styles['modal__employer-image']}
            alt="candidate"
            src={selectedEmployer?.companyLogo}
          />
          <div className={styles['modal__employer-info']}>
            <h4 className={styles['modal__employer-name']}>{selectedEmployer?.name}</h4>
            <div className={styles['modal__employer-location-info']}>
              <Icon name="location" className={styles['modal__employer-location-icon']} />
              <p>{`${selectedEmployer?.city?.name} , ${selectedEmployer?.state?.abbr}`}</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles['modal__body-job']}>
        <h4 className={styles['modal__body-job-title']}>Job positions</h4>
        {selectedEmployer?.jobs.map(job => (
          <EmployerJobCard job={job} jobLogo={selectedEmployer?.companyLogo} key={job.id} />
        ))}
      </div>
    </RightModal>
  );
});
