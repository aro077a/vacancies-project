import classNames from 'classnames';
import React, { memo, useCallback, useEffect } from 'react';

import { setSelectedCandidate } from '~/modules/adminCandidates/actions';
import { toggleInterestedJobSuccessModalVisibility } from '~/modules/companyCandidates/actions';
import { useDispatch, useSelector } from '~/store';
import { Icon } from '~/view/components/icon';
import { Image } from '~/view/components/image';
import { Loader } from '~/view/components/loader';
import { RightModal } from '~/view/components/modals';
import { SuccessModal } from '~/view/components/success-modal';

import { Overview } from './components/overview';
import styles from './styles.scss';

type Props = {
  visible: boolean;
  onClose: () => void;
  className?: string;
};

export const CompanyCandidateModal: React.FC<Props> = memo(function CompanyCandidateModal({
  visible,
  onClose,
  className,
}) {
  const dispatch = useDispatch();
  const selectedCandidate = useSelector(state => state.companyCandidates.selectedCandidate);
  const successModalVisibility = useSelector(
    state => state.companyCandidates.interestedJobSuccessModalVisibility,
  );
  const position = useSelector(state => state.companyCandidates.selectedInterestedJob);
  const selectedCandidateLoading = useSelector(
    state => state.companyCandidates.loadingSelectedCandidate,
  );
  const location = useSelector(state => state.companyCandidates.selectedCandidate?.location);

  const modalClassName = classNames(className, styles['modal']);

  useEffect(() => {
    if (!visible) {
      dispatch(setSelectedCandidate(null));
    }
  }, [dispatch, visible]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!selectedCandidate) {
    return null;
  }

  return (
    <>
      <RightModal
        className={modalClassName}
        onClose={handleClose}
        visible={visible}
        backTitle="< Back to candidates"
      >
        {selectedCandidateLoading && <Loader loading />}
        {!selectedCandidateLoading && (
          <>
            <div className={styles['modal__header']}>
              <div className={styles['modal__candidate']}>
                <Image
                  type="candidate"
                  className={styles['modal__candidate-image']}
                  alt="candidate"
                  src={selectedCandidate.avatar}
                />
                <div className={styles['modal__candidate-info']}>
                  <div className={styles['modal__candidate-top']}>
                    <h4 className={styles['modal__candidate-name']}>
                      {selectedCandidate.candidateName}
                    </h4>
                    <span className={styles['circle']} />
                    <p>{selectedCandidate?.jobName}</p>
                  </div>
                  <div className={styles['modal__candidate-location-info']}>
                    <Icon name="location" className={styles['modal__candidate-location-icon']} />
                    <p>{selectedCandidate.location || location}</p>
                  </div>
                </div>
              </div>
            </div>
            <Overview handleClose={handleClose} />
          </>
        )}
      </RightModal>
      <SuccessModal
        visible={successModalVisibility}
        onClose={() => dispatch(toggleInterestedJobSuccessModalVisibility())}
        title="You have shown interest in"
        description={position}
      />
    </>
  );
});
