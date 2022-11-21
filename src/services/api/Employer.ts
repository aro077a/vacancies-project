import { AxiosPromise } from 'axios';

import {
  CreateCompanyBusinessDetailsRequestBody,
  CreateCompanyInfoRequestBody,
  CreateHiringManagerRequestBody,
  GetECompanyManagersResponseParams,
  UploadCompanyLogoRequestBody,
} from '~/types/requests';
import {
  CreateCompanyBusinessDetailsResponse,
  CreateEmployerCompanyInfoResponse,
  GetCompanyHiringManagerResponse,
  UploadCompanyLogoResponse,
} from '~/types/responses';

import { Api } from './Api';

export class Employer {
  static createCompanyInfo(
    data: CreateCompanyInfoRequestBody,
  ): AxiosPromise<CreateEmployerCompanyInfoResponse> {
    return Api.post('company/register', data);
  }

  static createCompanyDetails(
    companyId: number,
    data: CreateCompanyBusinessDetailsRequestBody,
  ): AxiosPromise<CreateCompanyBusinessDetailsResponse> {
    return Api.post(`company/${companyId}/contact`, data);
  }

  static uploadCompanyLogo(
    companyId: number,
    data: UploadCompanyLogoRequestBody,
  ): AxiosPromise<UploadCompanyLogoResponse> {
    return Api.post(`company/${companyId}/logo`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
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
  ): AxiosPromise<GetCompanyHiringManagerResponse> {
    return Api.post(`company/${companyId}/manager`, data);
  }

  static deleteHiringManager(companyId: number, managerId: number): AxiosPromise<null> {
    return Api.delete(`company/${companyId}/manager/${managerId}`);
  }
}
