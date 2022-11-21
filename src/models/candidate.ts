import { MatchedJob } from './admin';
import { MatchedJobFeedbackReply, PaymentRateType, PermissionType, UserType } from './common';
import { TimesheetExpenses } from './company';

export enum LookingJobStatus {
  ACTIVE = 1,
  PASSIVE = 2,
  NOT_LOOKING = 3,
}

export type Profile = {
  id: number;
  user: {
    email: string;
  };
  linkedInResume?: string | null;
  linkedInResumeSize: string | null;
  linkedInResumeName: string | null;
  firstName: string;
  lastName: string;
  relocate: boolean;
  phone: string | null;
  city: number;
  state: number;
  admin: number;
};

export type WorkExperience = {
  id: number;
  logo: string | null;
  name: string;
  position: string;
  workStart: Date;
  workEnd: Date;
  location: number;
  details: WorkDetails[];
  country: number;
};

export type KeyProject = {
  id: number;
  name: string;
  position: string;
  workStart: Date;
  workEnd: Date;
  location: number;
  details: WorkDetails[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: number | any;
  type: string;
};

export type KeySkill = {
  id: number;
  name: string;
};

export type WorkDetails = {
  id: number;
  name: string;
};

export type Qualifications = {
  id: number;
  name: string;
};

export type ProfessionalDetails = {
  id: number;
  workExps: WorkExperience[];
  keyProjects: KeyProject[];
  projectValues: number;
  yearsOfExp: number;
  minSalary: number;
  availability: number;
  status: LookingJobStatus;
  jobPositions: number[] | { id: number; name: string }[];
  projectTypes: number[] | { id: number; name: string }[];
  interestedCompanies: number[] | { id: number; name: string }[];
  notInterestedCompanies: number[] | { id: number; name: string }[];
  interest: string;
  visaStatus: string;
  overview: string;
  qualifications: Qualifications[];
  professionalExperience: string;
  references: string;
  generalSummary: string;
  keySkills: KeySkill[];
  jobTitle: number;
  permission: PermissionType;
};

export type License = {
  id?: number;
  file: string;
  size?: string;
  name: string;
  expirationDate?: string;
};

export type Photo = {
  id: number;
  file: string;
};

export type User = {
  refresh: string;
  access: string;
  userType: UserType.CANDIDATE;
  typeId: number;
  username: string;
  photo: string | null;
  status: string;
  userStatus: number;
};

export type VideoInterview = {
  video: File | null;
};

export type BoardsType = {
  [key: string]: {
    id: number;
    title: string;
    items: MatchedJob[];
    label: string;
    icon: string;
  };
};

export type MatchedJobDetail = {
  id: number;
  positionName: string;
  companyName: string;
  location: string;
  description: string;
  projectTypeName: string;
  positionTypeName: string;
  companyLogo: string | null;
  companySite: string;
  match: string;
  interested: boolean;
  salary: number;
};

export type MatchedJobContract = {
  id: number;
  file: string;
  fileName: string;
  fileSize: string;
  approved: boolean | null;
};

export type MatchedJobFeedback = {
  id: number;
  candidateName: string;
  candidatePhoto: string | null;
  text: string;
  createdAt: string;
  replies: MatchedJobFeedbackReply[];
};

export type CandidateTimesheet = {
  id: number;
  companyLogo: string;
  companyName: string;
  jobPosition: string;
  contract: string | number;
  contractPrice: string;
  contractType: string;
  contractName: string;
  total: number;
  inTotal: string;
  week: string;
  status: number;
  matched: 1 | 2 | 3;
};

export type TimesheetPipeline = {
  id: number;
  positionName: string;
  companyName: string;
  location: string;
  salary: number;
  avatar: string;
  candidateName: string;
  positionTypeName: string;
  projectTypeName: string;
  approvedDate: string;
  candidate: number;
  candidateApproval: boolean;
  companyApproval: boolean;
  contract: {
    id: number;
    fileName: string;
    fileSize: string;
    paymentType: number;
    price: 1 | 2;
    file: string;
    percent: number;
    candidateRate: number;
  };
  createdAt: string;
  interview: null;
  invoice: null;
  job: number;
  notes: null;
  status: true;
  step: number;
};
export type FindJob = {
  id: number;
  positionName: string;
  location: string;
  description: string;
  projectTypeName: string;
  positionTypeName: string;
  interested?: boolean;
  salary: number;
  hiringManager: number;
  shortlist: boolean;
  companyLogo: string;
  paymentType: PaymentRateType;
};

export type CreatedTimesheetEntry = {
  id: number;
  companyLogo: string;
  companyName: string;
  jobPosition: string;
  contract: string;
  contractPrice: string;
  contractType: string;
  total: number;
  inTotal: string;
  rows: [
    {
      id: number;
      name: string;
      description: string;
      days: number[];
      hours: number[];
    },
  ];
  additionalExpenses: [
    {
      id: number;
      attachments: {
        id: number;
        file: string;
      };
      name: string;
      price: string;
    },
  ];
  week: string;
  status: number | null;
  matched: number[];
};

export type TimeSheetTabType = {
  days: number[];
  description: string;
  id: string;
  name: string;
};
export type ExpensesTabType = {
  attachments: File[];
  id: string;
  name: string;
  price: string | number;
};

export type CustomSelectValueType = {
  contractPrice: string;
  image: string;
  label: string;
  matched: number;
  paymentType: number;
  value: number;
};

export enum CandidateTimesheetStatus {
  SUBMITTED = 1,
  APPROVED = 2,
  REJECTED = 3,
}

export enum LoggedInCandidateStatus {
  NEW = 1,
  APPROVED = 2,
  REJECTED = 3,
}

export enum CandidateNotification {
  NewOfferNotification = 1,
  OfferClosedNotification = 2,
  NewInterviewNotification = 3,
  LeaveFeedbackNotification = 4,
  NewReplyNotification = 5,
  NewContractNotification = 6,
  TimesheetApproved = 7,
  TimesheetDeclined = 8,
}

export enum CandidateJobStatus {
  ACTIVE = 'Active',
  PASSIVE = 'Passive',
  NOT_LOOKING = 'Not Looking',
}

export enum TabsType {
  NewOffers = 1,
  ActiveVacancies = 2,
  Interviews = 3,
  PlacementApproved = 4,
}

export type CandidateTimesheetById = {
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
