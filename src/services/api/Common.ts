import { AxiosPromise } from 'axios';

import {
  CreateHiringManagerRequestBody,
  CreateJobDescriptionRequestBody,
  CreateJobDescriptionRequestParams,
  CreateJobHiringManagerRequestBody,
  CreateJobHiringManagerRequestParams,
  CreateJobInfoRequestBody,
  DeleteJobRequestParams,
  GetCompaniesShortListRequestParams,
  GetCompanyHiringManagersRequestBody,
  GetJobDescriptionRequestParams,
  GetJobHiringManagerRequestParams,
  GetJobInfoRequestParams,
  GetNotificationParams,
  SendContactUsFormRequestBody,
  setHiringManagerRequestBody,
  UpdateHiringManagerRequestBody,
  UpdateJobInfoRequestParams,
  UpdateNotificationStatusRequestBody,
} from '~/types/requests';
import {
  CreateJobDescriptionResponse,
  CreateJobHiringManagerResponse,
  CreateJobInfoResponse,
  GetCitiesResponse,
  GetCompaniesResponse,
  GetCompaniesShortListResponse,
  GetContactCandidatesResponse,
  GetCountriesResponse,
  GetCreatedHiringManagerResponse,
  GetJobDescriptionResponse,
  GetJobInfoResponse,
  GetJobPositionsResponse,
  GetNotificationsCountResponse,
  GetNotificationsResponse,
  GetProjectTypesResponse,
  GetStatesResponse,
  RepresentativeManagerResponse,
} from '~/types/responses';

import { Api } from './Api';

export class Common {
  static getCountries(): AxiosPromise<GetCountriesResponse> {
    return Api.get('glossary/country');
  }

  static getStates(): AxiosPromise<GetStatesResponse> {
    return Api.get('glossary/states');
  }

  static getCities(): AxiosPromise<GetCitiesResponse> {
    return Api.get('glossary/cities');
  }

  static getJobPositions(): AxiosPromise<GetJobPositionsResponse> {
    return Api.get('glossary/job_position');
  }

  static getJobGroupsRequest(): AxiosPromise<any> {
    return Api.get('glossary/job_group');
  }

  static getProjectTypes(): AxiosPromise<GetProjectTypesResponse> {
    return Api.get('glossary/project_type');
  }

  static getHiringManagerProjectTypes(): AxiosPromise<GetProjectTypesResponse> {
    return Api.get('/glossary/hiring_project_type');
  }

  static getHiringManagerJobPositions(): AxiosPromise<GetJobPositionsResponse> {
    return Api.get('/glossary/hiring_job_position');
  }

  static getCompanies(): AxiosPromise<GetCompaniesResponse> {
    return Api.get('company/short_info');
  }

  static getAllCandidates(): AxiosPromise<GetContactCandidatesResponse> {
    return Api.get('dashboard/contacts/candidates');
  }

  static getCompaniesShortList(
    params: GetCompaniesShortListRequestParams,
  ): AxiosPromise<GetCompaniesShortListResponse> {
    return Api.get('company/short_info', params);
  }

  static createJobInfo(body: CreateJobInfoRequestBody): AxiosPromise<CreateJobInfoResponse> {
    return Api.post('jobs/main', body);
  }

  static updateJobInfo(
    params: UpdateJobInfoRequestParams,
    body: CreateJobInfoRequestBody | UpdateHiringManagerRequestBody,
  ): AxiosPromise<CreateJobInfoResponse> {
    return Api.put(`jobs/${params.id}`, body);
  }

  static getJobInfo(params: GetJobInfoRequestParams): AxiosPromise<GetJobInfoResponse> {
    return Api.get(`jobs/${params.id}`);
  }

  static createJobHiringManager(
    params: CreateJobHiringManagerRequestParams,
    body: CreateJobHiringManagerRequestBody,
  ): AxiosPromise<CreateJobHiringManagerResponse> {
    return Api.post(`jobs/${params.id}/manager`, body);
  }

  static updateJobHiringManager(
    params: CreateJobHiringManagerRequestParams,
    body: CreateJobHiringManagerRequestBody,
  ): AxiosPromise<CreateJobHiringManagerResponse> {
    return Api.put(`jobs/${params.id}/manager`, body);
  }

  static getJobHiringManager(
    params: GetJobHiringManagerRequestParams,
  ): AxiosPromise<GetCreatedHiringManagerResponse> {
    return Api.get(`jobs/${params.id}/manager`);
  }

  static createJobDescription(
    params: CreateJobDescriptionRequestParams,
    body: CreateJobDescriptionRequestBody,
  ): AxiosPromise<CreateJobDescriptionResponse> {
    return Api.post(`jobs/${params.id}/detail`, body);
  }

  static updateJobDescription(
    params: CreateJobDescriptionRequestParams,
    body: CreateJobDescriptionRequestBody,
  ): AxiosPromise<CreateJobDescriptionResponse> {
    return Api.put(`jobs/${params.id}/detail`, body);
  }

  static getJobDescription(
    params: GetJobDescriptionRequestParams,
  ): AxiosPromise<GetJobDescriptionResponse> {
    return Api.get(`jobs/${params.id}/detail`);
  }

  static deleteJob(params: DeleteJobRequestParams): AxiosPromise {
    return Api.delete(`jobs/${params.id}`);
  }

  static getCompanyHiringManagers(
    companyId?: number,
    params?: GetCompanyHiringManagersRequestBody,
  ): AxiosPromise<any> {
    return Api.get(`company/${companyId}/manager`, params);
  }

  static createCompanyHiringManager(
    companyId: number,
    data: CreateHiringManagerRequestBody,
  ): AxiosPromise<GetCreatedHiringManagerResponse> {
    return Api.post(`company/${companyId}/manager`, data);
  }

  static setHiringManager(
    jobId: number,
    data: setHiringManagerRequestBody,
  ): AxiosPromise<GetCreatedHiringManagerResponse> {
    return Api.patch(`jobs/${jobId}`, data);
  }

  static getNotifications(params: GetNotificationParams): AxiosPromise<GetNotificationsResponse> {
    return Api.get('api/notification', params);
  }

  static updateNotificationStatus(
    notificationId: number,
    body: UpdateNotificationStatusRequestBody,
  ): AxiosPromise<null> {
    return Api.patch(`api/notification/${notificationId}`, body);
  }

  static getNotificationsCount(): AxiosPromise<GetNotificationsCountResponse> {
    return Api.get('api/notification/count');
  }

  static deleteNotifications(): AxiosPromise<null> {
    return Api.delete('api/notification/clear');
  }

  static sendContactUsForm(data: SendContactUsFormRequestBody): AxiosPromise<null> {
    return Api.post('api/contact-us', data);
  }

  static getRepresentativeManagerRequest(
    id: number | undefined,
  ): AxiosPromise<RepresentativeManagerResponse> {
    return Api.get(`company/${id}`);
  }
}
