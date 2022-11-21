import React, { memo, useCallback, useMemo } from 'react';

import { MatchedJobContract } from '~/models/candidate';
import { UserType } from '~/models/common';
import {
  approveMatchedJobContract,
  getContract as getCandidateContract,
} from '~/modules/candidateProposals/actions';
import {
  approveMatchedCandidateContract,
  getContract as getCompanyContract,
  markConfirmedContract,
} from '~/modules/companyInterviews/actions';
import { useDispatch, useSelector } from '~/store';
import { Button } from '~/view/components/button';
import { Icon } from '~/view/components/icon';

import styles from './styles.scss';

type Props = {
  contract: MatchedJobContract;
  type: 'company' | 'candidate';
};

export const ContractCard: React.FC<Props> = memo(function ContractCard({ contract, type }) {
  const dispatch = useDispatch();
  const { approved, id } = contract;
  const isCompany = useSelector(state => state.user.loggedInUserType) === UserType.COMPANY;

  const approveHandler = useCallback(() => {
    if (type === 'company') {
      dispatch(
        approveMatchedCandidateContract.request({
          data: { contractId: id, approved: true },
          cb: () => {
            dispatch(markConfirmedContract(true));
          },
        }),
      );
    } else {
      dispatch(approveMatchedJobContract.request(true));
    }
  }, [dispatch, type, id]);

  const statusButton = useMemo(() => {
    if (type === 'candidate') {
      switch (approved) {
        case true:
          return <div className={styles['card__status--approved']}>Approved by you</div>;
        case false:
          return <div className={styles['card__status--rejected']}>Rejected</div>;
        case null:
          return <Button onClick={approveHandler} title="Confirm" variant="accent" size="medium" />;
        default:
          return null;
      }
    }

    switch (approved) {
      case true:
        return <div className={styles['card__status--approved']}>Approved</div>;
      case false:
        return <div className={styles['card__status--rejected']}>Rejected</div>;
      case null:
        return (
          <div className={styles['card__actn-btns']}>
            <Button
              className={styles['card__act-btn']}
              onClick={approveHandler}
              title="Confirm"
              variant="accent"
              size="large"
            />
            <Button
              className={styles['card__act-btn']}
              title="Reject"
              variant="danger"
              size="large"
            />
          </div>
        );
      default:
        return null;
    }
  }, [approved, approveHandler, type]);

  const downloadContract = (): void => {
    if (isCompany) {
      dispatch(
        getCompanyContract.request({
          isReview: false,
        }),
      );
    } else {
      dispatch(
        getCandidateContract.request({
          isReview: false,
        }),
      );
    }
  };

  return (
    <div className={styles['card']}>
      <div className={styles['card__file-info']}>
        <div className={styles['card__file-info']}>
          <h4 className={styles['card__file-name']}>Contract</h4>
          <div className={styles['card__bottom']}>
            <button className={styles['card__download-btn']} onClick={downloadContract}>
              Download contract <Icon className={styles['card__download-icon']} name="download" />
            </button>
          </div>
        </div>
      </div>
      {statusButton}
    </div>
  );
});
