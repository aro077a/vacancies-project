import React, { memo, useCallback } from 'react';

import { markConfirmedContract } from '~/modules/companyInterviews/actions';
import { useDispatch, useSelector } from '~/store';
import { ContractConfirmedImage } from '~/view/assets/images/contract-confirmed';
import { CenterModal } from '~/view/components/modals';

import styles from './styles.scss';

export const ContractConfirmedModal: React.FC = memo(function ContractConfirmedModal() {
  const dispatch = useDispatch();
  const visible = useSelector(state => state.companyInterviews.contractConfirmed);

  const handleClose = useCallback(() => {
    dispatch(markConfirmedContract(false));
  }, [dispatch]);

  return (
    <CenterModal className={styles['modal']} visible={visible} onClose={handleClose}>
      <div className={styles['modal__image-wrapper']}>
        <ContractConfirmedImage />
      </div>
      <h2 className={styles['modal__title']}>Contract confirmed</h2>
      <p className={styles['modal__subtitle']}>Congratulations on finding top talent!</p>
    </CenterModal>
  );
});
