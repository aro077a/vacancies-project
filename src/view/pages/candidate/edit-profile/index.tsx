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

import { getCandidateDataForEdit } from '~/modules/createCandidate/actions';
import { useDispatch, useSelector } from '~/store';
import { CandidateRouter } from '~/utils/router';
import { BackButton } from '~/view/components/back-button';
import { EditCandidateHeader } from '~/view/components/edit-candidate-header';
import { Loader } from '~/view/components/loader';
import { Tab, Tabs } from '~/view/components/tabs';

import { EditCandidateCVPage } from './cv';
import { EditCandidateLicensesPage } from './licenses';
import { ChangePasswordPage } from './password';
import { EditCandidateInfoPage } from './personal-information';
import { EditCandidatePhotoPage } from './photo';
import { EditProfessionalDetailsPage } from './professional-details';
import styles from './styles.scss';
import { EditVideoInterviewPage } from './video-interview';

const mobileMenuTabs: Tab[] = [
  { id: 1, label: 'Personal information' },
  { id: 2, label: 'Password' },
  { id: 3, label: 'Professional details' },
  { id: 4, label: 'CV' },
  { id: 5, label: 'Licenses' },
  { id: 6, label: 'Photo' },
  { id: 7, label: 'Video interview' },
];

export const EditCandidateProfilePage: React.FC<RouteComponentProps> = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const loadingCandidateDataForEdit = useSelector(
    state => state.createCandidate.loadingCandidateDataForEdit,
  );
  const createdCandidateInfo = useSelector(state => state.createCandidate.candidateProfileCreated);
  const [activeMobileMenuTab, setActiveMobileMenuTab] = useState(mobileMenuTabs[0].id);
  const candidateId = useSelector(state => state.candidateUser.typeId);
  useEffect(() => {
    dispatch(getCandidateDataForEdit.request({ candidateId: Number(candidateId) }));
  }, [dispatch, candidateId]);

  useEffect(() => {
    switch (location.pathname) {
      case CandidateRouter.editCandidate.editProfileInformation():
        setActiveMobileMenuTab(mobileMenuTabs[0].id);
        break;
      case CandidateRouter.editCandidate.editPassword():
        setActiveMobileMenuTab(mobileMenuTabs[1].id);
        break;
      case CandidateRouter.editCandidate.editProfessionalDetails():
        setActiveMobileMenuTab(mobileMenuTabs[2].id);
        break;
      case CandidateRouter.editCandidate.editCV():
        setActiveMobileMenuTab(mobileMenuTabs[3].id);
        break;
      case CandidateRouter.editCandidate.editLicenses():
        setActiveMobileMenuTab(mobileMenuTabs[4].id);
        break;
      case CandidateRouter.editCandidate.editPhoto():
        setActiveMobileMenuTab(mobileMenuTabs[5].id);
        break;
      case CandidateRouter.editCandidate.editVideoInterview():
        setActiveMobileMenuTab(mobileMenuTabs[6].id);
        break;
      default:
        break;
    }
  }, [location.pathname]);

  const handleActiveMobileMenuTabChange = useCallback(
    (tabId: number) => {
      switch (tabId) {
        case mobileMenuTabs[0].id:
          history.push(CandidateRouter.editCandidate.editProfileInformation());
          break;
        case mobileMenuTabs[1].id:
          history.push(CandidateRouter.editCandidate.editPassword());
          break;
        case mobileMenuTabs[2].id:
          history.push(CandidateRouter.editCandidate.editProfessionalDetails());
          break;
        case mobileMenuTabs[3].id:
          history.push(CandidateRouter.editCandidate.editCV());
          break;
        case mobileMenuTabs[4].id:
          history.push(CandidateRouter.editCandidate.editLicenses());
          break;
        case mobileMenuTabs[5].id:
          history.push(CandidateRouter.editCandidate.editPhoto());
          break;
        case mobileMenuTabs[6].id:
          history.push(CandidateRouter.editCandidate.editVideoInterview());
          break;
        default:
          break;
      }
    },
    [history],
  );

  return (
    <div className={styles['page']}>
      <BackButton className={styles['page__back-btn']} title="to find jobs" goTo="/find-jobs" />
      <h1 className={styles['page__title']}>Edit Profile</h1>
      {!loadingCandidateDataForEdit && <EditCandidateHeader />}
      <div className={styles['page__content']}>
        <Tabs
          className={styles['page__mobile-menu']}
          tabs={mobileMenuTabs}
          activeTabId={activeMobileMenuTab}
          onChange={handleActiveMobileMenuTabChange}
        />
        <div className={styles['page__menu']}>
          <NavLink
            to={CandidateRouter.editCandidate.editProfileInformation()}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            Personal information
          </NavLink>
          <NavLink
            to={CandidateRouter.editCandidate.editPassword()}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            Password
          </NavLink>
          <NavLink
            to={CandidateRouter.editCandidate.editProfessionalDetails()}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            Professional details
          </NavLink>
          <NavLink
            to={CandidateRouter.editCandidate.editCV()}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            CV
          </NavLink>
          <NavLink
            to={CandidateRouter.editCandidate.editLicenses()}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            Licenses
          </NavLink>
          <NavLink
            to={CandidateRouter.editCandidate.editPhoto()}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            Photo
          </NavLink>
          <NavLink
            to={CandidateRouter.editCandidate.editVideoInterview()}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            Video interview
          </NavLink>
        </div>
        {loadingCandidateDataForEdit || !createdCandidateInfo ? (
          <Loader loading />
        ) : (
          <div className={styles['page__subpage']}>
            <Switch>
              <Route
                exact
                path={CandidateRouter.editCandidate.editProfileInformation()}
                component={EditCandidateInfoPage}
              />
              <Route
                exact
                path={CandidateRouter.editCandidate.editPassword()}
                component={ChangePasswordPage}
              />
              <Route
                exact
                path={CandidateRouter.editCandidate.editProfessionalDetails()}
                component={EditProfessionalDetailsPage}
              />
              <Route
                exact
                path={CandidateRouter.editCandidate.editCV()}
                component={EditCandidateCVPage}
              />
              <Route
                exact
                path={CandidateRouter.editCandidate.editLicenses()}
                component={EditCandidateLicensesPage}
              />
              <Route
                exact
                path={CandidateRouter.editCandidate.editPhoto()}
                component={EditCandidatePhotoPage}
              />
              <Route
                exact
                path={CandidateRouter.editCandidate.editVideoInterview()}
                component={EditVideoInterviewPage}
              />
              <Route path="*">
                <Redirect to={CandidateRouter.editCandidate.editProfileInformation()} />
              </Route>
            </Switch>
          </div>
        )}
      </div>
    </div>
  );
};
