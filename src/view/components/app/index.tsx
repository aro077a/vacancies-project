import classNames from 'classnames';
import React, { useEffect, useMemo } from 'react';
import { hot } from 'react-hot-loader/root';
import { Redirect, Route, RouteComponentProps, Switch, useLocation } from 'react-router-dom';

import { UserType } from '~/models/common';
import {
  getCities,
  getCountries,
  getHiringManagerJobPositions,
  getHiringManagerProjectTypes,
  getJobGroups,
  getJobPositions,
  getProjectTypes,
  getStates,
} from '~/modules/common/actions';
import { getCompanies } from '~/modules/companies/actions';
import { getNotificationsCount } from '~/modules/notifications/actions';
import { useDispatch, useSelector } from '~/store';
import { AdminRouter, CandidateRouter, CommonRouter, CompanyRouter } from '~/utils/router';
import { CandidatesApprovalPage } from '~/view/pages/admin/candidate-approval';
import { CandidatesPage } from '~/view/pages/admin/candidates';
import { ContactPage } from '~/view/pages/admin/contacts';
// admin pages
import { DashboardPage } from '~/view/pages/admin/dashboard';
import { EditAdminProfilePage } from '~/view/pages/admin/edit-profile';
import { EmployersPage } from '~/view/pages/admin/employers';
import { EmployersApprovalPage } from '~/view/pages/admin/employers-approval';
import { LiveJobsPage } from '~/view/pages/admin/live-jobs';
import { ManageAdminsPage } from '~/view/pages/admin/manage-admins';
import { UnassignedAdminPositionPage } from '~/view/pages/admin/manage-admins/components/unassigned-positions';
import { MessagingPage } from '~/view/pages/admin/messaging';
import { NotFoundPage } from '~/view/pages/admin/not-found';
import { PipelinePage } from '~/view/pages/admin/pipeline';
import { RejectedCandidatesPage } from '~/view/pages/admin/rejected-candidates';
import { AdminTimesheetPage } from '~/view/pages/admin/timesheet';
import { WhiteboardPage } from '~/view/pages/admin/whiteboard';
// candidate pages
// eslint-disable-next-line max-len
import { CreateProfessionalDetailsPage as CreateCandidateProfessionalDetailsPage } from '~/view/pages/candidate/auth/register/create-professional-details';
import { CreateProfilePage as CreateCandidateProfilePage } from '~/view/pages/candidate/auth/register/create-profile';
import { UploadCVPage as UploadCandidateCVPage } from '~/view/pages/candidate/auth/register/upload-cv';
// eslint-disable-next-line max-len
import { UploadLicensesPage as UploadCandidateLicensesPage } from '~/view/pages/candidate/auth/register/upload-licenses';
import { UploadPhotoPage as UploadCandidatePhotoPage } from '~/view/pages/candidate/auth/register/upload-photo';
import { EditCandidateProfilePage } from '~/view/pages/candidate/edit-profile';
import { VideoInterviewPage as CandidateInterviewPage } from '~/view/pages/candidate/edit-profile/create-interview';
import { FindJobsPage as CandidateFindJobsPage } from '~/view/pages/candidate/find-jobs';
import { ProposalsPage as CandidateProposalsPage } from '~/view/pages/candidate/proposals';
import { CandidateTimesheetPage } from '~/view/pages/candidate/timesheet';
import { ForgotPasswordPage } from '~/view/pages/common/auth/forgot-password';
// common pages
import { LoginPage } from '~/view/pages/common/auth/login';
import { ChooseUserTypePage } from '~/view/pages/common/auth/register/choose-user-type';
import { ResetPasswordPage } from '~/view/pages/common/auth/reset-password';
// eslint-disable-next-line max-len
import { CreateProfessionalDetailsPage as CreateCandidateDetailsByAdmin } from '~/view/pages/common/create-candidate/create-candidate-details';
// eslint-disable-next-line max-len
import { CreateCandidateInfoPage as CreateCandidateInfoByAdmin } from '~/view/pages/common/create-candidate/create-candidate-profile';
import { UploadCVPage as UploadCandidateCVbyAdmin } from '~/view/pages/common/create-candidate/upload-cv';
// eslint-disable-next-line max-len
import { UploadLicensesPage as UploadCandidateLicensesByAdmin } from '~/view/pages/common/create-candidate/upload-licenses';
// eslint-disable-next-line max-len
import { UploadCandidatePhotoPage as UploadCandidatePhotoByAdmin } from '~/view/pages/common/create-candidate/upload-photo';
// employer pages
// eslint-disable-next-line max-len
import { CreateHiringManagerPage as CreateEmployerCompanyHiringManager } from '~/view/pages/common/create-employer/add-hiring-managers';
// eslint-disable-next-line max-len
import { CreateEmployerCompanyInfo as CreateEmployerCompanyInfoByAdmin } from '~/view/pages/common/create-employer/create-company-info';
// company pages
import { UploadCompanyLogo as UploadCompanyLogoByAdmin } from '~/view/pages/common/create-employer/upload-company-logo';
import { CreateHiringManagerPage } from '~/view/pages/common/create-job/create-hiring-manager';
import { CreateJobDescriptionPage } from '~/view/pages/common/create-job/create-job-description';
import { CreateJobInfoPage } from '~/view/pages/common/create-job/create-job-info';
import { EditCandidatePage } from '~/view/pages/common/edit-candidate';
import { EditEmployerPage } from '~/view/pages/common/edit-employer';
import { EditJobPage } from '~/view/pages/common/edit-job';
// common pages
import { ShortListPage } from '~/view/pages/common/shortlist';
import { EnterMainInfoPage as EnterMainCompanyInfoPage } from '~/view/pages/company/auth/register/enter-main-info';
import { UploadLogoPage as UploadCompanyLogoPage } from '~/view/pages/company/auth/register/upload-logo';
import { AllCandidatesPage as CompanyCandidatesPage } from '~/view/pages/company/candidates';
import { EditCompanyPage } from '~/view/pages/company/edit-profile';
import { InterestedInPage } from '~/view/pages/company/interested-in';
import { InterviewsPage as CompanyInterviewsPage } from '~/view/pages/company/interviews';
import { MyJobsPage as CompanyMyJobsPage } from '~/view/pages/company/my-jobs';
import { CompanyTimesheetPage } from '~/view/pages/company/timesheet';
import { LandingPage } from '~/view/pages/landing-page';
import { Footer } from '~/view/pages/landing-page/components/footer';
import { ContactUsPage } from '~/view/pages/landing-page/pages/contact-us-page';
import { PrivacyAndPolicyPage } from '~/view/pages/landing-page/pages/privacy-and-policy';
import { TermsAndConditionsPage } from '~/view/pages/landing-page/pages/terms-and-conditions';

import { Header } from './components/header';
import { HomeContainer } from './components/home-container';
import styles from './styles.scss';

export const AppComponent: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  // register related state fields
  const registering = useSelector(state => state.registration.registering);
  const selectedUserType = useSelector(state => state.registration.selectedUserType);
  const candidateProfileCreated = useSelector(state => state.candidateRegistration.profileCreated);
  const candidateProfessionalDetailsCreated = useSelector(
    state => state.candidateRegistration.professionalDetailsCreated,
  );
  const candidateCVUploaded = useSelector(state => state.candidateRegistration.cvUploaded);
  const candidateLicensesUploaded = useSelector(
    state => state.candidateRegistration.licensesUploaded,
  );

  const companyMainInfoEntered = useSelector(state => state.companyRegistration.mainInfoEntered);
  const userLoggedIn = useSelector(state => state.user.loggedIn);
  const loggedInUserType = useSelector(state => state.user.loggedInUserType);

  const isLandingPage = location.pathname.includes('/landing');

  useEffect(() => {
    dispatch(getCountries.request());
    dispatch(getStates.request());
    dispatch(getCities.request());
    dispatch(getJobPositions.request());
    dispatch(getJobGroups.request());
    dispatch(getProjectTypes.request());
    dispatch(getHiringManagerJobPositions.request());
    dispatch(getHiringManagerProjectTypes.request());
    dispatch(getCompanies.request());
  }, [dispatch]);

  useEffect(() => {
    if (userLoggedIn) {
      dispatch(getNotificationsCount.request());
    }
  }, [userLoggedIn, dispatch]);

  const candidateCurrentRegistrationPage = useMemo<{
    path: string;
    component: React.FC<RouteComponentProps>;
  }>(() => {
    if (!candidateProfileCreated) {
      return {
        path: CandidateRouter.auth.register.createProfile,
        component: CreateCandidateProfilePage,
      };
    }

    if (!candidateProfessionalDetailsCreated) {
      return {
        path: CandidateRouter.auth.register.createProfessionalDetails,
        component: CreateCandidateProfessionalDetailsPage,
      };
    }

    if (!candidateCVUploaded) {
      return {
        path: CandidateRouter.auth.register.uploadCV,
        component: UploadCandidateCVPage,
      };
    }

    if (!candidateLicensesUploaded) {
      return {
        path: CandidateRouter.auth.register.uploadLicenses,
        component: UploadCandidateLicensesPage,
      };
    }

    return {
      path: CandidateRouter.auth.register.uploadPhoto,
      component: UploadCandidatePhotoPage,
    };
  }, [
    candidateCVUploaded,
    candidateLicensesUploaded,
    candidateProfessionalDetailsCreated,
    candidateProfileCreated,
  ]);

  const companyCurrentRegistrationPage = useMemo<{
    path: string;
    component: React.FC<RouteComponentProps>;
  }>(() => {
    if (!companyMainInfoEntered) {
      return {
        path: CompanyRouter.auth.register.enterMainInfo,
        component: EnterMainCompanyInfoPage,
      };
    }
    return {
      path: CompanyRouter.auth.register.uploadLogo,
      component: UploadCompanyLogoPage,
    };
  }, [companyMainInfoEntered]);

  const routes = useMemo(() => {
    if (userLoggedIn) {
      return (
        <HomeContainer>
          {(loggedInUserType === UserType.ADMIN || loggedInUserType === UserType.SUPER_ADMIN) && (
            <Switch>
              <Route exact path={AdminRouter.dashboard} component={DashboardPage} />
              <Route exact path={AdminRouter.liveJobs} component={LiveJobsPage} />
              <Route exact path={AdminRouter.candidates} component={CandidatesPage} />
              <Route exact path={AdminRouter.employers} component={EmployersPage} />
              <Route
                exact
                path={`${AdminRouter.pendingEmployers}`}
                component={EmployersApprovalPage}
              />
              <Route
                exact
                path={`${AdminRouter.pendingCandidates}`}
                component={CandidatesApprovalPage}
              />
              <Route
                exact
                path={`${AdminRouter.rejectedCandidates}`}
                component={RejectedCandidatesPage}
              />
              <Route
                exact
                path={CommonRouter.createEmployer.createEmployerCompanyInfo}
                component={CreateEmployerCompanyInfoByAdmin}
              />
              <Route
                exact
                path={CommonRouter.createEmployer.createHiringManager}
                component={CreateEmployerCompanyHiringManager}
              />
              <Route
                exact
                path={CommonRouter.createEmployer.createCompanyLogo}
                component={UploadCompanyLogoByAdmin}
              />
              <Route
                exact
                path={CommonRouter.createCandidate.createCandidateInfo}
                component={CreateCandidateInfoByAdmin}
              />
              <Route
                exact
                path={CommonRouter.createCandidate.createCandidateDetails}
                component={CreateCandidateDetailsByAdmin}
              />
              <Route
                exact
                path={CommonRouter.createCandidate.createCandidateCV}
                component={UploadCandidateCVbyAdmin}
              />
              <Route
                exact
                path={CommonRouter.createCandidate.createCandidateLicenses}
                component={UploadCandidateLicensesByAdmin}
              />
              <Route
                exact
                path={CommonRouter.createCandidate.createCandidatePhoto}
                component={UploadCandidatePhotoByAdmin}
              />
              <Route
                exact
                path={CommonRouter.createJob.createJobInfo}
                component={CreateJobInfoPage}
              />
              <Route
                exact
                path={CommonRouter.createJob.createHiringManager}
                component={CreateHiringManagerPage}
              />
              <Route
                exact
                path={CommonRouter.createJob.createJobDescription}
                component={CreateJobDescriptionPage}
              />
              <Route path={CommonRouter.editJob.getBase()} component={EditJobPage} />
              <Route path={CommonRouter.editCandidate.getBase()} component={EditCandidatePage} />
              <Route path={CommonRouter.editEmployer.getBase()} component={EditEmployerPage} />
              <Route path={CommonRouter.editProfile.getBase()} component={EditAdminProfilePage} />
              <Route exact path={AdminRouter.contact} component={ContactPage} />

              <Route path={AdminRouter.pipeline} component={PipelinePage} />
              <Route path={AdminRouter.admins} component={ManageAdminsPage} />
              <Route
                path={AdminRouter.unAssignedPositions}
                component={UnassignedAdminPositionPage}
              />
              <Route path={AdminRouter.whiteboard} component={WhiteboardPage} />
              <Route path={AdminRouter.messaging.getBase()} component={MessagingPage} />
              <Route path={AdminRouter.timesheet} component={AdminTimesheetPage} />
              <Route exact path={CommonRouter.landingPage} component={LandingPage} />
              <Route exact path={CommonRouter.contactUsPage} component={ContactUsPage} />
              <Route exact path={CommonRouter.privacyPage} component={PrivacyAndPolicyPage} />
              <Route exact path={CommonRouter.termsPage} component={TermsAndConditionsPage} />
              <Route exact path="/">
                <Redirect to={AdminRouter.dashboard} />
              </Route>
              <Route path="*" component={NotFoundPage} />
            </Switch>
          )}
          {loggedInUserType === UserType.CANDIDATE && (
            <Switch>
              <Route exact path={CandidateRouter.findJobs} component={CandidateFindJobsPage} />
              <Route exact path={CandidateRouter.proposals} component={CandidateProposalsPage} />
              <Route exact path={CandidateRouter.timesheet} component={CandidateTimesheetPage} />
              <Route
                path={CandidateRouter.editCandidate.getBase()}
                component={EditCandidateProfilePage}
              />
              <Route exact path={CandidateRouter.interview} component={CandidateInterviewPage} />
              <Route exact path={CommonRouter.shortList} component={ShortListPage} />
              <Route exact path={CommonRouter.landingPage} component={LandingPage} />
              <Route exact path={CommonRouter.contactUsPage} component={ContactUsPage} />
              <Route exact path={CommonRouter.privacyPage} component={PrivacyAndPolicyPage} />
              <Route exact path={CommonRouter.termsPage} component={TermsAndConditionsPage} />
              <Route exact path="/">
                <Redirect to={CandidateRouter.findJobs} />
              </Route>
              <Route path="*" component={NotFoundPage} />
            </Switch>
          )}
          {(loggedInUserType === UserType.COMPANY || loggedInUserType === UserType.MANAGER) && (
            <Switch>
              <Route exact path={CompanyRouter.addJobs} component={CompanyMyJobsPage} />
              <Route exact path={CompanyRouter.candidates} component={CompanyCandidatesPage} />
              <Route exact path={CompanyRouter.interviews} component={CompanyInterviewsPage} />
              <Route path={CompanyRouter.editCompany.getBase()} component={EditCompanyPage} />
              <Route exact path={CandidateRouter.timesheet} component={CompanyTimesheetPage} />
              <Route
                exact
                path={CommonRouter.createJob.createJobInfo}
                component={CreateJobInfoPage}
              />
              <Route
                exact
                path={CommonRouter.createJob.createHiringManager}
                component={CreateHiringManagerPage}
              />
              <Route
                exact
                path={CommonRouter.createJob.createJobDescription}
                component={CreateJobDescriptionPage}
              />
              <Route exact path={CommonRouter.shortList} component={ShortListPage} />
              <Route path={CommonRouter.editJob.getBase()} component={EditJobPage} />
              <Route exact path={CompanyRouter.interestedIn} component={InterestedInPage} />
              <Route exact path={CommonRouter.landingPage} component={LandingPage} />
              <Route exact path={CommonRouter.contactUsPage} component={ContactUsPage} />
              <Route exact path={CommonRouter.privacyPage} component={PrivacyAndPolicyPage} />
              <Route exact path={CommonRouter.termsPage} component={TermsAndConditionsPage} />
              <Route exact path="/">
                <Redirect to={CompanyRouter.addJobs} />
              </Route>
              <Route path="*" component={NotFoundPage} />
            </Switch>
          )}
        </HomeContainer>
      );
    }

    return (
      <div
        className={classNames({
          [styles['auth-wrapper']]: !isLandingPage,
        })}
      >
        <div
          className={classNames({
            [styles['auth-wrapper__content']]: !isLandingPage,
          })}
        >
          {registering ? (
            <>
              {selectedUserType === UserType.CANDIDATE && (
                <Switch>
                  <Route
                    exact
                    path={candidateCurrentRegistrationPage.path}
                    component={candidateCurrentRegistrationPage.component}
                  />
                  <Route path="*">
                    <Redirect to={candidateCurrentRegistrationPage.path} />
                  </Route>
                </Switch>
              )}
              {selectedUserType === UserType.COMPANY && (
                <Switch>
                  <Route
                    exact
                    path={companyCurrentRegistrationPage.path}
                    component={companyCurrentRegistrationPage.component}
                  />
                  <Route path="*">
                    <Redirect to={companyCurrentRegistrationPage.path} />
                  </Route>
                </Switch>
              )}
            </>
          ) : (
            <Switch>
              <Route exact path={CommonRouter.landingPage} component={LandingPage} />
              <Route exact path={CommonRouter.contactUsPage} component={ContactUsPage} />
              <Route exact path={CommonRouter.privacyPage} component={PrivacyAndPolicyPage} />
              <Route exact path={CommonRouter.termsPage} component={TermsAndConditionsPage} />
              <Route exact path={CommonRouter.auth.login} component={LoginPage} />
              <Route exact path={CommonRouter.auth.forgotPassword} component={ForgotPasswordPage} />
              <Route exact path={CommonRouter.auth.resetPassword} component={ResetPasswordPage} />
              <Route
                exact
                path={CommonRouter.auth.register.chooseUserType}
                component={ChooseUserTypePage}
              />
              <Route path="*">
                <Redirect to={CommonRouter.landingPage} />
              </Route>
            </Switch>
          )}
        </div>
      </div>
    );
  }, [
    isLandingPage,
    userLoggedIn,
    registering,
    selectedUserType,
    candidateCurrentRegistrationPage.path,
    candidateCurrentRegistrationPage.component,
    companyCurrentRegistrationPage.path,
    companyCurrentRegistrationPage.component,
    loggedInUserType,
  ]);

  return (
    <main className={styles['app-wrapper']}>
      {!isLandingPage && <Header />}
      {routes}
      <Footer />
    </main>
  );
};

export const App = hot(() => <AppComponent />);
