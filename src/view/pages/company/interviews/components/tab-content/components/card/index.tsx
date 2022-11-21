import classNames from 'classnames';
import { format, parseISO } from 'date-fns';
import React, { BaseSyntheticEvent, memo, useCallback, useMemo } from 'react';

import { MatchedJob } from '~/models/admin';
import { MatchedJobSteps } from '~/models/common';
import { getContract, toggleFeedbackModalVisibility } from '~/modules/companyInterviews/actions';
import {
  setSelectedMatchedCandidate,
  toggleNoteModalVisibility,
} from '~/modules/companyInterviews/actions';
import { useDispatch } from '~/store';
import { Button } from '~/view/components/button';
import { Image } from '~/view/components/image';

import styles from './styles.scss';

type Props = {
  card: MatchedJob & { index: number };
  activeTab: number;
  onCardClick: () => void;
};

export const BoardCard: React.FC<Props> = memo(function BoardCard({
  card,
  activeTab,
  onCardClick,
}) {
  const dispatch = useDispatch();
  const {
    positionName,
    location,
    salary,
    step,
    interview,
    approvedDate,
    candidate,
    positionTypeName,
    candidateName,
    avatar,
    contract,
    candidateApproval,
    companyApproval,
    invoice,
  } = card;

  const prefix = positionTypeName === 'Permanent' ? 'year' : 'hour';

  const hideOnMobileClass = styles['card__hide-on-mobile'];

  const acceptHandler = useCallback(
    e => {
      e.stopPropagation();

      dispatch(setSelectedMatchedCandidate(card));
      dispatch(toggleNoteModalVisibility(true));
    },
    [dispatch, card],
  );

  const declineHandler = useCallback(
    e => {
      e.stopPropagation();

      dispatch(setSelectedMatchedCandidate(card));
      dispatch(toggleNoteModalVisibility(false));
    },
    [dispatch, card],
  );

  const createFeedbackHandler = useCallback(
    e => {
      e.stopPropagation();

      dispatch(setSelectedMatchedCandidate(card));
      dispatch(toggleFeedbackModalVisibility());
    },
    [dispatch, card],
  );

  const reviewContractHandler = useCallback(
    e => {
      e.stopPropagation();
      dispatch(setSelectedMatchedCandidate(card));
      dispatch(
        getContract.request({
          isReview: true,
        }),
      );
    },
    [dispatch, card],
  );

  const reviewInvoiceHandler = useCallback((e: BaseSyntheticEvent) => {
    e.stopPropagation();
  }, []);

  const onCardClickHandler = useCallback(() => {
    dispatch(setSelectedMatchedCandidate(card));
    onCardClick();
  }, [onCardClick, card, dispatch]);

  const boardCard = useMemo(() => {
    switch (activeTab) {
      case 1:
        return (
          <>
            <p className={styles['card__job-title']}>{candidate}</p>
            <p className={classNames(styles['card__job-type'], hideOnMobileClass)}>{location}</p>
            <p className={classNames(styles['card__job-location'], hideOnMobileClass)}>
              {positionName}
            </p>
            <p className={styles['card__job-salary']}>
              ${salary} <span className={styles['card__job-salary-prefix']}>/{prefix}</span>
            </p>
            <div className={classNames(styles['card__act-btns'], hideOnMobileClass)}>
              <Button
                className={styles['card__accept-btn']}
                title="Accept"
                variant="accent"
                size="large"
                onClick={acceptHandler}
              />
              <Button
                className={styles['card__decline-btn']}
                title="Decline"
                variant="secondary"
                size="large"
                onClick={declineHandler}
              />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <p className={styles['card__job-title']}>{candidate}</p>
            <p className={classNames(styles['card__job-type'], hideOnMobileClass)}>{location}</p>
            <p className={classNames(styles['card__job-location'], hideOnMobileClass)}>
              {positionName}
            </p>
            <p className={classNames(styles['card__job-salary'], hideOnMobileClass)}>
              ${salary} <span className={styles['card__job-salary-prefix']}>/{prefix}</span>
            </p>
            {step === MatchedJobSteps.InterviewArranged ? (
              <p className={styles['card__job-interview-arranged']}>
                {interview?.date && format(parseISO(interview?.date), 'dd/MM/yyyy')}{' '}
                <span className={styles['card__job-interview-time']}>{interview?.time}</span>
              </p>
            ) : (
              <p className={styles['card__job-interview-arranged']}>Pending</p>
            )}
            {interview?.passed ? (
              <Button
                className={styles['card__feedback-btn']}
                title="Send feedback"
                variant="secondary"
                onClick={createFeedbackHandler}
              />
            ) : (
              <p className={styles['card__job-interview-location']}>{interview?.location}</p>
            )}
          </>
        );
      case 4:
        return (
          <>
            <div className={styles['card__candidate-info']}>
              <Image
                className={styles['card__candidate-photo']}
                type="candidate"
                alt={`${candidateName}'s photo`}
                src={avatar}
              />
              <p className={styles['card__candidate-name']}>{candidateName}</p>
            </div>
            <p className={classNames(styles['card__job-type'], hideOnMobileClass)}>{location}</p>
            <p className={classNames(styles['card__job-location'], hideOnMobileClass)}>
              {positionName}
            </p>
            <p className={classNames(styles['card__job-salary'], hideOnMobileClass)}>
              ${salary} <span className={styles['card__job-salary-prefix']}>/{prefix}</span>
            </p>
            {approvedDate ? (
              <p className={styles['card__job-approved-date']}>
                {format(parseISO(approvedDate), 'dd/MM/yyyy')}
              </p>
            ) : contract && companyApproval && !candidateApproval ? (
              <Button
                className={styles['card__waiting-contract-btn']}
                title="Waiting for approval"
                variant="secondary"
                onClick={e => e.stopPropagation()}
              />
            ) : MatchedJobSteps.WaitingForApproval === step ? (
              <Button
                className={styles['card__review-contract-btn']}
                title="Review contract"
                variant="secondary"
                onClick={reviewContractHandler}
              />
            ) : invoice && positionTypeName === 'Permanent' ? (
              <Button
                className={styles['card__review-contract-btn']}
                title="Review invoice"
                variant="secondary"
                onClick={reviewInvoiceHandler}
              />
            ) : (
              <></>
            )}
          </>
        );
      default:
        return null;
    }
  }, [
    approvedDate,
    activeTab,
    positionName,
    location,
    salary,
    step,
    interview,
    hideOnMobileClass,
    acceptHandler,
    declineHandler,
    createFeedbackHandler,
    reviewContractHandler,
    reviewInvoiceHandler,
    prefix,
    avatar,
    candidateName,
    contract,
    candidate,
    candidateApproval,
    companyApproval,
    positionTypeName,
    invoice,
  ]);

  return (
    <div onClick={onCardClickHandler} className={styles['card']}>
      {boardCard}
    </div>
  );
});
