import React, { useCallback, useEffect, useState } from 'react';
import {
  NavLink,
  Route,
  RouteComponentProps,
  Switch,
  useHistory,
  useLocation,
} from 'react-router-dom';

import { CommonRouter } from '~/utils/router';
import { Tab, Tabs } from '~/view/components/tabs';

import { InterviewQuestionsPage } from './interview-questions';
import { PasswordPage } from './password';
import { PaymentDetailsPage } from './payment-details';
import { ProfileDetailsPage } from './profile-details';
import styles from './styles.scss';
import { TermsAndConditionsPage } from './terms-conditions';

const mobileMenuTabs: Tab[] = [
  { id: 1, label: 'Profile details' },
  { id: 2, label: 'Payment details' },
  { id: 3, label: 'Password' },
  { id: 4, label: 'Terms & Conditions' },
  { id: 5, label: 'Interview Questions' },
];

export const EditAdminProfilePage: React.FC<RouteComponentProps> = () => {
  const history = useHistory();
  const location = useLocation();
  const [activeMobileMenuTab, setActiveMobileMenuTab] = useState(mobileMenuTabs[0].id);

  useEffect(() => {
    if (location.pathname === CommonRouter.editProfile.editAdminProfileDetails()) {
      setActiveMobileMenuTab(mobileMenuTabs[0].id);
    } else if (location.pathname === CommonRouter.editProfile.editAdminPaymentDetails()) {
      setActiveMobileMenuTab(mobileMenuTabs[1].id);
    } else if (location.pathname === CommonRouter.editProfile.editAdminPassword()) {
      setActiveMobileMenuTab(mobileMenuTabs[2].id);
    } else if (location.pathname === CommonRouter.editProfile.editAdminTermsAndConditions()) {
      setActiveMobileMenuTab(mobileMenuTabs[3].id);
    } else if (location.pathname === CommonRouter.editProfile.editAdminInterviewQuestions()) {
      setActiveMobileMenuTab(mobileMenuTabs[4].id);
    }
  }, [location.pathname]);

  const handleActiveMobileMenuTabChange = useCallback(
    (tabId: number) => {
      switch (tabId) {
        case mobileMenuTabs[0].id:
          history.push(CommonRouter.editProfile.editAdminProfileDetails());
          break;
        case mobileMenuTabs[1].id:
          history.push(CommonRouter.editProfile.editAdminPaymentDetails());
          break;
        case mobileMenuTabs[2].id:
          history.push(CommonRouter.editProfile.editAdminPassword());
          break;
        case mobileMenuTabs[3].id:
          history.push(CommonRouter.editProfile.editAdminTermsAndConditions());
          break;
        case mobileMenuTabs[4].id:
          history.push(CommonRouter.editProfile.editAdminInterviewQuestions());
          break;
        default:
          break;
      }
    },
    [history],
  );

  return (
    <div className={styles['page']}>
      <div className={styles['page__title-wrapper']}>
        <h1 className={styles['page__title']}>Edit Profile</h1>
      </div>
      <div className={styles['page__content']}>
        <Tabs
          className={styles['page__mobile-menu']}
          tabs={mobileMenuTabs}
          activeTabId={activeMobileMenuTab}
          onChange={handleActiveMobileMenuTabChange}
        />
        <div className={styles['page__menu']}>
          <NavLink
            to={CommonRouter.editProfile.editAdminProfileDetails()}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            Profile details
          </NavLink>
          <NavLink
            to={CommonRouter.editProfile.editAdminPaymentDetails()}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            Payment details
          </NavLink>
          <NavLink
            to={CommonRouter.editProfile.editAdminPassword()}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            Password
          </NavLink>
          <NavLink
            to={CommonRouter.editProfile.editAdminTermsAndConditions()}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            Terms & Conditions
          </NavLink>
          <NavLink
            to={CommonRouter.editProfile.editAdminInterviewQuestions()}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            Interview Questions
          </NavLink>
        </div>
        <div className={styles['page__subpage']}>
          <Switch>
            <Route
              exact
              path={CommonRouter.editProfile.editAdminProfileDetails()}
              component={ProfileDetailsPage}
            />
            <Route
              exact
              path={CommonRouter.editProfile.editAdminPaymentDetails()}
              component={PaymentDetailsPage}
            />
            <Route
              exact
              path={CommonRouter.editProfile.editAdminPassword()}
              component={PasswordPage}
            />
            <Route
              exact
              path={CommonRouter.editProfile.editAdminTermsAndConditions()}
              component={TermsAndConditionsPage}
            />
            <Route
              exact
              path={CommonRouter.editProfile.editAdminInterviewQuestions()}
              component={InterviewQuestionsPage}
            />
          </Switch>
        </div>
      </div>
    </div>
  );
};
