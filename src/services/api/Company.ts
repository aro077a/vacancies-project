import { AxiosPromise } from 'axios';

import { CreateEmployerBusinessFormValues, CreateEmployerFormValues } from '~/types/formValues';
import {
  ApproveMatchedJobContractRequestBody,
  CreateCompanyContactDetailsRequestBody,
  CreateCompanyInfoRequestBody,
  CreateFeedbackForCandidateBodyParams,
  CreateHiringManagerRequestBody,
  createReplyForFeedbackRequestBody,
  EnterCompanyMainInfoRequestBody,
  GetCandidatesRequestParams,
  GetCompanyActiveJobsParams,
  GetCompanyClosedJobsParams,
  GetCompanyInterestedInRequestParams,
  GetCompanyJobsRequestParams,
  getCompanyTimesheetByIdRequestParams,
  GetCompanyTimesheetRequestParams,
  GetECompanyManagersResponseParams,
  GetShortListRequestParams,
  UpdateCompanyMyJobRequestBody,
  UpdateCompanyTimesheetRequestParams,
  UpdateCompanyTimesheetStatusRequestBody,
  UpdateLiveJobCandidateMatchedRequestBody,
  UpdateMatchedJobStepRequestBodyParams,
  UpdateShortListStatusRequestBody,
  UploadCompanyLogoRequestBody,
} from '~/types/requests';
import {
  CompanyInterestResponse,
  CreateCompanyContactDetailsResponse,
  CreatedFeedbackForCandidateResponse,
  CreatedReplyFeedbackResponse,
  CreateEmployerCompanyInfoResponse,
  EnterCompanyMainInfoResponse,
  GetClientContactDetailsResponse,
  GetCompanyCandidateInfoResponse,
  GetCompanyCandidatesResponse,
  GetCompanyHiringManagerResponse,
  GetCompanyJobs,
  GetCompanyLogoResponse,
  GetCompanyMyJobsResponse,
  GetCompanyResponse,
  GetCompanyTimesheetByIdResponse,
  GetCompanyTimesheetResponse,
  GetGeneratedContractResponse,
  GetMatchedCandidateContractsResponse,
  GetMatchedCandidateDetailResponse,
  GetMatchedCandidateFeedbackResponse,
  GetMatchedJobContractsResponse,
  GetMatchedJobPipelineResponse,
  GetMatchedJobsPipelineResponse,
  GetUpdatedCompanyHiringManagerResponse,
  UpdateCompanyMyJobResponse,
  UpdateCompanyTimesheetStatusResponse,
  UpdateShortListResponse,
  UploadCompanyLogoResponse,
} from '~/types/responses';

import { Api } from './Api';

export class Company {
  static enterInfo(
    data: EnterCompanyMainInfoRequestBody,
  ): AxiosPromise<EnterCompanyMainInfoResponse> {
    return Api.post('company/register', data);
  }

  static createNewEmployer(
    data: CreateEmployerFormValues,
  ): AxiosPromise<CreateCompanyContactDetailsResponse> {
    return Api.post('company/register', data);
  }

  static editEmployer(
    id: number,
    data: CreateCompanyInfoRequestBody,
  ): AxiosPromise<CreateEmployerCompanyInfoResponse> {
    return Api.put(`company/${id}`, data);
  }

  static createContactDetails(
    companyId: number,
    data: CreateCompanyContactDetailsRequestBody,
  ): AxiosPromise<CreateCompanyContactDetailsResponse> {
    return Api.post(`company/${companyId}/contact`, data);
  }

  static uploadLogo(
    companyId: number,
    data: UploadCompanyLogoRequestBody,
  ): AxiosPromise<UploadCompanyLogoResponse> {
    return Api.post(`company/${companyId}/logo`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static getMatchedCandidates(): AxiosPromise<GetMatchedJobsPipelineResponse> {
    return Api.get('pipeline/matched-job');
  }

  static updateMatchedCandidateStatus(
    matchedId: number,
    data: UpdateMatchedJobStepRequestBodyParams,
  ): AxiosPromise<GetMatchedJobPipelineResponse> {
    return Api.put(`pipeline/matched-job/${matchedId}`, data);
  }

  static createFeedbackForCandidate(
    data: CreateFeedbackForCandidateBodyParams,
  ): AxiosPromise<CreatedFeedbackForCandidateResponse> {
    return Api.post('company/feedback', data);
  }

  static createReplyForFeedback(
    feedbackId: number,
    data: createReplyForFeedbackRequestBody,
  ): AxiosPromise<CreatedReplyFeedbackResponse> {
    return Api.post(`company/feedback/${feedbackId}/reply`, data);
  }

  static getMatchedCandidateDetail(
    candidateId: number,
  ): AxiosPromise<GetMatchedCandidateDetailResponse> {
    return Api.get(`company/candidates/${candidateId}`);
  }

  static getMatchedCandidateFeedback(
    candidateId: number,
  ): AxiosPromise<GetMatchedCandidateFeedbackResponse> {
    return Api.get(`company/candidates/${candidateId}/feedback`);
  }

  static getMatchedCandidateContract(
    candidateId: number,
  ): AxiosPromise<GetMatchedCandidateContractsResponse> {
    return Api.get(`company/candidates/${candidateId}/contract`);
  }

  static approveMatchedCandidateContract(
    contracId: number,
    data: ApproveMatchedJobContractRequestBody,
  ): AxiosPromise<GetMatchedJobContractsResponse> {
    return Api.put(`company/candidates/contract/${contracId}`, data);
  }

  static downloadContract(contractId: number): AxiosPromise<GetGeneratedContractResponse> {
    return Api.get(`pipeline/matched-job/contract/${contractId}`, { isCandidateIstance: false });
  }

  static getCompany(companyId: number): AxiosPromise<GetCompanyResponse> {
    return Api.get(`company/${companyId}`);
  }

  static updateCompanyInfo(
    companyId: number,
    data: CreateCompanyInfoRequestBody,
  ): AxiosPromise<CreateEmployerCompanyInfoResponse> {
    return Api.put(`company/${companyId}`, data);
  }

  static getClientContactDetails(companyId: number): AxiosPromise<GetClientContactDetailsResponse> {
    return Api.get(`company/${companyId}/contact`);
  }

  static updateClientContactDetails(
    companyId: number,
    data: CreateEmployerBusinessFormValues,
  ): AxiosPromise<GetClientContactDetailsResponse> {
    return Api.put(`company/${companyId}/contact`, data);
  }

  static fetchCompanyLogo(companyId: number): AxiosPromise<GetCompanyLogoResponse> {
    return Api.get(`company/${companyId}/logo`);
  }

  static upLoadCompanyLogoRequest(
    companyId: number,
    data: UploadCompanyLogoRequestBody,
  ): AxiosPromise<UploadCompanyLogoResponse> {
    return Api.post(`company/${companyId}/logo`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  static updateCompanyLogoRequest(
    companyId: number,
    data: UploadCompanyLogoRequestBody,
  ): AxiosPromise<UploadCompanyLogoResponse> {
    return Api.post(`company/${companyId}/logo`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  static deletePhoto(employerId: number): AxiosPromise<void> {
    return Api.delete(`company/${employerId}/logo`);
  }

  static getCompanyHiringManager(
    companyId: number,
    data: GetECompanyManagersResponseParams,
  ): AxiosPromise<GetCompanyHiringManagerResponse> {
    return Api.get(`company/${companyId}/manager`, data);
  }

  static createCompanyHiringManager(
    companyId: number,
    data: CreateHiringManagerRequestBody,
  ): AxiosPromise<GetUpdatedCompanyHiringManagerResponse> {
    return Api.post(`company/${companyId}/manager`, data);
  }

  static updateCompanyHiringManager(
    companyId: number,
    managerId: number,
    data: CreateHiringManagerRequestBody,
  ): AxiosPromise<GetUpdatedCompanyHiringManagerResponse> {
    return Api.put(`company/${companyId}/manager/${managerId}`, data);
  }

  static deleteHiringManager(companyId: number, managerId: number): AxiosPromise<null> {
    return Api.delete(`company/${companyId}/manager/${managerId}`);
  }

  static getCompanyTimesheet(
    params: GetCompanyTimesheetRequestParams,
  ): AxiosPromise<GetCompanyTimesheetResponse> {
    return Api.get(`company/time-sheet`, params);
  }

  static updateTimesheetStatus(
    params: UpdateCompanyTimesheetRequestParams,
    body: UpdateCompanyTimesheetStatusRequestBody,
  ): AxiosPromise<UpdateCompanyTimesheetStatusResponse> {
    return Api.put(`company/time-sheet/${params.id}`, body);
  }

  static getCompanyTimesheetById(
    params: getCompanyTimesheetByIdRequestParams,
  ): AxiosPromise<GetCompanyTimesheetByIdResponse> {
    return Api.get(`company/time-sheet/${params.id}`);
  }

  static getCandidates(
    params: GetCandidatesRequestParams,
  ): AxiosPromise<GetCompanyCandidatesResponse> {
    return Api.get('/company/candidates', params);
  }

  static getCandidateInfo(id: number): AxiosPromise<GetCompanyCandidateInfoResponse> {
    return Api.get(`/company/candidates/${id}`);
  }

  static getMyJobs(params: GetCompanyJobsRequestParams): AxiosPromise<GetCompanyJobs> {
    return Api.get(`/jobs/my`, params);
  }

  static updateCompanyInterests(
    data: UpdateLiveJobCandidateMatchedRequestBody,
  ): AxiosPromise<CompanyInterestResponse> {
    return Api.put('/company/interest', data);
  }

  static getMyActiveJobs(
    params: GetCompanyActiveJobsParams,
  ): AxiosPromise<GetCompanyMyJobsResponse> {
    return Api.get('jobs/my', params);
  }

  static getMyClosedJobs(
    params: GetCompanyClosedJobsParams,
  ): AxiosPromise<GetCompanyMyJobsResponse> {
    return Api.get('jobs/my', params);
  }

  static updateJobStatus(
    jobId: number,
    data: UpdateCompanyMyJobRequestBody,
  ): AxiosPromise<UpdateCompanyMyJobResponse> {
    return Api.patch(`jobs/${jobId}`, data);
  }

  static deleteMyJob(jobId: number): AxiosPromise<null> {
    return Api.delete(`jobs/${jobId}`);
  }

  static getShortList(
    params: GetShortListRequestParams,
  ): AxiosPromise<GetCompanyCandidatesResponse> {
    return Api.get('company/candidates', params);
  }

  static addToShortList(
    candidateId: number,
    data: UpdateShortListStatusRequestBody,
  ): AxiosPromise<UpdateShortListResponse> {
    return Api.put(`company/candidates/${candidateId}/shortlist`, data);
  }

  static getInterestedIn(
    params: GetCompanyInterestedInRequestParams,
  ): AxiosPromise<GetCompanyCandidatesResponse> {
    return Api.get('company/candidates', params);
  }
}
