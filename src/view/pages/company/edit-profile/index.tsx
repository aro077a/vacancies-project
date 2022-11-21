import React, { useCallback, useEffect, useState } from 'react';
import {
  NavLink,
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  useHistory,
  useLocation,
} from 'react-router-dom';

import { UserType } from '~/models/common';
import { getCompanyForEdit } from '~/modules/companyEditProfile/actions';
import { useDispatch, useSelector } from '~/store';
import { CompanyRouter } from '~/utils/router';
import { Loader } from '~/view/components/loader';
import { Tab, Tabs } from '~/view/components/tabs';

import { EditCompanyInfoPage } from './company-info';
import { EditCompanyLogoPage } from './company-logo';
import { EditHiringManagersPage } from './hiring-managers';
import { ChangePasswordPage } from './password';
import styles from './styles.scss';

const mobileMenuTabs: Tab[] = [
  { id: 1, label: 'Main Company Info' },
  { id: 2, label: 'Hiring Managers' },
  { id: 3, label: 'Password' },
  { id: 4, label: 'Company Logo' },
];

export const EditCompanyPage: React.FC<RouteComponentProps> = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { companyDataForEditLoading } = useSelector(state => state.companyProfile);
  const { loggedInUserType } = useSelector(state => state.user);
  const isCompany = loggedInUserType === UserType.COMPANY;

  useEffect(() => {
    dispatch(getCompanyForEdit.request());
  }, [dispatch]);

  const [activeMobileMenuTab, setActiveMobileMenuTab] = useState(mobileMenuTabs[0].id);

  useEffect(() => {
    switch (location.pathname) {
      case CompanyRouter.editCompany.editCompanyInformation():
        setActiveMobileMenuTab(mobileMenuTabs[0].id);
        break;
      case CompanyRouter.editCompany.editHiringManagers():
        setActiveMobileMenuTab(mobileMenuTabs[1].id);
        break;
      case CompanyRouter.editCompany.editPassword():
        setActiveMobileMenuTab(mobileMenuTabs[2].id);
        break;
      case CompanyRouter.editCompany.editCompanyLogo():
        setActiveMobileMenuTab(mobileMenuTabs[3].id);
        break;
      default:
        break;
    }
  }, [location.pathname]);

  const handleActiveMobileMenuTabChange = useCallback(
    (tabId: number) => {
      switch (tabId) {
        case mobileMenuTabs[0].id:
          history.push(CompanyRouter.editCompany.editCompanyInformation());
          break;
        case mobileMenuTabs[1].id:
          history.push(CompanyRouter.editCompany.editHiringManagers());
          break;
        case mobileMenuTabs[2].id:
          history.push(CompanyRouter.editCompany.editPassword());
          break;
        case mobileMenuTabs[3].id:
          history.push(CompanyRouter.editCompany.editCompanyLogo());
          break;
        default:
          break;
      }
    },
    [history],
  );

  return (
    <div className={styles['page']}>
      <h1 className={styles['page__title']}>Edit Profile</h1>
      <div className={styles['page__content']}>
        <Tabs
          className={styles['page__mobile-menu']}
          tabs={mobileMenuTabs}
          activeTabId={activeMobileMenuTab}
          onChange={handleActiveMobileMenuTabChange}
        />
        <div className={styles['page__menu']}>
          <NavLink
            to={CompanyRouter.editCompany.editCompanyInformation()}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            Main Company Info
          </NavLink>
          {isCompany && (
            <NavLink
              to={CompanyRouter.editCompany.editHiringManagers()}
              className={styles['page__menu-link']}
              activeClassName={styles['page__menu-link--active']}
            >
              Hiring Managers
            </NavLink>
          )}
          <NavLink
            to={CompanyRouter.editCompany.editPassword()}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            Password
          </NavLink>
          <NavLink
            to={CompanyRouter.editCompany.editCompanyLogo()}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            Company Logo
          </NavLink>
        </div>
        {companyDataForEditLoading ? (
          <Loader loading />
        ) : (
          <div className={styles['page__subpage']}>
            <Switch>
              <Route
                exact
                path={CompanyRouter.editCompany.editCompanyInformation()}
                component={EditCompanyInfoPage}
              />
              <Route
                exact
                path={CompanyRouter.editCompany.editPassword()}
                component={ChangePasswordPage}
              />
              <Route
                exact
                path={CompanyRouter.editCompany.editCompanyLogo()}
                component={EditCompanyLogoPage}
              />
              <Route
                exact
                path={CompanyRouter.editCompany.editHiringManagers()}
                component={EditHiringManagersPage}
              />
              <Route path="*">
                <Redirect to={CompanyRouter.editCompany.editCompanyInformation()} />
              </Route>
            </Switch>
          </div>
        )}
      </div>
    </div>
  );
};
