import classNames from 'classnames';
import React, { memo } from 'react';

import { Icon } from '~/view/components/icon';
import { Loader } from '~/view/components/loader';

import styles from './styles.scss';

type Props = {
  title: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  size?: 'large' | 'medium' | 'small';
  className?: string;
  inlineIcon?: string;
  inlineIconClassName?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const Button: React.FC<Props> = memo(function Button({
  title,
  variant = 'primary',
  size = 'large',
  className,
  inlineIcon,
  inlineIconClassName,
  type = 'button',
  disabled = false,
  loading = false,
  onClick,
}) {
  const buttonClassName = classNames(
    styles['button'],
    styles[`button--${variant}`],
    styles[`button--${size}`],
    { [styles['button--disabled']]: disabled },
    className,
  );

  return (
    <button
      type={type}
      className={buttonClassName}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <Loader loading light={variant !== 'secondary'} />
      ) : (
        <>
          {inlineIcon && <Icon name={inlineIcon} className={inlineIconClassName} />}
          {title}
        </>
      )}
    </button>
  );
});
