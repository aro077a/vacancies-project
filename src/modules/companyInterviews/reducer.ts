import { createReducer } from 'deox';
import produce from 'immer';

import { MatchedJobSteps } from '~/models/common';

import {
  addCandidateToShortList,
  approveMatchedCandidateContract,
  createFeedbackForCandidate,
  createReplyForFeedback,
  getCompanyMatchedCandidates,
  getContract,
  getMatchedCandidateContract,
  getMatchedCandidateDetail,
  getMatchedCandidateFeedback,
  markConfirmedContract,
  markFeedbackSent,
  resetToInitial,
  setActiveTab,
  setBoards,
  setSelectedMatchedCandidate,
  setSelectedMatchedCandidateFeedback,
  toggleFeedbackModalVisibility,
  toggleNoteModalVisibility,
  updateMatchedCandidateStatus,
} from './actions';
import { CompanyInterviewsState } from './types';

const initialState: CompanyInterviewsState = {
  matchedJobs: [],
  loadingMatchedJobs: false,
  noteModalVisibility: false,
  feedbackModalVisibility: false,
  creatingFeedbackForCandidate: false,
  isAccept: false,
  updatingMatchedCandidateStatus: false,
  selectedMatchedCandidate: null,
  loadingMatchedCandidateDetail: false,
  matchedCandidateOverview: null,
  loadingMatchedCandidateContract: false,
  matchedCandidateContracts: [],
  loadingMatchedCandidateFeedback: false,
  matchedCandidateFeedbacks: [],
  selectedCandidateMatchedFeedback: null,
  feedbackSent: false,
  contractConfirmed: false,
  creatingReply: false,
  approvingMatchedCandidateContract: false,
  gettingContract: false,
  contractFile: null,
  boards: {
    '1': {
      id: 1,
      title: 'Matched candidates',
      items: [],
      label: 'offers',
      icon: 'puzzle',
    },
    '2': {
      id: 2,
      title: 'Candidates interview',
      items: [],
      label: 'vacancies',
      icon: 'checkmark-in-circle',
    },
    '4': {
      id: 4,
      title: 'Placement approved',
      items: [],
      label: 'approved',
      icon: 'bag-with-checkmark',
    },
  },
  activeTab: 1,
  addingToShortList: false,
};

export const companyInterviewsReducer = createReducer(initialState, handle => [
  handle(getCompanyMatchedCandidates.request, state =>
    produce(state, draft => {
      draft.loadingMatchedJobs = true;
    }),
  ),
  handle(getCompanyMatchedCandidates.success, (state, { payload }) =>
    produce(state, draft => {
      draft.matchedJobs = payload.data;
      if (draft.matchedJobs.length) {
        draft.matchedJobs.forEach(job => {
          switch (job.step) {
            case MatchedJobSteps.SentToEmployee:
              draft.boards['1'].items.push(job);
              break;
            case MatchedJobSteps.InterviewArranged:
              draft.boards['2'].items.push(job);
              break;
            case MatchedJobSteps.AcceptedByEmployee:
              draft.boards['2'].items.push(job);
              break;
            case MatchedJobSteps.PlacementApproved:
              draft.boards['4'].items.push(job);
              break;
            case MatchedJobSteps.Completed:
              draft.boards['4'].items.push(job);
              break;
            case MatchedJobSteps.WaitingForApproval:
              draft.boards['4'].items.push(job);
              break;
            case MatchedJobSteps.TemporaryWorkers:
              draft.boards['4'].items.push(job);
              break;
            default:
              break;
          }
        });
      }
      draft.loadingMatchedJobs = false;
    }),
  ),
  handle(getCompanyMatchedCandidates.fail, state =>
    produce(state, draft => {
      draft.loadingMatchedJobs = false;
    }),
  ),
  handle(setBoards, (state, { payload }) =>
    produce(state, draft => {
      draft.boards = payload;
    }),
  ),
  handle(toggleNoteModalVisibility, (state, { payload }) =>
    produce(state, draft => {
      draft.isAccept = payload;
      draft.noteModalVisibility = !draft.noteModalVisibility;
    }),
  ),
  handle(updateMatchedCandidateStatus.request, state =>
    produce(state, draft => {
      draft.updatingMatchedCandidateStatus = true;
    }),
  ),
  handle(updateMatchedCandidateStatus.success, state =>
    produce(state, draft => {
      draft.updatingMatchedCandidateStatus = false;
    }),
  ),
  handle(updateMatchedCandidateStatus.fail, state =>
    produce(state, draft => {
      draft.updatingMatchedCandidateStatus = false;
    }),
  ),
  handle(setSelectedMatchedCandidate, (state, { payload }) =>
    produce(state, draft => {
      draft.selectedMatchedCandidate = payload;
      if (payload === null) {
        draft.matchedCandidateOverview = null;
        draft.matchedCandidateContracts = [];
        draft.matchedCandidateFeedbacks = [];
      }
    }),
  ),
  handle(toggleFeedbackModalVisibility, state =>
    produce(state, draft => {
      draft.feedbackModalVisibility = !draft.feedbackModalVisibility;
    }),
  ),
  handle(createFeedbackForCandidate.request, state =>
    produce(state, draft => {
      draft.creatingFeedbackForCandidate = true;
    }),
  ),
  handle(createFeedbackForCandidate.success, state =>
    produce(state, draft => {
      draft.creatingFeedbackForCandidate = false;
    }),
  ),
  handle(createFeedbackForCandidate.fail, state =>
    produce(state, draft => {
      draft.creatingFeedbackForCandidate = false;
    }),
  ),
  handle(getMatchedCandidateDetail.request, state =>
    produce(state, draft => {
      draft.loadingMatchedCandidateDetail = true;
    }),
  ),
  handle(getMatchedCandidateDetail.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingMatchedCandidateDetail = false;
      draft.matchedCandidateOverview = payload.data;
    }),
  ),
  handle(getMatchedCandidateDetail.fail, state =>
    produce(state, draft => {
      draft.loadingMatchedCandidateDetail = false;
    }),
  ),
  handle(getMatchedCandidateContract.request, state =>
    produce(state, draft => {
      draft.loadingMatchedCandidateContract = true;
    }),
  ),
  handle(getMatchedCandidateContract.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingMatchedCandidateContract = false;
      draft.matchedCandidateContracts = payload.data;
    }),
  ),
  handle(getMatchedCandidateContract.fail, state =>
    produce(state, draft => {
      draft.loadingMatchedCandidateContract = false;
    }),
  ),
  handle(getMatchedCandidateFeedback.request, state =>
    produce(state, draft => {
      draft.loadingMatchedCandidateFeedback = true;
    }),
  ),
  handle(getMatchedCandidateFeedback.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingMatchedCandidateFeedback = false;
      draft.matchedCandidateFeedbacks = payload;
    }),
  ),
  handle(getMatchedCandidateFeedback.fail, state =>
    produce(state, draft => {
      draft.loadingMatchedCandidateFeedback = false;
    }),
  ),
  handle(setSelectedMatchedCandidateFeedback, (state, { payload }) =>
    produce(state, draft => {
      draft.selectedCandidateMatchedFeedback = payload;
    }),
  ),
  handle(markFeedbackSent, (state, { payload }) =>
    produce(state, draft => {
      draft.feedbackSent = payload;
    }),
  ),
  handle(markConfirmedContract, (state, { payload }) =>
    produce(state, draft => {
      draft.contractConfirmed = payload;
    }),
  ),
  handle(createReplyForFeedback.request, state =>
    produce(state, draft => {
      draft.creatingReply = true;
    }),
  ),
  handle(createReplyForFeedback.success, (state, { payload }) =>
    produce(state, draft => {
      draft.creatingReply = false;
      if (draft.selectedCandidateMatchedFeedback) {
        draft.selectedCandidateMatchedFeedback.replies = [
          ...draft.selectedCandidateMatchedFeedback.replies,
          payload.data,
        ];
      }
    }),
  ),
  handle(createReplyForFeedback.fail, state =>
    produce(state, draft => {
      draft.creatingReply = false;
    }),
  ),
  handle(approveMatchedCandidateContract.request, state =>
    produce(state, draft => {
      draft.approvingMatchedCandidateContract = true;
    }),
  ),
  handle(approveMatchedCandidateContract.success, (state, { payload }) =>
    produce(state, draft => {
      if (payload.data) {
        const newArr = draft.matchedCandidateContracts
          .filter(contract => contract.id !== payload.data.id)
          .map(contract => contract);
        draft.matchedCandidateContracts = [payload.data, ...newArr];
      }
      draft.approvingMatchedCandidateContract = false;
    }),
  ),
  handle(approveMatchedCandidateContract.fail, state =>
    produce(state, draft => {
      draft.approvingMatchedCandidateContract = false;
    }),
  ),
  handle(setActiveTab, (state, { payload }) =>
    produce(state, draft => {
      draft.activeTab = payload;
    }),
  ),
  handle(resetToInitial, state =>
    produce(state, draft => {
      draft.activeTab = 1;
      Object.assign(draft.matchedJobs, initialState.matchedJobs);
      Object.assign(draft.boards, initialState.boards);
    }),
  ),
  handle(getContract.request, state =>
    produce(state, draft => {
      draft.gettingContract = true;
    }),
  ),
  handle(getContract.success, (state, { payload }) =>
    produce(state, draft => {
      draft.contractFile = payload;
      draft.gettingContract = false;
    }),
  ),
  handle(getContract.fail, state =>
    produce(state, draft => {
      draft.gettingContract = false;
    }),
  ),
  handle(addCandidateToShortList.request, state =>
    produce(state, draft => {
      draft.addingToShortList = true;
    }),
  ),
  handle(addCandidateToShortList.success, (state, { payload }) =>
    produce(state, draft => {
      if (draft.matchedCandidateOverview) {
        draft.matchedCandidateOverview = {
          ...draft.matchedCandidateOverview,
          shortlist: payload.data.shortlist,
        };
      }
    }),
  ),
  handle(addCandidateToShortList.fail, state =>
    produce(state, draft => {
      draft.addingToShortList = false;
    }),
  ),
]);
