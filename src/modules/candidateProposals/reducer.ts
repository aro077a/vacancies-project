import { createReducer } from 'deox';
import produce from 'immer';

import { MatchedJobSteps } from '~/models/common';

import {
  approveMatchedJobContract,
  createFeedbackForJob,
  createReplyForFeedback,
  getCandidateMatchedJobs,
  getContract,
  getMatchedJobContracts,
  getMatchedJobDetail,
  getMatchedJobFeedback,
  resetToInitial,
  setActiveTab,
  setBoards,
  setSelectedMatchedJob,
  toggleFeedbackModalVisibility,
  toggleReviewContractModalVisibility,
  updateCandidateMatchedJob,
} from './actions';
import { CandidateProposalsState } from './types';

const initialState: CandidateProposalsState = {
  candidateMatchedJobs: [],
  loadingCandidateMatchedJobs: false,
  updatingMatchedJobStatus: false,
  feedbackModalVisibility: false,
  reviewContractModalVisibility: false,
  creatingFeedbackForJob: false,
  selectedMatchedJob: null,
  loadingMatchedJobDetail: false,
  matchedJobDetail: null,
  loadingMatchedJobContracts: false,
  matchedJobContracts: null,
  loadingMatchedJobFeedback: false,
  matchedJobFeedback: null,
  approvingMatchedJobContract: false,
  creatingReply: false,
  boards: {
    '1': {
      id: 1,
      title: 'New Companies Interested',
      items: [],
      label: 'offers',
      icon: 'puzzle',
    },
    '2': {
      id: 2,
      title: 'Active vacancies',
      items: [],
      label: 'vacancies',
      icon: 'checkmark-in-circle',
    },
    '3': {
      id: 3,
      title: 'Interviews',
      items: [],
      label: 'interviews',
      icon: 'chat',
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
  gettingContract: false,
  contract: null,
};

export const candidateProposalsReducer = createReducer(initialState, handle => [
  handle(getCandidateMatchedJobs.request, state =>
    produce(state, draft => {
      draft.loadingCandidateMatchedJobs = true;
    }),
  ),
  handle(getCandidateMatchedJobs.success, (state, { payload }) =>
    produce(state, draft => {
      draft.candidateMatchedJobs = payload.data;
      if (draft.candidateMatchedJobs.length) {
        draft.candidateMatchedJobs.forEach(job => {
          switch (job.step) {
            case MatchedJobSteps.CandidateMatched:
              draft.boards['1'].items.push(job);
              break;
            case MatchedJobSteps.AgreedByCandidate:
              draft.boards['2'].items.push(job);
              break;
            case MatchedJobSteps.SentToEmployee:
              draft.boards['2'].items.push(job);
              break;
            case MatchedJobSteps.AcceptedByEmployee:
              draft.boards['2'].items.push(job);
              break;
            case MatchedJobSteps.InterviewArranged:
              draft.boards['3'].items.push(job);
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
      draft.loadingCandidateMatchedJobs = false;
    }),
  ),
  handle(getCandidateMatchedJobs.fail, state =>
    produce(state, draft => {
      draft.loadingCandidateMatchedJobs = false;
    }),
  ),
  handle(updateCandidateMatchedJob.request, state =>
    produce(state, draft => {
      draft.updatingMatchedJobStatus = true;
    }),
  ),
  handle(updateCandidateMatchedJob.success, state =>
    produce(state, draft => {
      draft.updatingMatchedJobStatus = false;
    }),
  ),
  handle(updateCandidateMatchedJob.fail, state =>
    produce(state, draft => {
      draft.updatingMatchedJobStatus = false;
    }),
  ),
  handle(setBoards, (state, { payload }) =>
    produce(state, draft => {
      draft.boards = payload;
    }),
  ),
  handle(toggleFeedbackModalVisibility, state =>
    produce(state, draft => {
      draft.feedbackModalVisibility = !draft.feedbackModalVisibility;
    }),
  ),
  handle(createFeedbackForJob.request, state =>
    produce(state, draft => {
      draft.creatingFeedbackForJob = true;
    }),
  ),
  handle(createFeedbackForJob.success, state =>
    produce(state, draft => {
      draft.creatingFeedbackForJob = false;
    }),
  ),
  handle(createFeedbackForJob.fail, state =>
    produce(state, draft => {
      draft.creatingFeedbackForJob = false;
    }),
  ),
  handle(setSelectedMatchedJob, (state, { payload }) =>
    produce(state, draft => {
      draft.selectedMatchedJob = payload;
      if (payload === null) {
        draft.matchedJobDetail = null;
        draft.matchedJobFeedback = null;
        draft.matchedJobContracts = null;
      }
    }),
  ),
  handle(getMatchedJobDetail.request, state =>
    produce(state, draft => {
      draft.loadingMatchedJobDetail = true;
    }),
  ),
  handle(getMatchedJobDetail.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingMatchedJobDetail = false;
      draft.matchedJobDetail = payload.data;
    }),
  ),
  handle(getMatchedJobDetail.fail, state =>
    produce(state, draft => {
      draft.loadingMatchedJobDetail = false;
    }),
  ),
  handle(getMatchedJobContracts.request, state =>
    produce(state, draft => {
      draft.loadingMatchedJobContracts = true;
    }),
  ),
  handle(getMatchedJobContracts.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingMatchedJobContracts = false;
      draft.matchedJobContracts = payload.data;
    }),
  ),
  handle(getMatchedJobContracts.fail, state =>
    produce(state, draft => {
      draft.loadingMatchedJobContracts = false;
    }),
  ),
  handle(getMatchedJobFeedback.request, state =>
    produce(state, draft => {
      draft.loadingMatchedJobFeedback = true;
    }),
  ),
  handle(getMatchedJobFeedback.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingMatchedJobFeedback = false;
      draft.matchedJobFeedback = payload.data;
    }),
  ),
  handle(getMatchedJobFeedback.fail, state =>
    produce(state, draft => {
      draft.loadingMatchedJobFeedback = false;
    }),
  ),
  handle(approveMatchedJobContract.request, state =>
    produce(state, draft => {
      draft.approvingMatchedJobContract = true;
    }),
  ),
  handle(approveMatchedJobContract.success, (state, { payload }) =>
    produce(state, draft => {
      draft.matchedJobContracts = payload.data;
      draft.approvingMatchedJobContract = false;
    }),
  ),
  handle(approveMatchedJobContract.fail, state =>
    produce(state, draft => {
      draft.approvingMatchedJobContract = false;
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
      if (draft.matchedJobFeedback) {
        draft.matchedJobFeedback.replies = [...draft.matchedJobFeedback.replies, payload.data];
      }
    }),
  ),
  handle(createReplyForFeedback.fail, state =>
    produce(state, draft => {
      draft.creatingReply = false;
    }),
  ),
  handle(toggleReviewContractModalVisibility, state =>
    produce(state, draft => {
      draft.reviewContractModalVisibility = !draft.reviewContractModalVisibility;
    }),
  ),
  handle(setActiveTab, (state, { payload }) =>
    produce(state, draft => {
      draft.activeTab = payload;
    }),
  ),
  handle(resetToInitial, state =>
    produce(state, draft => {
      Object.assign(draft.candidateMatchedJobs, initialState.candidateMatchedJobs);
      Object.assign(draft.boards, initialState.boards);
      draft.activeTab = 1;
    }),
  ),
  handle(getContract.request, state =>
    produce(state, draft => {
      draft.gettingContract = true;
    }),
  ),
  handle(getContract.success, (state, { payload }) =>
    produce(state, draft => {
      draft.contract = payload;
      draft.gettingContract = false;
    }),
  ),
  handle(getContract.fail, state =>
    produce(state, draft => {
      draft.gettingContract = false;
    }),
  ),
]);
