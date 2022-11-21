import classNames from 'classnames';
import React, { memo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

import { Icon } from '~/view/components/icon';
import { useOutsideClick } from '~/view/hooks/useOutsideClick';

import styles from './styles.scss';

type Props = {
  className: string;
  visible: boolean;
  title?: string;
  subtitle?: string;
  onClose: () => void;
};

const modalRoot = document.getElementById('modal-root');

export const CenterModal: React.FC<Props> = memo(function CenterModal({
  className,
  visible,
  children,
  title,
  subtitle,
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
            {(title || subtitle) && (
              <div className={styles['modal-wrapper__modal-header']}>
                {title && <h2 className={styles['modal-wrapper__modal-title']}>{title}</h2>}
                {subtitle && <p className={styles['modal-wrapper__modal-subtitle']}>{subtitle}</p>}
              </div>
            )}
            <button className={styles['modal-wrapper__modal-close-button']} onClick={onClose}>
              <Icon name="close" className={styles['modal-wrapper__modal-close-icon']} />
            </button>
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
