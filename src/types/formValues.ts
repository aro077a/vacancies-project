/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  City,
  ManagerSelectOption,
  PaymentRateType,
  PaymentType,
  PayOption,
  PermissionType,
  PositionType,
  State,
  SuperType,
} from '~/models//common';
import { ReceiverType, UserProps } from '~/models/admin';
import { KeySkill, LookingJobStatus, Qualifications, WorkDetails } from '~/models/candidate';
import { LookingCandidateStatus } from '~/models/company';
import { SelectOption } from '~/view/components/select';

export type CreateCandidateProfileFormValues = {
  user: {
    email: string;
    password: string;
    repeatPassword: string;
  };
  admin: SelectOption | null;
  firstName: string;
  lastName: string;
  city: SelectOption<{ stateId: number }> | null;
  state: SelectOption | null;
  relocate: false;
  phone: string;
  linkedInResume?: File | null;
};

export type UpdateCandidateProfileFormValues = Omit<
  CreateCandidateProfileFormValues,
  'user' | 'linkedInResume' | 'relocate' | 'phone' | 'city' | 'state' | 'admin'
> & {
  user: {
    email: string;
  };
  city: number | null;
  state: number | null;
  linkedInResume: string | null;
  relocate: boolean;
  phone: string;
  admin: number | null;
};

export type CreateCandidateProfessionalDetailsFormValues = {
  jobPositions: SelectOption[];
  projectTypes: SelectOption[];
  projectValues: SelectOption[] | number | any;
  interestedCompanies: SelectOption[];
  notInterestedCompanies: SelectOption[];
  jobTitle: SelectOption | null;
  permission: PermissionType;
  yearsOfExp: number;
  minSalary: string;
  availability: SelectOption[] | number | any;
  status: LookingJobStatus;
  workExps: {
    id: number;
    logo: File | null | string;
    name: string;
    position: string;
    location: SelectOption | null | number;
    workStart: Date | null;
    workEnd: Date | null;
    country: SelectOption<unknown> | null | number;
    details:
      | {
          id: number;
          name: string;
        }[];
  }[];
  keyProjects: {
    id: number;
    name: string;
    position: string;
    location: SelectOption | null | number;
    workStart: Date | null;
    workEnd: Date | null;
    value?: SelectOption | null | any;
    type: string;
  }[];
  qualifications: Qualifications[];
  keySkills: KeySkill[];
};

export type UpdateCandidateProfessionalDetailsAdminFormValues = {
  jobPositions: SelectOption[];
  projectTypes: SelectOption[];
  projectValues: SelectOption[] | number;
  interestedCompanies: SelectOption[];
  notInterestedCompanies: SelectOption[];
  jobTitle: SelectOption | null;
  yearsOfExp: number;
  minSalary: string;
  permission: PermissionType;
  availability: SelectOption[] | number;
  additionalInformation: string | null;
  interest: string;
  visaStatus: string;
  overview: string;
  qualifications: Qualifications[];
  professionalExperience: string;
  references: string;
  generalSummary: string;
  workExps: {
    id: number;
    logo: File | null | string;
    name: string;
    position: string;
    location: SelectOption | null | number;
    workStart: Date | null;
    workEnd: Date | null;
    details: WorkDetails[];
    country: SelectOption<unknown> | null | number;
  }[];
  keyProjects: {
    id: number;
    name: string;
    position: string;
    location: SelectOption | null | number;
    workStart: Date | null;
    workEnd: Date | null;
    value?: SelectOption | null | any;
    type: string;
  }[];
  keySkills: KeySkill[];
};

export type UploadCandidateCVFormValues = {
  file: File | null;
};

export type UploadCandidateLicensesFormValues = {
  file: File | null;
  expirationDate?: string | Date;
};

export type UploadCandidateDocumentsFormValues = {
  files: File[];
};

export type UpdateCandidateLicensesFormValues = {
  files: File[];
};

export type UploadCandidatePhotoFormValues = {
  file: File | null;
};

export type EnterCompanyMainInfoFormValues = {
  name: string;
  firstName: string;
  lastName: string;
  city: SelectOption<{ stateId: number }> | null;
  state: SelectOption | null;
  user: {
    email: string;
    password: string;
    repeatPassword: string;
  };
  status: LookingCandidateStatus;
  address: string;
  phone: string;
  site: string;
  abn: string;
  admin: SelectOption | null;
};

export type CreateCompanyContactDetailsFormValues = {
  name: string;
  position: string;
  email: string;
  phone: string;
};

export type UploadCompanyLogoFormValues = {
  file: File | null;
};

export type LoginFormValues = {
  email: string;
  password: string;
};

export type CreateJobInfoFormValues = {
  company: SelectOption | null;
  position: SelectOption | null;
  projectType: SelectOption | null;
  overview: string;
  positionType: PositionType;
  city: SelectOption<{ stateId: number }> | null;
  state: SelectOption | null;
  salary: string;
  disclose: boolean;
  superAmount: string | null;
  superType: SuperType;
  paymentType: PaymentRateType;
  admin: SelectOption | null;
  address: string;
  projectNumber: string;
  representative: boolean;
};

export type CreateEmployerFormValues = {
  id: number;
  user: UserProps | null;
  phone: string;
  name: string;
  address: string;
  site: string;
  status: number | null;
  city: City | SelectOption | null;
  state: State | SelectOption | null;
  email: string;
};

export type CreateNewEmployerFormValues = {
  user: {
    email: string;
    password: string;
  };
  firstName: string;
  lastName: string;
  phone: string;
  name: string;
  address: string;
  abn: string;
  site: string;
  city: SelectOption<{ stateId: number }> | null;
  state: SelectOption | null;
  admin: SelectOption | null;
};

export type CreateEmployerBusinessFormValues = {
  name: string;
  position: string;
  email: string;
  phone: string;
};

export type CreateJobHiringManagerFormValues = {
  manager: ManagerSelectOption | null;
  representative: boolean;
};

export type CreateNewContactCompanyFormValues = {
  firstName: string;
  lastName: string;
  position: SelectOption | null;
  project: SelectOption | null;
  city: SelectOption<{ stateId: number }> | null;
  state: SelectOption | null;
  email: string;
  phone: string;
  company: string | null | any;
  permission: PermissionType;
};

export type CreateNewContactCandidateFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  admin: SelectOption | null;
};

export type CreateMatchedJobNotes = {
  notes: string | null;
};

export type CreateInvoiceFormValues = {
  startDate: Date;
  salary: string;
  percent: string;
  flatFee?: string;
  flatFeeDescription?: string;
};

export type CreateJobContractFormValues = {
  paymentType: PaymentType;
  agreementDate: Date | string;
  commencementDate: Date | string;
  supervisor: SelectOption | null;
  hoursOfWork: string;
  candidateRate: string;
  companyRate: string;
  timesheetDeadline: string;
  payOption: PayOption;
};

export type SendJobContractAdditionalMessageFormValues = {
  message: string;
};

export type ArrangeInterviewFormValues = {
  date: Date | string;
  time: Date | string;
  participants: SelectOption[] | string[];
  location: string;
  message: string;
  admin: SelectOption | null;
};

export type EditAdminProfileDetailsFormValues = {
  user: {
    email: string;
  };
  phone: string;
};

export type EditAdminPaymentDetailsFormValues = {
  abn: string;
  tfn: string;
  bsb: string;
  acc: string;
};

export type TermsAndConditionsFormValues = {
  text: string | null;
};

export type InterviewQuestionsFormValues = {
  questionOne: string;
  questionTwo: string;
  questionThree: string;
  questionFour: string;
  explanation: string;
};

export type EditPasswordFormValues = {
  password: string;
  newPassword: string;
  confirmPassword: string;
};

export type SalaryRangeFormValues = {
  salaryGte: string;
  salaryLte: string;
  withAmount?: boolean;
};

export type GetCompanyInfoFormValues = {
  name: string;
  city: SelectOption<{ stateId: number }> | null;
  state: SelectOption | null;
  user: {
    email: string;
  };
  lastName: string;
  firstName: string;
  status: LookingCandidateStatus;
  address: string;
  phone: string;
  site: string;
  abn: string;
  admin: SelectOption | any;
};

export type UpdateCompanyInfoFormValues = {
  user: {
    email: string;
  };
  firstName: string;
  lastName: string;
  phone: string;
  name: string;
  address: string;
  abn: string;
  site: string;
  status: LookingCandidateStatus;
  city: number | any;
  state: number | any;
  admin: number | any;
};

export type CreateHiringCompanyFormValues = {
  firstName: string;
  lastName: string;
  position: SelectOption | null;
  city: SelectOption<{ stateId: number }> | null;
  email: string;
  phone: string;
  project: SelectOption | null;
  state: SelectOption | null;
  permission: PermissionType;
};

export type CreateEntryFormValues = {
  rows: {
    name: string;
    description: string;
    days: number[];
    hours: number[];
  }[];

  additionalExpenses: {
    attachments: File[];
    name: string;
    price: string;
  }[];

  week: string;
  matched: number | null;
};

export type CreateTaskFormValues = {
  title: string;
  description: string;
  dueDate: string;
  priority?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  admin?: number | any;
};

export type InviteAdminFormValues = {
  firstName: string;
  lastName: string;
  email: string;
};

export type SendMessageFormValues = {
  files: File[];
  additionalInformation: string;
};

export type AssignCompaniesAndRegionsFormValues = {
  regions: number[];
  positions: number[];
};

export type AssignJobToAdminFormValues = {
  job: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  admin: number | any;
};

export type ForgotPasswordFormValues = {
  email: string;
};

export type SendEmailFormValues = {
  to: string;
  subject: string;
  messageText: string;
  threadId?: string;
};

export type ResetPasswordFormValues = {
  password: string;
};

export type SendResumeFormValues = {
  candidate: SelectOption | null | undefined;
  jobPosition: SelectOption | null;
  description: string;
  subject: string;
  receiverType: ReceiverType;
  companies: {
    id?: SelectOption;
    hiringManagers: SelectOption[];
  }[];
};

export type RecordFormValues = {
  record: string | null;
};

export type NoteFormValues = {
  note: string | null;
};

export type ContactUsFormValues = {
  name: string;
  email: string;
  comment: string;
};

export type WhiteboardNoteFormValues = {
  value: string;
  description: string;
};
