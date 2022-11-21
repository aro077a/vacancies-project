import { LookingCandidateStatus } from './company';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type CreateCompany = {
  id: number;
  user: {
    email: string;
  };
  phone: string;
  lastName: string;
  firstName: string;
  name: string;
  address: string;
  abn: string;
  site: string;
  status: LookingCandidateStatus;
  city: number | any;
  state: number | any;
  admin: number | any;
};

export type CreateCompanyBusinessDetails = {
  id: number;
  name: string;
  position: string;
  email: string;
  phone: string;
};
