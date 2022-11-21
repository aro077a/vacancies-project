import { createReducer } from 'deox';
import produce from 'immer';

import { MatchedJobSteps } from '~/models/common';

import {
  arrangeInterview,
  createContract,
  createInvoice,
  downloadGeneratedContract,
  editInterviewMode,
  getMatchedJobPipeline,
  getUnmatchedJobPipeline,
  resetFilters,
  resetToInitial,
  sendContract,
  setAdmin,
  setCity,
  setColumns,
  setCompany,
  setContractType,
  setGeneratedContractId,
  setRegion,
  setSelectedMatchedJob,
  toggleContractModalVisibility,
  toggleInterviewModalVisibility,
  toggleInvoiceModalVisibility,
  toggleSendCVModalVisibility,
  toggleSuccessModalVisibility,
  updateMatchedJobStep,
} from './actions';
import { AdminMatchedJobsPipelineState } from './types';

const initialState: AdminMatchedJobsPipelineState = {
  unmatchedJobsPipeline: [],
  loadingUnmatchedJobs: false,
  matchedJobsPipeline: [],
  loadingMatchedJobPipeline: false,
  updatingMatchedJobStep: false,
  initialColumns: {
    '1': {
      id: 1,
      title: 'Candidate is matched',
      items: [],
    },
    '2': {
      id: 2,
      title: 'Candidate agreed to submittal',
      items: [],
    },
    '3': {
      id: 3,
      title: 'CV is sent',
      items: [],
    },
    '4': {
      id: 4,
      title: 'Employer accepted the candidate',
      items: [],
    },
    '5': {
      id: 5,
      title: 'Interview arranged',
      items: [],
    },
    '6': {
      id: 6,
      title: 'Placement approved',
      items: [],
    },
    '10': {
      id: 10,
      title: 'Active temporary workers',
      items: [],
    },
    '7': {
      id: 7,
      title: 'Deal successfully closed',
      items: [],
    },
    '8': {
      id: 8,
      title: 'Closed deals',
      items: [],
    },
  },
  CVModalVisibility: false,
  interviewModalVisibility: false,
  invoiceModalVisibility: false,
  contractModalVisibility: false,
  selectedMatchedJob: null,
  arrangingInterview: false,
  creatingInvoice: false,
  creatingContract: false,
  editInterviewMode: false,
  isContractGenerated: false,
  generatedContractId: null,
  donwloadingGeneratedContract: false,
  sendingContract: false,
  successModalVisibility: false,
  isNotesSentStatus: null,
  searchByCity: {
    value: 0,
    label: 'City',
  },
  searchByCompany: {
    value: 0,
    label: 'Company',
  },
  searchByRegion: {
    value: 0,
    label: 'Region',
  },
  searchByContractType: {
    value: 0,
    label: 'Contract type',
  },
  searchByAdmin: {
    value: 0,
    label: 'Admin',
  },
};

export const adminMatchedJobsPipelineReducers = createReducer(initialState, handle => [
  handle(getUnmatchedJobPipeline.request, state =>
    produce(state, draft => {
      draft.unmatchedJobsPipeline = [];
      draft.loadingUnmatchedJobs = true;
    }),
  ),
  handle(getUnmatchedJobPipeline.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingUnmatchedJobs = false;
      draft.unmatchedJobsPipeline = payload.data;
    }),
  ),
  handle(getUnmatchedJobPipeline.fail, state =>
    produce(state, draft => {
      draft.loadingUnmatchedJobs = false;
    }),
  ),
  handle(getMatchedJobPipeline.request, state =>
    produce(state, draft => {
      Object.assign(draft.initialColumns, initialState.initialColumns);
      draft.loadingMatchedJobPipeline = true;
    }),
  ),
  handle(getMatchedJobPipeline.success, (state, { payload }) =>
    produce(state, draft => {
      draft.matchedJobsPipeline = payload.data;
      if (draft.matchedJobsPipeline.length) {
        draft.matchedJobsPipeline.forEach(candidate => {
          switch (candidate.step) {
            case 1:
              draft.initialColumns['1'].items.push(candidate);
              break;
            case 2:
              draft.initialColumns['2'].items.push(candidate);
              break;
            case 3:
              draft.initialColumns['3'].items.push(candidate);
              break;
            case 4:
              draft.initialColumns['4'].items.push(candidate);
              break;
            case 5:
              draft.initialColumns['5'].items.push(candidate);
              break;
            case 6:
              draft.initialColumns['6'].items.push(candidate);
              break;
            case 7:
              draft.initialColumns['7'].items.push(candidate);
              break;
            case 9:
              draft.initialColumns['6'].items.push(candidate);
              break;
            case 10:
              draft.initialColumns['10'].items.push(candidate);
              break;
            default:
              draft.initialColumns['8'].items.push(candidate);
              break;
          }
        });
      }
      draft.loadingMatchedJobPipeline = false;
    }),
  ),
  handle(getMatchedJobPipeline.fail, state =>
    produce(state, draft => {
      draft.loadingMatchedJobPipeline = false;
    }),
  ),
  handle(updateMatchedJobStep.request, state =>
    produce(state, draft => {
      draft.updatingMatchedJobStep = true;
    }),
  ),
  handle(updateMatchedJobStep.success, (state, { payload }) =>
    produce(state, draft => {
      draft.updatingMatchedJobStep = false;
      draft.isNotesSentStatus = payload;
    }),
  ),
  handle(updateMatchedJobStep.fail, state =>
    produce(state, draft => {
      draft.updatingMatchedJobStep = false;
    }),
  ),
  handle(setColumns, (state, { payload }) =>
    produce(state, draft => {
      draft.initialColumns = payload;
    }),
  ),
  handle(toggleSendCVModalVisibility, state =>
    produce(state, draft => {
      draft.CVModalVisibility = !draft.CVModalVisibility;
      draft.editInterviewMode = false;
    }),
  ),
  handle(setSelectedMatchedJob, (state, { payload }) =>
    produce(state, draft => {
      draft.selectedMatchedJob = payload;
    }),
  ),
  handle(toggleInterviewModalVisibility, state =>
    produce(state, draft => {
      draft.interviewModalVisibility = !draft.interviewModalVisibility;
      draft.isNotesSentStatus = null;
    }),
  ),
  handle(toggleInvoiceModalVisibility, state =>
    produce(state, draft => {
      draft.invoiceModalVisibility = !draft.invoiceModalVisibility;
    }),
  ),
  handle(toggleContractModalVisibility, state =>
    produce(state, draft => {
      if (draft.contractModalVisibility) {
        draft.isContractGenerated = false;
      }
      draft.contractModalVisibility = !draft.contractModalVisibility;
    }),
  ),
  handle(arrangeInterview.request, state =>
    produce(state, draft => {
      draft.arrangingInterview = true;
    }),
  ),
  handle(arrangeInterview.success, state =>
    produce(state, draft => {
      draft.arrangingInterview = false;
    }),
  ),
  handle(arrangeInterview.fail, state =>
    produce(state, draft => {
      draft.arrangingInterview = false;
    }),
  ),
  handle(createInvoice.request, state =>
    produce(state, draft => {
      draft.creatingInvoice = true;
    }),
  ),
  handle(createInvoice.success, state =>
    produce(state, draft => {
      draft.creatingInvoice = false;
    }),
  ),
  handle(createInvoice.fail, state =>
    produce(state, draft => {
      draft.creatingInvoice = false;
    }),
  ),
  handle(createContract.request, state =>
    produce(state, draft => {
      draft.creatingContract = true;
    }),
  ),
  handle(createContract.success, (state, { payload }) =>
    produce(state, draft => {
      const {
        data: {
          id,
          agreementDate,
          commencementDate,
          candidateRate,
          hoursOfWork,
          companyRate,
          supervisor,
          payOption,
          paymentType,
          timesheetDeadline,
          matched,
        },
      } = payload;
      draft.generatedContractId = id;
      draft.isContractGenerated = true;
      const matchedIndex = draft.initialColumns['6'].items.findIndex(match => match.id === matched);
      draft.initialColumns['6'].items[matchedIndex].contract = {
        id,
        agreementDate,
        commencementDate,
        candidateRate,
        companyRate,
        hoursOfWork,
        supervisor,
        payOption,
        paymentType,
        timesheetDeadline,
      };
      draft.creatingContract = false;
    }),
  ),
  handle(createContract.fail, state =>
    produce(state, draft => {
      draft.creatingContract = false;
    }),
  ),
  handle(editInterviewMode, (state, { payload }) =>
    produce(state, draft => {
      draft.editInterviewMode = payload;
    }),
  ),
  handle(resetToInitial, state =>
    produce(state, draft => {
      Object.assign(draft, initialState);
    }),
  ),
  handle(downloadGeneratedContract.request, state =>
    produce(state, draft => {
      draft.donwloadingGeneratedContract = true;
    }),
  ),
  handle(downloadGeneratedContract.success, state =>
    produce(state, draft => {
      draft.donwloadingGeneratedContract = false;
    }),
  ),
  handle(downloadGeneratedContract.fail, state =>
    produce(state, draft => {
      draft.donwloadingGeneratedContract = false;
    }),
  ),
  handle(sendContract.request, state =>
    produce(state, draft => {
      draft.sendingContract = true;
    }),
  ),
  handle(sendContract.success, (state, { payload }) =>
    produce(state, draft => {
      draft.initialColumns['6'].items[payload].step = MatchedJobSteps.WaitingForApproval;
      draft.sendingContract = false;
    }),
  ),
  handle(sendContract.fail, state =>
    produce(state, draft => {
      draft.sendingContract = false;
    }),
  ),
  handle(setGeneratedContractId, (state, { payload }) =>
    produce(state, draft => {
      draft.generatedContractId = payload;
    }),
  ),
  handle(toggleSuccessModalVisibility, state =>
    produce(state, draft => {
      draft.successModalVisibility = !draft.successModalVisibility;
    }),
  ),
  handle(setCity, (state, { payload }) =>
    produce(state, draft => {
      draft.searchByCity = payload;
    }),
  ),
  handle(setRegion, (state, { payload }) =>
    produce(state, draft => {
      draft.searchByRegion = payload;
    }),
  ),
  handle(setCompany, (state, { payload }) =>
    produce(state, draft => {
      draft.searchByCompany = payload;
    }),
  ),
  handle(setContractType, (state, { payload }) =>
    produce(state, draft => {
      draft.searchByContractType = payload;
    }),
  ),
  handle(setAdmin, (state, { payload }) =>
    produce(state, draft => {
      draft.searchByAdmin = payload;
    }),
  ),
  handle(resetFilters, state =>
    produce(state, draft => {
      Object.assign(draft, initialState);
    }),
  ),
]);
