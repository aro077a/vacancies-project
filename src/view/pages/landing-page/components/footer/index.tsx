/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { NavLink } from 'react-router-dom';

import { CommonRouter } from '~/utils/router';
import logo from '~/view/assets/images/logo.svg';

import styles from './styles.scss';

export const Footer: React.FC = () => {
  return (
    <footer className={styles['footer']}>
      <div className={styles['footer__top']}>
        <div className={styles['footer__logo']}>
          <img src={logo} alt="logo" />
        </div>
        <div className={styles['footer__links']}>
          <NavLink
            className={styles['footer__link']}
            activeClassName={styles['footer__link-active']}
            to={CommonRouter.contactUsPage}
          >
            Contact Us
          </NavLink>
          {/* <NavLink
            className={styles['footer__link']}
            activeClassName={styles['footer__link-active']}
            to={CommonRouter.faq}
          >
            FAQ
          </NavLink> */}
          <NavLink
            className={styles['footer__link']}
            activeClassName={styles['footer__link-active']}
            to={CommonRouter.privacyPage}
          >
            Privacy Policy
          </NavLink>
          <NavLink
            className={styles['footer__link']}
            activeClassName={styles['footer__link-active']}
            to={CommonRouter.termsPage}
          >
            Terms & Conditions
          </NavLink>
        </div>
      </div>
      <div className={styles['footer__bottom']}>
        <p>Copyright © 2022, Timbyr</p>
      </div>
    </footer>
  );
};
