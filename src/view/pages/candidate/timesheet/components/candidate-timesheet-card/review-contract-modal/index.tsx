import './styles.css';

import { SpecialZoomLevel, Viewer } from '@react-pdf-viewer/core';
import { ProgressBar } from '@react-pdf-viewer/core';
import { pageNavigationPlugin, RenderGoToPageProps } from '@react-pdf-viewer/page-navigation';
import React, { memo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

import { download } from '~/utils/helpers';
import { Icon } from '~/view/components/icon';
import { useOutsideClick } from '~/view/hooks/useOutsideClick';

import { disableScrollPlugin } from './components/disableScrollPlugin';
import styles from './styles.scss';

type Props = {
  visible: boolean;
  onClose: () => void;
  candidateContract: string | null;
};

const modalRoot = document.getElementById('modal-root');

export const ReviewTimesheetContractModal: React.FC<Props> = memo(function CenterModal({
  visible,
  onClose,
  candidateContract,
}) {
  const pageNavigationInstance = pageNavigationPlugin();
  const disableScrollInstance = disableScrollPlugin();
  const { GoToNextPage, GoToPreviousPage } = pageNavigationInstance;
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

  const downloadHandler = (): void => {
    if (candidateContract) {
      download(candidateContract, 'contract.pdf');
    }
  };

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
                {candidateContract && (
                  <Viewer
                    plugins={[pageNavigationInstance, disableScrollInstance]}
                    defaultScale={SpecialZoomLevel.PageFit}
                    fileUrl={candidateContract}
                    renderLoader={(percentages: number) => (
                      <div style={{ width: '240px' }}>
                        <ProgressBar progress={Math.round(percentages)} />
                      </div>
                    )}
                  />
                )}
              </div>
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
