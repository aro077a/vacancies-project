/* eslint-disable camelcase */
import { CandidateStatus, EmployerStatus, WhiteboardNoteType } from '~/models/admin';
import { CandidateTimesheetStatus, LookingJobStatus } from '~/models/candidate';
import {
  JobStatus,
  MatchedJobSteps,
  PaymentType,
  PayOption,
  PermissionType,
  PositionType,
} from '~/models/common';
import { TimesheetStatus } from '~/models/company';
import { SelectOption } from '~/view/components/select';

import {
  CreateCandidateProfessionalDetailsFormValues,
  CreateCandidateProfileFormValues,
  CreateCompanyContactDetailsFormValues,
  CreateJobHiringManagerFormValues,
  CreateJobInfoFormValues,
  CreateNewEmployerFormValues,
  EnterCompanyMainInfoFormValues,
  LoginFormValues,
  UpdateCandidateProfessionalDetailsAdminFormValues,
  UploadCandidateCVFormValues,
  UploadCandidateLicensesFormValues,
  UploadCandidatePhotoFormValues,
  UploadCompanyLogoFormValues,
} from './formValues';

export type LoginRequestBody = LoginFormValues;

export type CreateCandidateProfileRequestBody = Omit<
  CreateCandidateProfileFormValues,
  'user' | 'city' | 'state' | 'linkedInResume' | 'admin'
> & {
  user: {
    email: string;
    password: string;
  };
  city: number;
  state: number;
  linkedInResume?: File | string;
  admin?: number;
};

export type GetCompaniesShortListRequestParams = {
  search: string;
  limit: number;
  offset: number;
};

export type CreateCandidateProfessionalDetailsRequestBody = Omit<
  CreateCandidateProfessionalDetailsFormValues | UpdateCandidateProfessionalDetailsAdminFormValues,
  | 'jobPositions'
  | 'projectTypes'
  | 'projectValues'
  | 'interestedCompanies'
  | 'notInterestedCompanies'
  | 'minSalary'
  | 'availability'
  | 'workExps'
  | 'keyProjects'
  | 'jobTitle'
> & {
  jobTitle: number;
  jobPositions: number[];
  projectTypes: number[];
  projectValues?: number;
  interestedCompanies: number[] | undefined;
  notInterestedCompanies: number[] | undefined;
  minSalary: number;
  availability?: number;
  workExps: (Omit<
    CreateCandidateProfessionalDetailsFormValues['workExps'][number],
    'id' | 'location' | 'workStart' | 'workEnd' | 'logo' | 'country'
  > & {
    location: number;
    workStart: string;
    workEnd: string;
    logo: File | string;
    country: number;
  })[];
  keyProjects: (Omit<
    CreateCandidateProfessionalDetailsFormValues['keyProjects'][number],
    'id' | 'location' | 'workStart' | 'workEnd' | 'value'
  > & {
    location: number;
    workStart: string;
    workEnd: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value?: string | number | any;
  })[];
};

export type UploadCandidateCVRequestBody = UploadCandidateCVFormValues;

export type UploadCandidateBrandedCVRequestBody = {
  brandedCv: File | null;
};

export type UploadCandidateLicensesRequestBody = {
  files: UploadCandidateLicensesFormValues[];
};

export type UploadCandidatePhotoRequestBody = UploadCandidatePhotoFormValues;

export type EnterCompanyMainInfoRequestBody = Omit<
  EnterCompanyMainInfoFormValues,
  'user' | 'city' | 'state' | 'site'
> & {
  user: {
    email: string;
    password: string;
  };
  city: number;
  state: number;
  site: string | null;
};

export type CreateCompanyContactDetailsRequestBody = Omit<
  CreateCompanyContactDetailsFormValues,
  'position'
> & {
  position: string | null;
};

export type UploadCompanyLogoRequestBody = UploadCompanyLogoFormValues;

export type GetCompaniesWithLiveJobsCountRequestParams = {
  limit: number;
  offset: number;
  assignedMe?: boolean;
};

export type GetLiveJobsRequestParams = {
  company?: number;
  limit: number;
  offset: number;
  state?: number;
  city?: number;
  position?: number;
  assignedMe?: boolean;
  admin?: number;
  positionType?: PositionType;
  salary__gte?: number;
  salary__lte?: number;
  superAmount__gte?: number;
  superAmount__lte?: number;
  search?: string;
  position__in?: string;
};

export type UpdateLiveJobStatusRequestParams = {
  id: number;
};

export type UpdateLiveJobStatusRequestBody = {
  status: JobStatus;
};

export type GetLiveJobCandidatesRequestParams = {
  id: number;
};

export type UpdateLiveJobCandidateMatchedRequestBody = {
  status: boolean;
  job: number;
  candidate: number;
};

export type GetLiveJobFeedbacksRequestParams = {
  id: number;
};

export type GetLiveJobFeedbackRepliesRequestParams = {
  id: number;
};

export type SendLiveJobFeedbackReplyRequestParams = {
  id: number;
};

export type SendLiveJobFeedbackReplyRequestBody = {
  text: string;
};

export type GetLiveJobRecordRequestParams = {
  id: number | undefined;
};

export type UpdateLiveJobRecordRequestParams = {
  id: number | undefined;
};

export type UpdateLiveJobRecordRequestBody = {
  text: string;
};

export type DeleteLiveJobRecordRequestParams = {
  id: number | undefined;
};

export type GetCandidatesRequestParams = {
  limit?: number;
  offset: number;
  // eslint-disable-next-line camelcase
  prof_detail__job_positions?: number;
  search?: string;
  // eslint-disable-next-line camelcase
  user__status?: number;
  prof_detail__min_salary__gte?: number;
  prof_detail__min_salary__lte?: number;
  city?: number;
  state?: number;
  prof_detail__status?: LookingJobStatus;
  prof_detail__project_types?: number;
  prof_detail__availability__in?: number[];
  prof_detail__project_values?: number;
  prof_detail__permission?: number;
  prof_detail__job_title__in?: string;
};

export type GetCompanyCandidatesRequestParams = {
  position?: number;
  city?: number;
  state?: number;
  prof_detail__job_title?: number;
  prof_detail__job_positions?: number;
  prof_detail__project_types?: number;
  prof_detail__project_values?: number;
  search?: string;
  limit: number;
  offset: number;
  prof_detail__min_salary__gte?: number;
  prof_detail__min_salary__lte?: number;
  shortlist?: string;
  prof_detail__availability__in?: number[];
  prof_detail__job_title__in?: string;
};

export type GetCandidatePotentialRequestParams = {
  limit: number;
  offset: number;
  search?: string;
};

export type GetCompanyJobsRequestParams = {
  limit: number;
  offset: number;
  status?: number;
};

export type GetEmployersResponseParams = {
  limit?: number;
  offset: number;
  search?: string;
  user__status?: number;
};

export type GetEmployerDetailsResponseParams = {
  id: number;
};

export type UpdateEmployerStatusRequestParams = {
  id: number;
};

export type UpdateEmployerStatusRequestBody = {
  status: EmployerStatus;
};

export type GetCandidateJobMatchedParams = {
  id: number;
};

export type UpdateCandidateJobMatchedRequestBody = {
  status: boolean;
  job: number;
  candidate: number;
};

export type getCandidateAdditionalInfoParams = {
  id: number;
};

export type UpdateCandidateStatusRequestParams = {
  id: number;
};

export type UpdateCandidateStatusRequestBody = {
  status: CandidateStatus;
};

export type CreateJobInfoRequestBody = Omit<
  CreateJobInfoFormValues,
  | 'salary'
  | 'company'
  | 'position'
  | 'projectType'
  | 'city'
  | 'state'
  | 'superAmount'
  | 'superType'
  | 'admin'
  | 'representative'
> & {
  salary: number | string;
  company: number | SelectOption<unknown> | null;
  position: number;
  projectType: number;
  city: number;
  state: number;
  status: JobStatus;
  hiringManager: number | undefined;
  superAmount: number | null;
  admin?: number;
  representative?: boolean;
};

export type UpdateJobInfoRequestParams = {
  id: number | null;
};

export type GetJobInfoRequestParams = {
  id: number;
};

export type CreateJobHiringManagerRequestParams = {
  id: number;
};

export type CreateJobHiringManagerRequestBody = Omit<
  CreateJobHiringManagerFormValues,
  'position' | 'name'
> & {
  position: string | null;
  name: string;
};

export type GetJobHiringManagerRequestParams = {
  id: number;
};

export type CreateJobDescriptionRequestParams = {
  id: number;
};

export type CreateJobDescriptionRequestBody = {
  description: string;
};

export type GetJobDescriptionRequestParams = {
  id: number;
};

export type DeleteJobRequestParams = {
  id: number;
};

export type GetCandidateFeedbacksRequestParams = {
  id: number;
};

export type GetCandidateFeedbackRepliesRequestParams = {
  feedbackId: number;
};

export type SendCandidateFeedbackReplyRequestParams = {
  feedbackId: number;
};

export type SendCandidateFeedbackReplyRequestBody = {
  text: string;
};

export type GetCandidateRecordRequestParams = {
  id: number;
};

export type UpdateCandidateRecordRequestParams = {
  id: number | undefined;
};

export type UpdateCandidateRecordRequestBody = {
  text: string;
};

export type UpdateCandidateProfileRequestParams = {
  id: number;
};

export type GetCandidateProfileRequestParams = {
  id: number;
};

export type GetCandidateProfDetailsRequestParams = {
  id: number;
};

export type UpdateCandidateProfDetailsRequestParams = {
  id: number;
};

export type GetCandidateCVRequestParams = {
  id: number;
};

export type GetCandidateLicensesRequestParams = {
  id: number;
};

export type GetCandidatePhotoRequestParams = {
  id: number;
};

export type GetCandidateVideoInterviewRequestParams = {
  id: number;
};

export type CreateCandidateVideoInterviewRequestBody = {
  video: Blob;
};

export type UpdateCandidateLookingForJobStatusRequestBody = {
  status: LookingJobStatus;
};

export type UpdateCandidateLookingForJobRequestParams = {
  id: number;
};

export type GetCandidatePrefillDataRequestParams = {
  linkedInResume: File | null;
};

export type AddContactCandidateRequestBody = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  admin: number;
};

export type AddContactCompanyRequestBody = {
  firstName: string;
  lastName: string;
  position?: number;
  email: string;
  phone?: string;
  company: number;
  project?: number;
  office: number;
  permission?: number;
};

export type GetAdminContactRequestParams = {
  limit: number;
  offset: number;
  position?: number;
  project?: number;
  office?: number;
  search?: string;
  company?: number;
  permission?: PermissionType;
};

export type UpdateAdminMatchedJobStepRequestParams = {
  cardId: number;
};

export type UpdateMatchedJobStepRequestBodyParams = {
  step: MatchedJobSteps;
  notes?: string | null;
  candidateApproval?: boolean;
  companyApproval?: boolean;
};

export type ArrangeInterviewRequestBodyParams = {
  participants: string[];
  date: string;
  time: string;
  message: string;
  location: string;
  matched: number;
  admin?: number;
};

export type CreateInvoiceRequestBodyParams = {
  startDate: string;
  salary: number;
  percent: number;
  matched: number;
  flatFeeDescription?: string;
  flatFee?: number;
};

export type CreateContractRequestBodyParams = {
  paymentType: PaymentType;
  agreementDate: string;
  commencementDate: string;
  supervisor: number;
  hoursOfWork: string;
  candidateRate: number;
  companyRate: number;
  timesheetDeadline: string;
  payOption: PayOption;
  matched: number;
};

export type CreateFeedbackForCandidateBodyParams = {
  text: string;
  candidate: number;
  job: number;
};

export type CreateCompanyInfoRequestBody = Omit<
  CreateNewEmployerFormValues,
  'user' | 'phone' | 'name' | 'address' | 'abn' | 'site' | 'city' | 'state' | 'admin'
> & {
  user: {
    email: string;
    password?: string;
  };
  phone: string;
  name: string;
  address: string;
  abn: string;
  site: string;
  city?: number;
  state?: number;
  admin?: number;
};

export type CreateCompanyBusinessDetailsRequestBody = {
  name: string;
  position: string;
  email: string;
  phone: string;
};

export type AdminProfileDetailsRequestBody = {
  user: {
    email: string;
  };
  phone: string;
};

export type SendContractRequestBody = {
  message?: string;
};

export type TermsAndConditionsRequestBody = {
  text: string | null;
};

export type InterviewQuestionsRequestBody = {
  questionOne: string;
  questionTwo: string;
  questionThree: string;
  questionFour: string;
};
export type ChangePasswordRequestBody = {
  password: string;
  newPassword: string;
  confirmPassword: string;
};
export type CreateFeedbackForJobRequestBody = {
  text: string;
  job: number;
};

export type ApproveMatchedJobContractRequestBody = {
  approved: boolean;
};

export type createReplyForFeedbackRequestBody = {
  text: string;
};

export type GetCandidateFindJobsRequestParams = {
  position?: number;
  position__in?: string;
  city?: number;
  projectType?: number;
  search?: string;
  limit: number;
  offset: number;
  superAmount__gte?: number;
  superAmount__lte?: number;
  salary__gte?: number;
  salary__lte?: number;
  positionType?: PositionType;
  company?: number;
};

export type SetFindJobInterestRequestBody = {
  status: boolean;
  job: number;
};

export type GetECompanyManagersResponseParams = {
  limit: number;
  offset: number;
  search?: string;
};

export type CreateHiringManagerRequestBody = {
  lastName: string;
  firstName: string;
  email: string;
  position?: number;
  phone: string;
  office?: number;
  project?: number;
  permission?: PermissionType;
};

export type GetCandidateTimesheetRequestParams = {
  limit: number;
  offset: number;
  search?: string;
};

export type GetTimesheetPipelineRequestParams = {
  limit: number;
  offset: number;
  step: MatchedJobSteps.TemporaryWorkers;
  contract__isnull: false;
  candidate?: number;
};

export type GetShortListRequestParams = {
  shortlist: 'true';
  offset: number;
  limit: number;
};

export type UpdateShortListStatusRequestBody = {
  shortlist: boolean;
};

export type CreateTimesheetEntryRequestParams = {
  rows: {
    name: string;
    description: string;
    days: number[];
    hours: number[];
  }[];
  additionalExpenses: {
    attachments: File[];
    name: string;
    price: string;
  }[];
  week: string;
  matched: number | null;
};

export type GetCompanyTimesheetRequestParams = {
  limit: number;
  offset: number;
  search?: string;
};

export type UpdateCompanyTimesheetRequestParams = {
  id: number;
};

export type getCompanyTimesheetByIdRequestParams = {
  id: number;
};

export type UpdateCompanyTimesheetStatusRequestBody = {
  status: TimesheetStatus;
};

export type setHiringManagerRequestBody = {
  hiringManager: number;
};

export type GetCompanyActiveJobsParams = {
  status: 1;
  limit: number;
  offset: number;
};

export type GetAdminDashboardTasksRequestParams = {
  limit: number;
  offset: number;
  priority?: string;
};

export type GetAdminDashboardPaymentReportsRequestParams = {
  limit: number;
  offset: number;
  externalStatus?: string;
};

export type CreateDashboardTaskRequestBody = {
  title: string;
  description: string;
  dueDate: string;
};
export type UpdateTaskRequestBody = {
  priority: number;
};

export type getDashboardTaskByIdRequestParams = {
  id: string;
};
export type GetCompanyClosedJobsParams = {
  status: 2;
  limit: number;
  offset: number;
};

export type UpdateCompanyMyJobRequestBody = {
  status: JobStatus;
};

export type GetNotificationParams = {
  limit: number;
  offset: number;
};

export type UpdateNotificationStatusRequestBody = {
  isNew: boolean;
};

export type GetListOfAdminsRequestParams = {
  limit: number;
  offset: number;
  search?: string;
};

export type InviteAdminRequestBody = {
  firstName: string;
  lastName: string;
  email: string;
};

export type GetAdminCompaniesRequestParams = {
  limit: number;
  offset: number;
};

export type GetAdminRegionsRequestParams = {
  limit: number;
  offset: number;
};

export type GetAdminRJobsRequestParams = {
  limit: number;
  offset: number;
};

export type AssignCompaniesAndRegionsToAdminRequestParams = {
  regions: number[];
  positions: number[];
};

export type AssignJobToAdminRequestParams = {
  job: number;
  admin: number | null;
};

export type GetAdminDashboardScoreboardRequestParams = {
  limit: number;
  offset: number;
  month?: number;
  year?: number;
};

export type GetAdminDashboardScoreboardBillingsRequestParams = {
  limit: number;
  offset: number;
};

export type GetAdminMessagesRequestParams = {
  maxResults: number;
  pageToken?: number;
};

export type SendMessageRequestParams = {
  to: string[];
  subject: string;
  messageText: string;
  files?: File[];
};

export type SendResumeRequestParams = {
  candidate?: number;
  jobPosition?: number;
  description: string;
  companies: {
    hiringManagers: number[];
  }[];
};

export type ResetPasswordRequestBody = {
  password: string;
  token: string;
};

export type UpdateEmailSignatureRequestBody = {
  signature: string;
};

export type getCandidateTimesheetByIdRequestParams = {
  id: number;
};

export type GetAdminSentResumesRequestParams = {
  limit: number;
  offset: number;
};

export type UpdateManagerNoteRequestBody = {
  text: string;
};

export type UpdateManagerNotesRequestParams = {
  text: string;
};
export type ManagerNotesRequestParams = {
  id: number | undefined;
};

export type GetCompanyHiringManagersRequestBody = {
  limit: number;
  offset: number;
};

export type GetAdminUnmatchedPipelinesRequestParams = {
  assignedMe: boolean;
  company?: number;
  state?: number;
  city?: number;
  position_type?: PositionType;
  admin?: number;
};

export type GetAdminPipelinesRequestParams = {
  assignedMe: boolean;
  job__state?: number;
  job__city?: number;
  job__company?: number;
  job__position_type?: PositionType;
  admin?: number;
};

export type GetMailAttachmentsRequestParams = {
  messageId: string;
  attachmentId: string;
};

export type UpdateHiringManagerRequestBody = {
  salary?: number;
  company?: number;
  position?: number;
  projectType?: number;
  city?: number;
  state?: number;
  status?: JobStatus;
  hiringManager?: number;
  overview?: string;
  representative?: boolean;
};

export type GetScoreboardDetailsRequestBody = {
  limit: number;
  offset: number;
  month?: number | string;
  year?: number | string;
};

export type GetCompanyInterestedInRequestParams = {
  limit: number;
  offset: number;
  interested: true;
};

export type GetAdminTimesheetRequestParams = {
  limit: number;
  offset: number;
  matched__job__company?: number;
  matched__candidate?: number;
  status?: CandidateTimesheetStatus;
  week?: string;
};

export type getAdminTimesheetByIdRequestParams = {
  id: number;
};

export type UpdateAdminTimesheetStatusRequestBody = {
  status: TimesheetStatus;
};

export type GetCompaniesWithJobsRequestParams = {
  offset: number;
  limit?: number;
};

export type SendContactUsFormRequestBody = {
  name: string;
  email: string;
  comment: string;
};

export type CreateWhiteboardNoteRequestBody = {
  value?: number;
  description: string;
  type: WhiteboardNoteType;
};

export type SetContractStatusRequestBody = {
  candidateApproval?: boolean;
  companyApproval?: boolean;
};

export type UploadCandidateDocumentsRequestBody = {
  files: {
    file: File;
  }[];
};
