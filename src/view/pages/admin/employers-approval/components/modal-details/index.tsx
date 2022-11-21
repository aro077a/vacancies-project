import classNames from 'classnames';
import React, { memo, useCallback, useEffect, useMemo } from 'react';

import { EmployerStatus } from '~/models/admin';
import { setSelectedEmployer } from '~/modules/adminEmployers/actions';
import { useDispatch, useSelector } from '~/store';
import { Button } from '~/view/components/button';
import { Icon } from '~/view/components/icon';
import { Image } from '~/view/components/image';
import { RightModal } from '~/view/components/modals';

import styles from './styles.scss';

type Props = {
  visible: boolean;
  onClose: () => void;
  onRejectClick?: (id: number) => void;
  onApproveClick?: (id: number) => void;
};

export const EmployerDetailsModal: React.FC<Props> = memo(function EmployerDetailsModal({
  visible,
  onClose,
  onApproveClick,
  onRejectClick,
}) {
  const dispatch = useDispatch();
  const { employerDetails } = useSelector(state => state.adminEmployers);

  useEffect(() => {
    if (!visible) {
      dispatch(setSelectedEmployer(null));
    }
  }, [dispatch, visible]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const selectedEmployerId = useSelector(
    state => state.adminEmployers.employerDetails?.id,
  ) as number;

  const handleApproveClick = useCallback(() => {
    if (onApproveClick) {
      onApproveClick(selectedEmployerId);
      onClose();
    }
  }, [onApproveClick, selectedEmployerId, onClose]);

  const handleRejectClick = useCallback(() => {
    if (onRejectClick) {
      onRejectClick(selectedEmployerId);
      onClose();
    }
  }, [onRejectClick, selectedEmployerId, onClose]);

  const footer = useMemo(() => {
    switch (employerDetails?.approveStatus) {
      case EmployerStatus.PENDING:
        return (
          <div className={styles['modal__footer']}>
            <div className={styles['modal__divider']} />
            <Button
              className={styles['modal__footer-btn']}
              title="Approve"
              size="large"
              variant="accent"
              onClick={handleApproveClick}
            />
            <Button onClick={handleRejectClick} title="Reject" size="large" variant="secondary" />
          </div>
        );
      case EmployerStatus.APPROVED:
        return (
          <div className={styles['modal__footer']}>
            <div className={styles['modal__divider']} />
            <Button
              className={classNames(
                styles['modal__footer-btn'],
                styles['modal__footer-btn--active'],
              )}
              title="Approve"
              size="large"
              variant="accent"
              inlineIcon="checkmark"
              inlineIconClassName={styles['modal__checkmark']}
              onClick={handleApproveClick}
            />
          </div>
        );
      case EmployerStatus.REJECTED:
        return (
          <div className={styles['modal__footer']}>
            <div className={styles['modal__divider']} />
            <Button
              inlineIcon="checkmark"
              onClick={handleRejectClick}
              title="Reject"
              size="large"
              variant="secondary"
              className={styles['modal__reject-btn']}
              inlineIconClassName={styles['modal__checkmark--reject']}
            />
          </div>
        );
      default:
        return null;
    }
  }, [employerDetails, handleApproveClick, handleRejectClick]);

  if (!employerDetails) {
    return null;
  }

  return (
    <RightModal
      className={styles['modal']}
      onClose={handleClose}
      visible={visible}
      backTitle="< Back to employers"
    >
      <div className={styles['modal__header']}>
        <div className={styles['modal__candidate']}>
          <Image
            type="company"
            className={styles['modal__candidate-image']}
            alt="company"
            src={employerDetails.companyLogo}
          />
          <div className={styles['modal__candidate-info']}>
            <h4 className={styles['modal__candidate-name']}>{employerDetails.name}</h4>
            <div className={styles['modal__candidate-location-info']}>
              <Icon name="location" className={styles['modal__candidate-location-icon']} />
              <p>
                {`${employerDetails.city && employerDetails.city.name}, ${
                  employerDetails.state && employerDetails.state.name
                }`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles['modal__info']}>
        <h4 className={styles['modal__info-title']}>Company info</h4>
        <div className={styles['modal__info-item']}>
          <p className={styles['modal__info-item-label']}>Account email address:</p>
          <p className={styles['modal__info-item-value']}>{employerDetails.user.email || '-'}</p>
        </div>
        <div className={styles['modal__info-item']}>
          <p className={styles['modal__info-item-label']}>HQ address:</p>
          <p className={styles['modal__info-item-value']}>{employerDetails.address || '-'}</p>
        </div>
        <div className={styles['modal__info-item']}>
          <p className={styles['modal__info-item-label']}>Office phone:</p>
          <p className={styles['modal__info-item-value']}>{employerDetails.phone || '-'}</p>
        </div>
        <div className={styles['modal__info-item']}>
          <p className={styles['modal__info-item-label']}>Website:</p>
          <p className={styles['modal__info-item-value']}>{employerDetails.site || '-'}</p>
        </div>
      </div>

      <div className={styles['modal__info']}>
        <h4 className={styles['modal__info-title']}>Details</h4>
        <div className={styles['modal__info-item']}>
          <p className={styles['modal__info-item-label']}>Business contact name:</p>
          <p className={styles['modal__info-item-value']}>
            {(employerDetails.contacts && employerDetails.contacts.email) || '-'}
          </p>
        </div>
        <div className={styles['modal__info-item']}>
          <p className={styles['modal__info-item-label']}>Business contact position:</p>
          <p className={styles['modal__info-item-value']}>
            {(employerDetails.contacts && employerDetails.contacts.position) || '-'}
          </p>
        </div>

        <div className={styles['modal__info-item']}>
          <p className={styles['modal__info-item-label']}>Business contact email:</p>
          <p className={styles['modal__info-item-value']}>
            {(employerDetails.contacts && employerDetails.contacts.email) || '-'}
          </p>
        </div>

        <div className={styles['modal__info-item']}>
          <p className={styles['modal__info-item-label']}>Best phone number:</p>
          <p className={styles['modal__info-item-value']}>
            {(employerDetails.contacts && employerDetails.contacts.phone) || '-'}
          </p>
        </div>
      </div>
      {footer}
    </RightModal>
  );
});
