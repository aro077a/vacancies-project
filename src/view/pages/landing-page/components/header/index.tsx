/* eslint-disable jsx-a11y/anchor-is-valid */
import classNames from 'classnames';
import React, { memo, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  getCities,
  getCountries,
  getHiringManagerJobPositions,
  getHiringManagerProjectTypes,
  getJobPositions,
  getProjectTypes,
  getStates,
} from '~/modules/common/actions';
import { getCompanies } from '~/modules/companies/actions';
import { useDispatch } from '~/store';
import { CommonRouter } from '~/utils/router';
import logoMobile from '~/view/assets/icons/logo-without-text.svg';
import logo from '~/view/assets/images/logo.svg';
import { Button } from '~/view/components/button';
import { Icon } from '~/view/components/icon';

import { MenuModal } from './components/modal-menu';
import styles from './styles.scss';

const hideOnMobile = 'mobile-hide';

const links = [
  {
    path: CommonRouter.auth.register.chooseUserType,
    label: 'Find jobs',
  },
  {
    path: CommonRouter.auth.register.chooseUserType,
    label: 'Find candidates',
  },
  {
    path: CommonRouter.contactUsPage,
    label: 'Contact Us',
  },
  {
    path: CommonRouter.auth.login,
    label: 'Sign in',
  },
];

export const Header: React.FC = memo(function Header() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [mobileMenuModalVisible, setMobileMenuModalVisible] = useState(false);

  const toggleMobileMenuVisibility = useCallback(() => {
    setMobileMenuModalVisible(prevValue => !prevValue);
  }, []);

  const handleCreateAccount = useCallback(() => {
    dispatch(getCountries.request());
    dispatch(getStates.request());
    dispatch(getCities.request());
    dispatch(getJobPositions.request());
    dispatch(getProjectTypes.request());
    dispatch(getHiringManagerJobPositions.request());
    dispatch(getHiringManagerProjectTypes.request());
    dispatch(getCompanies.request());
    history.push(CommonRouter.auth.register.chooseUserType);
  }, [history, dispatch]);

  const handleLogin = useCallback(() => {
    history.push(CommonRouter.auth.login);
  }, [history]);

  const handleGoToLanding = (): void => {
    history.push(CommonRouter.landingPage);
  };

  const handleGoToContactUsPage = (): void => {
    history.push(CommonRouter.contactUsPage);
  };

  return (
    <header className={styles['header']}>
      <div className={styles['header__logo-mobile']}>
        <img src={logoMobile} alt="Logo" />
      </div>
      <button className={styles['header__toggle-menu']} onClick={toggleMobileMenuVisibility}>
        <Icon name="menu" className={styles['header__mobile-menu-icon']} />
      </button>
      <div
        onClick={handleGoToLanding}
        className={classNames(styles['header__logo'], styles[hideOnMobile])}
      >
        <img className={styles['header__logo-img']} src={logo} alt="Logo" />
      </div>
      <div className={classNames(styles['header__links'], styles[hideOnMobile])}>
        <a onClick={handleCreateAccount} className={styles['header__links-item']}>
          Find jobs
        </a>
        <a onClick={handleCreateAccount} className={styles['header__links-item']}>
          Find candidate
        </a>
        <a onClick={handleGoToContactUsPage} className={styles['header__links-item']}>
          Contact Us
        </a>
        <a onClick={handleLogin} className={styles['header__links-item']}>
          Sign in
        </a>
      </div>
      <Button
        className={styles[hideOnMobile]}
        onClick={handleCreateAccount}
        size="medium"
        title="Create Account"
        variant="accent"
      />
      <MenuModal
        visible={mobileMenuModalVisible}
        onClose={toggleMobileMenuVisibility}
        links={links}
      />
    </header>
  );
});
