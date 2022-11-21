import {
  CreateCandidateProfessionalDetailsResponse,
  CreateCandidateProfileResponse,
  ErrorResponse,
  GetCandidateDocumentsResponse,
  GetCandidateLicensesResponse,
  GetCandidateOverviewResponse,
  GetCandidatePhotoResponse,
  GetCandidatePrefillDataFromResume,
  GetCandidateVideoInterviewResponse,
  UpdateCandidateDocumentsResponse,
  UploadCandidateCVResponse,
} from '~/types/responses';

export type CreateCandidateState = {
  creatingCandidateProfile: boolean;
  creatingCandidateProfileErrors: ErrorResponse['detail'] | null;
  candidateProfileCreated: CreateCandidateProfileResponse['data'] | null;
  creatingCandidateProfessionalDetails: boolean;
  creatingCandidateProfessionalDetailsErrors: ErrorResponse['detail'] | null;
  candidateProfessionalDetailsCreated: CreateCandidateProfessionalDetailsResponse['data'] | null;
  uploadingCandidateCV: boolean;
  uploadingCandidateBrandedCV: boolean;
  uploadingCandidateCVErrors: ErrorResponse['detail'] | null;
  candidateCVUploaded: UploadCandidateCVResponse['data'] | null;
  uploadingCandidateLicenses: boolean;
  uploadingCandidateLicensesErrors: ErrorResponse['detail'] | null;
  candidateLicensesUploaded: boolean;
  uploadingCandidatePhoto: boolean;
  uploadingCandidatePhotoErrors: ErrorResponse['detail'] | null;
  candidatePhotoUploaded: boolean;
  createdCandidateId: number | null;
  editMode: boolean;
  registeredCandidateId: number;
  loadingCandidateDataForEdit: boolean;
  candidateLicense: GetCandidateLicensesResponse['data'] | [];
  canidateDocuments:
    | GetCandidateDocumentsResponse['data']
    | UpdateCandidateDocumentsResponse['data']['files'];
  candidatePhoto: GetCandidatePhotoResponse['data'] | null;
  candidateVideoInterview: GetCandidateVideoInterviewResponse['data']['video'] | null;
  updatingCandidateLookingForJobStatus: boolean;
  deletingCandidatePhoto: boolean;
  candidatePhotoDeleted: boolean;
  loadingPrefillData: boolean;
  prefillDataFromResume: GetCandidatePrefillDataFromResume['data'] | null;
  interviewQuestions: string[] | null;
  generalExplanation: string | null;
  loadingInterviewQuestions: boolean;
  videoInterviewNotLoadedYet: boolean;
  candidateNewVideoRecorded: string | null;
  candidateVideoInterviewBlob: Blob | null;
  uploadingVideoInterview: boolean;
  isUpload: boolean;
  confirmModalVisibility: boolean;
  deletingVideoInterview: boolean;
  candidateStatus: number;
  candidateBrandedCV: GetCandidateOverviewResponse['data'] | null;
  uploadingDocuments: boolean;
};
