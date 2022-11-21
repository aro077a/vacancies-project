import {
  CreateJobDescriptionResponse,
  CreateJobInfoResponse,
  ErrorResponse,
  GetCreatedHiringManagerResponse,
  GetHiringManagersResponse,
  RepresentativeManagerResponse,
} from '~/types/responses';

export type CreateJobState = {
  creatingJobInfo: boolean;
  creatingJobInfoErrors: ErrorResponse['detail'] | null;
  createdJobInfo: CreateJobInfoResponse['data'] | null;
  creatingHiringManager: boolean;
  creatingHiringManagerErrors: ErrorResponse['detail'] | null;
  createdHiringManager: GetCreatedHiringManagerResponse['data'] | null;
  creatingDescription: boolean;
  createdDescription: CreateJobDescriptionResponse['data'] | null;
  loadingJobDataForEdit: boolean;
  editMode: boolean;
  deleteModalVisible: boolean;
  deletingJob: boolean;
  loadingHiringManagers: boolean;
  addingHiringManager: boolean;
  addedHiringManager: GetCreatedHiringManagerResponse['data'] | null;
  settingHiringManager: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  saveCreatedJobInfo: any;
  savedCompanyId: number | undefined;
  updatingJobInfo: boolean;
  jobHiringManagers: GetHiringManagersResponse['data'];
  representativeManager: RepresentativeManagerResponse['data'] | null;
  loadingRepresentativeManager: boolean;
};
