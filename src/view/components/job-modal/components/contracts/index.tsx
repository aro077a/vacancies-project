import React, { memo } from 'react';

import { useSelector } from '~/store';
import { Loader } from '~/view/components/loader';

import { ContractBlock } from './components/contract-block';
import styles from './styles.scss';

export const Contracts: React.FC = memo(function Contracts() {
  const { liveJobContracts, pendingContracts } = useSelector(state => state.adminLiveJobs);
  const loadingContracts = useSelector(state => state.adminLiveJobs.loadingLiveJobContracts);

  return (
    <div className={styles['contracts']}>
      <div className={styles['contracts__section']}>
        <h4 className={styles['contracts__section-title']}>Pending contracts</h4>
        {loadingContracts && <Loader loading />}
        {pendingContracts.map(contract => (
          <ContractBlock key={contract.id} {...contract} />
        ))}
        {pendingContracts.length === 0 && !loadingContracts && (
          <p className={styles['no-contracts-message']}>No contracts</p>
        )}
      </div>
      <div className={styles['contracts__section']}>
        <h4 className={styles['contracts__section-title']}>All contracts</h4>
        {loadingContracts && <Loader loading />}
        {liveJobContracts.map(contract => (
          <ContractBlock key={contract.id} {...contract} />
        ))}
        {liveJobContracts.length === 0 && !loadingContracts && (
          <p className={styles['no-contracts-message']}>No contracts</p>
        )}
      </div>
    </div>
  );
});
