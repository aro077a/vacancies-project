import { createReducer } from 'deox';
import produce from 'immer';

import {
  addContactCandidate,
  addContactCompany,
  addManagerNote,
  deleteContactCandidate,
  deleteContactCompany,
  deleteManagerNote,
  getContactCandidates,
  getContactCompanies,
  getContactMessages,
  getManagerNotes,
  getSentResumes,
  resetContactSearchFilters,
  setCity,
  setCompany,
  setCompanyContact,
  setContactCandidateSearchWithFilters,
  setContactCompanySearchWithFilters,
  setNoteEditMode,
  setPosition,
  setPositionType,
  setProjectType,
  setRegion,
  setSelectedContactCandidateId,
  setSelectedContactCompanyId,
  setSelectedNoteId,
  toggleSuccessModalVisibility,
  updateManagerNote,
} from './actions';
import { ContactsState } from './types';

export const initialState: ContactsState = {
  companies: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  candidates: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  messages: {
    threads: [],
    nextPageToken: 0,
  },
  loadingCompanies: false,
  loadingCandidates: false,
  addingContactCompany: false,
  addingContactCandidates: false,
  createdContactCompany: null,
  createdContactCandidate: null,
  addContactCompanyErrors: null,
  addContactCandidateErrors: null,
  companySearchValue: '',
  candidateSearchValue: '',
  selectedCompanyContact: null,
  loadingContactMessage: false,
  sentResumes: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  loadingSentResumes: false,
  loadingManagerNotes: false,
  managerNotes: [],
  addManagerNoteLoading: false,
  updatingManagerNote: false,
  deletingManagerNote: false,
  editMode: false,
  selectedNoteId: 0,
  deletingContactCandidate: false,
  selectedContactCandidateId: 0,
  deletingContactCompany: false,
  selectedContactCompanyId: 0,
  searchManagerRegionFilter: {
    value: 0,
    label: '',
  },
  searchManagerCityFilter: {
    value: 0,
    label: 'City',
  },
  searchManagerByPosition: {
    value: 0,
    label: 'Position',
  },
  searchManagerByProjectType: {
    value: 0,
    label: 'Project type',
  },
  searchManagerByCompany: {
    value: 0,
    label: 'Company',
  },
  searchManagerByPositionType: {
    value: 0,
    label: 'Position type',
  },
  successModalVisibility: false,
};

export const adminContactReducer = createReducer(initialState, handle => [
  handle(getContactCompanies.init, (state, { payload }) =>
    produce(state, draft => {
      if (payload.initialFetch) {
        Object.assign(draft.companies, initialState.companies);
      }
    }),
  ),
  handle(getContactCompanies.request, state =>
    produce(state, draft => {
      draft.loadingCompanies = true;
    }),
  ),
  handle(getContactCompanies.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingCompanies = false;
      draft.companies = {
        ...payload.data,
        results: draft.companies.results.concat(payload.data.results),
      };
    }),
  ),
  handle(getContactCompanies.fail, state =>
    produce(state, draft => {
      draft.loadingCompanies = false;
    }),
  ),
  handle(setContactCompanySearchWithFilters, (state, { payload }) =>
    produce(state, draft => {
      draft.companySearchValue = payload.keyWord;
      Object.assign(draft.companies, initialState.companies);
    }),
  ),

  handle(getContactCandidates.init, (state, { payload }) =>
    produce(state, draft => {
      if (payload.initialFetch) {
        Object.assign(draft.candidates, initialState.candidates);
      }
    }),
  ),
  handle(getContactCandidates.request, state =>
    produce(state, draft => {
      draft.loadingCandidates = true;
    }),
  ),
  handle(getContactCandidates.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingCandidates = false;
      draft.candidates = {
        ...payload.data,
        results: draft.candidates.results.concat(payload.data.results),
      };
    }),
  ),
  handle(getContactCandidates.fail, state =>
    produce(state, draft => {
      draft.loadingCandidates = false;
    }),
  ),
  handle(setContactCandidateSearchWithFilters, (state, { payload }) =>
    produce(state, draft => {
      draft.candidateSearchValue = payload.keyWord;
      Object.assign(draft.candidates, initialState.candidates);
    }),
  ),

  handle(addContactCompany.request, state =>
    produce(state, draft => {
      draft.addingContactCompany = true;
    }),
  ),
  handle(addContactCompany.success, (state, { payload }) =>
    produce(state, draft => {
      draft.addingContactCompany = false;
      draft.createdContactCompany = payload.data;
    }),
  ),
  handle(addContactCompany.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.addingContactCompany = false;
      draft.addContactCompanyErrors = payload;
    }),
  ),

  handle(addContactCandidate.request, state =>
    produce(state, draft => {
      draft.addingContactCandidates = true;
    }),
  ),
  handle(addContactCandidate.success, (state, { payload }) =>
    produce(state, draft => {
      draft.addingContactCandidates = false;
      draft.createdContactCandidate = payload.data;
    }),
  ),
  handle(addContactCandidate.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.addingContactCandidates = false;
      draft.addContactCandidateErrors = payload;
    }),
  ),
  handle(setCompanyContact, (state, { payload }) =>
    produce(state, draft => {
      draft.selectedCompanyContact = payload;
      if (payload === null) {
        draft.selectedCompanyContact = null;
        Object.assign(draft.sentResumes, initialState.sentResumes);
        Object.assign(draft.messages, initialState.messages);
      }
    }),
  ),
  handle(getContactMessages.init, (state, { payload }) =>
    produce(state, draft => {
      if (payload.initialFetch) {
        Object.assign(draft.messages, initialState.messages);
      }
    }),
  ),
  handle(getContactMessages.request, state =>
    produce(state, draft => {
      draft.loadingContactMessage = true;
    }),
  ),
  handle(getContactMessages.success, (state, { payload }) =>
    produce(state, draft => {
      draft.messages = {
        nextPageToken: payload.data.nextPageToken,
        threads: payload.data.threads ? draft.messages.threads.concat(payload.data.threads) : [],
      };
      draft.loadingContactMessage = false;
    }),
  ),
  handle(getContactMessages.fail, state =>
    produce(state, draft => {
      draft.loadingContactMessage = false;
    }),
  ),
  handle(getSentResumes.init, (state, { payload }) =>
    produce(state, draft => {
      if (payload.initialFetch) {
        Object.assign(draft.sentResumes, initialState.sentResumes);
      }
    }),
  ),
  handle(getSentResumes.request, state =>
    produce(state, draft => {
      draft.loadingSentResumes = true;
    }),
  ),
  handle(getSentResumes.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingSentResumes = false;
      draft.sentResumes = {
        ...payload.data,
        results: draft.sentResumes.results.concat(payload.data.results),
      };
    }),
  ),
  handle(getSentResumes.fail, state =>
    produce(state, draft => {
      draft.loadingSentResumes = false;
    }),
  ),
  handle(getManagerNotes.request, state =>
    produce(state, draft => {
      draft.loadingManagerNotes = true;
    }),
  ),
  handle(getManagerNotes.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingManagerNotes = false;
      draft.managerNotes = payload.data;
    }),
  ),
  handle(getManagerNotes.fail, state =>
    produce(state, draft => {
      draft.loadingManagerNotes = false;
    }),
  ),
  handle(addManagerNote.request, state =>
    produce(state, draft => {
      draft.addManagerNoteLoading = true;
    }),
  ),
  handle(addManagerNote.success, (state, { payload }) =>
    produce(state, draft => {
      draft.addManagerNoteLoading = false;
      draft.managerNotes = [...draft.managerNotes, payload.data];
    }),
  ),
  handle(addManagerNote.fail, state =>
    produce(state, draft => {
      draft.addManagerNoteLoading = false;
    }),
  ),
  handle(updateManagerNote.request, state =>
    produce(state, draft => {
      draft.updatingManagerNote = true;
    }),
  ),
  handle(updateManagerNote.success, (state, { payload }) =>
    produce(state, draft => {
      draft.updatingManagerNote = false;
      const updatedManagerNote = draft.managerNotes.findIndex(
        note => note.id === payload?.data?.id,
      );
      draft.managerNotes[updatedManagerNote] = payload?.data;
    }),
  ),
  handle(updateManagerNote.fail, state =>
    produce(state, draft => {
      draft.updatingManagerNote = false;
    }),
  ),
  handle(deleteManagerNote.request, state =>
    produce(state, draft => {
      draft.deletingManagerNote = true;
    }),
  ),
  handle(deleteManagerNote.success, state =>
    produce(state, draft => {
      draft.deletingManagerNote = false;
      draft.managerNotes = [...draft.managerNotes.filter(item => item.id !== draft.selectedNoteId)];
    }),
  ),
  handle(deleteManagerNote.fail, state =>
    produce(state, draft => {
      draft.deletingManagerNote = false;
    }),
  ),
  handle(setNoteEditMode, (state, { payload }) =>
    produce(state, draft => {
      draft.editMode = payload.editMode;
    }),
  ),
  handle(setSelectedNoteId, (state, { payload }) =>
    produce(state, draft => {
      draft.selectedNoteId = payload.selectedNoteId;
    }),
  ),
  handle(deleteContactCandidate.request, state =>
    produce(state, draft => {
      draft.deletingContactCandidate = true;
    }),
  ),
  handle(deleteContactCandidate.success, state =>
    produce(state, draft => {
      draft.deletingContactCandidate = false;
      draft.candidates.results = [
        ...draft.candidates.results.filter(
          candidate => candidate.id !== draft.selectedContactCandidateId,
        ),
      ];
    }),
  ),
  handle(deleteContactCandidate.fail, state =>
    produce(state, draft => {
      draft.deletingContactCandidate = false;
    }),
  ),
  handle(setSelectedContactCandidateId, (state, { payload }) =>
    produce(state, draft => {
      draft.selectedContactCandidateId = payload.contactCandidateId;
    }),
  ),
  handle(deleteContactCompany.request, state =>
    produce(state, draft => {
      draft.deletingContactCompany = true;
    }),
  ),
  handle(deleteContactCompany.success, state =>
    produce(state, draft => {
      draft.deletingContactCompany = false;
      draft.companies.results = [
        ...draft.companies.results.filter(
          company => company.id !== draft?.selectedContactCompanyId,
        ),
      ];
    }),
  ),
  handle(deleteContactCompany.fail, state =>
    produce(state, draft => {
      draft.deletingContactCompany = false;
    }),
  ),
  handle(setSelectedContactCompanyId, (state, { payload }) =>
    produce(state, draft => {
      draft.selectedContactCompanyId = payload.contactCompanyId;
    }),
  ),
  handle(resetContactSearchFilters, state =>
    produce(state, draft => {
      Object.assign(draft, initialState);
    }),
  ),
  handle(setPositionType, (state, { payload }) =>
    produce(state, draft => {
      draft.searchManagerByPositionType = payload;
    }),
  ),
  handle(setRegion, (state, { payload }) =>
    produce(state, draft => {
      draft.searchManagerRegionFilter = payload;
    }),
  ),
  handle(setCity, (state, { payload }) =>
    produce(state, draft => {
      draft.searchManagerCityFilter = payload;
    }),
  ),
  handle(setPosition, (state, { payload }) =>
    produce(state, draft => {
      draft.searchManagerByPosition = payload;
    }),
  ),
  handle(setProjectType, (state, { payload }) =>
    produce(state, draft => {
      draft.searchManagerByProjectType = payload;
    }),
  ),
  handle(setCompany, (state, { payload }) =>
    produce(state, draft => {
      draft.searchManagerByCompany = payload;
    }),
  ),
  handle(toggleSuccessModalVisibility, state =>
    produce(state, draft => {
      draft.successModalVisibility = !draft.successModalVisibility;
    }),
  ),
]);
