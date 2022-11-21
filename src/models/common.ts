export type Country = {
  name: string;
  id: number;
};

export type State = {
  name: string;
  abbr: string;
  id: number;
  value?: number;
};

export type City = {
  name: string;
  id: number;
  stateId: number;
  value?: number;
};

export type JobPosition = {
  id: number;
  name: string;
};

export type JobGroup = {
  candidatesCount: number;
  id: number;
  jobsCount: number;
  name: string;
  positions: JobGroupPositionType[];
};

export type JobGroupPositionType = {
  candidatesCount: number;
  id: number;
  jobsCount: number;
  name: string;
};

export type ProjectType = {
  id: number;
  name: string;
};

export type CompanyType = {
  id: number;
  name: string;
  companyLogo: string | null;
};

export type CandidateType = {
  id: number;
  firstName: string;
  lastName: string;
  avatar: string | null;
};

export enum UserType {
  ADMIN = 'admin',
  CANDIDATE = 'candidate',
  COMPANY = 'company',
  MANAGER = 'hiring_manager',
  SUPER_ADMIN = 'super_admin',
}

export type DatePattern = 'dd/MM/yyyy' | 'MM/yyyy';

export enum JobStatus {
  ACTIVE = 1,
  CLOSED = 2,
}

export enum PositionType {
  PERMANENT = 1,
  TEMPORARY = 2,
}

export enum SuperType {
  INCLUDING = 1,
  EXCLUDING = 2,
}

export enum PaymentRateType {
  DAILY = 2,
  HOURLY = 1,
}

// export enum CompanyInfoType {
//   REPRESENTATIVE = true,
//   HIRING_MANAGER = false,
// }

export enum ContactType {
  COMPANY = 'company',
  CANDIDATE = 'candidate',
}

export type JobInfo = {
  id: number;
  positionType: PositionType;
  salary: number;
  status: JobStatus;
  disclose: boolean;
  createdAt: string;
  overview: string;
  company: number;
  companyLogo: string | null;
  companyName: string;
  position: number;
  projectType: number;
  city: number;
  state: number;
  hiringManager: number;
  superAmount: number;
  address: string;
  projectNumber: string;
  representative: boolean;
};

export type JobHiringManager = {
  name: string;
  email: string;
  position: string | null;
  phone: string;
};

export type JobDescription = {
  description: string;
};

export enum MatchedJobSteps {
  CandidateMatched = 1,
  AgreedByCandidate = 2,
  SentToEmployee = 3,
  AcceptedByEmployee = 4,
  InterviewArranged = 5,
  PlacementApproved = 6,
  Completed = 7,
  Canceled = 8,
  WaitingForApproval = 9,
  TemporaryWorkers = 10,
}

export enum PaymentType {
  Hourly = 1,
  Daily = 2,
}

export type MatchedJobFeedbackReply = {
  id: number;
  name: string;
  photo: string | null;
  addedAt: string;
  isAdmin: boolean;
  text: string;
};

export type CV = {
  id: number;
  file: string;
  size: string;
  name: string;
};

export type MatchedContract = {
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
};

export type ManagerSelectOption = {
  label: string;
  value: number;
  office: number;
  phone: string;
  position: number;
  id: number;
  email: string;
  permission: PermissionType;
};

export type Notification = {
  id: number;
  addedAt: string;
  type: number;
  isNew: boolean;
  title: string;
  body: string;
  createdAt: string;
  foreignObject: number;
  image: string;
  name: string;
};

export enum PayOption {
  PAYG = 1,
  ABN = 2,
}

export enum PermissionType {
  Temporary = 1,
  Permanent = 2,
  Both = 3,
}

export type CandidateDocument = {
  id: number;
  size: string;
  name: string;
  file: string;
};
