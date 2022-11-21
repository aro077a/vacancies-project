import classNames from 'classnames';
import React, { memo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';

import { logout } from '~/modules/user/actions';
import { useDispatch } from '~/store';
import { HeaderLink } from '~/view/components/app/components/header/types';
import { Icon } from '~/view/components/icon';
import { UserBadge } from '~/view/components/user-badge';

import styles from './styles.scss';

type Props = {
  links: HeaderLink[];
  visible: boolean;
  onClose: () => void;
  onEditProfile: () => void;
};

const modalRoot = document.getElementById('modal-root');

export const MenuModal: React.FC<Props> = memo(function MenuModal({
  links,
  visible,
  onClose,
  onEditProfile,
}) {
  const dispatch = useDispatch();

  const mobileLogout = useCallback(() => {
    dispatch(logout());
    onClose();
  }, [dispatch, onClose]);

  const mobileLEditProfile = useCallback(() => {
    onEditProfile();
    onClose();
  }, [onEditProfile, onClose]);
  if (modalRoot) {
    if (visible) {
      return createPortal(
        <div className={styles['menu']}>
          <div className={styles['menu__user-info-wrapper']}>
            <UserBadge />
            <button className={styles['menu__close-button']} onClick={onClose}>
              <Icon name="close" className={styles['menu__close-icon']} />
            </button>
          </div>
          <div className={styles['menu__edit-profile-link']} onClick={mobileLEditProfile}>
            <Icon name="pencil" className={styles['menu__edit-profile-icon']} />
            Edit Profile
          </div>
          <div className={styles['menu__horizontal-separator']} />
          <div className={styles['menu__links-wrapper']}>
            {links.map((link, index) => (
              <React.Fragment key={link.path}>
                <NavLink
                  to={link.path}
                  className={styles['menu__link']}
                  activeClassName={styles['menu__link--active']}
                  onClick={onClose}
                >
                  {link.label}
                  <Icon name="chevron-right" className={styles['menu__link-chevron-icon']} />
                </NavLink>
                {index !== links.length - 1 && (
                  <div
                    className={classNames(
                      styles['menu__horizontal-separator'],
                      styles['menu__horizontal-separator--link'],
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <button className={styles['menu__link']} onClick={mobileLogout}>
            Log out
            <Icon name="chevron-right" className={styles['menu__link-chevron-icon']} />
          </button>
        </div>,
        modalRoot,
      );
    }

    return createPortal(null, modalRoot);
  }

  return null;
});
