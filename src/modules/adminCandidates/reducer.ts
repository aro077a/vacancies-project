import { createReducer } from 'deox';
import produce from 'immer';

import {
  addCandidateRecord,
  deleteCandidate,
  deleteCandidateRecord,
  downloadCandidateCV,
  getCandidateAdditionalInfo,
  getCandidateFeedbackReplies,
  getCandidateFeedbacks,
  getCandidateInterestedJobs,
  getCandidateJobsMatched,
  getCandidateOverview,
  getCandidatePotentialJobs,
  getCandidateRecord,
  getCandidates,
  getCandidateVideoInterview,
  getJobsShowedInterestInCandidate,
  getPendingApprovalCount,
  navigateFromContacts,
  resetCandidateFilters,
  resetPotentialJobFilters,
  sendCandidateFeedbackReply,
  setAvailability,
  setCandidatesSearchWithFilters,
  setCandidateStatus,
  setCity,
  setFiltersForPotentialJobs,
  setPermissionType,
  setPosition,
  setProjectType,
  setProjectValue,
  setRecordEditMode,
  setRegion,
  setSalary,
  setSearchValue,
  setSelectedCandidate,
  setSelectedCandidateFeedback,
  setSelectedCandidateId,
  setSelectedJob,
  setSelectedJobGrop,
  setSelectedRecordId,
  toggleThreadModalVisibility,
  updateCandidateJobMatched,
  updateCandidateRecord,
  updateCandidateStatus,
} from './actions';
import { CandidatesState } from './types';

const initialState: CandidatesState = {
  candidates: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  searchSelectedJobs: [],
  loadingCandidates: false,
  loadingCandidateJobsMatched: false,
  candidateJobsMatched: [],
  selectedCandidate: null,
  loadingCandidateOverview: false,
  candidateOverview: null,
  loadingJobsInterestedInCandidate: false,
  jobsInterestedInCandidate: [],
  loadingCandidateInterestedJobs: false,
  candidateInterestedJobs: [],
  loadingPotentialCandidateJobs: false,
  potentialCandidateJobs: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  updatingCandidateJobMatched: false,
  loadingCandidateAdditionalInfo: false,
  candidateAdditionalInfo: null,
  candidateSearchValue: '',
  candidateSearchJobType: 0,
  updateCandidateStatusLoading: false,
  candidateFeedbacks: [],
  loadingCandidateFeedbacks: false,
  selectedCandidateFeedbackReplies: null,
  loadingSelectedCandidateFeedbackReplies: false,
  selectedCandidateFeedback: null,
  sendingCandidateFeedbackReply: false,
  loadingCandidateRecord: false,
  updatingCandidateRecord: false,
  candidateRecords: [],
  deletingCandidateRecord: false,
  potentialSearchValue: '',
  pendingApprovalCount: 0,
  gettingPendingCandidates: false,
  threadModalVisibility: false,
  downloadingCandidateCV: false,
  searchCandidateRegionFilter: {
    label: 'Region',
    value: 0,
  },
  searchCandidateCityFilter: {
    label: 'City',
    value: 0,
  },
  searchCandidateJobType: {
    label: 'Job type',
    value: 0,
  },
  searchCandidateByProjectType: {
    label: 'Project type',
    value: 0,
  },
  searchCandidateByProjectValue: {
    label: 'Project value',
    value: 0,
  },
  searchCandidateByPermission: {
    label: 'Position type',
    value: 0,
  },
  searchCandidateByStatus: {
    value: 0,
    label: 'Looking for job status',
  },
  searchCandidateByAvailability: [],
  searchCandidateKeyWord: '',
  searchCandidateSalaryGte: '',
  searchCandidateSalaryLte: '',
  addCandidateRecordLoading: false,
  selectedRecordId: 0,
  editMode: false,
  deletingCandidate: false,
  selectedCandidateId: 0,
  navigateFromContactsToCandidates: false,
  candidateVideoInterview: null,
  loadingCandidateVideoInterview: false,
  searchSelectedJobGroups: [],
};

export const adminCandidatesReducer = createReducer(initialState, handle => [
  handle(getCandidates.init, (state, { payload }) =>
    produce(state, draft => {
      if (payload.initialFetch) {
        Object.assign(draft.candidates, initialState.candidates);
      }
    }),
  ),
  handle(getCandidates.request, state =>
    produce(state, draft => {
      draft.loadingCandidates = true;
    }),
  ),
  handle(getCandidates.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingCandidates = false;
      draft.candidates = {
        ...payload.data,
        results: draft.candidates.results.concat(payload.data.results),
      };
    }),
  ),
  handle(getCandidates.fail, state =>
    produce(state, draft => {
      draft.loadingCandidates = false;
    }),
  ),
  handle(getCandidateJobsMatched.request, state =>
    produce(state, draft => {
      draft.loadingCandidateJobsMatched = true;
    }),
  ),
  handle(getCandidateJobsMatched.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingCandidateJobsMatched = false;
      draft.candidateJobsMatched = payload.data;
    }),
  ),
  handle(getCandidateJobsMatched.fail, state =>
    produce(state, draft => {
      draft.loadingCandidateJobsMatched = false;
    }),
  ),
  handle(setSelectedCandidate, (state, { payload }) =>
    produce(state, draft => {
      draft.selectedCandidate = payload;
      if (payload === null) {
        draft.candidateJobsMatched = [];
        draft.candidateOverview = null;
        draft.jobsInterestedInCandidate = [];
        draft.candidateInterestedJobs = [];
      }
    }),
  ),
  handle(getCandidateOverview.request, state =>
    produce(state, draft => {
      draft.loadingCandidateOverview = true;
    }),
  ),
  handle(getCandidateOverview.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingCandidateOverview = false;
      draft.candidateOverview = payload.data;
    }),
  ),
  handle(getCandidateOverview.fail, state =>
    produce(state, draft => {
      draft.loadingCandidateOverview = false;
    }),
  ),
  handle(getCandidateVideoInterview.request, state =>
    produce(state, draft => {
      draft.loadingCandidateVideoInterview = true;
    }),
  ),
  handle(getCandidateVideoInterview.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingCandidateVideoInterview = false;
      draft.candidateVideoInterview = payload.data;
    }),
  ),
  handle(getCandidateVideoInterview.fail, state =>
    produce(state, draft => {
      draft.candidateVideoInterview = null;
      draft.loadingCandidateVideoInterview = false;
    }),
  ),
  handle(getJobsShowedInterestInCandidate.request, state =>
    produce(state, draft => {
      draft.loadingJobsInterestedInCandidate = true;
    }),
  ),
  handle(getJobsShowedInterestInCandidate.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingJobsInterestedInCandidate = false;
      draft.jobsInterestedInCandidate = payload.data;
    }),
  ),
  handle(getJobsShowedInterestInCandidate.fail, state =>
    produce(state, draft => {
      draft.loadingJobsInterestedInCandidate = false;
    }),
  ),
  handle(getCandidateInterestedJobs.request, state =>
    produce(state, draft => {
      draft.loadingCandidateInterestedJobs = true;
    }),
  ),
  handle(getCandidateInterestedJobs.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingCandidateInterestedJobs = false;
      draft.candidateInterestedJobs = payload.data;
    }),
  ),
  handle(getCandidateInterestedJobs.fail, state =>
    produce(state, draft => {
      draft.loadingCandidateInterestedJobs = false;
    }),
  ),
  handle(getCandidatePotentialJobs.request, state =>
    produce(state, draft => {
      draft.loadingPotentialCandidateJobs = true;
    }),
  ),
  handle(getCandidatePotentialJobs.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingPotentialCandidateJobs = false;
      draft.potentialCandidateJobs = {
        ...payload.data,
        results: draft.potentialCandidateJobs.results.concat(payload.data.results),
      };
    }),
  ),
  handle(getCandidatePotentialJobs.fail, state =>
    produce(state, draft => {
      draft.loadingPotentialCandidateJobs = false;
    }),
  ),
  handle(updateCandidateJobMatched.request, state =>
    produce(state, draft => {
      draft.updatingCandidateJobMatched = true;
    }),
  ),
  handle(updateCandidateJobMatched.success, state =>
    produce(state, draft => {
      draft.updatingCandidateJobMatched = false;
    }),
  ),
  handle(updateCandidateJobMatched.fail, state =>
    produce(state, draft => {
      draft.updatingCandidateJobMatched = false;
    }),
  ),
  handle(getCandidateAdditionalInfo.request, state =>
    produce(state, draft => {
      draft.loadingCandidateAdditionalInfo = true;
    }),
  ),
  handle(getCandidateAdditionalInfo.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingCandidateAdditionalInfo = false;
      draft.candidateAdditionalInfo = payload.data;
    }),
  ),
  handle(getCandidateAdditionalInfo.fail, state =>
    produce(state, draft => {
      draft.loadingCandidateAdditionalInfo = false;
    }),
  ),
  handle(setCandidatesSearchWithFilters, (state, { payload }) =>
    produce(state, draft => {
      draft.candidateSearchJobType = payload.jobPosition;
      draft.candidateSearchValue = payload.keyWord;
      Object.assign(draft.candidates, initialState.candidates);
    }),
  ),

  handle(updateCandidateStatus.request, state =>
    produce(state, draft => {
      draft.updateCandidateStatusLoading = true;
    }),
  ),
  handle(updateCandidateStatus.success, (state, { payload }) =>
    produce(state, draft => {
      draft.updateCandidateStatusLoading = false;
      draft.candidates.results = draft.candidates.results.filter(
        candidate => candidate.id !== payload.candidateId,
      );
      draft.pendingApprovalCount--;
    }),
  ),
  handle(updateCandidateStatus.fail, state =>
    produce(state, draft => {
      draft.updateCandidateStatusLoading = false;
    }),
  ),
  handle(resetCandidateFilters, state =>
    produce(state, draft => {
      Object.assign(draft, { ...initialState, pendingApprovalCount: draft.pendingApprovalCount });
    }),
  ),
  handle(getCandidateFeedbacks.request, state =>
    produce(state, draft => {
      draft.loadingCandidateFeedbacks = true;
    }),
  ),
  handle(getCandidateFeedbacks.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingCandidateFeedbacks = false;
      draft.candidateFeedbacks = payload.data;
    }),
  ),
  handle(getCandidateFeedbacks.fail, state =>
    produce(state, draft => {
      draft.loadingCandidateFeedbacks = false;
    }),
  ),
  handle(getCandidateFeedbackReplies.request, state =>
    produce(state, draft => {
      draft.loadingSelectedCandidateFeedbackReplies = true;
    }),
  ),
  handle(getCandidateFeedbackReplies.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingSelectedCandidateFeedbackReplies = false;
      draft.selectedCandidateFeedbackReplies = payload.data;
    }),
  ),
  handle(getCandidateFeedbackReplies.fail, state =>
    produce(state, draft => {
      draft.loadingSelectedCandidateFeedbackReplies = false;
    }),
  ),
  handle(sendCandidateFeedbackReply.request, state =>
    produce(state, draft => {
      draft.sendingCandidateFeedbackReply = true;
    }),
  ),
  handle(sendCandidateFeedbackReply.success, (state, { payload }) =>
    produce(state, draft => {
      const selectedFeedback = draft.candidateFeedbacks.find(
        feedback => feedback.id === draft.selectedCandidateFeedback?.id,
      );

      if (selectedFeedback) {
        selectedFeedback.repliesCount += 1;
        selectedFeedback.latestReplyDate = payload.data.addedAt;
      }

      draft.sendingCandidateFeedbackReply = false;
      draft.selectedCandidateFeedbackReplies?.replies?.push({
        id: payload.data.id,
        name: payload.data.name,
        photo: payload.data.photo,
        addedAt: payload.data.addedAt,
        text: payload.data.text,
        isAdmin: true,
      });
    }),
  ),
  handle(sendCandidateFeedbackReply.fail, state =>
    produce(state, draft => {
      draft.sendingCandidateFeedbackReply = false;
    }),
  ),
  handle(setSelectedCandidateFeedback, (state, { payload }) =>
    produce(state, draft => {
      draft.selectedCandidateFeedback = payload;

      if (payload === null) {
        draft.selectedCandidateFeedbackReplies = null;
      }
    }),
  ),
  handle(getCandidateRecord.request, state =>
    produce(state, draft => {
      draft.loadingCandidateRecord = true;
    }),
  ),
  handle(getCandidateRecord.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingCandidateRecord = false;
      draft.candidateRecords = payload.data;
    }),
  ),
  handle(getCandidateRecord.fail, state =>
    produce(state, draft => {
      draft.loadingCandidateRecord = false;
    }),
  ),
  handle(addCandidateRecord.request, state =>
    produce(state, draft => {
      draft.addCandidateRecordLoading = true;
    }),
  ),
  handle(addCandidateRecord.success, (state, { payload }) =>
    produce(state, draft => {
      draft.addCandidateRecordLoading = false;
      draft.candidateRecords = [...draft.candidateRecords, payload.data];
    }),
  ),
  handle(addCandidateRecord.fail, state =>
    produce(state, draft => {
      draft.addCandidateRecordLoading = false;
    }),
  ),
  handle(updateCandidateRecord.request, state =>
    produce(state, draft => {
      draft.updatingCandidateRecord = true;
    }),
  ),
  handle(updateCandidateRecord.success, (state, { payload }) =>
    produce(state, draft => {
      draft.updatingCandidateRecord = false;
      const updatedCandidateRecord = draft.candidateRecords.findIndex(
        record => record.id === payload?.data?.id,
      );
      draft.candidateRecords[updatedCandidateRecord] = payload?.data;
    }),
  ),
  handle(updateCandidateRecord.fail, state =>
    produce(state, draft => {
      draft.updatingCandidateRecord = false;
    }),
  ),
  handle(deleteCandidateRecord.request, state =>
    produce(state, draft => {
      draft.deletingCandidateRecord = true;
    }),
  ),
  handle(deleteCandidateRecord.success, state =>
    produce(state, draft => {
      draft.deletingCandidateRecord = false;
      draft.candidateRecords = [
        ...draft.candidateRecords.filter(item => item.id !== draft.selectedRecordId),
      ];
    }),
  ),
  handle(deleteCandidateRecord.fail, state =>
    produce(state, draft => {
      draft.deletingCandidateRecord = false;
    }),
  ),
  handle(resetPotentialJobFilters, state =>
    produce(state, draft => {
      draft.potentialCandidateJobs = {
        previous: null,
        next: null,
        results: [],
        count: 0,
      };
    }),
  ),
  handle(setFiltersForPotentialJobs, (state, { payload }) =>
    produce(state, draft => {
      draft.potentialSearchValue = payload.searchValue;
      draft.potentialCandidateJobs = {
        previous: null,
        next: null,
        results: [],
        count: 0,
      };
    }),
  ),
  handle(getPendingApprovalCount.request, state =>
    produce(state, draft => {
      draft.gettingPendingCandidates = true;
    }),
  ),
  handle(getPendingApprovalCount.success, (state, { payload }) =>
    produce(state, draft => {
      draft.gettingPendingCandidates = false;
      draft.pendingApprovalCount = payload;
    }),
  ),
  handle(getPendingApprovalCount.fail, state =>
    produce(state, draft => {
      draft.gettingPendingCandidates = false;
    }),
  ),
  handle(toggleThreadModalVisibility, state =>
    produce(state, draft => {
      draft.threadModalVisibility = !draft.threadModalVisibility;
    }),
  ),
  handle(downloadCandidateCV.request, state =>
    produce(state, draft => {
      draft.downloadingCandidateCV = true;
    }),
  ),
  handle(downloadCandidateCV.success, state =>
    produce(state, draft => {
      draft.downloadingCandidateCV = false;
    }),
  ),
  handle(downloadCandidateCV.fail, state =>
    produce(state, draft => {
      draft.downloadingCandidateCV = false;
    }),
  ),
  handle(setRegion, (state, { payload }) =>
    produce(state, draft => {
      draft.searchCandidateRegionFilter = payload;
    }),
  ),
  handle(setCity, (state, { payload }) =>
    produce(state, draft => {
      draft.searchCandidateCityFilter = payload;
    }),
  ),
  handle(setPosition, (state, { payload }) =>
    produce(state, draft => {
      draft.searchCandidateJobType = payload;
    }),
  ),
  handle(setPermissionType, (state, { payload }) =>
    produce(state, draft => {
      draft.searchCandidateByPermission = payload;
    }),
  ),
  handle(setSearchValue, (state, { payload }) =>
    produce(state, draft => {
      draft.searchCandidateKeyWord = payload;
    }),
  ),
  handle(setSalary, (state, { payload }) =>
    produce(state, draft => {
      draft.searchCandidateSalaryGte = payload.salaryGte;
      draft.searchCandidateSalaryLte = payload.salaryLte;
    }),
  ),
  handle(setSelectedRecordId, (state, { payload }) =>
    produce(state, draft => {
      draft.selectedRecordId = payload.selectedRecordId;
    }),
  ),
  handle(setRecordEditMode, (state, { payload }) =>
    produce(state, draft => {
      draft.editMode = payload.editMode;
    }),
  ),
  handle(deleteCandidate.request, state =>
    produce(state, draft => {
      draft.deletingCandidate = true;
    }),
  ),
  handle(deleteCandidate.success, state =>
    produce(state, draft => {
      draft.deletingCandidate = false;
      draft.candidates.results = [
        ...draft.candidates.results.filter(candidate => candidate.id !== draft.selectedCandidateId),
      ];
    }),
  ),
  handle(deleteCandidate.fail, state =>
    produce(state, draft => {
      draft.deletingCandidate = false;
    }),
  ),
  handle(setSelectedCandidateId, (state, { payload }) =>
    produce(state, draft => {
      draft.selectedCandidateId = payload.candidateId;
    }),
  ),
  handle(setProjectType, (state, { payload }) =>
    produce(state, draft => {
      draft.searchCandidateByProjectType = payload;
    }),
  ),
  handle(setAvailability, (state, { payload }) =>
    produce(state, draft => {
      draft.searchCandidateByAvailability = payload;
    }),
  ),
  handle(navigateFromContacts, (state, { payload }) =>
    produce(state, draft => {
      draft.navigateFromContactsToCandidates = payload;
    }),
  ),
  handle(setProjectValue, (state, { payload }) =>
    produce(state, draft => {
      draft.searchCandidateByProjectValue = payload;
    }),
  ),
  handle(setCandidateStatus, (state, { payload }) =>
    produce(state, draft => {
      draft.searchCandidateByStatus = payload;
    }),
  ),
  handle(setSelectedJob, (state, { payload }) =>
    produce(state, draft => {
      draft.searchSelectedJobs = payload;
    }),
  ),
  handle(setSelectedJobGrop, (state, { payload }) =>
    produce(state, draft => {
      draft.searchSelectedJobGroups = payload;
    }),
  ),
]);
