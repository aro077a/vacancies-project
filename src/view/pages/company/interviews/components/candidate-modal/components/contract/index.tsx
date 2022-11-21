import React from 'react';

import { useSelector } from '~/store';
import { ContractCard } from '~/view/components/contract-card';

import styles from './styles.scss';

export const Contracts: React.FC = () => {
  const contracts = useSelector(state => state.companyInterviews.matchedCandidateContracts);

  return (
    <div className={styles['contract']}>
      {contracts.map(contract => (
        <ContractCard key={contract.id} contract={contract} type="company" />
      ))}
    </div>
  );
};
