import { ActionType, getType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { call, delay, put, takeLatest } from 'typed-redux-saga';

import { AdminNotification } from '~/models/admin';
import { CandidateNotification, TabsType as CandidateTabsType } from '~/models/candidate';
import { CompanyNotification, TabsType as CompanyTabsType } from '~/models/company';
import {
  getCandidateFeedbackReplies,
  toggleThreadModalVisibility as toggleCandidateThreadModalVisibility,
} from '~/modules/adminCandidates/actions';
import {
  setEmployerDetails,
  toggleEmployerModalVisibility,
} from '~/modules/adminEmployers/actions';
import {
  getLiveJobFeedbackReplies,
  setSelectedLiveJob,
  toggleJobModalVisibility,
  toggleThreadModalVisibility as toggleJobThreadModalVisibility,
} from '~/modules/adminLiveJobs/actions';
import { setActiveTab as setCandidateActiveTab } from '~/modules/candidateProposals/actions';
import {
  setSelectedCandidateTimesheetId,
  toggleCandidateTimesheetModal,
} from '~/modules/candidateTimesheet/actions';
import { setActiveTab as setCompanyActiveTab } from '~/modules/companyInterviews/actions';
import { setSelectedTimesheetId, toggleTimesheetModal } from '~/modules/companyTimesheet/actions';
import { Admin } from '~/services/api/Admin';
import { Common } from '~/services/api/Common';
import { AdminRouter, CandidateRouter, CompanyRouter } from '~/utils/router';

import {
  deleteNotifications,
  getNotifications,
  getNotificationsCount,
  reviewNotification,
  toggleNotificationModalVisibility,
  updateNotificationStatus,
} from './actions';

function* getNotificationsSaga({
  payload,
}: ActionType<typeof getNotifications.request>): SagaIterator {
  try {
    if (typeof payload === 'number') {
      const requestParams = {
        limit: 5,
        offset: payload > 1 ? (payload - 1) * 5 : 0,
      };

      const { data } = yield* call(Common.getNotifications, requestParams);

      yield* put(getNotifications.success(data));
    }
  } catch (error) {
    yield* put(getNotifications.fail());
  }
}

function* updateNotificationStatusSaga({
  payload,
}: ActionType<typeof updateNotificationStatus.request>): SagaIterator {
  try {
    yield* call(Common.updateNotificationStatus, payload, { isNew: false });

    yield* put(updateNotificationStatus.success());
  } catch (error) {
    yield* put(updateNotificationStatus.fail());
  }
}

function* getNotificationsCountSaga(): SagaIterator {
  try {
    const timer = 1000 * 60 * 5;

    while (true) {
      const { data } = yield* call(Common.getNotificationsCount);

      yield* put(getNotificationsCount.success(data));
      yield* delay(timer);
    }
  } catch (error) {
    yield* put(getNotificationsCount.fail());
  }
}

function* reviewNotificationSaga({
  payload,
}: ActionType<typeof reviewNotification.request>): SagaIterator {
  try {
    const { historyPush, id, typeId } = payload;

    switch (typeId) {
      case AdminNotification.NewCompany: {
        historyPush(AdminRouter.pendingEmployers);
        const { data } = yield* call(Admin.getEmployerDetailsId, { id });

        yield* put(setEmployerDetails(data));
        yield* put(toggleNotificationModalVisibility());
        yield* put(toggleEmployerModalVisibility());

        yield* put(reviewNotification.success());
        break;
      }
      case AdminNotification.NewJob: {
        historyPush(AdminRouter.liveJobs);
        const { data } = yield* call(Admin.getLiveJob, id);

        yield* put(setSelectedLiveJob(data.data));
        yield* put(toggleNotificationModalVisibility());
        yield* put(toggleJobModalVisibility());

        yield* put(reviewNotification.success());
        break;
      }
      case AdminNotification.CandidateAgreedToMatch: {
        historyPush(AdminRouter.pipeline);

        yield* put(toggleNotificationModalVisibility());

        // Temporary solution. Do it prettier

        yield* delay(2000);

        const card = document.getElementById(`${id}`);

        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        yield* delay(1000);

        card?.classList.add('bounce');

        yield* delay(2000);

        card?.classList.remove('bounce');

        yield* put(reviewNotification.success());
        break;
      }
      case AdminNotification.CompanyAgreedToMatch: {
        historyPush(AdminRouter.pipeline);

        yield* put(toggleNotificationModalVisibility());

        // Temporary solution. Do it prettier

        yield* delay(2000);

        const card = document.getElementById(`${id}`);

        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        yield* delay(1000);

        card?.classList.add('bounce');

        yield* delay(2000);

        card?.classList.remove('bounce');

        yield* put(reviewNotification.success());
        break;
      }
      case AdminNotification.NewFeedbackFromCandidate: {
        historyPush(AdminRouter.liveJobs);

        const { data } = yield* call(Admin.getLiveJobFeedbackReplies, {
          id,
        });

        yield* put(getLiveJobFeedbackReplies.success(data));

        yield* put(toggleNotificationModalVisibility());

        yield* put(toggleJobThreadModalVisibility());

        yield* put(reviewNotification.success());
        break;
      }
      case AdminNotification.NewReplyFromCandidate: {
        historyPush(AdminRouter.liveJobs);

        const { data } = yield* call(Admin.getLiveJobFeedbackReplies, {
          id,
        });

        yield* put(getLiveJobFeedbackReplies.success(data));

        yield* put(toggleNotificationModalVisibility());

        yield* put(toggleJobThreadModalVisibility());

        yield* put(reviewNotification.success());
        break;
      }
      case AdminNotification.NewFeedbackFromCompany: {
        historyPush(AdminRouter.candidates);

        const { data } = yield* call(Admin.getCandidateFeedbackReplies, {
          feedbackId: id,
        });

        yield* put(getCandidateFeedbackReplies.success(data));

        yield* put(toggleNotificationModalVisibility());

        yield* put(toggleCandidateThreadModalVisibility());

        yield* put(reviewNotification.success());
        break;
      }
      case AdminNotification.NewReplyFromCompany: {
        historyPush(AdminRouter.candidates);

        const { data } = yield* call(Admin.getCandidateFeedbackReplies, {
          feedbackId: id,
        });

        yield* put(getCandidateFeedbackReplies.success(data));

        yield* put(toggleNotificationModalVisibility());

        yield* put(toggleCandidateThreadModalVisibility());

        yield* put(reviewNotification.success());
        break;
      }
      case AdminNotification.CompanyApprovedContract: {
        historyPush(AdminRouter.pipeline);
        yield* put(toggleNotificationModalVisibility());

        // Temporary solution. Do it prettier

        yield* delay(2000);

        const card = document.getElementById(`${id}`);

        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        yield* delay(1000);

        card?.classList.add('bounce');

        yield* delay(2000);

        card?.classList.remove('bounce');

        yield* put(reviewNotification.success());
        break;
      }
      case AdminNotification.CandidateApprovedContract: {
        historyPush(AdminRouter.pipeline);
        yield* put(toggleNotificationModalVisibility());

        // Temporary solution. Do it prettier

        yield* delay(2000);

        const card = document.getElementById(`${id}`);

        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        yield* delay(1000);

        card?.classList.add('bounce');

        yield* delay(2000);

        card?.classList.remove('bounce');

        yield* put(reviewNotification.success());
        break;
      }
      case AdminNotification.NewTaskAdded:
        historyPush(AdminRouter.dashboard);
        yield* put(toggleNotificationModalVisibility());

        yield* put(reviewNotification.success());
        break;
      case AdminNotification.TaskCompleted:
        historyPush(AdminRouter.dashboard);
        yield* put(toggleNotificationModalVisibility());

        yield* put(reviewNotification.success());
        break;
      case CompanyNotification.NewMatchedNotification:
        historyPush(CompanyRouter.interviews);

        yield* put(toggleNotificationModalVisibility());

        yield* put(setCompanyActiveTab(CompanyTabsType.Matched));

        yield* put(reviewNotification.success());

        break;
      case CompanyNotification.NewInterviewNotification:
        historyPush(CompanyRouter.interviews);

        yield* put(toggleNotificationModalVisibility());

        yield* put(setCompanyActiveTab(CompanyTabsType.ArrangeInterview));

        yield* put(reviewNotification.success());

        break;
      case CompanyNotification.NewTimesheet: {
        historyPush(CompanyRouter.timesheet);

        yield* put(toggleNotificationModalVisibility());

        yield* put(setSelectedTimesheetId(id));

        yield* put(toggleTimesheetModal());

        yield* put(reviewNotification.success());

        break;
      }
      case CompanyNotification.NewContract:
        historyPush(CompanyRouter.interviews);

        yield* put(toggleNotificationModalVisibility());

        yield* put(setCompanyActiveTab(CompanyTabsType.PlacementApproved));

        yield* put(reviewNotification.success());

        break;
      case CompanyNotification.LeaveFeedbackNotification:
        historyPush(CompanyRouter.interviews);

        yield* put(toggleNotificationModalVisibility());

        yield* put(setCompanyActiveTab(CompanyTabsType.InterviewedCandidates));

        yield* put(reviewNotification.success());
        break;
      case CompanyNotification.NewReplyNotification:
        historyPush(CompanyRouter.interviews);

        yield* put(toggleNotificationModalVisibility());

        yield* put(setCompanyActiveTab(CompanyTabsType.InterviewedCandidates));

        yield* put(reviewNotification.success());
        break;
      case CandidateNotification.NewOfferNotification:
        historyPush(CandidateRouter.proposals);

        yield* put(toggleNotificationModalVisibility());

        yield* put(setCandidateActiveTab(CandidateTabsType.NewOffers));

        yield* put(reviewNotification.success());
        break;
      case CandidateNotification.OfferClosedNotification:
        historyPush(CandidateRouter.proposals);

        yield* put(toggleNotificationModalVisibility());

        yield* put(setCandidateActiveTab(CandidateTabsType.NewOffers));

        yield* put(reviewNotification.success());
        break;
      case CandidateNotification.NewInterviewNotification:
        historyPush(CandidateRouter.proposals);

        yield* put(toggleNotificationModalVisibility());

        yield* put(setCandidateActiveTab(CandidateTabsType.Interviews));

        yield* put(reviewNotification.success());
        break;
      case CandidateNotification.LeaveFeedbackNotification:
        historyPush(CandidateRouter.proposals);

        yield* put(toggleNotificationModalVisibility());

        yield* put(setCandidateActiveTab(CandidateTabsType.Interviews));

        yield* put(reviewNotification.success());
        break;
      case CandidateNotification.NewContractNotification:
        historyPush(CandidateRouter.proposals);

        yield* put(toggleNotificationModalVisibility());

        yield* put(setCandidateActiveTab(CandidateTabsType.PlacementApproved));

        yield* put(reviewNotification.success());
        break;
      case CandidateNotification.TimesheetApproved:
        historyPush(CandidateRouter.timesheet);

        yield* put(toggleNotificationModalVisibility());

        yield* put(setSelectedCandidateTimesheetId(id));

        yield* put(toggleCandidateTimesheetModal());

        yield* put(reviewNotification.success());
        break;
      case CandidateNotification.TimesheetDeclined:
        historyPush(CandidateRouter.timesheet);

        yield* put(toggleNotificationModalVisibility());

        yield* put(setSelectedCandidateTimesheetId(id));

        yield* put(toggleCandidateTimesheetModal());

        yield* put(reviewNotification.success());
        break;
      case CandidateNotification.NewReplyNotification:
        historyPush(CandidateRouter.proposals);

        yield* put(setCandidateActiveTab(CandidateTabsType.Interviews));

        yield* put(toggleNotificationModalVisibility());

        yield* put(reviewNotification.success());
        break;
      default:
        break;
    }
  } catch (error) {
    yield* put(reviewNotification.fail());
  }
}

function* deleteNotificationsSaga(): SagaIterator {
  try {
    yield* call(Common.deleteNotifications);

    yield* put(deleteNotifications.success());
  } catch (error) {
    yield* put(deleteNotifications.fail());
  }
}

export function* watchNotifications(): SagaIterator {
  yield* takeLatest(getType(getNotifications.request), getNotificationsSaga);
  yield* takeLatest(getType(updateNotificationStatus.request), updateNotificationStatusSaga);
  yield* takeLatest(getType(getNotificationsCount.request), getNotificationsCountSaga);
  yield* takeLatest(getType(reviewNotification.request), reviewNotificationSaga);
  yield* takeLatest(getType(deleteNotifications.request), deleteNotificationsSaga);
}
