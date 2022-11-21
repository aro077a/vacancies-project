import classNames from 'classnames';
import { format, parseISO } from 'date-fns';
import React, { memo, useCallback, useMemo } from 'react';

import { MatchedJob } from '~/models/admin';
import { MatchedJobSteps } from '~/models/common';
import {
  getContract,
  setBoards,
  setSelectedMatchedJob,
  toggleFeedbackModalVisibility,
  updateCandidateMatchedJob,
} from '~/modules/candidateProposals/actions';
import { useDispatch, useSelector } from '~/store';
import { Button } from '~/view/components/button';

import styles from './styles.scss';

type Props = {
  card: MatchedJob;
  activeTab: number;
  index: number;
  onCardClick: () => void;
};

export const BoardCard: React.FC<Props> = memo(function BoardCard({
  card,
  activeTab,
  index,
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
    projectTypeName,
    id,
    positionTypeName,
    contract,
    candidateApproval,
    companyApproval,
  } = card;
  const { boards } = useSelector(state => state.candidateProposals);

  const prefix = positionTypeName === 'Permanent' ? 'year' : 'hour';

  const hideOnMobileClass = styles['hide-on-mobile'];

  const onCardClickHandler = useCallback(() => {
    dispatch(setSelectedMatchedJob({ ...card, index }));
    onCardClick();
  }, [onCardClick, card, dispatch, index]);

  const acceptHandler = useCallback(
    e => {
      e.stopPropagation();
      const sourceBoard = boards[1];
      const destBoard = boards[2];
      const sourceItems = [...sourceBoard.items];
      const destItems = [...destBoard.items];
      const [removed] = sourceItems.splice(index, 1);
      destItems.unshift({ ...removed, step: MatchedJobSteps.AgreedByCandidate });
      dispatch(
        updateCandidateMatchedJob.request({
          matchedId: id,
          step: MatchedJobSteps.AgreedByCandidate,
          cb: () => {
            dispatch(
              setBoards({
                ...boards,
                1: {
                  ...sourceBoard,
                  items: sourceItems,
                },
                2: {
                  ...destBoard,
                  items: destItems,
                },
              }),
            );
          },
        }),
      );
    },
    [boards, id, index, dispatch],
  );

  const declineHandler = useCallback(
    e => {
      e.stopPropagation();
      const sourceBoard = boards[1];
      const sourceItems = [...sourceBoard.items];
      sourceItems.splice(index, 1);
      dispatch(
        updateCandidateMatchedJob.request({
          matchedId: id,
          step: MatchedJobSteps.Canceled,
          cb: () => {
            dispatch(
              setBoards({
                ...boards,
                1: {
                  ...sourceBoard,
                  items: sourceItems,
                },
              }),
            );
          },
        }),
      );
    },
    [boards, id, index, dispatch],
  );

  const createFeedbackHandler = useCallback(
    e => {
      e.stopPropagation();
      dispatch(setSelectedMatchedJob({ ...card, index }));
      dispatch(toggleFeedbackModalVisibility());
    },
    [dispatch, card, index],
  );

  const reviewContractHandler = useCallback(
    e => {
      e.stopPropagation();
      dispatch(setSelectedMatchedJob({ ...card, index }));
      dispatch(
        getContract.request({
          isReview: true,
        }),
      );
    },
    [dispatch, index, card],
  );

  const boardCard = useMemo(() => {
    switch (activeTab) {
      case 1:
        return (
          <div
            className={classNames(styles['card'], styles['card--offers-view'])}
            onClick={() => onCardClickHandler()}
          >
            <p className={styles['card__job-title']}>{positionName}</p>
            <p className={classNames(styles['card__job-type'], hideOnMobileClass)}>
              {projectTypeName}
            </p>
            <p className={classNames(styles['card__job-location'], hideOnMobileClass)}>
              {location}
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
          </div>
        );
      case 2:
        return (
          <div
            className={classNames(styles['card'], styles['card--vacancies-view'])}
            onClick={() => onCardClickHandler()}
          >
            <p className={styles['card__job-title']}>{positionName}</p>
            <p className={classNames(styles['card__job-type'], hideOnMobileClass)}>
              {projectTypeName}
            </p>
            <p className={classNames(styles['card__job-location'], hideOnMobileClass)}>
              {location}
            </p>
            <p className={classNames(styles['card__job-salary'], hideOnMobileClass)}>
              ${salary} <span className={styles['card__job-salary-prefix']}>/{prefix}</span>
            </p>
            {(step === MatchedJobSteps.SentToEmployee ||
              step === MatchedJobSteps.AcceptedByEmployee) && (
              <div
                className={classNames(styles['card__cv-status'], styles['card__cv-status--sent'])}
              >
                CV Sent
              </div>
            )}
            {step === MatchedJobSteps.AgreedByCandidate && (
              <div
                className={classNames(
                  styles['card__cv-status'],
                  styles['card__cv-status--pending'],
                )}
              >
                CV Pending
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div
            className={classNames(styles['card'], styles['card--interviews-view'])}
            onClick={() => onCardClickHandler()}
          >
            <p className={styles['card__job-title']}>{positionName}</p>
            <p className={classNames(styles['card__job-type'], hideOnMobileClass)}>
              {projectTypeName}
            </p>
            <p className={classNames(styles['card__job-location'], hideOnMobileClass)}>
              {location}
            </p>
            <p className={classNames(styles['card__job-salary'], hideOnMobileClass)}>
              ${salary} <span className={styles['card__job-salary-prefix']}>/{prefix}</span>
            </p>
            <p className={classNames(styles['card__job-interview'], hideOnMobileClass)}>
              {interview?.location || 'N/A'}
            </p>
            {interview?.passed ? (
              <Button
                className={styles['card__feedback-btn']}
                title="Send feedback"
                variant="secondary"
                onClick={createFeedbackHandler}
              />
            ) : (
              <p className={styles['card__job-interview-date']}>
                {interview?.date || 'N/A'}{' '}
                <span className={styles['card__job-interview-time']}>{interview?.time}</span>
              </p>
            )}
          </div>
        );
      case 4:
        return (
          <div
            className={classNames(styles['card'], styles['card--placements-view'])}
            onClick={() => onCardClickHandler()}
          >
            <p className={styles['card__job-title']}>{positionName}</p>
            <p className={classNames(styles['card__job-type'], hideOnMobileClass)}>
              {projectTypeName}Commercial Build
            </p>
            <p className={classNames(styles['card__job-location'], hideOnMobileClass)}>
              {location}
            </p>
            <p className={classNames(styles['card__job-salary'], hideOnMobileClass)}>
              ${salary} <span className={styles['card__job-salary-prefix']}>/{prefix}</span>
            </p>
            {approvedDate ? (
              <p className={styles['card__job-approved-date']}>
                {format(parseISO(approvedDate), 'dd/MM/yyyy')}
              </p>
            ) : contract && candidateApproval && !companyApproval ? (
              <Button
                className={styles['card__waiting-contract-btn']}
                title="Waiting for approval"
                variant="secondary"
              />
            ) : MatchedJobSteps.WaitingForApproval === step ? (
              <Button
                className={styles['card__review-contract-btn']}
                title="Review contract"
                variant="secondary"
                onClick={reviewContractHandler}
              />
            ) : (
              <></>
            )}
          </div>
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
    projectTypeName,
    prefix,
    contract,
    acceptHandler,
    declineHandler,
    createFeedbackHandler,
    reviewContractHandler,
    onCardClickHandler,
    candidateApproval,
    companyApproval,
  ]);

  return boardCard;
});
