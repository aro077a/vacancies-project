import { CompanyHiringManger } from '~/models/company';
import {
  ErrorResponse,
  GetClientContactDetailsResponse,
  GetCompanyHiringManagerResponse,
  GetCompanyLogoResponse,
  GetCompanyResponse,
  GetUpdatedCompanyHiringManagerResponse,
} from '~/types/responses';

export type CompanyProfileState = {
  companyDataForEditLoading: boolean;
  companyInfo: GetCompanyResponse['data'] | null;
  updatingCompanyInfoLoading: boolean;
  updateCompanyInfoErrors: ErrorResponse['detail'] | null;
  clientDetails: GetClientContactDetailsResponse['data'] | null;
  updatingCLientDetailsLoading: boolean;
  updateCLientDetailsErrors: ErrorResponse['detail'] | null;
  companyLogo: GetCompanyLogoResponse['data'] | null;
  updatingCompanyLogo: boolean;
  updatingCompanyLogoErrors: ErrorResponse['detail'] | null;
  companyManagers: GetCompanyHiringManagerResponse['data'];
  loadingCompanyManagers: boolean;
  addingHiringManager: boolean;
  addHiringManagerErrors: ErrorResponse['detail'] | null;
  createdHiringManager: GetUpdatedCompanyHiringManagerResponse['data'] | null;
  deletingHiringManger: boolean;
  managerId: number;
  updatingHiringManager: boolean;
  updateHiringManagerErrors: ErrorResponse['detail'] | null;
  hiringManager: CompanyHiringManger | null;
  deletingCompanyLogo: boolean;
  companyLogoDeleted: boolean;
};
