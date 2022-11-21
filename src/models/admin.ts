/* eslint-disable camelcase */
import { KeyProject, License, ProfessionalDetails, WorkExperience } from './candidate';
import {
  CV,
  MatchedContract,
  MatchedJobSteps,
  PaymentType,
  PayOption,
  PositionType as PositionTypeEnum,
  UserType,
} from './common';
import { TimesheetExpenses } from './company';

export type User = {
  refresh: string;
  access: string;
  userType: UserType.ADMIN;
  typeId: number;
  email: string;
};

export type CompanyWithLiveJobsCount = {
  id: number;
  name: string;
  companyLogo: string | null;
  jobCount: number;
};

export type AdditionalInfo = {
  additionalInformation: string;
};

export type LiveJob = {
  id: number;
  positionName: string;
  companyName: string;
  addedAt: string;
  companyLogo: string | null;
  jobDetail: string | null;
  overview: string;
  projectTypeName: string;
  location: string;
  salary: number;
  statusName: string;
  positionTypeName: string;
  candidateCount: number;
  company: number;
  superAmount: number;
  paymentTypeName: 'Daily' | 'Hourly';
};

export type LiveJobCandidate = {
  id: number;
  name: string;
  avatar: string | null;
  match: number;
  location: string;
  salary: number;
  isMatched: boolean;
  addedAt: string | null;
  step?: string;
  positions: string[];
};

export type LiveJobFeedback = {
  id: number;
  repliesCount: number;
  latestReplyDate: string;
  candidateName: string;
  candidatePhoto: string | null;
  text: string;
  createdAt: string;
};

export type LiveJobFeedbackReplies = {
  id: number;
  candidateName: string;
  candidatePhoto: string | null;
  replies: {
    id: number;
    name: string;
    photo: string | null;
    addedAt: string;
    text: string;
    isAdmin: boolean;
  }[];
  text: string;
  createdAt: string;
};

export type LiveJobRecord = {
  text: string;
};

export type Candidate = {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  location: string;
  jobPositions: string[];
  projectTypes: string[];
  status?: 'Active' | 'disable';
  salary: number;
  brandedCv: string;
};

export enum EmployerStatus {
  NONE = 0,
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
}

export type CityProps = {
  name: string;
  stateId: string;
  id: string;
};

export type StateProps = {
  name: string;
  abbr: string;
  id: string;
};

export type JobPosition = {
  name: string;
  id: string;
};

export type JobState = {
  id: number;
  position: JobPosition;
  projectType: {
    id: number;
    name: string;
  };
  salary: number;
  city: CityProps;
  state: StateProps;
  superAmount: number;
};

export type ProjectType = {
  id: number;
  name: string;
};

export type UserProps = {
  email: string;
  password: string;
};

export type ContactProps = {
  id: number;
  name: string;
  position: string;
  email: string;
  phone: string;
};

export type EmployerDetailsProps = {
  id: number;
  jobs: JobState[];
  companyLogo: string;
  city: CityProps;
  state: StateProps;
  user: UserProps;
  contacts: ContactProps;
  name: string;
  address: string;
  phone: string;
  site: string;
  status: string;
  approveStatus: EmployerStatus;
};

export type Employers = {
  id: number;
  name: string;
  city: CityProps;
  state: StateProps;
  companyLogo: string;
  jobs: JobState[];
};

export type CandidateOverview = {
  id: number;
  name: string;
  location: string;
  avatar: string | null;
  workExps: WorkExperience[];
  keyProjects: KeyProject[];
  license: License[];
  brandedCv: string;
  brandedCvSize: string;
  brandedCvName: string;
};

export type CandidateMatched = {
  id: number;
  positionName: string;
  companyName: string;
  addedAt: string;
  companyLogo: string;
  jobDetail: string;
  projectTypeName: string;
  location: string;
  statusName: string;
  positionTypeName: string;
  candidateCount: number;
  match: number;
  isMatched: boolean;
  positionType: number[];
  salary: number;
  status: number[];
  disclose: boolean;
  createdAt: string;
  company: number;
  position: number;
  projectType: number;
  step: string;
};

export type CandidateAdditionalInfo = {
  id: number;
  additionalInformation: string;
  jobPositions: string[];
  projectTypes: string[];
  describeJobs: string[];
  interestedCompanies: string[];
  notInterestedCompanies: string[];
  relocate: boolean;
  phone: string;
  email: string;
  yearsOfExp: number;
  availability: string;
  linkedInResume: string;
  linkedInResumeSize: string;
  linkedInResumeName: string;
  cv: CV;
};

export enum CandidateStatus {
  New = 1,
  Approved = 2,
  Rejected = 3,
}

export type CandidateFeedback = {
  id: number;
  repliesCount: number;
  latestReplyDate: string;
  companyName: string;
  companyPhoto: string;
  jobName: string;
  text: string;
  createdAt: string;
  job: number;
};

export type CandidateFeedbackReplies = {
  id: number;
  replies: {
    id: number;
    name: string;
    photo: string | null;
    addedAt: string;
    text: string;
    isAdmin: boolean;
  }[];
  companyName: string;
  companyPhoto: string;
  jobName: string;
  text: string;
  createdAt: string;
};

export type CandidateRecord = {
  id: number;
  adminName: string;
  adminPhoto: string | null;
  text: string;
  updatedAt: string;
};

export type CandidateProfessionalDetails = ProfessionalDetails & AdditionalInfo;

export type ContactCompanies = {
  id: number;
  companyName: string;
  location: string;
  companyLogo: string;
  firstName: string;
  lastName: string;
  position: number;
  email: string;
  phone: string;
  company: number;
};

export type ContactCandidates = {
  id: number;
  avatar: string;
  location: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  positions: string[];
};
export type UnmatchedJob = {
  id: number;
  positionName: string;
  location: string;
  salary: number;
  companyLogo: string | null;
  companyName: string;
};

export type MatchedJob = {
  id: number;
  positionName: string;
  location: string;
  salary: number;
  avatar: string | null;
  candidateName: string;
  positionTypeName: string;
  projectTypeName: string;
  interview: ArrangedInterview;
  invoice: CreatedInvoice;
  contract: MatchedContract | null;
  status: boolean;
  createdAd: string;
  step: MatchedJobSteps;
  notes: string;
  job: number;
  candidate: number;
  companyName: string;
  approvedDate: string;
  companyId: number;
  managerName: string;
  shortlist: boolean;
  superAmount: number;
  companyApproval: boolean;
  candidateApproval: boolean;
};

export type initialColumnsType = {
  [key: string]: {
    id: number;
    title: string;
    items: MatchedJob[];
  };
};

export type ArrangedInterview = {
  id: number;
  participants: string[];
  date: string;
  time: string;
  location: string;
  matched: number;
  passed: boolean;
  message: string;
  admin: number;
};

export type CreatedInvoice = {
  id: number;
  startDate: string;
  salary: number;
  percent: number;
  matched: number;
};

export type CreatedContract = {
  id: number;
  paymentType: PaymentType;
  agreementDate: string;
  commencementDate: string;
  supervisor: number;
  hoursOfWork: string;
  candidateRate: string;
  companyRate: string;
  timesheetDeadline: string;
  payOption: PayOption;
  matched: number;
};

export type JobContract = {
  id: number;
  companyName: string;
  companyLogo: string;
  companyLocation: string;
  companyStatus: boolean;
  candidateName: string;
  candidateLocation: string;
  candidatePhoto: string | null;
  candidateStatus: boolean;
  pending: boolean;
  fileName: string;
  fileSize: string;
  file: string;
};

export type GetAdminProfile = {
  id: number;
  user: {
    email: string;
  };
  phone: string;
};

export type AdminProfileProps = {
  email: string;
};

export type AdminPaymentDetails = {
  abn: string;
  tfn: string;
  bsb: string;
  acc: string;
};
export type ChangePassword = {
  password: string;
  newPassword: string;
  conFirmPassword: string;
};
export type TermsAndConditions = {
  text: string;
};

export type InterviewQuestions = {
  explanation: string;
  question_1: string;
  question_2: string;
  question_3: string;
  question_4: string;
};

export type DashboardRequests = {
  id: number;
  phone: string;
  email: string;
  photo: string;
  name: string;
  location: string;
  addedAt: string;
  date: string;
  time: string;
  notes: string;
  createdAt: string;
};

export type DashboardTasks = {
  id: number;
  priority: number;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
  admin: number;
  author: string;
};

export type TasksDropdownType = {
  id: number;
  title: string;
};

export type DashboardPaymentReports = {
  id: number;
  companyName: string;
  location: string;
  total: string;
  externalStatus: string;
  createdAt: string;
};

export enum TaskPriority {
  Low = 1,
  Medium = 2,
  High = 3,
  Done = 4,
}
export enum TaskPriorityString {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Done = 'Done',
}

export type PriorityItemsType = {
  label: string;
  value: number;
};

export type UpdateDashboardTask = {
  id: number;
  priority: number;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
  admin: number;
  author: string;
};

export enum PositionType {
  ASSIGNED = 1,
  UNASSIGNED = 2,
}

export enum AdminNotification {
  NewCompany = 21,
  NewJob = 22,
  NewRequest = 23,
  CandidateAgreedToMatch = 24,
  CompanyAgreedToMatch = 25,
  NewFeedbackFromCandidate = 26,
  NewFeedbackFromCompany = 27,
  NewReplyFromCandidate = 28,
  NewReplyFromCompany = 29,
  CandidateApprovedContract = 30,
  CandidateDeclinedContract = 31,
  CompanyApprovedContract = 32,
  CompanyDeclinedContract = 33,
  NewTaskAdded = 41,
  TaskCompleted = 42,
}

export type AdminsList = {
  id: number;
  user: string;
  phone: string;
  superAdmin: boolean;
  actions: boolean;
  assignedPositions: number;
  firstName: string;
  lastName: string;
  photo: string;
  regions: number[];
  positions: number[];
  jobs: number[];
};

export type InvitedAdmin = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

export type AdminCompanyState = {
  name: string;
  abbr: string;
  id: number;
};

export type AdminCompanyList = {
  id: number;
  name: string;
  logo: string;
  state: AdminCompanyState;
  adminCount: number;
  selected: boolean;
};

export type AdminRegions = {
  id: number;
  adminCount: number;
  name: string;
  abbr: string;
  selected: boolean;
};

export type AdminJobs = {
  id: number;
  company: {
    id: number;
    name: string;
    logo: string;
  };
  location: string;
  positionName: string;
};

export type AssignedCompaniesAndRegions = {
  id: number;
  user: string;
  phone: string;
  photo: string;
  firstName: string;
  lastName: string;
  regions: number[];
  positions: number[];
  jobs: number[];
  superAdmin: boolean;
  assignedPositions: number;
  actions: boolean;
};

export type AssignJobToAdmin = {
  job: number;
  admin: number;
};

export type DashboardScoreboard = {
  interviews: number;
  jobs: number;
  placements: number;
  revenue: number;
  tempsWorking: number;
};

export type DashboardBillings = {
  yearBillings: number;
  monthName: string;
  monthBillings: number;
};

export type EmailPart = {
  mimeType: string;
  filename: string;
  body: {
    attachmentId: string;
  };
};

export type Thread = {
  id: string;
  snippet: string;
  historyId: number;
};

export type ThreadMessage = {
  historyId: number;
  id: string;
  internalDate: number;
  labelIds: string[];
  snippet: string;
  threadId: string;
  payload: {
    headers: { name: string; value: string }[];
    body: {
      data: string;
      size: number;
    };
    parts?: EmailPart[];
  };
};

export type FullThread = {
  historyId: number;
  id: string;
  messages: ThreadMessage[];
};

export type SendResume = {
  candidate: number;
  jobPosition: number;
  description: string;
  companies: {
    id: 0;
    hiringManagers: number[];
  }[];
};

export type SendResumeLog = {
  id: number;
  createdAt: string;
  description: string;
  hiringManager: number;
  candidate: number;
  candidateName: string;
  jobPosition: number;
  jobPositionName: string;
  file: string;
};

export type MatchedInterview = {
  id: number;
  participants: string[];
  avatar: string;
  candidateName: string;
  companyLogo: string;
  companyName: string;
  date: string;
  time: string;
  location: string;
  matched: number;
};

export type ManagerNote = {
  id: number;
  adminName: string;
  adminPhoto: string | null;
  text: string;
  updatedAt: string;
};

export type ScoreboardInterview = {
  id: number;
  logo: string | null;
  companyName: string;
  positionName: string;
  managerName: string;
  candidateName: string;
  adminName: string;
  date: string;
  time: string;
  createdAt: string;
};

export type ScoreboardJob = {
  id: number;
  logo: string | null;
  companyName: string;
  positionName: string;
  managerName: string;
  createdAt: string;
  adminName: string;
};

export type ScoreboardPlacement = {
  id: number;
  logo: string | null;
  companyName: string;
  positionName: string;
  managerName: string;
  candidateName: string;
  adminName: string;
  createdAt: string;
  approvedDate: string;
};

export type ScoreboardRevenue = {
  id: number;
  logo: string | null;
  companyName: string;
  positionName: string;
  type: PositionTypeEnum;
  candidateName: string;
  adminName: string;
  total: string;
  createdAt: string;
};

export type ScoreboardTempWork = {
  id: number;
  logo: string | null;
  companyName: string;
  positionName: string;
  candidateName: string;
  adminName: string;
  totalWorkCount: number;
  total: number;
  paymentType: PaymentType;
};

export enum Scoreboard {
  Jobs = 1,
  Interviews = 2,
  Placements = 3,
  Revenues = 4,
  TempWorks = 5,
}

export type AdminTimesheet = {
  id: number;
  companyLogo: string;
  companyName: string;
  jobPosition: string;
  contractPrice: string;
  contractType: string;
  total: number;
  inTotal: string;
  candidatePrice: string;
  candidate: string;
  candidateInTotal: string;
  week: string;
  status: number;
  workCount: number;
  matched: 1 | 2 | 3;
};

export type AdminTimesheetById = {
  id: number;
  companyLogo: string;
  companyName: string;
  jobPosition: string;
  contractPrice: string;
  contractType: string;
  total: number;
  inTotal: string;
  week: string;
  status: number;
  matched: number;
  workCount: number;
  rows: {
    id: number;
    name: string;
    description: string;
    days: boolean[];
    hours: number[];
  }[];
  additionalExpenses: TimesheetExpenses[];
};

export type MatchedCandidateTimesheet = {
  id: number;
  fullName: string;
};

export type MatchedCompanyTimesheet = {
  id: number;
  logo: string;
  name: string;
};

export enum WhiteboardNoteType {
  Talent = 'Talent',
  Interviews = 'Interviews',
  Placements = 'Placements',
  UrgentJobs = 'Urgent jobs',
  KeyNotes = 'Key notes',
}

export type WhiteboardNote = {
  id: number;
  value: number;
  description: string;
  type: WhiteboardNoteType;
};

export enum ReceiverType {
  Company = 1,
  HiringManager = 2,
}
