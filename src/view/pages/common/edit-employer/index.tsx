import React, { useCallback, useEffect, useState } from 'react';
import {
  NavLink,
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';

import { getEmployerForEdit, setSelectedEmployer } from '~/modules/createEmployer/actions';
import { useDispatch, useSelector } from '~/store';
import { CommonRouter } from '~/utils/router';
import { Loader } from '~/view/components/loader';
import { Tab, Tabs } from '~/view/components/tabs';

import { EditEmployerInfoPage } from './company-info';
import { EditEmployerLogoPage } from './company-logo';
import { EmployerContactDetailsPage } from './contact-details';
import { EditHiringManagersPage } from './hiring-managers';
import { ChangePasswordPage } from './password';
import styles from './styles.scss';

const mobileMenuTabs: Tab[] = [
  { id: 1, label: 'Main Employer Info' },
  { id: 2, label: 'Hiring Managers' },
  { id: 3, label: 'Password' },
  { id: 4, label: 'Employer Logo' },
];

export const EditEmployerPage: React.FC<RouteComponentProps> = () => {
  const history = useHistory();
  const location = useLocation();
  const params = useParams<{ employerId: string }>();
  const dispatch = useDispatch();
  const { employerDataForEditLoading } = useSelector(state => state.createEmployer);

  useEffect(() => {
    dispatch(getEmployerForEdit.request({ employerId: Number(params.employerId) }));
    dispatch(setSelectedEmployer({ employerId: Number(params.employerId) }));
  }, [dispatch, params.employerId]);

  const [activeMobileMenuTab, setActiveMobileMenuTab] = useState(mobileMenuTabs[0].id);

  useEffect(() => {
    switch (location.pathname) {
      case CommonRouter.editEmployer.editEmployerInformation(params.employerId):
        setActiveMobileMenuTab(mobileMenuTabs[0].id);
        break;
      case CommonRouter.editEmployer.editEmployerHiringManagers(params.employerId):
        setActiveMobileMenuTab(mobileMenuTabs[1].id);
        break;
      case CommonRouter.editEmployer.editEmployerPassword(params.employerId):
        setActiveMobileMenuTab(mobileMenuTabs[2].id);
        break;
      case CommonRouter.editEmployer.editEmployerLogo(params.employerId):
        setActiveMobileMenuTab(mobileMenuTabs[3].id);
        break;
      default:
        break;
    }
  }, [location.pathname, params.employerId]);

  const handleActiveMobileMenuTabChange = useCallback(
    (tabId: number) => {
      switch (tabId) {
        case mobileMenuTabs[0].id:
          history.push(CommonRouter.editEmployer.editEmployerInformation(params.employerId));
          break;
        case mobileMenuTabs[2].id:
          history.push(CommonRouter.editEmployer.editEmployerPassword(params.employerId));
          break;
        case mobileMenuTabs[3].id:
          history.push(CommonRouter.editEmployer.editEmployerLogo(params.employerId));
          break;
        case mobileMenuTabs[4].id:
          history.push(CommonRouter.editEmployer.editEmployerHiringManagers(params.employerId));
          break;
        default:
          break;
      }
    },
    [history, params.employerId],
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
            to={CommonRouter.editEmployer.editEmployerInformation(params.employerId)}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            Main Employer Info
          </NavLink>
          <NavLink
            to={CommonRouter.editEmployer.editEmployerHiringManagers(params.employerId)}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            Hiring Managers
          </NavLink>
          <NavLink
            to={CommonRouter.editEmployer.editEmployerPassword(params.employerId)}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            Password
          </NavLink>
          <NavLink
            to={CommonRouter.editEmployer.editEmployerLogo(params.employerId)}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            Employer Logo
          </NavLink>
        </div>
        {employerDataForEditLoading ? (
          <Loader loading />
        ) : (
          <div className={styles['page__subpage']}>
            <Switch>
              <Route
                exact
                path={CommonRouter.editEmployer.editEmployerInformation(params.employerId)}
                component={EditEmployerInfoPage}
              />
              <Route
                exact
                path={CommonRouter.editEmployer.editEmployerDetails(params.employerId)}
                component={EmployerContactDetailsPage}
              />
              <Route
                exact
                path={CommonRouter.editEmployer.editEmployerPassword(params.employerId)}
                component={ChangePasswordPage}
              />
              <Route
                exact
                path={CommonRouter.editEmployer.editEmployerLogo(params.employerId)}
                component={EditEmployerLogoPage}
              />
              <Route
                exact
                path={CommonRouter.editEmployer.editEmployerHiringManagers(params.employerId)}
                component={EditHiringManagersPage}
              />
              <Route path="*">
                <Redirect
                  to={CommonRouter.editEmployer.editEmployerInformation(params.employerId)}
                />
              </Route>
            </Switch>
          </div>
        )}
      </div>
    </div>
  );
};
