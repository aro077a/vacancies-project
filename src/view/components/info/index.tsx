import classNames from 'classnames';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { Icon } from '~/view/components/icon';

import styles from './styles.scss';

type Props = {
  infoText: string;
  className?: string;
};

const modalRoot = document.getElementById('modal-root') as HTMLDivElement;

export const Info: React.FC<Props> = memo(function Info({ infoText, className }) {
  const infoTextWrapperRef = useRef<HTMLDivElement>(null);
  const [infoTextWrapperStyles, setInfoTextWrapperStyles] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    if (infoTextWrapperStyles && infoTextWrapperRef.current) {
      infoTextWrapperRef.current.style.top = `${
        infoTextWrapperStyles.top - infoTextWrapperRef.current.offsetHeight - 15
      }px`;

      infoTextWrapperRef.current.style.left = `${
        infoTextWrapperStyles.left - infoTextWrapperRef.current.offsetWidth / 2
      }px`;

      infoTextWrapperRef.current.style.visibility = 'visible';
    }
  }, [infoTextWrapperStyles]);

  const handleMouseEnter: React.MouseEventHandler<HTMLDivElement> = useCallback(event => {
    const rects = (event.target as HTMLDivElement).getBoundingClientRect();

    const body = document.body;
    const docEl = document.documentElement;

    const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    const clientTop = docEl.clientTop || body.clientTop || 0;
    const clientLeft = docEl.clientLeft || body.clientLeft || 0;

    const top = rects.top + scrollTop - clientTop;
    const left = rects.left + scrollLeft - clientLeft;

    setInfoTextWrapperStyles({ top, left });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setInfoTextWrapperStyles(null);
  }, []);

  return (
    <div className={classNames(styles['info'], className)}>
      <div
        className={styles['info__icon-wrapper']}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Icon name="info-circle" className={styles['info__icon']} />
      </div>
      {createPortal(
        infoTextWrapperStyles ? (
          <div
            ref={infoTextWrapperRef}
            className={styles['info__info-text-wrapper']}
            style={infoTextWrapperStyles}
          >
            <p className={styles['info__info-text']}>{infoText}</p>
          </div>
        ) : null,
        modalRoot,
      )}
    </div>
  );
});
