import { CompanyHiringManger } from '~/models/company';
import {
  CreateCompanyBusinessDetailsResponse,
  CreateEmployerCompanyInfoResponse,
  ErrorResponse,
  GetClientContactDetailsResponse,
  GetCompanyHiringManagersResponse,
  GetCompanyLogoResponse,
  GetCompanyResponse,
  GetCreatedHiringManagerResponse,
} from '~/types/responses';

export type CreateEmployerState = {
  creatingEmployerCompanyInfo: boolean;
  creatingEmployerCompanyInfoErrors: ErrorResponse['detail'] | null;
  employerCompanyInfoCreated: CreateEmployerCompanyInfoResponse['data'] | null;
  creatingCompanyBusinessDetails: boolean;
  creatingCompanyBusinessDetailsErrors: ErrorResponse['detail'] | null;
  companyBusinessDetailsCreated: CreateCompanyBusinessDetailsResponse['data'] | null;
  uploadingCompanyLogo: boolean;
  uploadingCompanyLogoErrors: ErrorResponse['detail'] | null;
  companyLogoUploaded: boolean;
  registeredCompanyId: number;
  employerDataForEditLoading: boolean;
  updatingEmployerInfo: boolean;
  updateEmployerInfoErrors: ErrorResponse['detail'] | null;
  employerInfo: GetCompanyResponse['data'] | null;
  updatingEmployerDetails: boolean;
  updateEmployerDetailsErrors: ErrorResponse['detail'] | null;
  employerDetails: GetClientContactDetailsResponse['data'] | null;
  employerLogo: GetCompanyLogoResponse['data'] | null;
  updatingEmployerLogo: boolean;
  updatingEmployerLogoErrors: ErrorResponse['detail'] | null;
  employerId: number;
  deletingEmployerLogo: boolean;
  employerLogoDeleted: boolean;
  companyManagers: GetCompanyHiringManagersResponse['data'];
  createdHiringManager: GetCreatedHiringManagerResponse['data'] | null;
  loadingHiringManagers: boolean;
  creatingHiringManager: boolean;
  deletingHiringManger: boolean;
  updatingHiringManager: boolean;
  updateHiringManagerErrors: ErrorResponse['detail'] | null;
  managerId: number;
  editMode: boolean;
  hiringManager: CompanyHiringManger | null;
  createHiringManagerErrors: ErrorResponse['detail'] | null | string;
  isEmpty: boolean;
};
