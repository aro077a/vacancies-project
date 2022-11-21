import React, { memo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useHistory } from 'react-router-dom';

import { CommonRouter } from '~/utils/router';
import logo from '~/view/assets/icons/logo-without-text.svg';
import { Button } from '~/view/components/button';
import { Icon } from '~/view/components/icon';

import styles from './styles.scss';

type Link = {
  path: string;
  label: string;
};

type Props = {
  links: Link[];
  visible: boolean;
  onClose: () => void;
};

const modalRoot = document.getElementById('modal-root');

export const MenuModal: React.FC<Props> = memo(function MenuModal({ links, visible, onClose }) {
  const history = useHistory();

  const handleCreateAccount = useCallback(() => {
    history.push(CommonRouter.auth.register.chooseUserType);
  }, [history]);

  if (modalRoot) {
    if (visible) {
      return createPortal(
        <div className={styles['menu']}>
          <div className={styles['menu__header']}>
            <div className={styles['menu__header-logo']}>
              <img src={logo} alt="Logo" />
            </div>
            <button onClick={onClose}>
              <Icon className={styles['menu__close-icon']} name="close" />
            </button>
          </div>
          <Button
            className={styles['menu__create-acc-btn']}
            variant="accent"
            title="Create account"
            onClick={handleCreateAccount}
          />
          <div className={styles['menu__horizontal-separator']} />
          <div className={styles['menu__links']}>
            {links.map(link => (
              <NavLink
                activeClassName={styles['menu__link--active']}
                className={styles['menu__link']}
                to={link.path}
              >
                {link.label}
                <Icon className={styles['menu__link-icon']} name="chevron-right" />
              </NavLink>
            ))}
          </div>
        </div>,
        modalRoot,
      );
    }

    return createPortal(null, modalRoot);
  }
  return null;
});
