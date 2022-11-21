import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { MatchedJobSteps } from '~/models/common';
import { addCandidateToShortList } from '~/modules/companyInterviews/actions';
import {
  setSelectedMatchedCandidate,
  toggleNoteModalVisibility,
} from '~/modules/companyInterviews/actions';
import { useDispatch, useSelector } from '~/store';
import { DiscloseInfoValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { Checkbox } from '~/view/components/checkbox';
import { Icon } from '~/view/components/icon';
import { Image } from '~/view/components/image';
import { RightModal } from '~/view/components/modals';
import { Tab, Tabs } from '~/view/components/tabs';

import { Contracts } from './components/contract';
import { Feedback } from './components/feedback';
import { Overview } from './components/overview';
import styles from './styles.scss';

type Props = {
  visible: boolean;
  onClose: () => void;
  currentBoard: number;
};

const tabs: Tab[] = [
  {
    id: 1,
    label: 'Overview',
  },
  {
    id: 2,
    label: 'My feedback',
  },
];

export const CandidateModal: React.FC<Props> = memo(function CandidateModal({
  visible,
  onClose,
  currentBoard,
}) {
  const dispatch = useDispatch();
  const selectedCandidate = useSelector(state => state.companyInterviews.selectedMatchedCandidate);
  const candidateOverview = useSelector(state => state.companyInterviews.matchedCandidateOverview);

  const tabsWithContract: Tab[] = useMemo(
    () => [
      {
        id: 1,
        label: 'Overview',
      },
      {
        id: 2,
        label: 'My Feedback',
      },

      ...(MatchedJobSteps.WaitingForApproval === selectedCandidate?.step ||
      selectedCandidate?.approvedDate !== null
        ? [
            {
              id: 3,
              label: 'Contracts',
            },
          ]
        : []),
    ],
    [selectedCandidate],
  );

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      disclose: false,
    },
    resolver: yupResolver(DiscloseInfoValidation),
  });

  useEffect(() => {
    if (!visible) {
      dispatch(setSelectedMatchedCandidate(null));
    }
  }, [dispatch, visible]);

  const handleActiveTabChange = useCallback((tabId: number) => {
    setActiveTab(tabId);
  }, []);

  const handleClose = useCallback(() => {
    if (activeTab !== tabs[0].id) {
      setActiveTab(tabs[0].id);
    }

    onClose();
  }, [activeTab, onClose]);

  const buttonState = useMemo(() => {
    switch (currentBoard) {
      case 1:
        return '75% Match';
      case 2:
        return 'Accepted';
      case 3:
        return 'Interviewed';
      case 4:
        if (window.innerWidth > 500) {
          return 'Placement approved';
        }
        return 'Approved';
      default:
        return null;
    }
  }, [currentBoard]);

  const acceptHandler = useCallback(() => {
    dispatch(toggleNoteModalVisibility(true));
  }, [dispatch]);

  const declineHandler = useCallback(() => {
    dispatch(toggleNoteModalVisibility(false));
  }, [dispatch]);

  const modalWithFooter = classNames(styles['modal'], styles['modal--with-footer']);

  const handleShortlist = useCallback(() => {
    if (candidateOverview) {
      dispatch(
        addCandidateToShortList.request({
          candidateId: candidateOverview.id,
          status: !candidateOverview.shortlist,
        }),
      );
    }
  }, [dispatch, candidateOverview]);

  if (!selectedCandidate || !candidateOverview) {
    return null;
  }

  return (
    <RightModal
      className={modalWithFooter}
      onClose={handleClose}
      visible={visible}
      backTitle="< Back"
    >
      <div className={styles['modal__header']}>
        <div className={styles['modal__candidate']}>
          <Image
            type="candidate"
            className={styles['modal__candidate-image']}
            alt="candidate"
            src={candidateOverview?.avatar || null}
          />
          <div className={styles['modal__candidate-info']}>
            <h4 className={styles['modal__candidate-name']}>{candidateOverview?.candidateName}</h4>
            <div className={styles['modal__candidate-location-info']}>
              <Icon name="location" className={styles['modal__candidate-location-icon']} />
              <p className={styles['modal__candidate-location']}>{candidateOverview?.location}</p>
            </div>
          </div>
          <div className={styles['modal__candidate-status-wrapper']}>
            <Button
              onClick={handleShortlist}
              className={styles['modal__shortlist-btn']}
              size="medium"
              inlineIconClassName={styles['modal__shortlist-icon']}
              inlineIcon={candidateOverview.shortlist ? 'shortlist-filled' : 'shortlist'}
              title={candidateOverview.shortlist ? 'Added to shortlist' : 'Add to shortlist'}
              variant="secondary"
            />
            <div className={styles['modal__candidate-status']}>{buttonState}</div>
          </div>
        </div>
      </div>
      {currentBoard !== 1 && (
        <Tabs
          tabs={currentBoard === 4 ? tabsWithContract : tabs}
          activeTabId={activeTab}
          className={styles['modal__tabs']}
          onChange={handleActiveTabChange}
        />
      )}
      {activeTab === 1 && <Overview />}
      {activeTab === 2 && <Feedback />}
      {activeTab === 3 && <Contracts />}
      {currentBoard === 1 && (
        <div className={styles['modal__footer']}>
          <div>
            <Button
              className={styles['modal__footer-btn']}
              title="Accept candidate"
              size="large"
              variant="accent"
              onClick={handleSubmit(acceptHandler)}
            />
            <Button
              className={styles['modal__footer-btn']}
              title="Decline candidate"
              size="large"
              variant="secondary"
              onClick={declineHandler}
            />
          </div>
          <div className={styles['modal__footer-disclose']}>
            <Checkbox control={control} name="disclose" />
            <p
              className={classNames(styles['modal__footer-disclose-label'], {
                [styles['modal__disclose-error-warning']]: errors.disclose,
              })}
            >
              Disclose my identity
            </p>
          </div>
        </div>
      )}
    </RightModal>
  );
});
