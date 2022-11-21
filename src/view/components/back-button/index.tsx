import classNames from 'classnames';
import React, { memo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import styles from './styles.scss';

type Props = {
  goTo?: '/candidates' | '/live-jobs' | '/my-jobs' | '/find-jobs' | '/contact';
  title?: string;
  className?: string;
};

export const BackButton: React.FC<Props> = memo(function BackButton({ goTo, title, className }) {
  const history = useHistory();

  const buttonClassName = classNames(styles['back-button'], className);

  const handleGoBack = useCallback(() => {
    if (goTo) {
      history.push(goTo);
      return;
    }
    history.goBack();
  }, [history, goTo]);

  return (
    <button className={buttonClassName} onClick={handleGoBack}>
      {'<'} Back {title}
    </button>
  );
});
