import { getType } from 'deox';
import { Action, combineReducers } from 'redux';
import { createTransform, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { adminAssignedReducer } from '~/modules/adminAssigned/reducer';
import { adminCandidatesReducer } from '~/modules/adminCandidates/reducer';
import { adminContactReducer } from '~/modules/adminContacts/reducer';
import { adminDashboardReducer } from '~/modules/adminDashboard/reducer';
import { adminProfileReducer } from '~/modules/adminEditProfile/reducer';
import { adminEmployersReducer } from '~/modules/adminEmployers/reducer';
import { adminLiveJobsReducer } from '~/modules/adminLiveJobs/reducer';
import { adminMessagingReducer } from '~/modules/adminMessaging/reducer';
import { adminMatchedJobsPipelineReducers } from '~/modules/adminPipeline/reducer';
import { adminTimesheetReducer } from '~/modules/adminTimesheet/reducer';
import { adminUserReducer } from '~/modules/adminUser/reducer';
import { adminWhiteboardReducer } from '~/modules/adminWhiteboard/reducer';
import { resetStore } from '~/modules/app/actions';
import { candidateFindJobsReducer } from '~/modules/candidateFindJobs/reducer';
import { candidateProposalsReducer } from '~/modules/candidateProposals/reducer';
import { candidateRegistrationReducer } from '~/modules/candidateRegistration/reducer';
import { candidateTimesheetReducer } from '~/modules/candidateTimesheet/reducer';
import { candidateUserReducer } from '~/modules/candidateUser/reducer';
import { commonReducer } from '~/modules/common/reducer';
import { companyReducer } from '~/modules/companies/reducer';
import { companyCandidatesReducer } from '~/modules/companyCandidates/reducer';
import { companyProfileReducer } from '~/modules/companyEditProfile/reducer';
import { CompanyInterestedReducer } from '~/modules/companyInterested/reducer';
import { companyInterviewsReducer } from '~/modules/companyInterviews/reducer';
import { companyJobsReducer } from '~/modules/companyJobs/reducer';
import { myJobsReducer } from '~/modules/companyMyJobs/reducer';
import { companyRegistrationReducer } from '~/modules/companyRegistration/reducer';
import { companyTimesheetReducer } from '~/modules/companyTimesheet/reducer';
import { companyUserReducer } from '~/modules/companyUser/reducer';
import { createCandidateReducer } from '~/modules/createCandidate/reducer';
import { createEmployerReducer } from '~/modules/createEmployer/reducer';
import { createJobReducer } from '~/modules/createJob/reducer';
import { hiringManagerUserReducer } from '~/modules/hiringManager/reducer';
import { manageAdminsReducer } from '~/modules/manageAdmins/reducer';
import { notificationReducer } from '~/modules/notifications/reducer';
import { successPopupReducer } from '~/modules/popups/reducer';
import { registrationReducer } from '~/modules/registration/reducer';
import { shortListReducer } from '~/modules/shortlist/reducer';
import { superAdminUserReducer } from '~/modules/superAdminUser/reducer';
import { userReducer } from '~/modules/user/reducer';

import { RootState } from './types';

const transforms = [
  createTransform(
    state => JSON.stringify(state),
    state =>
      JSON.parse(state, (key, value) =>
        typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
          ? new Date(value)
          : value,
      ),
  ),
];

const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'common',
    'registration',
    'candidateRegistration',
    'companyRegistration',
    'user',
    'adminUser',
    'candidateUser',
    'companyUser',
    'notifications',
    'hiringManagerUser',
    'superAdminUser',
    'adminAssigned',
  ],
  transforms,
};

const appReducer = combineReducers({
  common: commonReducer,
  registration: registrationReducer,
  candidateRegistration: candidateRegistrationReducer,
  companyRegistration: companyRegistrationReducer,
  user: userReducer,
  adminUser: adminUserReducer,
  candidateUser: candidateUserReducer,
  companyUser: companyUserReducer,
  adminLiveJobs: adminLiveJobsReducer,
  adminCandidates: adminCandidatesReducer,
  adminEmployers: adminEmployersReducer,
  createJob: createJobReducer,
  createCandidate: createCandidateReducer,
  adminContacts: adminContactReducer,
  createEmployer: createEmployerReducer,
  adminMatchedJobsPipeline: adminMatchedJobsPipelineReducers,
  candidateProposals: candidateProposalsReducer,
  companyInterviews: companyInterviewsReducer,
  adminProfile: adminProfileReducer,
  candidateFindJobs: candidateFindJobsReducer,
  companyProfile: companyProfileReducer,
  companyCandidates: companyCandidatesReducer,
  companyJobs: companyJobsReducer,
  candidateTimesheet: candidateTimesheetReducer,
  shortList: shortListReducer,
  companyTimesheet: companyTimesheetReducer,
  adminDashboard: adminDashboardReducer,
  companyMyJobs: myJobsReducer,
  companies: companyReducer,
  notifications: notificationReducer,
  manageAdmins: manageAdminsReducer,
  adminMessaging: adminMessagingReducer,
  hiringManagerUser: hiringManagerUserReducer,
  superAdminUser: superAdminUserReducer,
  adminAssigned: adminAssignedReducer,
  companyInterestedIn: CompanyInterestedReducer,
  successPopup: successPopupReducer,
  adminTimesheet: adminTimesheetReducer,
  adminWhiteboard: adminWhiteboardReducer,
});

const rootReducer = (state: RootState | undefined, action: Action): RootState => {
  if (action.type === getType(resetStore)) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default persistReducer(rootPersistConfig, rootReducer);
