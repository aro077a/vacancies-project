import { all, SagaGenerator } from 'typed-redux-saga';

import { watchAdminAssigned } from '~/modules/adminAssigned/sagas';
import { watchAdminCandidates } from '~/modules/adminCandidates/sagas';
import { watchAdminContacts } from '~/modules/adminContacts/sagas';
import { watchAdminDashboard } from '~/modules/adminDashboard/sagas';
import { watchAdminProfile } from '~/modules/adminEditProfile/sagas';
import { watchAdminEmployers } from '~/modules/adminEmployers/sagas';
import { watchAdminLiveJobs } from '~/modules/adminLiveJobs/sagas';
import { watchAdminMessaging } from '~/modules/adminMessaging/sagas';
import { watchAdminMatchedJobsPipeline } from '~/modules/adminPipeline/sagas';
import { watchAdminTimesheet } from '~/modules/adminTimesheet/sagas';
import { watchAdminWhiteboard } from '~/modules/adminWhiteboard/sagas';
import { watchFindJobsSaga } from '~/modules/candidateFindJobs/sagas';
import { watchCandidateProposals } from '~/modules/candidateProposals/sagas';
import { watchCandidateRegistration } from '~/modules/candidateRegistration/sagas';
import { watchCandidateTimesheet } from '~/modules/candidateTimesheet/sagas';
import { watchCommon } from '~/modules/common/sagas';
import { watchCompany } from '~/modules/companies/sagas';
import { watchCompanyCandidates } from '~/modules/companyCandidates/sagas';
import { watchCompanyProfile } from '~/modules/companyEditProfile/sagas';
import { watchCompanyInterestedIn } from '~/modules/companyInterested/sagas';
import { watchCompanyInterviews } from '~/modules/companyInterviews/sagas';
import { watchCompanyJobs } from '~/modules/companyJobs/sagas';
import { watchMyJobs } from '~/modules/companyMyJobs/sagas';
import { watchCompanyRegistration } from '~/modules/companyRegistration/sagas';
import { watchCompanyTimesheet } from '~/modules/companyTimesheet/sagas';
import { watchCreateCandidate } from '~/modules/createCandidate/sagas';
import { watchCreateEmployer } from '~/modules/createEmployer/sagas';
import { watchCreateJob } from '~/modules/createJob/sagas';
import { watchAdmins } from '~/modules/manageAdmins/sagas';
import { watchNotifications } from '~/modules/notifications/sagas';
import { watchShortList } from '~/modules/shortlist/sagas';
import { watchUser } from '~/modules/user/sagas';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function* rootSaga(): SagaGenerator<any> {
  yield* all([
    watchCommon(),
    watchUser(),
    watchCandidateRegistration(),
    watchCompanyRegistration(),
    watchAdminLiveJobs(),
    watchAdminCandidates(),
    watchAdminEmployers(),
    watchCreateJob(),
    watchCreateCandidate(),
    watchAdminContacts(),
    watchAdminMatchedJobsPipeline(),
    watchCreateEmployer(),
    watchCandidateProposals(),
    watchCompanyInterviews(),
    watchAdminProfile(),
    watchFindJobsSaga(),
    watchCompanyProfile(),
    watchCompanyCandidates(),
    watchShortList(),
    watchCompanyTimesheet(),
    watchAdminDashboard(),
    watchCompanyJobs(),
    watchCandidateTimesheet(),
    watchMyJobs(),
    watchCompany(),
    watchNotifications(),
    watchAdmins(),
    watchAdminMessaging(),
    watchAdminAssigned(),
    watchCompanyInterestedIn(),
    watchAdminTimesheet(),
    watchAdminWhiteboard(),
  ]);
}
