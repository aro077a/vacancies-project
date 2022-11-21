import { AxiosPromise } from 'axios';

import { AdminPaymentDetails } from '~/models/admin';
import {
  AddContactCandidateRequestBody,
  AddContactCompanyRequestBody,
  AdminProfileDetailsRequestBody,
  ArrangeInterviewRequestBodyParams,
  AssignCompaniesAndRegionsToAdminRequestParams,
  AssignJobToAdminRequestParams,
  ChangePasswordRequestBody,
  CreateCandidateProfessionalDetailsRequestBody,
  CreateContractRequestBodyParams,
  CreateDashboardTaskRequestBody,
  CreateInvoiceRequestBodyParams,
  CreateTimesheetEntryRequestParams,
  CreateWhiteboardNoteRequestBody,
  DeleteLiveJobRecordRequestParams,
  GetAdminCompaniesRequestParams,
  GetAdminContactRequestParams,
  GetAdminDashboardPaymentReportsRequestParams,
  GetAdminDashboardScoreboardBillingsRequestParams,
  GetAdminDashboardScoreboardRequestParams,
  GetAdminDashboardTasksRequestParams,
  GetAdminMessagesRequestParams,
  GetAdminPipelinesRequestParams,
  GetAdminRegionsRequestParams,
  GetAdminRJobsRequestParams,
  GetAdminSentResumesRequestParams,
  getAdminTimesheetByIdRequestParams,
  GetAdminTimesheetRequestParams,
  GetAdminUnmatchedPipelinesRequestParams,
  getCandidateAdditionalInfoParams,
  GetCandidateFeedbackRepliesRequestParams,
  GetCandidateFeedbacksRequestParams,
  GetCandidateJobMatchedParams,
  GetCandidatePotentialRequestParams,
  GetCandidateProfDetailsRequestParams,
  GetCandidateRecordRequestParams,
  GetCandidatesRequestParams,
  GetCompaniesWithLiveJobsCountRequestParams,
  getDashboardTaskByIdRequestParams,
  GetEmployerDetailsResponseParams,
  GetEmployersResponseParams,
  GetListOfAdminsRequestParams,
  GetLiveJobCandidatesRequestParams,
  GetLiveJobFeedbackRepliesRequestParams,
  GetLiveJobFeedbacksRequestParams,
  GetLiveJobRecordRequestParams,
  GetLiveJobsRequestParams,
  GetMailAttachmentsRequestParams,
  GetScoreboardDetailsRequestBody,
  GetTimesheetPipelineRequestParams,
  InterviewQuestionsRequestBody,
  InviteAdminRequestBody,
  ManagerNotesRequestParams,
  SendCandidateFeedbackReplyRequestBody,
  SendCandidateFeedbackReplyRequestParams,
  SendContractRequestBody,
  SendLiveJobFeedbackReplyRequestBody,
  SendLiveJobFeedbackReplyRequestParams,
  SendResumeRequestParams,
  SetContractStatusRequestBody,
  TermsAndConditionsRequestBody,
  UpdateAdminMatchedJobStepRequestParams,
  UpdateAdminTimesheetStatusRequestBody,
  UpdateCandidateJobMatchedRequestBody,
  UpdateCandidateProfDetailsRequestParams,
  UpdateCandidateRecordRequestBody,
  UpdateCandidateRecordRequestParams,
  UpdateCandidateStatusRequestBody,
  UpdateCandidateStatusRequestParams,
  UpdateEmailSignatureRequestBody,
  UpdateEmployerStatusRequestBody,
  UpdateEmployerStatusRequestParams,
  UpdateLiveJobCandidateMatchedRequestBody,
  UpdateLiveJobRecordRequestBody,
  UpdateLiveJobRecordRequestParams,
  UpdateLiveJobStatusRequestBody,
  UpdateLiveJobStatusRequestParams,
  UpdateManagerNotesRequestParams,
  UpdateMatchedJobStepRequestBodyParams,
  UpdateTaskRequestBody,
  UploadCandidateBrandedCVRequestBody,
  UploadCandidateDocumentsRequestBody,
} from '~/types/requests';
import {
  ArrangeInterviewResponse,
  AssignCompaniesAndRegionsToAdminResponse,
  AssignJobToAdminResponse,
  CreateContractResponse,
  CreateDashboardTaskResponse,
  CreateInvoiceResponse,
  CreateNewContactCandidateResponse,
  CreateNewContactCompanyResponse,
  CreateTimesheetEntryResponse,
  EditPasswordResponse,
  GetAdminDashboardBillingsResponse,
  GetAdminDashboardPaymentReportsResponse,
  GetAdminDashboardScoreboardResponse,
  GetAdminDashboardTasksResponse,
  GetAdminEmailsResponse,
  GetAdminJobsResponse,
  GetAdminPaymentResponse,
  GetAdminPositionsListResponse,
  GetAdminProfileResponse,
  GetAdminRegionsResponse,
  GetAdminTimesheetByIdResponse,
  GetAdminTimesheetResponse,
  GetAdminWhiteboardNotesResponse,
  getCandidateAdditionalInfoResponse,
  GetCandidateDocumentsResponse,
  GetCandidateFeedbackRepliesResponse,
  GetCandidateFeedbacksResponse,
  GetCandidateJobMatchedResponse,
  GetCandidateOverviewResponse,
  GetCandidatePotentialResponse,
  GetCandidateProfDetailsByAdminResponse,
  GetCandidateRecordResponse,
  GetCandidatesResponse,
  GetCandidateVideoInterviewResponse,
  GetCandidateWithTimesheetResponse,
  GetCompaniesWithLiveJobsCountResponse,
  GetCompanyWithTimesheetResponse,
  GetContactCandidatesResponse,
  GetContactCompaniesResponse,
  GetDashboardTaskByIdResponse,
  GetEmailInfoResponse,
  GetEmailSignatureResponse,
  GetEmployersDetailsResponse,
  GetEmployersResponse,
  GetGeneratedContractResponse,
  GetInterviewQuestionsResponse,
  GetListOfAdminsResponse,
  GetLiveJobCandidatesResponse,
  GetLiveJobContractsResponse,
  GetLiveJobFeedbackRepliesResponse,
  GetLiveJobFeedbacksResponse,
  GetLiveJobRecordResponse,
  GetLiveJobResponse,
  GetLiveJobsResponse,
  GetMailAttachmentResponse,
  GetManagerNotesResponse,
  GetMatchedJobPipelineResponse,
  GetMatchedJobsPipelineResponse,
  GetScoreboardInterviewsResponse,
  GetScoreboardJobsResponse,
  GetScoreboardPlacementsResponse,
  GetScoreboardRevenuesResponse,
  GetScoreboardTempWorksResponse,
  GetSentResumesResponse,
  GetTermsAndConditionsResponse,
  GetTimesheetPipelineResponse,
  GetUnmatchedJobPipelineResponse,
  GetWhiteboardNoteCreatedResponse,
  GetWhiteboardTotalValueResponse,
  InviteAdminResponse,
  SendCandidateFeedbackReplyResponse,
  SendLiveJobFeedbackReplyResponse,
  SendResumeResponse,
  UpdateAdminTimesheetStatusResponse,
  UpdateCandidateDocumentsResponse,
  UpdateCandidateJobMatchedResponse,
  UpdateCandidateRecordResponse,
  UpdateCandidateStatusResponse,
  UpdateLiveJobCandidateMatchedResponse,
  UpdateLiveJobRecordResponse,
  UpdateLiveJobStatusResponse,
  UpdateManagerNotesResponse,
} from '~/types/responses';

import { Api } from './Api';

export class Admin {
  static getCompaniesWithLiveJobsCount(
    params: GetCompaniesWithLiveJobsCountRequestParams,
  ): AxiosPromise<GetCompaniesWithLiveJobsCountResponse> {
    return Api.get('company/company_live_job', params);
  }

  static getLiveJobs(params: GetLiveJobsRequestParams): AxiosPromise<GetLiveJobsResponse> {
    return Api.get('jobs/live_jobs', params);
  }

  static getLiveJob(jobId: number): AxiosPromise<GetLiveJobResponse> {
    return Api.get(`jobs/live_jobs/${jobId}`);
  }

  static updateLiveJobStatus(
    params: UpdateLiveJobStatusRequestParams,
    body: UpdateLiveJobStatusRequestBody,
  ): AxiosPromise<UpdateLiveJobStatusResponse> {
    return Api.put(`jobs/live_jobs/${params.id}/status`, body);
  }

  static getLiveJobMatchedCandidates(
    params: GetLiveJobCandidatesRequestParams,
  ): AxiosPromise<GetLiveJobCandidatesResponse> {
    return Api.get(`jobs/live_jobs/${params.id}/matched`);
  }

  static getLiveJobInterestedCandidates(
    params: GetLiveJobCandidatesRequestParams,
  ): AxiosPromise<GetLiveJobCandidatesResponse> {
    return Api.get(`jobs/live_jobs/${params.id}/candidate-interest`);
  }

  static getLiveJobCompanyInterestedCandidates(
    params: GetLiveJobCandidatesRequestParams,
  ): AxiosPromise<GetLiveJobCandidatesResponse> {
    return Api.get(`jobs/live_jobs/${params.id}/company-interest`);
  }

  static getLiveJobPotentialCandidates(
    params: GetLiveJobCandidatesRequestParams,
  ): AxiosPromise<GetLiveJobCandidatesResponse> {
    return Api.get(`jobs/live_jobs/${params.id}/potential`);
  }

  static updateLiveJobCandidateMatched(
    body: UpdateLiveJobCandidateMatchedRequestBody,
  ): AxiosPromise<UpdateLiveJobCandidateMatchedResponse> {
    return Api.put('admins/match', body);
  }

  static getLiveJobFeedbacks(
    params: GetLiveJobFeedbacksRequestParams,
  ): AxiosPromise<GetLiveJobFeedbacksResponse> {
    return Api.get(`jobs/${params.id}/feedback`);
  }

  static getLiveJobFeedbackReplies(
    params: GetLiveJobFeedbackRepliesRequestParams,
  ): AxiosPromise<GetLiveJobFeedbackRepliesResponse> {
    return Api.get(`jobs/feedback/${params.id}`);
  }

  static sendLiveJobFeedbackReply(
    params: SendLiveJobFeedbackReplyRequestParams,
    body: SendLiveJobFeedbackReplyRequestBody,
  ): AxiosPromise<SendLiveJobFeedbackReplyResponse> {
    return Api.post(`jobs/feedback/${params.id}/reply`, body);
  }

  static getLiveJobRecordsRequest(
    params: GetLiveJobRecordRequestParams,
  ): AxiosPromise<GetLiveJobRecordResponse> {
    return Api.get(`jobs/${params.id}/record`);
  }

  static addLiveJobRecordRequest(
    params: UpdateLiveJobRecordRequestParams,
    body: UpdateLiveJobRecordRequestBody,
  ): AxiosPromise<UpdateLiveJobRecordResponse> {
    return Api.post(`jobs/${params.id}/record`, body);
  }

  static updateLiveJobRecordRequest(
    params: UpdateLiveJobRecordRequestParams,
    recordId: number,
    body: UpdateLiveJobRecordRequestBody,
  ): AxiosPromise<UpdateLiveJobRecordResponse> {
    return Api.put(`jobs/${params.id}/record/${recordId}`, body);
  }

  static deleteLiveJobRecordRequest(
    params: DeleteLiveJobRecordRequestParams,
    recordId: number,
  ): AxiosPromise<UpdateLiveJobRecordResponse> {
    return Api.delete(`jobs/${params.id}/record/${recordId}`);
  }

  static getCandidates(params: GetCandidatesRequestParams): AxiosPromise<GetCandidatesResponse> {
    return Api.get('candidate/admin_tab', params);
  }

  static getEmployers(params: GetEmployersResponseParams): AxiosPromise<GetEmployersResponse> {
    return Api.get('company/admin_tab', params);
  }

  static getEmployerDetailsId(
    params: GetEmployerDetailsResponseParams,
  ): AxiosPromise<GetEmployersDetailsResponse> {
    return Api.get(`company/${params.id}/admin_tab`);
  }

  static updateEmployerStatus(
    params: UpdateEmployerStatusRequestParams,
    body: UpdateEmployerStatusRequestBody,
  ): AxiosPromise<void> {
    return Api.put(`company/${params.id}/approve`, body);
  }

  static getCandidateJobsMatched(
    params: GetCandidateJobMatchedParams,
  ): AxiosPromise<GetCandidateJobMatchedResponse> {
    return Api.get(`candidate/${params.id}/matched`);
  }

  static getCandidateOverview(
    params: GetCandidateJobMatchedParams,
  ): AxiosPromise<GetCandidateOverviewResponse> {
    return Api.get(`candidate/${params.id}/admin_tab`);
  }

  static getJobsShowedInterestInCandidate(
    params: GetCandidateJobMatchedParams,
  ): AxiosPromise<GetCandidateJobMatchedResponse> {
    return Api.get(`candidate/${params.id}/company-interest`);
  }

  static getCandidateInterestJob(
    params: GetCandidateJobMatchedParams,
  ): AxiosPromise<GetCandidateJobMatchedResponse> {
    return Api.get(`candidate/${params.id}/candidate-interest`);
  }

  static getPotentialCandidateJobs(
    candidateId: number,
    params: GetCandidatePotentialRequestParams,
  ): AxiosPromise<GetCandidatePotentialResponse> {
    return Api.get(`candidate/${candidateId}/potential`, params);
  }

  static updateCandidateJobMatched(
    body: UpdateCandidateJobMatchedRequestBody,
  ): AxiosPromise<UpdateCandidateJobMatchedResponse> {
    return Api.put('admins/match', body);
  }

  static getCandidateAdditionalInfo(
    params: getCandidateAdditionalInfoParams,
  ): AxiosPromise<getCandidateAdditionalInfoResponse> {
    return Api.get(`candidate/${params.id}/additional_info`);
  }

  static getCandidateFeedbacks(
    params: GetCandidateFeedbacksRequestParams,
  ): AxiosPromise<GetCandidateFeedbacksResponse> {
    return Api.get(`candidate/${params.id}/feedback`);
  }

  static sendCandidateFeedbackReply(
    params: SendCandidateFeedbackReplyRequestParams,
    body: SendCandidateFeedbackReplyRequestBody,
  ): AxiosPromise<SendCandidateFeedbackReplyResponse> {
    return Api.post(`company/feedback/${params.feedbackId}/reply`, body);
  }

  static getCandidateFeedbackReplies(
    params: GetCandidateFeedbackRepliesRequestParams,
  ): AxiosPromise<GetCandidateFeedbackRepliesResponse> {
    return Api.get(`candidate/feedback/${params.feedbackId}`);
  }

  static updateCandidateStatus(
    params: UpdateCandidateStatusRequestParams,
    body: UpdateCandidateStatusRequestBody,
  ): AxiosPromise<UpdateCandidateStatusResponse> {
    return Api.put(`candidate/${params.id}/approve`, body);
  }

  static getCandidateRecord(
    params: GetCandidateRecordRequestParams,
  ): AxiosPromise<GetCandidateRecordResponse> {
    return Api.get(`candidate/${params.id}/record`);
  }

  static addCandidateRecordRequest(
    params: UpdateCandidateRecordRequestParams,
    body: UpdateCandidateRecordRequestBody,
  ): AxiosPromise<UpdateCandidateRecordResponse> {
    return Api.post(`candidate/${params.id}/record`, body);
  }

  static updateCandidateRecord(
    params: UpdateCandidateRecordRequestParams,
    recordId: number,
    body: UpdateCandidateRecordRequestBody,
  ): AxiosPromise<UpdateCandidateRecordResponse> {
    return Api.put(`candidate/${params.id}/record/${recordId}`, body);
  }

  static deleteCandidateRecord(
    candidateId: number | undefined,
    recordId: number,
  ): AxiosPromise<null> {
    return Api.delete(`candidate/${candidateId}/record/${recordId}`);
  }

  static getCandidateVideoInterview(
    candidateId: number,
  ): AxiosPromise<GetCandidateVideoInterviewResponse> {
    return Api.get(`/candidate/${candidateId}/video_interview`);
  }

  static getCandidateDocuments(candidateId: number): AxiosPromise<GetCandidateDocumentsResponse> {
    return Api.get(`/candidate/${candidateId}/documents`);
  }

  static uploadCandidateDocuments(
    candidateId: number,
    body: UploadCandidateDocumentsRequestBody,
  ): AxiosPromise<UpdateCandidateDocumentsResponse> {
    return Api.post(`/candidate/${candidateId}/documents`, body, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  static clearCandidateDocuments(
    candidateId: number,
    body: UploadCandidateDocumentsRequestBody,
  ): AxiosPromise<UpdateCandidateDocumentsResponse> {
    return Api.post(`/candidate/${candidateId}/documents`, body);
  }

  static getCandidateProfessionalDetails(
    params: GetCandidateProfDetailsRequestParams,
  ): AxiosPromise<GetCandidateProfDetailsByAdminResponse> {
    return Api.get(`admins/${params.id}/prof_detail`);
  }

  static updateCandidateProfessionalDetails(
    params: UpdateCandidateProfDetailsRequestParams,
    data: CreateCandidateProfessionalDetailsRequestBody,
  ): AxiosPromise<GetCandidateProfDetailsByAdminResponse> {
    return Api.put(`admins/${params.id}/prof_detail`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  static getContactCompanies(
    params: GetAdminContactRequestParams,
  ): AxiosPromise<GetContactCompaniesResponse> {
    return Api.get('/dashboard/contacts/company', params);
  }

  static getContactCandidates(
    params: GetAdminContactRequestParams,
  ): AxiosPromise<GetContactCandidatesResponse> {
    return Api.get('/dashboard/contacts/candidate', params);
  }

  static createContactCandidate(
    body: AddContactCandidateRequestBody,
  ): AxiosPromise<CreateNewContactCandidateResponse> {
    return Api.post('/dashboard/contacts/candidate', body);
  }

  static createContactCompany(
    body: AddContactCompanyRequestBody,
  ): AxiosPromise<CreateNewContactCompanyResponse> {
    return Api.post('/dashboard/contacts/company', body);
  }

  static getUnmatchedJobsPipeline(
    params: GetAdminUnmatchedPipelinesRequestParams,
  ): AxiosPromise<GetUnmatchedJobPipelineResponse> {
    return Api.get('pipeline/unmatched-job', params);
  }

  static getAdminMatchedJobPipeline(
    params: GetAdminPipelinesRequestParams,
  ): AxiosPromise<GetMatchedJobsPipelineResponse> {
    return Api.get('pipeline/matched-job', params);
  }

  static updateAdminMatchedJobPipeline(
    params: UpdateAdminMatchedJobStepRequestParams,
    data: UpdateMatchedJobStepRequestBodyParams,
  ): AxiosPromise<GetMatchedJobPipelineResponse> {
    return Api.put(`pipeline/matched-job/${params.cardId}`, data);
  }

  static arrangeInterview(
    data: ArrangeInterviewRequestBodyParams,
  ): AxiosPromise<ArrangeInterviewResponse> {
    return Api.post('pipeline/matched-interview/', data);
  }

  static updateArrangedInterview(
    interviewId: number,
    data: ArrangeInterviewRequestBodyParams,
  ): AxiosPromise<ArrangeInterviewResponse> {
    return Api.put(`pipeline/matched-interview/${interviewId}`, data);
  }

  static createInvoice(data: CreateInvoiceRequestBodyParams): AxiosPromise<CreateInvoiceResponse> {
    return Api.post('pipeline/matched-job/invoice', data);
  }

  static createContract(
    body: CreateContractRequestBodyParams,
  ): AxiosPromise<CreateContractResponse> {
    return Api.post('pipeline/matched-job/contract', body, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  static downloadGeneratedContract(
    contractId: number,
    params: { isCandidateInstance: boolean },
  ): AxiosPromise<GetGeneratedContractResponse> {
    return Api.get(`pipeline/matched-job/contract/${contractId}`, params);
  }

  static sendContract(contractId: number, data: SendContractRequestBody): AxiosPromise<null> {
    return Api.post(`pipeline/matched-job/contract/${contractId}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  static getLiveJobContracts(jobId: number): AxiosPromise<GetLiveJobContractsResponse> {
    return Api.get(`jobs/live_jobs/${jobId}/contracts`);
  }

  static getAdminProfile(adminId: number): AxiosPromise<GetAdminProfileResponse> {
    return Api.get(`admins/${adminId}`);
  }

  static editAdminProfileDetails(
    adminId: number,
    body: AdminProfileDetailsRequestBody,
  ): AxiosPromise<GetAdminProfileResponse> {
    return Api.put(`admins/${adminId}`, body);
  }

  static getAdminPayments(): AxiosPromise<GetAdminPaymentResponse> {
    return Api.get('admins/payment');
  }

  static editAdminPayments(body: AdminPaymentDetails): AxiosPromise<GetAdminPaymentResponse> {
    return Api.put('admins/payment', body);
  }

  static getTermsAndConditions(): AxiosPromise<GetTermsAndConditionsResponse> {
    return Api.get('admins/terms');
  }

  static updateTermsAndConditions(
    body: TermsAndConditionsRequestBody,
  ): AxiosPromise<GetTermsAndConditionsResponse> {
    return Api.put('admins/terms', body);
  }

  static fetchInterviewQuestions(): AxiosPromise<GetInterviewQuestionsResponse> {
    return Api.get('admins/interview_questions');
  }

  static updateInterviewQuestions(
    body: InterviewQuestionsRequestBody,
  ): AxiosPromise<GetInterviewQuestionsResponse> {
    return Api.put('admins/interview_questions', body);
  }

  static updatePassword(body: ChangePasswordRequestBody): AxiosPromise<EditPasswordResponse> {
    return Api.post('user/change-password', body);
  }

  static getDashboardTasks(
    params: GetAdminDashboardTasksRequestParams,
  ): AxiosPromise<GetAdminDashboardTasksResponse> {
    return Api.get('/dashboard/tasks', params);
  }

  static getDashboardPaymentReports(
    params: GetAdminDashboardPaymentReportsRequestParams,
  ): AxiosPromise<GetAdminDashboardPaymentReportsResponse> {
    return Api.get('/dashboard/payment-report', params);
  }

  static createDashboardTask(
    body: CreateDashboardTaskRequestBody,
  ): AxiosPromise<CreateDashboardTaskResponse> {
    return Api.post('/dashboard/tasks', body);
  }

  static getDashboardTaskById(
    params: getDashboardTaskByIdRequestParams,
  ): AxiosPromise<GetDashboardTaskByIdResponse> {
    return Api.get(`/dashboard/tasks/${params.id}`);
  }

  static updateDashboardTask(
    taskId: number,
    body: CreateDashboardTaskRequestBody,
  ): AxiosPromise<GetDashboardTaskByIdResponse> {
    return Api.put(`/dashboard/tasks/${taskId}`, body);
  }

  static deleteDashboardTask(taskId: number): AxiosPromise<null> {
    return Api.delete(`/dashboard/tasks/${taskId}`);
  }

  static closeDashboardTask(
    taskId: number,
    body: UpdateTaskRequestBody,
  ): AxiosPromise<GetDashboardTaskByIdResponse> {
    return Api.put(`/dashboard/tasks/${taskId}`, body);
  }

  static getAllAdmins(params: GetListOfAdminsRequestParams): AxiosPromise<GetListOfAdminsResponse> {
    return Api.get('admins/', params);
  }

  static inviteAdminRequest(body: InviteAdminRequestBody): AxiosPromise<InviteAdminResponse> {
    return Api.post('admins/', body);
  }

  static getAdminPositionsListRequest(
    adminId: number,
    params: GetAdminCompaniesRequestParams,
  ): AxiosPromise<GetAdminPositionsListResponse> {
    return Api.get(`admins/${adminId}/unassigned/positions`, params);
  }

  static getAdminRegionList(
    adminId: number,
    params: GetAdminRegionsRequestParams,
  ): AxiosPromise<GetAdminRegionsResponse> {
    return Api.get(`admins/${adminId}/unassigned/regions`, params);
  }

  static getAdminJobList(params: GetAdminRJobsRequestParams): AxiosPromise<GetAdminJobsResponse> {
    return Api.get('admins/unassigned/jobs', params);
  }

  static assignCompaniesAndRegionsToAdmin(
    adminId: number,
    body: AssignCompaniesAndRegionsToAdminRequestParams,
  ): AxiosPromise<AssignCompaniesAndRegionsToAdminResponse> {
    return Api.patch(`admins/${adminId}`, body);
  }

  static assignJobToAdminRequest(
    body: AssignJobToAdminRequestParams,
  ): AxiosPromise<AssignJobToAdminResponse> {
    return Api.post('admins/assign-job', body);
  }

  static getDashboardScoreboardRequest(
    params: GetAdminDashboardScoreboardRequestParams,
  ): AxiosPromise<GetAdminDashboardScoreboardResponse> {
    return Api.get('/dashboard/scoreboard', params);
  }

  static getDashboardScoreboardBillingsRequest(
    params: GetAdminDashboardScoreboardBillingsRequestParams,
  ): AxiosPromise<GetAdminDashboardBillingsResponse> {
    return Api.get('/dashboard/billings', params);
  }

  static donwloadCandidateCV(candidateId: number): AxiosPromise<any> {
    return Api.get(`/candidate/${candidateId}/resume`);
  }

  static getInboxMessages(
    params: GetAdminMessagesRequestParams,
  ): AxiosPromise<GetAdminEmailsResponse> {
    return Api.get('admins/messaging/inbox', params);
  }

  static getSentMessages(
    params: GetAdminMessagesRequestParams,
  ): AxiosPromise<GetAdminEmailsResponse> {
    return Api.get('admins/messaging/sentbox', params);
  }

  static getEmailInfo(threadId: string): AxiosPromise<GetEmailInfoResponse> {
    return Api.get(`admins/messaging/thread/${threadId}`);
  }

  static sendMail(data: FormData): AxiosPromise<null> {
    return Api.post('admins/messaging/send/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  static deleteMail(mailId: string): AxiosPromise<null> {
    return Api.delete(`admins/messaging/${mailId}/trash`);
  }

  static getEmailSignature(): AxiosPromise<GetEmailSignatureResponse> {
    return Api.get('admins/messaging/signature/');
  }

  static updateEmailSignature(
    data: UpdateEmailSignatureRequestBody,
  ): AxiosPromise<GetEmailSignatureResponse> {
    return Api.put('admins/messaging/signature', data);
  }

  static sendResumeRequest(body: SendResumeRequestParams): AxiosPromise<SendResumeResponse> {
    return Api.post('dashboard/send-resume', body);
  }

  static deleteAdminRequest(adminId: number): AxiosPromise<null> {
    return Api.delete(`admins/${adminId}`);
  }

  static getContactMessages(
    contactId: number,
    params: GetAdminMessagesRequestParams,
  ): AxiosPromise<GetAdminEmailsResponse> {
    return Api.get(`admins/messaging/${contactId}/thread`, params);
  }

  static getSentResumes(
    id: number,
    params: GetAdminSentResumesRequestParams,
  ): AxiosPromise<GetSentResumesResponse> {
    return Api.get(`/dashboard/contacts/company/${id}/logs`, params);
  }

  static getManagerNotesRequest(contactId: number): AxiosPromise<GetManagerNotesResponse> {
    return Api.get(`dashboard/contacts/company/${contactId}/notes`);
  }

  static addManagerNotesRequest(
    params: ManagerNotesRequestParams,
    body: UpdateManagerNotesRequestParams,
  ): AxiosPromise<UpdateManagerNotesResponse> {
    return Api.post(`dashboard/contacts/company/${params.id}/notes`, body);
  }

  static updateManagerNote(
    contactId: number,
    noteId: number,
    body: UpdateManagerNotesRequestParams,
  ): AxiosPromise<UpdateManagerNotesResponse> {
    return Api.put(`dashboard/contacts/company/${contactId}/notes/${noteId}`, body);
  }

  static deleteManagerNote(contactId: number, noteId: number): AxiosPromise<null> {
    return Api.delete(`dashboard/contacts/company/${contactId}/notes/${noteId}`);
  }

  static deleteEmployerRequest(employerId: number): AxiosPromise<null> {
    return Api.delete(`company/${employerId}`);
  }

  static deleteCandidateRequest(candidateId: number): AxiosPromise<null> {
    return Api.delete(`candidate/${candidateId}`);
  }

  static deleteContactCompanyRequest(companyId: number): AxiosPromise<null> {
    return Api.delete(`/dashboard/contacts/company/${companyId}`);
  }

  static downloadAttachment(
    params: GetMailAttachmentsRequestParams,
  ): AxiosPromise<GetMailAttachmentResponse> {
    return Api.get(`admins/messaging/${params.messageId}/attachment/${params.attachmentId}`);
  }

  static uploadCandidateBrandedCV(
    candidateId: number,
    data: UploadCandidateBrandedCVRequestBody,
  ): AxiosPromise<GetCandidateOverviewResponse> {
    return Api.patch(`candidate/${candidateId}/admin_tab`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  static getScoreboardInterviews(
    params: GetScoreboardDetailsRequestBody,
  ): AxiosPromise<GetScoreboardInterviewsResponse> {
    return Api.get('/dashboard/scoreboard/interviews', params);
  }

  static getScoreboardJobs(
    params: GetScoreboardDetailsRequestBody,
  ): AxiosPromise<GetScoreboardJobsResponse> {
    return Api.get('/dashboard/scoreboard/jobs', params);
  }

  static getScoreboardPlacements(
    params: GetScoreboardDetailsRequestBody,
  ): AxiosPromise<GetScoreboardPlacementsResponse> {
    return Api.get('/dashboard/scoreboard/placements', params);
  }

  static getScoreboardRevenues(
    params: GetScoreboardDetailsRequestBody,
  ): AxiosPromise<GetScoreboardRevenuesResponse> {
    return Api.get('/dashboard/scoreboard/revenues', params);
  }

  static getScoreboardTempWorks(
    params: GetScoreboardDetailsRequestBody,
  ): AxiosPromise<GetScoreboardTempWorksResponse> {
    return Api.get('/dashboard/scoreboard/temps-working', params);
  }

  static getAdminTimesheet(
    params: GetAdminTimesheetRequestParams,
  ): AxiosPromise<GetAdminTimesheetResponse> {
    return Api.get(`admins/timesheet`, params);
  }

  static getAdminTimesheetByIdRequest(
    params: getAdminTimesheetByIdRequestParams,
  ): AxiosPromise<GetAdminTimesheetByIdResponse> {
    return Api.get(`admins/timesheet/${params.id}`);
  }

  static updateAdminTimesheetStatusRequest(
    params: getAdminTimesheetByIdRequestParams,
    body: UpdateAdminTimesheetStatusRequestBody,
  ): AxiosPromise<UpdateAdminTimesheetStatusResponse> {
    return Api.put(`company/time-sheet/${params.id}`, body);
  }

  static getCandidatesWithTimesheet(): AxiosPromise<GetCandidateWithTimesheetResponse> {
    return Api.get('pipeline/timesheet/candidate');
  }

  static getCompaniesWithTimesheet(): AxiosPromise<GetCompanyWithTimesheetResponse> {
    return Api.get('pipeline/timesheet/company');
  }

  static createAdminTimesheetEntry(
    data: CreateTimesheetEntryRequestParams,
  ): AxiosPromise<CreateTimesheetEntryResponse> {
    return Api.post(`admins/timesheet`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  static getCandidateTimesheetPipeline(
    params: GetTimesheetPipelineRequestParams,
  ): AxiosPromise<GetTimesheetPipelineResponse> {
    return Api.get('pipeline/matched-job', params);
  }

  static getWhiteboardNotes(): AxiosPromise<GetAdminWhiteboardNotesResponse> {
    return Api.get('admins/note');
  }

  static createWhiteboardNote(
    data: CreateWhiteboardNoteRequestBody,
  ): AxiosPromise<GetWhiteboardNoteCreatedResponse> {
    return Api.post('admins/note', data);
  }

  static deleteWhiteboardNote(noteId: number): AxiosPromise<null> {
    return Api.delete(`admins/note/${noteId}`);
  }

  static updateWhiteboardNote(
    noteId: number,
    data: CreateWhiteboardNoteRequestBody,
  ): AxiosPromise<GetWhiteboardNoteCreatedResponse> {
    return Api.put(`admins/note/${noteId}`, data);
  }

  static getWhiteboardTotalValue(): AxiosPromise<GetWhiteboardTotalValueResponse> {
    return Api.get('admins/note/total');
  }

  static setContractStatus(
    contractId: number,
    data: SetContractStatusRequestBody,
  ): AxiosPromise<void> {
    return Api.patch(`pipeline/contract/${contractId}/approve`, data);
  }
}
