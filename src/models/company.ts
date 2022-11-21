import { License, LookingJobStatus } from './candidate';
import {
  CV,
  JobStatus,
  MatchedJobFeedbackReply,
  MatchedJobSteps,
  PaymentRateType,
  PermissionType,
  UserType,
} from './common';

export enum LookingCandidateStatus {
  ACTIVE = 1,
  PASSIVE = 2,
  NOT_LOOKING = 3,
}

export type Info = {
  id: number;
  user: {
    email: string;
  };
  phone: string | null;
  name: string;
  address: string;
  site: string | null;
  status: LookingCandidateStatus;
  city: number;
  state: number;
};

export type ContactDetails = {
  id: number;
  name: string;
  position: string;
  email: string;
  phone: string;
};

export type Logo = {
  id: number;
  file: string;
};

export type User = {
  refresh: string;
  access: string;
  userType: UserType.COMPANY;
  typeId: number;
  company: string;
  logo: string | null;
};

export type MatchedCandidateDetail = {
  id: number;
  candidateName: string;
  avatar: string | null;
  location: string | null;
  jobPositions: string[];
  projectTypes: string[];
  minSalary: number;
  status: number;
  matchedMax: number;
  additionalInformation: string;
  workExps: MatchedCandidateWorkExp[];
  keyProjects: CandidateKeyProject[];
  describeJobs: string[];
  yearsOfExp: number;
  availability: number;
  cv: CV;
  interested: boolean;
  interestedId: number;
  license: License[];
  jobName: string;
  shortlist: boolean;
  brandedCvUrl: string;
  brandedCvName: string;
  brandedCvSize: string;
};

export type MyJobs = {
  count: number;
  next: string;
  previous: string;
  results: MyJob[];
};

export type MatchedCandidateWorkExp = {
  id: number;
  logo: string | null;
  location: string;
  name: string;
  position: string;
  workStart: Date;
  workEnd: Date;
};

export type MatchedCandidateKeyProject = {
  id: number;
  location: string;
  name: string;
  position: string;
  workStart: Date;
  workEnd: Date;
};

export type CandidateKeyProject = {
  id: number;
  location: string;
  name: string;
  position: string;
  workStart: string;
  workEnd: string;
  type: string;
  value?: string | number;
};

export type SearchCandidate = {
  id: number;
  candidateName: string;
  jobName: string;
  avatar: string | null;
  location: string;
  companies: string[];
  keyProjects: CandidateKeyProject[];
  minSalary: number;
  status: LookingJobStatus;
  matchedMax: number;
  shortlist: boolean;
  brandedCv: string;
};

export type MatchedCandidateContract = {
  id: number;
  file: string;
  fileName: string;
  fileSize: string;
  approved: boolean | null;
};

export type MatchedCandidateFeedback = {
  id: number;
  repliesCount: number;
  latestReplyDate: string;
  companyName: string;
  companyPhoto: string;
  jobName: string;
  replies: MatchedJobFeedbackReply[];
  text: string;
  createdAt: string;
  job: number;
};
export type CompanyMainInfo = {
  id: number;
  user: {
    email: string;
  };
  firstName: string;
  lastName: string;
  phone: string | null;
  name: string;
  address: string;
  abn: string;
  site: string | null;
  status: LookingCandidateStatus;
  city: number;
  state: number;
  admin: number;
};

export type ClientContactDetails = {
  name: string;
  position: string;
  email: string;
  phone: string;
};

export type CompanyHiringManger = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  position: number;
  phone: string;
  office: number;
  project: number;
  permission: PermissionType;
  representative: boolean;
};

export type CompanyTimesheet = {
  id: number;
  candidate: string;
  location: string;
  jobPosition: string;
  contractPrice: string;
  contractType: string;
  total: number;
  inTotal: string;
  week: string;
  status: number;
  matched: number;
};

export type CompanyTimesheetById = {
  id: number;
  candidate: string;
  location: string;
  jobPosition: string;
  contractPrice: string;
  contractType: string;
  total: number;
  inTotal: string;
  week: string;
  status: number;
  matched: number;
  rows: {
    id: number;
    name: string;
    description: string;
    days: boolean[];
    hours: number[];
  }[];
  additionalExpenses: TimesheetExpenses[];
};

export enum TimesheetStatus {
  SUBMITTED = 1,
  APPROVED = 2,
  REJECTED = 3,
}

export type TimesheetRows = {
  days: boolean[];
  description: string;
  hours: number[];
  id: number;
  name: string;
};
export type AttachmentsType = {
  id: number;
  file: string;
  name: string;
};

export type TimesheetExpenses = {
  id: number;
  name: string;
  price: string;
  attachments: AttachmentsType[];
};

export type FileCardType = {
  file: string;
  name: string;
  fullWidth?: boolean;
};

export type MatchedCandidateForMyJob = {
  id: number;
  candidateName: string;
  photo: string | null;
  step: MatchedJobSteps;
  addedAt: string;
};

export type MyJob = {
  id: number;
  positionName: string;
  matchedCount: number;
  description: string;
  projectTypeName: string;
  positionTypeName: string;
  location: string;
  matched: MatchedCandidateForMyJob[];
  salary: number;
  status: JobStatus;
  hiringManager: number;
  superAmount: number;
  paymentType: PaymentRateType;
};

export enum CompanyNotification {
  NewMatchedNotification = 11,
  NewInterviewNotification = 12,
  LeaveFeedbackNotification = 13,
  NewReplyNotification = 14,
  NewContract = 15,
  NewTimesheet = 16,
}

export type FormattedDateType = {
  id: string;
  hour?: number;
  day?: number | boolean;
  week?: string;
};

export enum TabsType {
  Matched = 1,
  ArrangeInterview = 2,
  InterviewedCandidates = 3,
  PlacementApproved = 4,
}

export type RepresentativeManagerType = {
  user: {
    email: string;
  };
  abn: string;
  address: string;
  admin: string;
  city: 257;
  descriptionWork: string;
  firstName: string;
  id: number;
  lastName: string;
  name: string;
  phone: string;
  site: string;
  state: number;
  status: number;
};
