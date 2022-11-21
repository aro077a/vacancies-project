import { createReducer } from 'deox';
import produce from 'immer';

import { JobStatus } from '~/models/common';

import {
  addLiveJobRecord,
  deleteLiveJobRecord,
  getCompaniesWithLiveJobsCount,
  getLiveJob,
  getLiveJobCompanyInterestedCandidates,
  getLiveJobContracts,
  getLiveJobFeedbackReplies,
  getLiveJobFeedbacks,
  getLiveJobInterestedCandidates,
  getLiveJobMatchedCandidates,
  getLiveJobPotentialCandidates,
  getLiveJobs,
  getLiveJobsRecords,
  resetFilters,
  sendLiveJobFeedbackReply,
  setAdmin,
  setCity,
  setPosition,
  setPositionType,
  setRecordEditMode,
  setRegion,
  setSalary,
  setSearchValue,
  setSelectedCompanyId,
  setSelectedJob,
  setSelectedJobGrop,
  setSelectedLiveJob,
  setSelectedLiveJobFeedback,
  setSelectedRecordId,
  toggleJobModalVisibility,
  toggleThreadModalVisibility,
  updateLiveJobCandidateMatched,
  updateLiveJobRecord,
  updateMatchedCandidatesCountInLiveJobs,
  updateSelectedLiveJobStatus,
} from './actions';
import { AdminLiveJobsState } from './types';

const initialState: AdminLiveJobsState = {
  selectedCompanyId: null,
  loadingCompaniesWithLiveJobsCount: false,
  companiesWithLiveJobsCount: {
    count: 0,
    previous: null,
    next: null,
    countJobs: 0,
    results: [],
  },
  loadingLiveJobs: false,
  liveJobs: {
    count: 0,
    previous: null,
    next: null,
    results: [],
  },
  selectedLiveJob: null,
  updatingLiveJobStatus: false,
  loadingLiveJobMatchedCandidates: false,
  liveJobMatchedCandidates: [],
  loadingLiveJobInterestedCandidates: false,
  liveJobInterestedCandidates: [],
  loadingLiveJobCompanyInterestedCandidates: false,
  liveJobCompanyInterestedCandidates: [],
  loadingLiveJobPotentialCandidates: false,
  liveJobPotentialCandidates: [],
  updatingLiveJobCandidateMatched: false,
  loadingLiveJobFeedbacks: false,
  liveJobFeedbacks: [],
  selectedLiveJobFeedback: null,
  loadingLiveJobFeedbackReplies: false,
  liveJobFeedbackReplies: null,
  sendingLiveJobFeedbackReply: false,
  loadingLiveJob: false,
  liveJobContracts: [],
  pendingContracts: [],
  loadingLiveJobContracts: false,
  jobModalVisibility: false,
  searchCandidateKeyWord: '',
  threadModalVisibility: false,
  searchSalaryWithSuper: false,
  searchJobRegionFilter: {
    label: 'Region',
    value: 0,
  },
  searchJobCityFilter: {
    label: 'City',
    value: 0,
  },
  searchLiveJobsJobType: {
    label: 'Job type',
    value: 0,
  },
  searchLiveJobsByAdmin: {
    label: 'Admin',
    value: 0,
  },
  searchJobPositionType: {
    label: 'Position type',
    value: 0,
  },
  loadingLiveJobsRecord: false,
  liveJobsRecords: [],
  addLiveJobRecordLoading: false,
  updatingLiveJobRecord: false,
  deletingLiveJobRecord: false,
  selectedRecordId: 0,
  searchJobSalaryGte: '',
  searchJobSalaryLte: '',
  editMode: false,
  searchSelectedJobs: [],
  searchSelectedJobGroups: [],
};

export const adminLiveJobsReducer = createReducer(initialState, handle => [
  handle(setSelectedCompanyId, (state, { payload }) =>
    produce(state, draft => {
      draft.selectedCompanyId = payload;
      Object.assign(draft.liveJobs, initialState.liveJobs);
    }),
  ),
  handle(getCompaniesWithLiveJobsCount.init, (state, { payload }) =>
    produce(state, draft => {
      if (payload.initialFetch) {
        draft.selectedCompanyId = null;
        Object.assign(draft.companiesWithLiveJobsCount, initialState.companiesWithLiveJobsCount);
      }
    }),
  ),
  handle(getCompaniesWithLiveJobsCount.request, state =>
    produce(state, draft => {
      draft.loadingCompaniesWithLiveJobsCount = true;
    }),
  ),
  handle(getCompaniesWithLiveJobsCount.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingCompaniesWithLiveJobsCount = false;
      draft.companiesWithLiveJobsCount = {
        ...payload.data,
        results: draft.companiesWithLiveJobsCount.results.concat(payload.data.results),
      };
    }),
  ),
  handle(getCompaniesWithLiveJobsCount.fail, state =>
    produce(state, draft => {
      draft.loadingCompaniesWithLiveJobsCount = false;
    }),
  ),
  handle(getLiveJobs.init, (state, { payload }) =>
    produce(state, draft => {
      if (payload.initialFetch) {
        Object.assign(draft.liveJobs, initialState.liveJobs);
      }
    }),
  ),
  handle(getLiveJobs.request, state =>
    produce(state, draft => {
      draft.loadingLiveJobs = true;
    }),
  ),
  handle(getLiveJobs.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingLiveJobs = false;
      draft.liveJobs = {
        ...payload.data,
        results: draft.liveJobs.results.concat(payload.data.results),
      };
    }),
  ),
  handle(getLiveJobs.fail, state =>
    produce(state, draft => {
      draft.loadingLiveJobs = false;
    }),
  ),
  handle(setSelectedLiveJob, (state, { payload }) =>
    produce(state, draft => {
      draft.selectedLiveJob = payload;

      if (payload === null) {
        draft.liveJobMatchedCandidates = [];
        draft.liveJobInterestedCandidates = [];
        draft.liveJobCompanyInterestedCandidates = [];
        draft.liveJobPotentialCandidates = [];
        draft.liveJobFeedbacks = [];
        draft.pendingContracts = [];
        draft.liveJobContracts = [];
        draft.liveJobsRecords = [];
      }
    }),
  ),
  handle(updateSelectedLiveJobStatus.request, state =>
    produce(state, draft => {
      draft.updatingLiveJobStatus = true;
    }),
  ),
  handle(updateSelectedLiveJobStatus.success, (state, { payload }) =>
    produce(state, draft => {
      if (draft.selectedLiveJob) {
        const newStatus = payload.data.status === JobStatus.ACTIVE ? 'Active' : 'Closed';

        draft.selectedLiveJob.statusName = newStatus;

        const selectedLiveJobInResults = draft.liveJobs.results.find(
          liveJob => liveJob.id === draft.selectedLiveJob?.id,
        );

        if (selectedLiveJobInResults) {
          selectedLiveJobInResults.statusName = newStatus;
        }
      }

      draft.updatingLiveJobStatus = false;
    }),
  ),
  handle(updateSelectedLiveJobStatus.fail, state =>
    produce(state, draft => {
      draft.updatingLiveJobStatus = false;
    }),
  ),
  handle(getLiveJobMatchedCandidates.request, state =>
    produce(state, draft => {
      draft.loadingLiveJobMatchedCandidates = true;
    }),
  ),
  handle(getLiveJobMatchedCandidates.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingLiveJobMatchedCandidates = false;
      draft.liveJobMatchedCandidates = payload.data;
    }),
  ),
  handle(getLiveJobMatchedCandidates.fail, state =>
    produce(state, draft => {
      draft.loadingLiveJobMatchedCandidates = false;
    }),
  ),
  handle(getLiveJobInterestedCandidates.request, state =>
    produce(state, draft => {
      draft.loadingLiveJobInterestedCandidates = true;
    }),
  ),
  handle(getLiveJobInterestedCandidates.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingLiveJobInterestedCandidates = false;
      draft.liveJobInterestedCandidates = payload.data;
    }),
  ),
  handle(getLiveJobInterestedCandidates.fail, state =>
    produce(state, draft => {
      draft.loadingLiveJobInterestedCandidates = false;
    }),
  ),
  handle(getLiveJobCompanyInterestedCandidates.request, state =>
    produce(state, draft => {
      draft.loadingLiveJobCompanyInterestedCandidates = true;
    }),
  ),
  handle(getLiveJobCompanyInterestedCandidates.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingLiveJobCompanyInterestedCandidates = false;
      draft.liveJobCompanyInterestedCandidates = payload.data;
    }),
  ),
  handle(getLiveJobCompanyInterestedCandidates.fail, state =>
    produce(state, draft => {
      draft.loadingLiveJobCompanyInterestedCandidates = false;
    }),
  ),
  handle(getLiveJobPotentialCandidates.request, state =>
    produce(state, draft => {
      draft.loadingLiveJobPotentialCandidates = true;
    }),
  ),
  handle(getLiveJobPotentialCandidates.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingLiveJobPotentialCandidates = false;
      draft.liveJobPotentialCandidates = payload.data;
    }),
  ),
  handle(getLiveJobPotentialCandidates.fail, state =>
    produce(state, draft => {
      draft.loadingLiveJobPotentialCandidates = false;
    }),
  ),
  handle(updateLiveJobCandidateMatched.request, state =>
    produce(state, draft => {
      draft.updatingLiveJobCandidateMatched = true;
    }),
  ),
  handle(updateLiveJobCandidateMatched.success, state =>
    produce(state, draft => {
      draft.updatingLiveJobCandidateMatched = false;
    }),
  ),
  handle(updateLiveJobCandidateMatched.fail, state =>
    produce(state, draft => {
      draft.updatingLiveJobCandidateMatched = false;
    }),
  ),
  handle(updateMatchedCandidatesCountInLiveJobs, (state, { payload }) =>
    produce(state, draft => {
      const liveJobToUpdate = draft.liveJobs.results.find(
        liveJob => liveJob.id === payload.liveJobId,
      );

      if (liveJobToUpdate) {
        liveJobToUpdate.candidateCount = payload.candidatesCount;
      }
    }),
  ),
  handle(getLiveJobFeedbacks.request, state =>
    produce(state, draft => {
      draft.loadingLiveJobFeedbacks = true;
    }),
  ),
  handle(getLiveJobFeedbacks.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingLiveJobFeedbacks = false;
      draft.liveJobFeedbacks = payload.data;
    }),
  ),
  handle(getLiveJobFeedbacks.fail, state =>
    produce(state, draft => {
      draft.loadingLiveJobFeedbacks = false;
    }),
  ),
  handle(setSelectedLiveJobFeedback, (state, { payload }) =>
    produce(state, draft => {
      draft.selectedLiveJobFeedback = payload;

      if (payload === null) {
        draft.liveJobFeedbackReplies = null;
      }
    }),
  ),
  handle(getLiveJobFeedbackReplies.request, state =>
    produce(state, draft => {
      draft.loadingLiveJobFeedbackReplies = true;
    }),
  ),
  handle(getLiveJobFeedbackReplies.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingLiveJobFeedbackReplies = false;
      draft.liveJobFeedbackReplies = payload.data;
    }),
  ),
  handle(getLiveJobFeedbackReplies.fail, state =>
    produce(state, draft => {
      draft.loadingLiveJobFeedbackReplies = false;
    }),
  ),
  handle(sendLiveJobFeedbackReply.request, state =>
    produce(state, draft => {
      draft.sendingLiveJobFeedbackReply = true;
    }),
  ),
  handle(sendLiveJobFeedbackReply.success, (state, { payload }) =>
    produce(state, draft => {
      const selectedFeedback = draft.liveJobFeedbacks.find(
        feedback => feedback.id === draft.selectedLiveJobFeedback?.id,
      );

      if (selectedFeedback) {
        selectedFeedback.repliesCount += 1;
        selectedFeedback.latestReplyDate = payload.data.addedAt;
      }

      draft.sendingLiveJobFeedbackReply = false;
      draft.liveJobFeedbackReplies?.replies.push({
        id: payload.data.id,
        name: 'Admin',
        photo: payload.data.photo,
        addedAt: payload.data.addedAt,
        text: payload.data.text,
        isAdmin: true,
      });
    }),
  ),
  handle(sendLiveJobFeedbackReply.fail, state =>
    produce(state, draft => {
      draft.sendingLiveJobFeedbackReply = false;
    }),
  ),
  handle(getLiveJob.request, state =>
    produce(state, draft => {
      draft.loadingLiveJob = true;
    }),
  ),
  handle(getLiveJob.success, state =>
    produce(state, draft => {
      draft.loadingLiveJob = false;
    }),
  ),
  handle(getLiveJob.fail, state =>
    produce(state, draft => {
      draft.loadingLiveJob = false;
    }),
  ),
  handle(getLiveJobContracts.request, state =>
    produce(state, draft => {
      draft.loadingLiveJobContracts = true;
    }),
  ),
  handle(getLiveJobContracts.success, (state, { payload }) =>
    produce(state, draft => {
      draft.pendingContracts = [];
      draft.liveJobContracts = [];
      draft.loadingLiveJobContracts = false;
      if (payload.data.length) {
        payload.data.forEach(item => {
          if (item.pending) {
            draft.pendingContracts.push(item);
          } else {
            draft.liveJobContracts.push(item);
          }
        });
      }
    }),
  ),
  handle(getLiveJobContracts.fail, state =>
    produce(state, draft => {
      draft.loadingLiveJobContracts = false;
    }),
  ),
  handle(toggleJobModalVisibility, state =>
    produce(state, draft => {
      draft.jobModalVisibility = !draft.jobModalVisibility;
    }),
  ),
  handle(toggleThreadModalVisibility, state =>
    produce(state, draft => {
      draft.threadModalVisibility = !draft.threadModalVisibility;
    }),
  ),
  handle(setCity, (state, { payload }) =>
    produce(state, draft => {
      draft.searchJobCityFilter = payload;
    }),
  ),
  handle(setPositionType, (state, { payload }) =>
    produce(state, draft => {
      draft.searchJobPositionType = payload;
    }),
  ),
  handle(setRegion, (state, { payload }) =>
    produce(state, draft => {
      draft.searchJobRegionFilter = payload;
    }),
  ),
  handle(setPosition, (state, { payload }) =>
    produce(state, draft => {
      draft.searchLiveJobsJobType = payload;
    }),
  ),
  handle(setAdmin, (state, { payload }) =>
    produce(state, draft => {
      draft.searchLiveJobsByAdmin = payload;
    }),
  ),
  handle(getLiveJobsRecords.request, state =>
    produce(state, draft => {
      draft.loadingLiveJobsRecord = true;
    }),
  ),
  handle(getLiveJobsRecords.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingLiveJobsRecord = false;
      draft.liveJobsRecords = payload.data;
    }),
  ),
  handle(setSalary, (state, { payload }) =>
    produce(state, draft => {
      draft.searchSalaryWithSuper = payload.withAmount;
      draft.searchJobSalaryGte = payload.salaryGte;
      draft.searchJobSalaryLte = payload.salaryLte;
    }),
  ),
  handle(setSearchValue, (state, { payload }) =>
    produce(state, draft => {
      draft.searchCandidateKeyWord = payload;
    }),
  ),
  handle(getLiveJobsRecords.fail, state =>
    produce(state, draft => {
      draft.loadingLiveJobsRecord = false;
    }),
  ),
  handle(addLiveJobRecord.request, state =>
    produce(state, draft => {
      draft.addLiveJobRecordLoading = true;
    }),
  ),
  handle(addLiveJobRecord.success, (state, { payload }) =>
    produce(state, draft => {
      draft.addLiveJobRecordLoading = false;
      draft.liveJobsRecords = [...draft.liveJobsRecords, payload.data];
    }),
  ),
  handle(addLiveJobRecord.fail, state =>
    produce(state, draft => {
      draft.addLiveJobRecordLoading = false;
    }),
  ),
  handle(updateLiveJobRecord.request, state =>
    produce(state, draft => {
      draft.updatingLiveJobRecord = true;
    }),
  ),
  handle(updateLiveJobRecord.success, (state, { payload }) =>
    produce(state, draft => {
      draft.updatingLiveJobRecord = false;
      const updatedLiveJobRecord = draft.liveJobsRecords.findIndex(
        record => record.id === payload?.data?.id,
      );
      draft.liveJobsRecords[updatedLiveJobRecord] = payload?.data;
    }),
  ),
  handle(updateLiveJobRecord.fail, state =>
    produce(state, draft => {
      draft.updatingLiveJobRecord = false;
    }),
  ),
  handle(deleteLiveJobRecord.request, state =>
    produce(state, draft => {
      draft.deletingLiveJobRecord = true;
    }),
  ),
  handle(deleteLiveJobRecord.success, state =>
    produce(state, draft => {
      draft.deletingLiveJobRecord = false;
      draft.liveJobsRecords = [
        ...draft.liveJobsRecords.filter(item => item.id !== draft.selectedRecordId),
      ];
    }),
  ),
  handle(deleteLiveJobRecord.fail, state =>
    produce(state, draft => {
      draft.deletingLiveJobRecord = false;
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
  handle(resetFilters, state =>
    produce(state, draft => {
      const newObject = {
        ...initialState,
        companiesWithLiveJobsCount: draft.companiesWithLiveJobsCount,
      };
      Object.assign(draft, newObject);
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
