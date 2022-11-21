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

import { UserType } from '~/models/common';
import { getCandidateRecord } from '~/modules/adminCandidates/actions';
import { getCandidateDataForEdit, resetEditing } from '~/modules/createCandidate/actions';
import { useDispatch, useSelector } from '~/store';
import { CommonRouter } from '~/utils/router';
import { BackButton } from '~/view/components/back-button';
import { EditCandidateHeader } from '~/view/components/edit-candidate-header';
import { Loader } from '~/view/components/loader';
import { Tab, Tabs } from '~/view/components/tabs';
import { CreateProfessionalDetailsPage } from '~/view/pages/common/create-candidate/create-candidate-details';
import { UploadInterviewPage } from '~/view/pages/common/create-candidate/create-candidate-interview';
import { CreateCandidateInfoPage } from '~/view/pages/common/create-candidate/create-candidate-profile';
import { UploadCVPage } from '~/view/pages/common/create-candidate/upload-cv';
import { UploadLicensesPage } from '~/view/pages/common/create-candidate/upload-licenses';
import { UploadCandidatePhotoPage } from '~/view/pages/common/create-candidate/upload-photo';

import { EditCandidateBrandedCVPage } from './branded-cv';
import { EditCandidateDocuments } from './documents';
import { EditCandidateRecordsPage } from './my-records';
import styles from './styles.scss';

const mobileMenuTabs: Tab[] = [
  { id: 1, label: 'Personal information' },
  { id: 2, label: 'Professional details' },
  { id: 3, label: 'CV' },
  { id: 4, label: 'Branded CV' },
  { id: 5, label: 'Licenses' },
  { id: 6, label: 'Photo' },
  { id: 7, label: 'Video interview' },
  { id: 8, label: 'My Records' },
  { id: 9, label: 'Documents' },
];

export const EditCandidatePage: React.FC<RouteComponentProps> = () => {
  const history = useHistory();
  const location = useLocation();
  const params = useParams<{ candidateId: string }>();
  const dispatch = useDispatch();
  const loadingCandidateDataForEdit = useSelector(
    state => state.createCandidate.loadingCandidateDataForEdit,
  );
  const createdCandidateInfo = useSelector(state => state.createCandidate.candidateProfileCreated);
  const [activeMobileMenuTab, setActiveMobileMenuTab] = useState(mobileMenuTabs[0].id);
  const userType = useSelector(state => state.user.loggedInUserType);
  const { navigateFromContactsToCandidates } = useSelector(state => state.adminCandidates);

  useEffect(() => {
    dispatch(getCandidateDataForEdit.request({ candidateId: Number(params.candidateId) }));

    if (userType === UserType.ADMIN || userType === UserType.SUPER_ADMIN) {
      dispatch(getCandidateRecord.request({ candidateId: Number(params.candidateId) }));
    }

    return () => {
      dispatch(resetEditing());
    };
  }, [dispatch, params.candidateId, userType]);

  useEffect(() => {
    switch (location.pathname) {
      case CommonRouter.editCandidate.editCandidateProfile(params.candidateId):
        setActiveMobileMenuTab(mobileMenuTabs[0].id);
        break;
      case CommonRouter.editCandidate.editCandidateDetails(params.candidateId):
        setActiveMobileMenuTab(mobileMenuTabs[1].id);
        break;
      case CommonRouter.editCandidate.editCandidateCV(params.candidateId):
        setActiveMobileMenuTab(mobileMenuTabs[2].id);
        break;
      case CommonRouter.editCandidate.editCandidateBrandedCV(params.candidateId):
        setActiveMobileMenuTab(mobileMenuTabs[3].id);
        break;
      case CommonRouter.editCandidate.editCandidateLicenses(params.candidateId):
        setActiveMobileMenuTab(mobileMenuTabs[4].id);
        break;
      case CommonRouter.editCandidate.editCandidatePhoto(params.candidateId):
        setActiveMobileMenuTab(mobileMenuTabs[5].id);
        break;
      case CommonRouter.editCandidate.editCandidateInterview(params.candidateId):
        setActiveMobileMenuTab(mobileMenuTabs[6].id);
        break;
      case CommonRouter.editCandidate.editCandidateRecords(params.candidateId):
        setActiveMobileMenuTab(mobileMenuTabs[7].id);
        break;
      case CommonRouter.editCandidate.editCandidateDocuments(params.candidateId):
        setActiveMobileMenuTab(mobileMenuTabs[8].id);
        break;
      default:
        break;
    }
  }, [location.pathname, params.candidateId]);

  const handleActiveMobileMenuTabChange = useCallback(
    (tabId: number) => {
      switch (tabId) {
        case mobileMenuTabs[0].id:
          history.push(CommonRouter.editCandidate.editCandidateProfile(params.candidateId));
          break;
        case mobileMenuTabs[1].id:
          history.push(CommonRouter.editCandidate.editCandidateDetails(params.candidateId));
          break;
        case mobileMenuTabs[2].id:
          history.push(CommonRouter.editCandidate.editCandidateCV(params.candidateId));
          break;
        case mobileMenuTabs[3].id:
          history.push(CommonRouter.editCandidate.editCandidateBrandedCV(params.candidateId));
          break;
        case mobileMenuTabs[4].id:
          history.push(CommonRouter.editCandidate.editCandidateLicenses(params.candidateId));
          break;
        case mobileMenuTabs[5].id:
          history.push(CommonRouter.editCandidate.editCandidatePhoto(params.candidateId));
          break;
        case mobileMenuTabs[6].id:
          history.push(CommonRouter.editCandidate.editCandidateInterview(params.candidateId));
          break;
        case mobileMenuTabs[7].id:
          history.push(CommonRouter.editCandidate.editCandidateRecords(params.candidateId));
          break;
        case mobileMenuTabs[8].id:
          history.push(CommonRouter.editCandidate.editCandidateDocuments(params.candidateId));
          break;
        default:
          break;
      }
    },
    [history, params.candidateId],
  );
  return (
    <div className={styles['page']}>
      {navigateFromContactsToCandidates ? (
        <BackButton className={styles['page__back-btn']} title="to contacts" goTo="/contact" />
      ) : (
        <BackButton className={styles['page__back-btn']} title="to candidates" goTo="/candidates" />
      )}
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
            to={CommonRouter.editCandidate.editCandidateProfile(params.candidateId)}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            Personal information
          </NavLink>
          <NavLink
            to={CommonRouter.editCandidate.editCandidateDetails(params.candidateId)}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            Professional details
          </NavLink>
          <NavLink
            to={CommonRouter.editCandidate.editCandidateCV(params.candidateId)}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            CV
          </NavLink>
          <NavLink
            to={CommonRouter.editCandidate.editCandidateBrandedCV(params.candidateId)}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            Branded CV
          </NavLink>
          <NavLink
            to={CommonRouter.editCandidate.editCandidateLicenses(params.candidateId)}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            Licenses
          </NavLink>
          <NavLink
            to={CommonRouter.editCandidate.editCandidatePhoto(params.candidateId)}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            Photo
          </NavLink>
          <NavLink
            to={CommonRouter.editCandidate.editCandidateInterview(params.candidateId)}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            Video interview
          </NavLink>
          <NavLink
            to={CommonRouter.editCandidate.editCandidateRecords(params.candidateId)}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            My records
          </NavLink>
          <NavLink
            to={CommonRouter.editCandidate.editCandidateDocuments(params.candidateId)}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            Documents
          </NavLink>
        </div>
        {loadingCandidateDataForEdit || !createdCandidateInfo ? (
          <Loader loading />
        ) : (
          <div className={styles['page__subpage']}>
            <Switch>
              <Route
                exact
                path={CommonRouter.editCandidate.editCandidateProfile(params.candidateId)}
                component={CreateCandidateInfoPage}
              />
              <Route
                exact
                path={CommonRouter.editCandidate.editCandidateDetails(params.candidateId)}
                component={CreateProfessionalDetailsPage}
              />
              <Route
                exact
                path={CommonRouter.editCandidate.editCandidateCV(params.candidateId)}
                component={UploadCVPage}
              />
              <Route
                exact
                path={CommonRouter.editCandidate.editCandidateBrandedCV(params.candidateId)}
                component={EditCandidateBrandedCVPage}
              />
              <Route
                exact
                path={CommonRouter.editCandidate.editCandidateLicenses(params.candidateId)}
                component={UploadLicensesPage}
              />
              <Route
                exact
                path={CommonRouter.editCandidate.editCandidatePhoto(params.candidateId)}
                component={UploadCandidatePhotoPage}
              />
              <Route
                exact
                path={CommonRouter.editCandidate.editCandidateInterview(params.candidateId)}
                component={UploadInterviewPage}
              />
              <Route
                exact
                path={CommonRouter.editCandidate.editCandidateRecords(params.candidateId)}
                component={EditCandidateRecordsPage}
              />
              <Route
                exact
                path={CommonRouter.editCandidate.editCandidateDocuments(params.candidateId)}
                component={EditCandidateDocuments}
              />
              <Route path="*">
                <Redirect
                  to={CommonRouter.editCandidate.editCandidateProfile(params.candidateId)}
                />
              </Route>
            </Switch>
          </div>
        )}
      </div>
    </div>
  );
};
