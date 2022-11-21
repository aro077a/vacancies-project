import React, { memo, useCallback, useState } from 'react';

import { JobContract } from '~/models/admin';
import { downloadGeneratedContract, setGeneratedContractId } from '~/modules/adminPipeline/actions';
import { useDispatch } from '~/store';
import { Button } from '~/view/components/button';
import { Icon } from '~/view/components/icon';

import { Card } from './components/card';
import styles from './styles.scss';

export const ContractBlock: React.FC<JobContract> = memo(function ContractBlock({
  companyName,
  companyLocation,
  candidateLocation,
  candidateName,
  candidateStatus,
  companyStatus,
  id,
}) {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);

  const toggleDropdownVisibility = useCallback(() => {
    setIsVisible(prevValue => !prevValue);
  }, []);

  const downloadContract = (isCandidate: boolean): void => {
    dispatch(setGeneratedContractId(id));

    if (isCandidate) {
      dispatch(downloadGeneratedContract.request({ isCandidate }));
    } else {
      dispatch(downloadGeneratedContract.request({ isCandidate }));
    }
  };

  return (
    <div className={styles['block']}>
      <div className={styles['block__header']}>
        <div className={styles['block__contract-info']}>
          <h4 className={styles['block__file-name']}>Contract</h4>
          <div className={styles['block__extra-info']}>
            <button
              onClick={() => downloadContract(true)}
              className={styles['block__download-btn']}
            >
              Download candidate's contract{' '}
              <Icon
                className={styles['block__download-icon']}
                name="download"
                width="10px"
                height="10px"
              />
            </button>
            <button
              onClick={() => downloadContract(false)}
              className={styles['block__download-btn']}
            >
              Download company's contract{' '}
              <Icon
                className={styles['block__download-icon']}
                name="download"
                width="10px"
                height="10px"
              />
            </button>
          </div>
        </div>
        <Button
          className={styles['block__update-btn']}
          title="Update contract"
          variant="secondary"
        />
        <button onClick={toggleDropdownVisibility}>
          <Icon className={styles['block__dropdown-icon']} name="chevron-down" />
        </button>
      </div>
      {isVisible && (
        <div className={styles['block__body']}>
          <Card
            id={id}
            location={companyLocation}
            status={companyStatus}
            name={companyName}
            img={null}
            isCompany
          />
          <Card
            id={id}
            location={candidateLocation}
            status={candidateStatus}
            name={candidateName}
            img={null}
            isCompany={false}
          />
        </div>
      )}
    </div>
  );
});
