import classNames from 'classnames';
import React, { memo } from 'react';

import styles from './styles.scss';

type Props = {
  text: string;
  variant?: 'primary' | 'secondary';
  className?: string;
};

export const Tag: React.FC<Props> = memo(function Tag({ text, variant = 'primary', className }) {
  const tagClassName = classNames(styles['tag'], styles[`tag--${variant}`], className);
  return <div className={tagClassName}>{text}</div>;
});
