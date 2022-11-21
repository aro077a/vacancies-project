import './styles.css';

import { SpecialZoomLevel, Viewer } from '@react-pdf-viewer/core';
import { ProgressBar } from '@react-pdf-viewer/core';
import { pageNavigationPlugin, RenderGoToPageProps } from '@react-pdf-viewer/page-navigation';
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';

import { UserType } from '~/models/common';
import {
  approveMatchedJobContract,
  getCandidateMatchedJobs,
  setSelectedMatchedJob,
  toggleReviewContractModalVisibility,
} from '~/modules/candidateProposals/actions';
import {
  approveMatchedCandidateContract,
  getCompanyMatchedCandidates,
  markConfirmedContract,
} from '~/modules/companyInterviews/actions';
import { useDispatch, useSelector } from '~/store';
import { download } from '~/utils/helpers';
import { Button } from '~/view/components/button';
import { Icon } from '~/view/components/icon';
import { useOutsideClick } from '~/view/hooks/useOutsideClick';

import { disableScrollPlugin } from './components/disableScrollPlugin';
import styles from './styles.scss';

type Props = {
  visible: boolean;
  onClose: () => void;
  type: 'company' | 'candidate';
};

const modalRoot = document.getElementById('modal-root');

export const ReviewContractModal: React.FC<Props> = memo(function CenterModal({
  visible,
  onClose,
  type,
}) {
  const dispatch = useDispatch();
  const pageNavigationInstance = pageNavigationPlugin();
  const disableScrollInstance = disableScrollPlugin();
  const { GoToNextPage, GoToPreviousPage } = pageNavigationInstance;
  const candidateFile = useSelector(state => state.candidateProposals.contract);
  const companyFile = useSelector(state => state.companyInterviews.contractFile);
  const companyContract = useSelector(
    state => state.companyInterviews.selectedMatchedCandidate?.contract,
  );
  const candidateApproving = useSelector(
    state => state.candidateProposals.approvingMatchedJobContract,
  );
  const companyApproving = useSelector(
    state => state.companyInterviews.approvingMatchedCandidateContract,
  );
  const loggedInUserType = useSelector(state => state.user.loggedInUserType);
  const modalWrapperRef = useRef<HTMLDivElement>(null);
  const modalRef = useOutsideClick<HTMLDivElement>({
    handler: useCallback(
      event => {
        if (event.target === modalWrapperRef.current) {
          onClose();
        }
      },
      [onClose],
    ),
  });

  const fileUrl = useMemo(() => {
    if (type === 'candidate') {
      return candidateFile;
    }
    return companyFile;
  }, [companyFile, candidateFile, type]);

  const approving = useMemo(() => {
    if (type === 'candidate') {
      return candidateApproving;
    }
    return companyApproving;
  }, [type, candidateApproving, companyApproving]);

  useEffect(() => {
    if (!visible) {
      dispatch(setSelectedMatchedJob(null));
    }
  }, [dispatch, visible]);

  const downloadHandler = (): void => {
    if (fileUrl) {
      download(fileUrl, 'contract.pdf');
    }
  };

  const approveHandler = useCallback(() => {
    if (type === 'candidate') {
      dispatch(approveMatchedJobContract.request(true));
    } else {
      dispatch(
        approveMatchedCandidateContract.request({
          data: {
            approved: true,
            contractId: companyContract?.id as number,
          },
          cb: () => {
            dispatch(toggleReviewContractModalVisibility());
            dispatch(markConfirmedContract(true));
            if (loggedInUserType === UserType.COMPANY || loggedInUserType === UserType.MANAGER) {
              dispatch(getCompanyMatchedCandidates.request());
            } else if (loggedInUserType === UserType.CANDIDATE) {
              dispatch(getCandidateMatchedJobs.request());
            }
          },
        }),
      );
    }
  }, [dispatch, companyContract, type, loggedInUserType]);

  if (modalRoot) {
    if (visible) {
      return createPortal(
        <>
          <div ref={modalWrapperRef} className={styles['modal-wrapper']}>
            <div ref={modalRef} className={styles['modal-wrapper__modal']}>
              <div className={styles['modal-wrapper__header']}>
                <button onClick={onClose} className={styles['modal__close-btn']}>
                  <Icon className={styles['modal__close-icon']} name="close" />
                </button>
                <h4 className={styles['modal-wrapper__file-title']}>Contract.pdf</h4>
                <div className={styles['modal-wrapper__file-info']}>
                  <button
                    onClick={downloadHandler}
                    className={styles['modal-wrapper__btn-download']}
                  >
                    Download contract
                    <Icon className={styles['download-icon']} name="download" />
                  </button>
                </div>
              </div>
              <div className={styles['modal__viewer-wrapper']}>
                {fileUrl && (
                  <Viewer
                    plugins={[pageNavigationInstance, disableScrollInstance]}
                    defaultScale={SpecialZoomLevel.PageFit}
                    fileUrl={fileUrl}
                    renderLoader={(percentages: number) => (
                      <div style={{ width: '240px' }}>
                        <ProgressBar progress={Math.round(percentages)} />
                      </div>
                    )}
                  />
                )}
              </div>
            </div>
            <div className={styles['modal-wrapper__footer']}>
              <Button
                className={styles['modal-wrapper__confirm-btn']}
                variant="accent"
                title="Confirm contract"
                size="large"
                loading={approving}
                onClick={approveHandler}
              />
            </div>
          </div>
          <div>
            <GoToNextPage>
              {(props: RenderGoToPageProps) => (
                <button
                  className={styles['next-btn']}
                  style={{
                    backgroundColor: props.isDisabled ? '#ccc' : '#fff',
                    cursor: props.isDisabled ? 'not-allowed' : 'pointer',
                  }}
                  disabled={props.isDisabled}
                  onClick={props.onClick}
                >
                  <Icon className={styles['arrow-right']} name="chevron-right" />
                </button>
              )}
            </GoToNextPage>
            <GoToPreviousPage>
              {(props: RenderGoToPageProps) => (
                <button
                  className={styles['previous-btn']}
                  style={{
                    backgroundColor: props.isDisabled ? '#ccc' : '#fff',
                    cursor: props.isDisabled ? 'not-allowed' : 'pointer',
                  }}
                  disabled={props.isDisabled}
                  onClick={props.onClick}
                >
                  <Icon className={styles['arrow-left']} name="chevron-right" />
                </button>
              )}
            </GoToPreviousPage>
          </div>
        </>,
        modalRoot,
      );
    }

    return createPortal(null, modalRoot);
  }

  return null;
});
