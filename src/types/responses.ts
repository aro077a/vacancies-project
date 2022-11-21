import {
  AdminCompanyList,
  AdminJobs,
  AdminPaymentDetails,
  AdminRegions,
  AdminsList,
  AdminTimesheet,
  AdminTimesheetById,
  ArrangedInterview,
  AssignedCompaniesAndRegions,
  AssignJobToAdmin,
  Candidate,
  CandidateAdditionalInfo,
  CandidateFeedback,
  CandidateFeedbackReplies,
  CandidateMatched,
  CandidateOverview,
  CandidateProfessionalDetails as CandidateProfDetailsByAdmin,
  CandidateRecord,
  CandidateStatus,
  ChangePassword,
  CompanyWithLiveJobsCount,
  ContactCandidates,
  ContactCompanies,
  CreatedContract,
  CreatedInvoice,
  DashboardBillings,
  DashboardPaymentReports,
  DashboardScoreboard,
  DashboardTasks,
  EmployerDetailsProps,
  Employers,
  FullThread,
  GetAdminProfile,
  InterviewQuestions,
  InvitedAdmin,
  JobContract,
  LiveJob,
  LiveJobCandidate,
  LiveJobFeedback,
  LiveJobFeedbackReplies,
  ManagerNote,
  MatchedCandidateTimesheet,
  MatchedCompanyTimesheet,
  MatchedJob,
  ScoreboardInterview,
  ScoreboardJob,
  ScoreboardPlacement,
  ScoreboardRevenue,
  ScoreboardTempWork,
  SendResume,
  SendResumeLog,
  TermsAndConditions,
  Thread,
  UnmatchedJob,
  UpdateDashboardTask,
  User as AdminUser,
  WhiteboardNote,
} from '~/models/admin';
import {
  CandidateTimesheet,
  CandidateTimesheetById,
  CreatedTimesheetEntry,
  FindJob,
  License as CandidateLicense,
  LookingJobStatus,
  MatchedJobContract,
  MatchedJobDetail,
  MatchedJobFeedback,
  Photo as CandidatePhoto,
  ProfessionalDetails as CandidateProfessionalDetails,
  Profile as CandidateProfile,
  TimesheetPipeline,
  User as CandidateUser,
} from '~/models/candidate';
import {
  CandidateDocument,
  City,
  CompanyType,
  Country,
  CV as CandidateCV,
  JobDescription,
  JobGroup,
  JobHiringManager,
  JobInfo,
  JobPosition,
  JobStatus,
  MatchedJobFeedbackReply,
  MatchedJobSteps,
  Notification,
  ProjectType,
  State,
} from '~/models/common';
import {
  CompanyHiringManger,
  CompanyMainInfo,
  CompanyTimesheet,
  CompanyTimesheetById,
  ContactDetails as CompanyContactDetails,
  Info as CompanyInfo,
  Logo as CompanyLogo,
  MatchedCandidateContract,
  MatchedCandidateDetail,
  MatchedCandidateFeedback,
  MyJob,
  RepresentativeManagerType,
  SearchCandidate,
  User as CompanyUser,
} from '~/models/company';
import { CreateCompany, CreateCompanyBusinessDetails } from '~/models/employer';
import { User as ManagerUser } from '~/models/hiringManager';
import { User as SuperAdminUser } from '~/models/superAdmin';

export type ErrorResponse = {
  status: 'error';
  code: number;
  data: null;
  detail: string | Record<string, string[] | Record<string, string[]>>;
};

type GmailApiSuccessPaginatedResponse<T> = {
  status: 'success';
  code: number;
  data: {
    threads: T[];
    nextPageToken: number;
  };
  detail: null;
};

type ApiSuccessResponse<T> = {
  status: 'success';
  code: number;
  data: T;
  detail: null;
};

type ApiSuccessPaginatedResponse<T, AdditionalT = unknown> = ApiSuccessResponse<
  {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
  } & AdditionalT
>;

export type GetStatesResponse = ApiSuccessResponse<State[]>;

export type GetCitiesResponse = ApiSuccessResponse<City[]>;

export type GetCountriesResponse = ApiSuccessResponse<Country[]>;

export type GetJobPositionsResponse = ApiSuccessResponse<JobPosition[]>;

export type GetJobGroupTypeResponse = ApiSuccessResponse<JobGroup[]>;

export type GetProjectTypesResponse = ApiSuccessResponse<ProjectType[]>;

export type GetCompaniesResponse = ApiSuccessResponse<CompanyType[]>;

export type GetCompaniesShortListResponse = ApiSuccessPaginatedResponse<{
  id: number;
  name: string;
  companyLogo: string | null;
}>;

export type CreateCandidateProfileResponse = ApiSuccessResponse<CandidateProfile>;

export type CreateCandidateProfessionalDetailsResponse =
  ApiSuccessResponse<CandidateProfessionalDetails>;

export type UploadCandidateCVResponse = ApiSuccessResponse<CandidateCV>;

export type UploadCandidateLicensesResponse = ApiSuccessResponse<{
  files: CandidateLicense[];
}>;

export type UploadCandidatePhotoResponse = ApiSuccessResponse<CandidatePhoto>;

export type EnterCompanyMainInfoResponse = ApiSuccessResponse<CompanyInfo>;

export type CreateCompanyContactDetailsResponse = ApiSuccessResponse<CompanyContactDetails>;

export type UploadCompanyLogoResponse = ApiSuccessResponse<CompanyLogo>;

export type LoginResponse<
  T = AdminUser | CandidateUser | CompanyUser | ManagerUser | SuperAdminUser,
> = ApiSuccessResponse<T>;

export type RefreshTokensResponse = ApiSuccessResponse<{
  access: string;
  refresh: string;
}>;

export type GetCompaniesWithLiveJobsCountResponse = ApiSuccessPaginatedResponse<
  CompanyWithLiveJobsCount,
  { countJobs: number }
>;

export type GetLiveJobsResponse = ApiSuccessPaginatedResponse<LiveJob>;

export type GetLiveJobResponse = ApiSuccessResponse<LiveJob>;

export type UpdateLiveJobStatusResponse = ApiSuccessResponse<{
  status: JobStatus;
}>;

export type GetLiveJobCandidatesResponse = ApiSuccessResponse<LiveJobCandidate[]>;

export type UpdateLiveJobCandidateMatchedResponse = ApiSuccessResponse<{
  id: number;
  status: boolean;
  createdAt: string;
  job: number;
  candidate: number;
}>;

export type GetLiveJobFeedbacksResponse = ApiSuccessResponse<LiveJobFeedback[]>;

export type GetLiveJobFeedbackRepliesResponse = ApiSuccessResponse<LiveJobFeedbackReplies>;

export type SendLiveJobFeedbackReplyResponse = ApiSuccessResponse<{
  addedAt: string;
  id: number;
  photo: string | null;
  text: string;
}>;

export type GetLiveJobContractsResponse = ApiSuccessResponse<JobContract[]>;

export type GetCandidatesResponse = ApiSuccessPaginatedResponse<Candidate>;

export type GetEmployersResponse = ApiSuccessPaginatedResponse<Employers>;

export type GetEmployersDetailsResponse = ApiSuccessResponse<EmployerDetailsProps>;

export type GetCandidateJobMatchedResponse = ApiSuccessResponse<CandidateMatched[]>;

export type GetCandidatePotentialResponse = ApiSuccessPaginatedResponse<CandidateMatched>;

export type GetCandidateOverviewResponse = ApiSuccessResponse<CandidateOverview>;

export type UpdateCandidateJobMatchedResponse = ApiSuccessResponse<{
  id: number;
  status: boolean;
  createdAt: string;
  job: number;
  candidate: number;
}>;

export type getCandidateAdditionalInfoResponse = ApiSuccessResponse<CandidateAdditionalInfo>;

export type UpdateCandidateStatusResponse = ApiSuccessResponse<CandidateStatus>;

export type CreateJobInfoResponse = ApiSuccessResponse<JobInfo>;

export type GetJobInfoResponse = ApiSuccessResponse<JobInfo>;

export type CreateJobHiringManagerResponse = ApiSuccessResponse<JobHiringManager>;

export type GetJobHiringManagerResponse = ApiSuccessResponse<JobHiringManager>;

export type CreateJobDescriptionResponse = ApiSuccessResponse<JobDescription>;

export type GetJobDescriptionResponse = ApiSuccessResponse<JobDescription>;

export type GetCandidateFeedbacksResponse = ApiSuccessResponse<CandidateFeedback[]>;

export type GetCandidateFeedbackRepliesResponse = ApiSuccessResponse<CandidateFeedbackReplies>;

export type SendCandidateFeedbackReplyResponse = ApiSuccessResponse<{
  addedAt: string;
  id: number;
  photo: string | null;
  text: string;
  name: string;
}>;

export type GetCandidateRecordResponse = ApiSuccessResponse<CandidateRecord[]>;

export type UpdateCandidateRecordResponse = ApiSuccessResponse<CandidateRecord>;

export type GetCandidateProfileResponse = ApiSuccessResponse<CandidateProfile>;

export type GetCandidateProfDetailsResponse = ApiSuccessResponse<CandidateProfessionalDetails>;

export type GetCandidateCVResponse = ApiSuccessResponse<CandidateCV>;

export type GetCandidateLicensesResponse = ApiSuccessResponse<CandidateLicense[]>;

export type GetCandidatePhotoResponse = ApiSuccessResponse<CandidatePhoto>;

export type GetCandidateVideoInterviewResponse = ApiSuccessResponse<{
  video: string;
}>;

export type UpdateCandidateLookingForJobStatus = ApiSuccessResponse<{
  status: LookingJobStatus;
}>;

export type GetCandidateProfDetailsByAdminResponse =
  ApiSuccessResponse<CandidateProfDetailsByAdmin>;

export type GetCandidatePrefillDataFromResume = ApiSuccessResponse<any>;

export type GetContactCompaniesResponse = ApiSuccessPaginatedResponse<ContactCompanies>;

export type GetContactCandidatesResponse = ApiSuccessPaginatedResponse<ContactCandidates>;

export type CreateNewContactCompanyResponse = ApiSuccessResponse<ContactCompanies>;
export type CreateNewContactCandidateResponse = ApiSuccessResponse<ContactCandidates>;
export type GetUnmatchedJobPipelineResponse = ApiSuccessResponse<UnmatchedJob[]>;

export type GetMatchedJobsPipelineResponse = ApiSuccessResponse<MatchedJob[]>;

export type GetMatchedJobPipelineResponse = ApiSuccessResponse<{
  step: MatchedJobSteps;
  notes: string;
  candidateApproval: boolean;
  companyApproval: boolean;
}>;

export type ArrangeInterviewResponse = ApiSuccessResponse<ArrangedInterview>;

export type CreateInvoiceResponse = ApiSuccessResponse<CreatedInvoice>;

export type CreateContractResponse = ApiSuccessResponse<CreatedContract>;

export type CreatedFeedbackForCandidateResponse = ApiSuccessResponse<{
  id: number;
  text: string;
  createdAt: string;
  candidate: number;
  job: number;
}>;

export type CreateEmployerCompanyInfoResponse = ApiSuccessResponse<CreateCompany>;

export type CreateCompanyBusinessDetailsResponse = ApiSuccessResponse<CreateCompanyBusinessDetails>;

export type GetAdminProfileResponse = ApiSuccessResponse<GetAdminProfile>;
export type GetAdminPaymentResponse = ApiSuccessResponse<AdminPaymentDetails>;
export type EditPasswordResponse = ApiSuccessResponse<ChangePassword>;
export type GetTermsAndConditionsResponse = ApiSuccessResponse<TermsAndConditions>;
export type GetInterviewQuestionsResponse = ApiSuccessResponse<InterviewQuestions>;
export type CreatedFeedbackForJobResponse = ApiSuccessResponse<{
  id: number;
  text: string;
  createdAd: string;
  job: number;
}>;

export type GetMatchedJobDetailResponse = ApiSuccessResponse<MatchedJobDetail>;

export type GetMatchedJobContractsResponse = ApiSuccessResponse<MatchedJobContract>;

export type GetMatchedJobFeedbackResponse = ApiSuccessResponse<MatchedJobFeedback>;

export type CreatedReplyFeedbackResponse = ApiSuccessResponse<MatchedJobFeedbackReply>;

export type GetMatchedCandidateDetailResponse = ApiSuccessResponse<MatchedCandidateDetail>;

export type GetMatchedCandidateContractsResponse = ApiSuccessResponse<MatchedCandidateContract[]>;

export type GetMatchedCandidateFeedbackResponse = ApiSuccessResponse<MatchedCandidateFeedback[]>;

export type GetFindJobsResponse = ApiSuccessPaginatedResponse<FindJob>;

export type GetShortListResponse = ApiSuccessPaginatedResponse<FindJob | SearchCandidate>;

export type SetJobInterestResponse = ApiSuccessResponse<{
  id: number;
  status: boolean;
  job: number;
}>;

export type CompanyInterestResponse = ApiSuccessResponse<{
  id: number;
  status: boolean;
  job: number;
  candidate: number;
}>;

export type GetCompanyResponse = ApiSuccessResponse<CompanyMainInfo>;

export type GetClientContactDetailsResponse = ApiSuccessResponse<CreateCompanyBusinessDetails>;

export type GetCompanyLogoResponse = ApiSuccessResponse<CompanyLogo>;

export type GetCompanyHiringManagerResponse = ApiSuccessPaginatedResponse<CompanyHiringManger>;

export type GetUpdatedCompanyHiringManagerResponse = ApiSuccessResponse<CompanyHiringManger>;

export type GetCompanyCandidatesResponse = ApiSuccessPaginatedResponse<SearchCandidate>;

export type GetCompanyCandidateInfoResponse = ApiSuccessResponse<MatchedCandidateDetail>;

export type GetCompanyJobs = ApiSuccessPaginatedResponse<MyJob>;
export type GetCompanyHiringManagersResponse = ApiSuccessPaginatedResponse<CompanyHiringManger>;
export type GetHiringManagersResponse = ApiSuccessResponse<CompanyHiringManger[]>;

export type GetCreatedHiringManagerResponse = ApiSuccessResponse<CompanyHiringManger>;

export type GetCandidateTimesheetResponse = ApiSuccessPaginatedResponse<CandidateTimesheet>;

export type GetTimesheetPipelineResponse = ApiSuccessPaginatedResponse<TimesheetPipeline>;

export type UpdateShortListResponse = ApiSuccessResponse<{
  shortlist: boolean;
  job: number;
  candidate: number;
}>;

export type CreateTimesheetEntryResponse = ApiSuccessPaginatedResponse<CreatedTimesheetEntry>;

export type GetCompanyTimesheetResponse = ApiSuccessPaginatedResponse<CompanyTimesheet>;

export type UpdateCompanyTimesheetStatusResponse = ApiSuccessResponse<CompanyTimesheet>;

export type GetCompanyTimesheetByIdResponse = ApiSuccessResponse<CompanyTimesheetById>;

export type GetAdminDashboardTasksResponse = ApiSuccessPaginatedResponse<DashboardTasks>;

export type GetAdminDashboardPaymentReportsResponse =
  ApiSuccessPaginatedResponse<DashboardPaymentReports>;

export type CreateDashboardTaskResponse = ApiSuccessResponse<DashboardTasks>;

export type UpdateDashboardTaskResponse = ApiSuccessResponse<UpdateDashboardTask>;

export type GetDashboardTaskByIdResponse = ApiSuccessResponse<DashboardTasks>;
export type GetCompanyMyJobsResponse = ApiSuccessPaginatedResponse<MyJob>;

export type UpdateCompanyMyJobResponse = ApiSuccessResponse<MyJob>;

export type GetNotificationsResponse = ApiSuccessPaginatedResponse<Notification>;

export type GetNotificationsCountResponse = ApiSuccessResponse<{
  count: number;
}>;

export type GetListOfAdminsResponse = ApiSuccessPaginatedResponse<AdminsList>;

export type InviteAdminResponse = ApiSuccessResponse<InvitedAdmin>;

export type GetAdminPositionsListResponse = ApiSuccessPaginatedResponse<AdminCompanyList>;

export type GetAdminRegionsResponse = ApiSuccessPaginatedResponse<AdminRegions>;

export type GetAdminJobsResponse = ApiSuccessPaginatedResponse<AdminJobs>;

export type AssignCompaniesAndRegionsToAdminResponse =
  ApiSuccessResponse<AssignedCompaniesAndRegions>;

export type AssignJobToAdminResponse = ApiSuccessResponse<AssignJobToAdmin>;

export type GetAdminDashboardScoreboardResponse = ApiSuccessResponse<DashboardScoreboard>;

export type GetAdminDashboardBillingsResponse = ApiSuccessResponse<DashboardBillings>;

export type GetAdminEmailsResponse = GmailApiSuccessPaginatedResponse<Thread>;

export type SendResumeResponse = ApiSuccessResponse<SendResume>;

export type GetEmailInfoResponse = ApiSuccessResponse<FullThread>;

export type GetEmailSignatureResponse = ApiSuccessResponse<{
  signature: string;
}>;

export type GetCandidateTimesheetByIdResponse = ApiSuccessResponse<CandidateTimesheetById>;

export type GetSentResumesResponse = ApiSuccessPaginatedResponse<SendResumeLog>;

export type GetManagerNotesResponse = ApiSuccessResponse<ManagerNote[]>;

export type UpdateManagerNotesResponse = ApiSuccessResponse<ManagerNote>;

export type GetLiveJobRecordResponse = ApiSuccessResponse<CandidateRecord[]>;

export type UpdateLiveJobRecordResponse = ApiSuccessResponse<CandidateRecord>;

export type GetMailAttachmentResponse = ApiSuccessResponse<{
  data: string;
}>;

export type GetGeneratedContractResponse = ApiSuccessResponse<string>;

export type GetScoreboardInterviewsResponse = ApiSuccessPaginatedResponse<ScoreboardInterview>;

export type GetScoreboardJobsResponse = ApiSuccessPaginatedResponse<ScoreboardJob>;

export type GetScoreboardPlacementsResponse = ApiSuccessPaginatedResponse<ScoreboardPlacement>;

export type GetScoreboardRevenuesResponse = ApiSuccessPaginatedResponse<ScoreboardRevenue>;

export type GetScoreboardTempWorksResponse = ApiSuccessPaginatedResponse<ScoreboardTempWork>;

export type GetScoreboardDetailsResponse =
  | GetScoreboardInterviewsResponse
  | GetScoreboardPlacementsResponse
  | GetScoreboardRevenuesResponse
  | GetScoreboardJobsResponse
  | GetScoreboardTempWorksResponse;

export type GetAdminTimesheetResponse = ApiSuccessPaginatedResponse<AdminTimesheet>;

export type GetAdminTimesheetByIdResponse = ApiSuccessResponse<AdminTimesheetById>;

export type UpdateAdminTimesheetStatusResponse = ApiSuccessResponse<AdminTimesheet>;

export type GetCompanyWithTimesheetResponse = ApiSuccessResponse<MatchedCompanyTimesheet[]>;

export type GetCandidateWithTimesheetResponse = ApiSuccessResponse<MatchedCandidateTimesheet[]>;

export type GetAdminWhiteboardNotesResponse = ApiSuccessResponse<WhiteboardNote[]>;

export type GetWhiteboardNoteCreatedResponse = ApiSuccessResponse<WhiteboardNote>;

export type GetWhiteboardTotalValueResponse = ApiSuccessResponse<{
  total: number;
}>;

export type GetCandidateDocumentsResponse = ApiSuccessResponse<CandidateDocument[]>;

export type UpdateCandidateDocumentsResponse = ApiSuccessResponse<{
  files: CandidateDocument[];
}>;

export type RepresentativeManagerResponse = ApiSuccessResponse<RepresentativeManagerType>;
