import { ContactCompanies } from '~/models/admin';
import {
  CreateNewContactCandidateResponse,
  CreateNewContactCompanyResponse,
  ErrorResponse,
  GetAdminEmailsResponse,
  GetContactCandidatesResponse,
  GetContactCompaniesResponse,
  GetManagerNotesResponse,
  GetSentResumesResponse,
} from '~/types/responses';
import { SelectOption } from '~/view/components/select';

export type ContactsState = {
  companies: GetContactCompaniesResponse['data'];
  candidates: GetContactCandidatesResponse['data'];
  loadingCompanies: boolean;
  loadingCandidates: boolean;
  addingContactCompany: boolean;
  addingContactCandidates: boolean;
  createdContactCompany: CreateNewContactCompanyResponse['data'] | null;
  createdContactCandidate: CreateNewContactCandidateResponse['data'] | null;
  addContactCompanyErrors: ErrorResponse['detail'] | null;
  addContactCandidateErrors: ErrorResponse['detail'] | null;
  companySearchValue: string;
  candidateSearchValue: string;
  selectedCompanyContact: ContactCompanies | null;
  messages: GetAdminEmailsResponse['data'];
  loadingContactMessage: boolean;
  sentResumes: GetSentResumesResponse['data'];
  loadingSentResumes: boolean;
  loadingManagerNotes: boolean;
  managerNotes: GetManagerNotesResponse['data'];
  addManagerNoteLoading: boolean;
  updatingManagerNote: boolean;
  deletingManagerNote: boolean;
  editMode: boolean;
  selectedNoteId: number;
  deletingContactCandidate: boolean;
  selectedContactCandidateId: number;
  deletingContactCompany: boolean;
  selectedContactCompanyId: number;
  searchManagerRegionFilter: SelectOption;
  searchManagerCityFilter: SelectOption;
  searchManagerByPosition: SelectOption;
  searchManagerByProjectType: SelectOption;
  searchManagerByCompany: SelectOption;
  searchManagerByPositionType: SelectOption;
  successModalVisibility: boolean;
};
