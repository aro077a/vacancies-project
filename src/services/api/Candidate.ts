import { AxiosPromise } from 'axios';

import {
  ApproveMatchedJobContractRequestBody,
  CreateCandidateProfessionalDetailsRequestBody,
  CreateCandidateProfileRequestBody,
  CreateCandidateVideoInterviewRequestBody,
  CreateFeedbackForJobRequestBody,
  CreateTimesheetEntryRequestParams,
  GetCandidateCVRequestParams,
  GetCandidateFindJobsRequestParams,
  GetCandidateLicensesRequestParams,
  GetCandidatePhotoRequestParams,
  GetCandidatePrefillDataRequestParams,
  GetCandidateProfDetailsRequestParams,
  GetCandidateProfileRequestParams,
  getCandidateTimesheetByIdRequestParams,
  GetCandidateTimesheetRequestParams,
  GetCandidateVideoInterviewRequestParams,
  GetCompaniesWithJobsRequestParams,
  GetShortListRequestParams,
  GetTimesheetPipelineRequestParams,
  SendCandidateFeedbackReplyRequestBody,
  SetFindJobInterestRequestBody,
  UpdateCandidateLookingForJobRequestParams,
  UpdateCandidateLookingForJobStatusRequestBody,
  UpdateCandidateProfileRequestParams,
  UpdateMatchedJobStepRequestBodyParams,
  UpdateShortListStatusRequestBody,
  UploadCandidateCVRequestBody,
  UploadCandidateLicensesRequestBody,
  UploadCandidatePhotoRequestBody,
} from '~/types/requests';
import {
  CreateCandidateProfessionalDetailsResponse,
  CreateCandidateProfileResponse,
  CreatedFeedbackForJobResponse,
  CreatedReplyFeedbackResponse,
  CreateTimesheetEntryResponse,
  GetCandidateCVResponse,
  GetCandidateLicensesResponse,
  GetCandidatePhotoResponse,
  GetCandidatePrefillDataFromResume,
  GetCandidateProfDetailsResponse,
  GetCandidateProfileResponse,
  GetCandidateTimesheetByIdResponse,
  GetCandidateTimesheetResponse,
  GetCandidateVideoInterviewResponse,
  GetCompaniesWithLiveJobsCountResponse,
  GetFindJobsResponse,
  GetGeneratedContractResponse,
  GetInterviewQuestionsResponse,
  GetMatchedJobContractsResponse,
  GetMatchedJobDetailResponse,
  GetMatchedJobFeedbackResponse,
  GetMatchedJobPipelineResponse,
  GetMatchedJobsPipelineResponse,
  GetTimesheetPipelineResponse,
  SetJobInterestResponse,
  UpdateCandidateLookingForJobStatus,
  UpdateShortListResponse,
  UploadCandidateCVResponse,
  UploadCandidateLicensesResponse,
  UploadCandidatePhotoResponse,
} from '~/types/responses';

import { Api } from './Api';

export class Candidate {
  static createProfile(
    data: CreateCandidateProfileRequestBody,
  ): AxiosPromise<CreateCandidateProfileResponse> {
    return Api.post('candidate/regiter', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  static getProfile(
    params: GetCandidateProfileRequestParams,
  ): AxiosPromise<GetCandidateProfileResponse> {
    return Api.get(`candidate/${params.id}`);
  }

  static updateProfile(
    params: UpdateCandidateProfileRequestParams,
    body: CreateCandidateProfileRequestBody,
  ): AxiosPromise<CreateCandidateProfileResponse> {
    return Api.put(`candidate/${params.id}`, body, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  static createProfessionalDetails(
    candidateId: number,
    data: CreateCandidateProfessionalDetailsRequestBody,
  ): AxiosPromise<CreateCandidateProfessionalDetailsResponse> {
    return Api.post(`candidate/${candidateId}/prof_detail`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  static getProfessionalDetails(
    params: GetCandidateProfDetailsRequestParams,
  ): AxiosPromise<GetCandidateProfDetailsResponse> {
    return Api.get(`candidate/${params.id}/prof_detail`);
  }

  static uploadCV(
    candidateId: number,
    data: UploadCandidateCVRequestBody,
  ): AxiosPromise<UploadCandidateCVResponse> {
    return Api.post(`candidate/${candidateId}/cv`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  static getCV(params: GetCandidateCVRequestParams): AxiosPromise<GetCandidateCVResponse> {
    return Api.get(`candidate/${params.id}/cv`);
  }

  static uploadLicenses(
    candidateId: number,
    data: UploadCandidateLicensesRequestBody,
  ): AxiosPromise<UploadCandidateLicensesResponse> {
    return Api.post(`candidate/${candidateId}/licenses`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  static clearLicenses(
    candidateId: number,
    data: UploadCandidateLicensesRequestBody,
  ): AxiosPromise<UploadCandidateLicensesResponse> {
    return Api.post(`candidate/${candidateId}/licenses`, data);
  }

  static getLicenses(
    params: GetCandidateLicensesRequestParams,
  ): AxiosPromise<GetCandidateLicensesResponse> {
    return Api.get(`candidate/${params.id}/licenses`);
  }

  static uploadPhoto(
    candidateId: number,
    data: UploadCandidatePhotoRequestBody,
  ): AxiosPromise<UploadCandidatePhotoResponse> {
    return Api.post(`candidate/${candidateId}/photo`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  static getPhoto(params: GetCandidatePhotoRequestParams): AxiosPromise<GetCandidatePhotoResponse> {
    return Api.get(`candidate/${params.id}/photo`);
  }

  static deletePhoto(candidateId: number): AxiosPromise<void> {
    return Api.delete(`candidate/${candidateId}/photo`);
  }

  static createInterview(
    params: GetCandidateVideoInterviewRequestParams,
    data: CreateCandidateVideoInterviewRequestBody,
  ): AxiosPromise<GetCandidateVideoInterviewResponse> {
    return Api.post(`candidate/${params.id}/video_interview`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  static getInterview(
    params: GetCandidateVideoInterviewRequestParams,
  ): AxiosPromise<GetCandidateVideoInterviewResponse> {
    return Api.get(`candidate/${params.id}/video_interview`);
  }

  static updateInterview(
    params: GetCandidateVideoInterviewRequestParams,
    data: CreateCandidateVideoInterviewRequestBody,
  ): AxiosPromise<GetCandidateVideoInterviewResponse> {
    return Api.put(`candidate/${params.id}/video_interview`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  static deleteInterview(params: GetCandidateVideoInterviewRequestParams): AxiosPromise<null> {
    return Api.delete(`candidate/${params.id}/video_interview`);
  }

  static updateLookingForJobStatus(
    params: UpdateCandidateLookingForJobRequestParams,
    body: UpdateCandidateLookingForJobStatusRequestBody,
  ): AxiosPromise<UpdateCandidateLookingForJobStatus> {
    return Api.put(`candidate/${params.id}/status`, body);
  }

  static getPrefillDataFromResume(
    data: GetCandidatePrefillDataRequestParams,
  ): AxiosPromise<GetCandidatePrefillDataFromResume> {
    return Api.post('candidate/parse-resume', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  static getCandidateProposals(): AxiosPromise<GetMatchedJobsPipelineResponse> {
    return Api.get('pipeline/matched-job');
  }

  static updateCandidateMatchedJobStatus(
    matchedId: number,
    data: UpdateMatchedJobStepRequestBodyParams,
  ): AxiosPromise<GetMatchedJobPipelineResponse> {
    return Api.put(`pipeline/matched-job/${matchedId}`, data);
  }

  static createFeedbackForJob(
    data: CreateFeedbackForJobRequestBody,
  ): AxiosPromise<CreatedFeedbackForJobResponse> {
    return Api.post('candidate/feedback', data);
  }

  static getJobDetail(jobId: number): AxiosPromise<GetMatchedJobDetailResponse> {
    return Api.get(`candidate/find-jobs/${jobId}`);
  }

  static getContracts(jobId: number): AxiosPromise<GetMatchedJobContractsResponse> {
    return Api.get(`candidate/find-jobs/${jobId}/contract`);
  }

  static getFeedbacks(jobId: number): AxiosPromise<GetMatchedJobFeedbackResponse> {
    return Api.get(`candidate/find-jobs/${jobId}/feedback`);
  }

  static createReplyOnFeedback(
    feedbackId: number,
    data: SendCandidateFeedbackReplyRequestBody,
  ): AxiosPromise<CreatedReplyFeedbackResponse> {
    return Api.post(`candidate/feedback/${feedbackId}/reply`, data);
  }

  static approveContract(
    jobId: number,
    data: ApproveMatchedJobContractRequestBody,
  ): AxiosPromise<GetMatchedJobContractsResponse> {
    return Api.put(`candidate/find-jobs/${jobId}/contract`, data);
  }

  static downloadContract(contractId: number | string): AxiosPromise<GetGeneratedContractResponse> {
    return Api.get(`pipeline/matched-job/contract/${contractId}`, { isCandidateIstance: true });
  }

  static getCandidateTimesheet(
    params: GetCandidateTimesheetRequestParams,
  ): AxiosPromise<GetCandidateTimesheetResponse> {
    return Api.get(`candidate/time-sheet`, params);
  }

  static getCandidateTimesheetPipeline(
    params: GetTimesheetPipelineRequestParams,
  ): AxiosPromise<GetTimesheetPipelineResponse> {
    return Api.get('pipeline/matched-job', params);
  }

  static createCandidateTimesheetEntry(
    data: CreateTimesheetEntryRequestParams,
  ): AxiosPromise<CreateTimesheetEntryResponse> {
    return Api.post(`candidate/time-sheet`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  static getFindJobs(params: GetCandidateFindJobsRequestParams): AxiosPromise<GetFindJobsResponse> {
    return Api.get('candidate/find-jobs', params);
  }

  static setJobInterest(data: SetFindJobInterestRequestBody): AxiosPromise<SetJobInterestResponse> {
    return Api.put('candidate/interest', data);
  }

  static getShortList(params: GetShortListRequestParams): AxiosPromise<GetFindJobsResponse> {
    return Api.get('candidate/find-jobs', params);
  }

  static addToShortList(
    jobId: number,
    data: UpdateShortListStatusRequestBody,
  ): AxiosPromise<UpdateShortListResponse> {
    return Api.put(`candidate/find-jobs/${jobId}/shortlist`, data);
  }

  static getInterviewQuestions(): AxiosPromise<GetInterviewQuestionsResponse> {
    return Api.get('candidate/interview_questions');
  }

  static getCandidateTimesheetByIdRequest(
    params: getCandidateTimesheetByIdRequestParams,
  ): AxiosPromise<GetCandidateTimesheetByIdResponse> {
    return Api.get(`candidate/time-sheet/${params.id}`);
  }

  static getCompaniesWithJobs(
    params: GetCompaniesWithJobsRequestParams,
  ): AxiosPromise<GetCompaniesWithLiveJobsCountResponse> {
    return Api.get('candidate/find-company', params);
  }
}
