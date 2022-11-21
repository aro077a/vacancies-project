import React from 'react';

import { useSelector } from '~/store';
import { ContractCard } from '~/view/components/contract-card';

import styles from './styles.scss';

export const Contracts: React.FC = () => {
  const contract = useSelector(state => state.candidateProposals.matchedJobContracts);

  return (
    <div className={styles['contracts']}>
      {contract ? (
        <ContractCard type="candidate" contract={contract} />
      ) : (
        <p className={styles['contract__no-contract-message']}>No contract</p>
      )}
    </div>
  );
};
