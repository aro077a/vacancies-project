import React, { memo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { CommonRouter } from '~/utils/router';
import { Button } from '~/view/components/button';
import { CenterModal } from '~/view/components/modals';

import styles from './styles.scss';

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = memo(function InfoModal({ visible, onClose }) {
  const history = useHistory();
  const navigateToLoginPage = useCallback(() => {
    history.push(CommonRouter.auth.login);
  }, [history]);
  return (
    <CenterModal title="" className={styles['modal-info']} visible={visible} onClose={onClose}>
      <div className={styles['modal-info__body']}>
        <div className={styles['modal-info__body-title']}>
          <h2>
            Your request is pending approval. We will email you shortly, once it will be approved
          </h2>
        </div>
        <Button
          variant="accent"
          title="Go to Login page"
          className={styles['modal-info__body-button']}
          onClick={navigateToLoginPage}
        />
      </div>
    </CenterModal>
  );
});
