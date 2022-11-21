import { createAction } from 'deox';

import { ContactCompanies } from '~/models/admin';
import {
  CreateNewContactCandidateFormValues,
  CreateNewContactCompanyFormValues,
} from '~/types/formValues';
import { UpdateManagerNoteRequestBody } from '~/types/requests';
import {
  CreateNewContactCandidateResponse,
  CreateNewContactCompanyResponse,
  ErrorResponse,
  GetAdminEmailsResponse,
  GetContactCandidatesResponse,
  GetContactCompaniesResponse,
  GetManagerNotesResponse,
  GetSentResumesResponse,
  UpdateManagerNotesResponse,
} from '~/types/responses';
import { SelectOption } from '~/view/components/select';

export const getContactCompanies = {
  init: createAction(
    'adminContacts/GET_CONTACT_COMPANIES',
    resolve => (payload: { initialFetch: boolean }) => resolve(payload),
  ),
  request: createAction('adminContacts/GET_CONTACT_COMPANIES_REQUEST'),
  success: createAction(
    'adminContacts/GET_CONTACT_COMPANIES_SUCCESS',
    resolve => (payload: GetContactCompaniesResponse) => resolve(payload),
  ),
  fail: createAction('adminContacts/GET_CONTACT_COMPANIES_FAIL'),
};

export const setContactCompanySearchWithFilters = createAction(
  'adminContacts/SET_CONTACT_COMPANIES_SEARCH_WITH_FILTERS',
  resolve => (payload: { keyWord: string }) => resolve(payload),
);

export const getContactCandidates = {
  init: createAction(
    'adminContacts/GET_CONTACT_CANDIDATES',
    resolve => (payload: { initialFetch: boolean }) => resolve(payload),
  ),
  request: createAction('adminContacts/GET_CONTACT_CANDIDATES_REQUEST'),
  success: createAction(
    'adminContacts/GET_CONTACT_CANDIDATES_SUCCESS',
    resolve => (payload: GetContactCandidatesResponse) => resolve(payload),
  ),
  fail: createAction('adminContacts/GET_CONTACT_CANDIDATES_FAIL'),
};

export const setContactCandidateSearchWithFilters = createAction(
  'adminContacts/SET_CONTACT_CANDIDATES_SEARCH_WITH_FILTERS',
  resolve => (payload: { keyWord: string }) => resolve(payload),
);

export const addContactCompany = {
  request: createAction(
    'adminContacts/ADD_CONTACT_COMPANY',
    resolve =>
      (payload: { formValues: CreateNewContactCompanyFormValues; onSuccess: () => void }) =>
        resolve(payload),
  ),
  success: createAction(
    'adminContacts/ADD_CONTACT_COMPANY_SUCCESS',
    resolve => (payload: CreateNewContactCompanyResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminContacts/ADD_CONTACT_COMPANY_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const addContactCandidate = {
  request: createAction(
    'adminContacts/ADD_CONTACT_CANDIDATES',
    resolve =>
      (payload: { formValues: CreateNewContactCandidateFormValues; onSuccess: () => void }) =>
        resolve(payload),
  ),
  success: createAction(
    'adminContacts/ADD_CONTACT_CANDIDATES_SUCCESS',
    resolve => (payload: CreateNewContactCandidateResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminContacts/ADD_CONTACT_CANDIDATES_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setCompanyContact = createAction(
  'adminContacts/SET_SELECTED_CONTACT',
  resolve => (payload: ContactCompanies | null) => resolve(payload),
);

export const getContactMessages = {
  init: createAction(
    'adminContacts/GET_CONTACT_MESSAGES',
    resolve => (payload: { initialFetch: boolean }) => resolve(payload),
  ),
  request: createAction('adminContacts/GET_CONTACT_MESSAGES_REQUEST'),
  success: createAction(
    'adminContacts/GET_CONTACT_MESSAGES_SUCCESS',
    resolve => (payload: GetAdminEmailsResponse) => resolve(payload),
  ),
  fail: createAction('adminContacts/GET_CONTACT_MESSAGES_FAIL'),
};

export const getSentResumes = {
  init: createAction(
    'adminContacts/GET_SENT_RESUMES',
    resolve => (payload: { initialFetch: boolean }) => resolve(payload),
  ),
  request: createAction('adminContacts/GET_SENT_RESUMES_REQUEST'),
  success: createAction(
    'adminContacts/GET_SENT_RESUMES_SUCCESS',
    resolve => (payload: GetSentResumesResponse) => resolve(payload),
  ),
  fail: createAction('adminContacts/GET_SENT_RESUMES_FAIL'),
};

export const getManagerNotes = {
  request: createAction('adminContacts/GET_MANAGER_NOTES_REQUEST'),
  success: createAction(
    'adminContacts/GET_MANAGER_NOTES_SUCCESS',
    resolve => (payload: GetManagerNotesResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminContacts/GET_MANAGER_NOTES_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const addManagerNote = {
  request: createAction(
    'adminContacts/ADD_MANAGER_NOTE',
    resolve => (payload: { text: string }) => resolve(payload),
  ),
  success: createAction(
    'adminContacts/ADD_MANAGER_NOTE_SUCCESS',
    resolve => (payload: UpdateManagerNotesResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminContacts/ADD_MANAGER_NOTE_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const updateManagerNote = {
  request: createAction(
    'adminContacts/UPDATE_MANAGER_NOTE',
    resolve => (payload: UpdateManagerNoteRequestBody) => resolve(payload),
  ),
  success: createAction(
    'adminContacts/UPDATE_MANAGER_NOTE_SUCCESS',
    resolve => (payload: UpdateManagerNotesResponse) => resolve(payload),
  ),
  fail: createAction(
    'adminContacts/UPDATE_MANAGER_NOTE_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const deleteManagerNote = {
  request: createAction(
    'adminContacts/DELETE_MANAGER_NOTE',
    resolve => (payload: { noteId: number }) => resolve(payload),
  ),
  success: createAction('adminContacts/DELETE_MANAGER_NOTE_SUCCESS'),
  fail: createAction(
    'adminContacts/DELETE_MANAGER_NOTE_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setNoteEditMode = createAction(
  'adminContacts/SET_NOTE_EDIT_MODE',
  resolve => (payload: { editMode: boolean }) => resolve(payload),
);

export const setSelectedNoteId = createAction(
  'adminContacts/SET_SELECTED_NOTE_ID',
  resolve => (payload: { selectedNoteId: number }) => resolve(payload),
);

export const deleteContactCandidate = {
  request: createAction(
    'adminContacts/DELETE_CANDIDATE',
    resolve => (payload: { contactCandidateId: number }) => resolve(payload),
  ),
  success: createAction('adminContacts/DELETE_CANDIDATE_SUCCESS'),
  fail: createAction(
    'adminContacts/DELETE_CANDIDATE_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const deleteContactCompany = {
  request: createAction(
    'adminContacts/DELETE_CONTACT_COMPANY',
    resolve => (payload: { contactCompanyId: number }) => resolve(payload),
  ),
  success: createAction('adminContacts/DELETE_CONTACT_COMPANY_SUCCESS'),
  fail: createAction(
    'adminContacts/DELETE_CONTACT_COMPANY_FAIL',
    resolve => (payload: ErrorResponse['detail'] | null) => resolve(payload),
  ),
};

export const setSelectedContactCandidateId = createAction(
  'adminContacts/SET_SELECTED_CONTACT_CANDIDATE_ID',
  resolve => (payload: { contactCandidateId: number }) => resolve(payload),
);

export const setSelectedContactCompanyId = createAction(
  'adminContacts/SET_SELECTED_CONTACT_COMPANY_ID',
  resolve => (payload: { contactCompanyId: number }) => resolve(payload),
);

export const resetContactSearchFilters = createAction('adminContacts/RESET_CONTACT_FILTERS');

export const setRegion = createAction(
  'adminContacts/SET_REGION',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setCity = createAction(
  'adminContacts/SET_CITY',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setPosition = createAction(
  'adminContacts/SET_POSITION',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setProjectType = createAction(
  'adminContacts/SET_PROJECT_TYPE',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setCompany = createAction(
  'adminContacts/SET_COMPANY',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const setPositionType = createAction(
  'adminContacts/SET_POSITION_TYPE',
  resolve => (payload: SelectOption) => resolve(payload),
);

export const toggleSuccessModalVisibility = createAction(
  'adminContacts/TOGGLE_SUCCESS_MODAL_VISIBILITY',
);
