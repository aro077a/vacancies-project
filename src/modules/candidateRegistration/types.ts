import { ErrorResponse } from '~/types/responses';

export type CandidateRegistrationState = {
  creatingProfile: boolean;
  creatingProfileErrors: ErrorResponse['detail'] | null;
  profileCreated: boolean;
  creatingProfessionalDetails: boolean;
  creatingProfessionalDetailsErrors: ErrorResponse['detail'] | null;
  professionalDetailsCreated: boolean;
  uploadingCV: boolean;
  uploadingCVErrors: ErrorResponse['detail'] | null;
  cvUploaded: boolean;
  uploadingLicenses: boolean;
  uploadingLicensesErrors: ErrorResponse['detail'] | null;
  licensesUploaded: boolean;
  uploadingPhoto: boolean;
  uploadingPhotoErrors: ErrorResponse['detail'] | null;
  photoUploaded: boolean;
  registeredUserId: number | null;
};
