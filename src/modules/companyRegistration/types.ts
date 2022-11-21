import {
  ErrorResponse,
  GetCompanyHiringManagersResponse,
  GetCreatedHiringManagerResponse,
} from '~/types/responses';

export type CompanyRegistrationState = {
  enteringMainInfo: boolean;
  enteringMainInfoErrors: ErrorResponse['detail'] | null;
  mainInfoEntered: boolean;
  creatingContactDetails: boolean;
  creatingContactDetailsErrors: ErrorResponse['detail'] | null;
  contactDetailsCreated: boolean;
  uploadingLogo: boolean;
  uploadingLogoErrors: ErrorResponse['detail'] | null;
  logoUploaded: boolean;
  registeredUserId: number;
  createdCompanyManagers: GetCompanyHiringManagersResponse['data'];
  createdHiringManager: GetCreatedHiringManagerResponse['data'] | null;
  loadingHiringManagers: boolean;
  creatingHiringManager: boolean;
};
