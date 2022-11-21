import classNames from 'classnames';
import React, { memo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

import { useOutsideClick } from '~/view/hooks/useOutsideClick';

import styles from './styles.scss';

type Props = {
  backTitle: string;
  className: string;
  visible: boolean;
  onClose: () => void;
};

const modalRoot = document.getElementById('modal-root');

export const RightModal: React.FC<Props> = memo(function RightModal({
  backTitle,
  className,
  visible,
  children,
  onClose,
}) {
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

  if (modalRoot) {
    if (visible) {
      return createPortal(
        <div ref={modalWrapperRef} className={classNames(styles['modal-wrapper'])}>
          <div ref={modalRef} className={classNames(styles['modal-wrapper__modal'], className)}>
            <div className={styles['modal-wrapper__modal-heading']}>
              <button className={styles['modal-wrapper__modal-back-button']} onClick={onClose}>
                {backTitle}
              </button>
            </div>
            {children}
          </div>
        </div>,
        modalRoot,
      );
    }

    return createPortal(null, modalRoot);
  }

  return null;
});
