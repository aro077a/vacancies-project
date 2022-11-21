import { addDays, startOfToday } from 'date-fns';
import * as Yup from 'yup';

import { PositionType } from '~/models/common';

const validations = {
  phone: Yup.string()
    .nullable()
    .test('valid', 'Phone number is invalid!', value => {
      return value ? /^\+\d{0,}$/.test(value) : true;
    }),
  salary: Yup.string()
    .required('Salary is required!')
    .matches(/^[0-9.,$]*$/, 'Salary is invalid'),
  commision: Yup.string()
    .required('Commision is required!')
    .test('valid', 'Commision percentage is invalid', value => {
      return Number(value?.replace('%', '')) <= 100;
    }),
  dailyRate: Yup.string()
    .required('Daily rate is required')
    .matches(/^[0-9.,$]*$/, 'Salary is invalid'),
  timesheetPrice: Yup.string()
    .required('Price is required')
    .matches(/^[0-9.,$]*$/, 'Price is invalid'),
};

export const LoginPageFormValidation = Yup.object().shape({
  email: Yup.string().required('Email is required!').email('Email is invalid!'),
  password: Yup.string().required('Password is required!'),
});

export const ChooseUserTypePageFormValidation = Yup.object().shape({
  agreed: Yup.boolean().isTrue(),
});

export const CreateCandidateProfileFormValidation = Yup.object().shape({
  user: Yup.object().shape({
    email: Yup.string()
      .required('Email is required!')
      .email('Email is invalid!')
      .max(254, 'Email is too long!'),
    password: Yup.string()
      .required('Password is required!')
      .min(6, 'Password is too short!')
      .max(256, 'Password is too long!'),
    repeatPassword: Yup.string()
      .required('Repeat password is required!')
      .equals([Yup.ref('password')], 'Password mismatch!'),
  }),
  firstName: Yup.string().required('First name is required!').max(255, 'First name is too long!'),
  lastName: Yup.string().required('Last name is required!').max(255, 'Last name is too long!'),
  city: Yup.object().nullable().required('City is required!'),
  state: Yup.object().nullable().required('State is required!'),
  phone: validations.phone,
});

export const CandidateProfileFormValidationNoPass = Yup.object().shape({
  user: Yup.object().shape({
    email: Yup.string()
      .required('Email is required!')
      .email('Email is invalid!')
      .max(254, 'Email is too long!'),
  }),
  firstName: Yup.string().required('First name is required!').max(255, 'First name is too long!'),
  lastName: Yup.string().required('Last name is required!').max(255, 'Last name is too long!'),
  city: Yup.object().nullable().required('City is required!'),
  state: Yup.object().nullable().required('State is required!'),
  phone: validations.phone,
  admin: Yup.object().nullable().required('Admin is required!'),
});

export const CreateCandidateWorkExperienceFormValidation = Yup.object().shape({
  logo: Yup.object().nullable(),
  name: Yup.string().required('Name is required').max(255, 'Name is too long!'),
  position: Yup.string().required('Position is required').max(255, 'Position is too long!'),
  location: Yup.object().nullable(),
  workStart: Yup.date().nullable().required('Start date is required!'),
  workEnd: Yup.date()
    .nullable()
    .required('End date is required!')
    .when('workStart', (workStart, schema) => {
      if (workStart) {
        return schema.min(addDays(workStart, 1), 'End date should be greater than start date');
      }

      return schema;
    })
    .max(addDays(startOfToday(), 1), 'End date cannot be in future'),
  details: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().max(255, 'Experience name is too long!'),
    }),
  ),
});

export const CreateCandidateKeyProjectFormValidation = Yup.object().shape({
  name: Yup.string().required('Name is required').max(255, 'Name is too long!'),
  position: Yup.string().required('Position is required').max(255, 'Position is too long!'),
  value: Yup.object().nullable(),
  type: Yup.string().max(100, 'Project value is too long!'),
  location: Yup.object().nullable().required('Location is required!'),
  workStart: Yup.date().nullable().required('Start date is required!'),
  workEnd: Yup.date()
    .nullable()
    .required('End date is required!')
    .when('workStart', (workStart, schema) => {
      if (workStart) {
        return schema.min(addDays(workStart, 1), 'End date should be greater than start date');
      }

      return schema;
    })
    .max(addDays(startOfToday(), 1), 'End date cannot be in future'),
});

export const CreateCandidateProfessionalDetailsFormValidation = Yup.object().shape({
  jobTitle: Yup.object().nullable().required('Job title is required!'),
  jobPositions: Yup.array()
    .of(Yup.object())
    .min(1, 'Selecting at least one job position is required!'),
  projectTypes: Yup.array()
    .of(Yup.object())
    .min(1, 'Selecting at least one project type is required!'),
  yearsOfExp: Yup.number().required('Years of experience is required!'),
  minSalary: validations.salary,
  availability: Yup.object().nullable().required('Availability is required!'),
  workExps: Yup.array()
    .of(Yup.object())
    .when('yearsOfExp', (yearsOfExp, schema) => {
      return yearsOfExp > 0
        ? schema.min(1, 'Creating at least one work experience is required')
        : schema;
    }),
  keyProjects: Yup.array().of(Yup.object()),
  projectValues: Yup.object().nullable(),
});

export const updateCandidateProfessionalDetailsAdminFormValidation = Yup.object().shape({
  jobTitle: Yup.object().nullable().required('Job title is required!'),
  jobPositions: Yup.array()
    .of(Yup.object())
    .min(1, 'Selecting at least one job position is required!'),
  projectTypes: Yup.array()
    .of(Yup.object())
    .min(1, 'Selecting at least one project type is required!'),
  yearsOfExp: Yup.number().required('Years of experience is required!'),
  projectValues: Yup.object().nullable(),
  minSalary: validations.salary,
  availability: Yup.object().nullable().required('Availability is required!'),
  additionalInformation: Yup.string().nullable().max(2000, 'Additional info is too long'),
  workExps: Yup.array()
    .of(Yup.object())
    .when('yearsOfExp', (yearsOfExp, schema) => {
      return yearsOfExp > 0
        ? schema.min(1, 'Creating at least one work experience is required')
        : schema;
    }),
  keyProjects: Yup.array().of(Yup.object()),
  keySkills: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Skill name is required').max(255, 'Skill name is too long!'),
    }),
  ),
  qualifications: Yup.array().of(
    Yup.object().shape({
      name: Yup.string()
        .required('Qualification is required')
        .max(255, 'Qualification is too long!'),
    }),
  ),
});

export const EnterCompanyMainInfoFormValidation = Yup.object().shape({
  name: Yup.string().required('Company name is required'),
  firstName: Yup.string()
    .required('Representative name is required!')
    .max(255, 'Representative name is too long'),
  lastName: Yup.string()
    .required('Representative last name is required!')
    .max(255, 'Representative last name is too long'),
  city: Yup.object().nullable().required('City is required!'),
  state: Yup.object().nullable().required('State is required!'),
  user: Yup.object().shape({
    email: Yup.string()
      .required('Email is required!')
      .email('Email is invalid!')
      .max(254, 'Email is too long!'),
    password: Yup.string()
      .required('Password is required!')
      .min(6, 'Password is too short!')
      .max(256, 'Password is too long!'),
    repeatPassword: Yup.string()
      .required('Repeat password is required!')
      .equals([Yup.ref('password')], 'Password mismatch!'),
  }),
  status: Yup.number().required('Looking candidate status is required!'),
  address: Yup.string().required('HQ address is required'),
  abn: Yup.string().required('ABN is required'),
  phone: validations.phone,
  site: Yup.string().url('Website link is invalid!'),
});

export const CreateCompanyContactDetailsFormValidation = Yup.object().shape({
  name: Yup.string().required('Business contact name is required'),
  position: Yup.string(),
  email: Yup.string()
    .required('Business contact email is required!')
    .email('Business contact email is invalid!'),
  phone: validations.phone.required('Phone number is required!'),
});

export const CreateEmployerFormValidation = Yup.object().shape({
  name: Yup.string().required('Company name is required'),
  firstName: Yup.string()
    .required('Representative name is required!')
    .max(255, 'Representative name is too long'),
  lastName: Yup.string()
    .required('Representative last name is required!')
    .max(255, 'Representative last name is too long'),
  city: Yup.object().nullable().required('City is required!'),
  state: Yup.object().nullable().required('State is required!'),
  user: Yup.object().shape({
    email: Yup.string()
      .required('Email is required!')
      .email('Email is invalid!')
      .max(254, 'Email is too long!'),
  }),
  address: Yup.string().required('HQ address  is required'),
  abn: Yup.string().required('ABN is required'),
  phone: validations.phone,
  site: Yup.string().nullable().url('Website link is invalid!'),
  admin: Yup.object().nullable().required('Admin is required!'),
});

export const CreateEmployerBusinessFormValidation = Yup.object().shape({
  name: Yup.string().required('Business contact name is required!'),
  position: Yup.string().nullable(),
  email: Yup.string()
    .email('Business contact email is invalid!')
    .required('Business email is required!'),
  phone: validations.phone.required('Phone number is required!'),
});

export const CreateJobInfoFormValidation = Yup.object().shape({
  company: Yup.object().nullable().required('Company is required!'),
  position: Yup.object().nullable().required('Position is required!'),
  projectType: Yup.object().nullable().required('Project type is required!'),
  overview: Yup.string().required('Job overview is required!'),
  positionType: Yup.number().required(),
  city: Yup.object().nullable().required('City is required!'),
  state: Yup.object().nullable().required('State is required!'),
  salary: validations.salary.when('positionType', (positionType, schema) => {
    return positionType === PositionType.TEMPORARY ? schema.notRequired() : schema;
  }),
  disclose: Yup.boolean().required(),
  address: Yup.string().required('Site address is required!').max(50, 'Address is too long!'),
  projectNumber: Yup.string()
    .required('Project number is required!')
    .max(50, 'Project number is too long'),
});

export const CreateJobInfoAdminRoleFormValidation = Yup.object().shape({
  company: Yup.object().nullable().required('Company is required!'),
  position: Yup.object().nullable().required('Position is required!'),
  projectType: Yup.object().nullable().required('Project type is required!'),
  overview: Yup.string().required('Job overview is required!'),
  positionType: Yup.number().required(),
  city: Yup.object().nullable().required('City is required!'),
  state: Yup.object().nullable().required('State is required!'),
  salary: validations.salary.when('positionType', (positionType, schema) => {
    return positionType === PositionType.TEMPORARY ? schema.notRequired() : schema;
  }),
  disclose: Yup.boolean().required(),
  admin: Yup.object().nullable().required('Admin is required!'),
  address: Yup.string().required('Site address is required!').max(50, 'Address is too long!'),
  projectNumber: Yup.string()
    .required('Project number is required!')
    .max(50, 'Project number is too long'),
});

export const CreateJobHiringManagerFormValidation = Yup.object().shape({
  name: Yup.object().nullable(),
});

export const LiveJobFeedbackReplyFormValidation = Yup.object().shape({
  newReply: Yup.string().required('Reply is required!').max(1023, 'Reply is too long!'),
});

export const LiveJobRecordFormValidation = Yup.object().shape({
  record: Yup.string().required('Record is required!').max(5000, 'Record is too long!'),
});

export const CandidateFeedbackReplyFormValidation = Yup.object().shape({
  newReply: Yup.string().required('Reply is required!').max(1023, 'Reply is too long!'),
});

export const CandidateRecordFormValidation = Yup.object().shape({
  record: Yup.string().required('Record is required!').max(5000, 'Record is too long!'),
});

export const NewContactCompanyFormValidation = Yup.object().shape({
  company: Yup.object().nullable().required('Company name is required'),
  firstName: Yup.string().required('First name is required').max(255, 'First name is too long!'),
  lastName: Yup.string().required('Last name is required').max(255, 'Last name is too long!'),
  email: Yup.string()
    .email('Email is invalid!')
    .max(254, 'Email is too long!')
    .required('Business contact email is required'),
  phone: validations.phone,
  position: Yup.object().nullable(),
  project: Yup.object().nullable(),
  state: Yup.object().nullable().required('State is required!'),
  city: Yup.object().nullable().required('City is required!'),
});

export const NewContactCandidateFormValidation = Yup.object().shape({
  email: Yup.string()
    .email('Email is invalid!')
    .max(254, 'Email is too long!')
    .required('Candidate email is required'),
  firstName: Yup.string().required('First name is required').max(255, 'First name is too long!'),
  lastName: Yup.string().required('Last name is required').max(255, 'Last name is too long!'),
  phone: validations.phone,
  admin: Yup.object().nullable().required('Admin is required!'),
});

export const SendMessageFormValidation = Yup.object().shape({
  file: Yup.string(),
});
export const MatchedJobNotesValidation = Yup.object().shape({
  notes: Yup.string().max(500, 'Notes are too long'),
});

export const CreateInvoiceValidation = Yup.object().shape({
  salary: validations.salary,
  startDate: Yup.date().required('Availability date is required!'),
  percent: validations.commision,
  flatFee: Yup.string().nullable(),
  flatFeeDescription: Yup.string().nullable(),
});

export const CreateJobContractValidation = Yup.object().shape({
  paymentType: Yup.number().required('Contract payment type is required!'),
  agreementDate: Yup.date().required('Date is required!'),
  commencementDate: Yup.date().required('Date is required!'),
  hoursOfWork: Yup.string().required('Hours of work required'),
  candidateRate: Yup.string()
    .required('Candidate rate is required!')
    .matches(/^[0-9.,$]*$/, 'Candidate rate is invalid'),
  companyRate: Yup.string()
    .required('Company rate is required!')
    .matches(/^[0-9.,$]*$/, 'Company rate is invalid'),
  timesheetDeadline: Yup.string().required('Timesheet deadline is required'),
  payOption: Yup.number().required('Pay option is required!'),
  supervisor: Yup.object().nullable().required('Supervisor is required!'),
});

export const SendAdditionalMessageForContractValidation = Yup.object().shape({
  message: Yup.string().max(1000, 'Message is too long'),
});

export const ArrangeInterviewValidation = Yup.object().shape({
  date: Yup.date().required('Date is required!').min(startOfToday(), 'Chosen date is passed!'),
  participants: Yup.array().of(Yup.object()),
  message: Yup.string().max(500, 'Message is too long!').nullable(),
  location: Yup.string().required('Location is required!'),
  admin: Yup.object().nullable().required('Admin is required!'),
  time: Yup.string().required('Time is required!'),
});

export const MatchedJobFeedbackValidation = Yup.object().shape({
  feedback: Yup.string().required('Feedback is required').max(1000, 'Feedback is too long'),
});

export const DiscloseInfoValidation = Yup.object().shape({
  disclose: Yup.boolean().isTrue('You cannot accept candidate before this field is checked'),
});

export const AdminProfileDetailsValidation = Yup.object().shape({
  user: Yup.object().shape({
    email: Yup.string()
      .required('Email is required!')
      .email('Email is invalid!')
      .max(254, 'Email is too long!'),
  }),
  phone: validations.phone,
});

export const AdminPaymentDetailsValidation = Yup.object().shape({
  abn: Yup.string().max(255, 'Sole trade ABN is too long').required('Sole trade ABN is required'),
  tfn: Yup.string().max(255, 'TFN is too long').required('TFN is required'),
  bsb: Yup.string().max(255, 'BSB number is too long').required('BSB number is required'),
  acc: Yup.string().max(255, 'Account number is too long').required('Account number is required'),
});

export const TermsAndConditionsValidation = Yup.object().shape({
  text: Yup.string().max(50000, 'Terms are too long').required('Terms are required'),
});

export const InterviewQuestionsValidation = Yup.object().shape({
  questionOne: Yup.string().max(255, 'Question 1 is too long').required('Question 1 is required'),
  questionTwo: Yup.string().max(255, 'Question 2 too long').required('Question 2 required'),
  questionThree: Yup.string().max(255, 'Question 3 is too long').required('Question 3 is required'),
  questionFour: Yup.string()
    .max(255, 'Question 4  is too long')
    .required('Question 4  is required'),
});
export const ChangePasswordValidation = Yup.object().shape({
  password: Yup.string()
    .required('Password is required!')
    .min(6, 'Password is too short!')
    .max(256, 'Password is too long!'),
  newPassword: Yup.string()
    .required('New password is required!')
    .min(8, 'New password is too short!'),
  confirmPassword: Yup.string()
    .required('New password is required!')
    .equals([Yup.ref('newPassword')], 'Password mismatch!'),
});

export const UpdateCompanyInfoFormValidationAdminRole = Yup.object().shape({
  name: Yup.string().required('Company name is required'),
  firstName: Yup.string()
    .required('Representative name is required!')
    .max(255, 'Representative name is too long'),
  lastName: Yup.string()
    .required('Representative last name is required!')
    .max(255, 'Representative last name is too long'),
  city: Yup.object().nullable().required('City is required!'),
  state: Yup.object().nullable().required('State is required!'),
  user: Yup.object().shape({
    email: Yup.string()
      .required('Email is required!')
      .email('Email is invalid!')
      .max(254, 'Email is too long!'),
  }),
  status: Yup.number().required('Looking candidate status is required!'),
  address: Yup.string().required('HQ address is required'),
  abn: Yup.string().required('ABN is required'),
  phone: validations.phone,
  site: Yup.string().url('Website link is invalid!'),
  admin: Yup.object().nullable().required('Admin is required!'),
});

export const UpdateCompanyInfoFormValidation = Yup.object().shape({
  name: Yup.string().required('Company name is required'),
  firstName: Yup.string()
    .required('Representative name is required!')
    .max(255, 'Representative name is too long'),
  lastName: Yup.string()
    .required('Representative last name is required!')
    .max(255, 'Representative last name is too long'),
  city: Yup.object().nullable().required('City is required!'),
  state: Yup.object().nullable().required('State is required!'),
  user: Yup.object().shape({
    email: Yup.string()
      .required('Email is required!')
      .email('Email is invalid!')
      .max(254, 'Email is too long!'),
  }),
  status: Yup.number().required('Looking candidate status is required!'),
  address: Yup.string().required('HQ address is required'),
  abn: Yup.string().required('ABN is required'),
  phone: validations.phone,
  site: Yup.string().url('Website link is invalid!'),
});

export const CreateHiringManagerFormValidation = Yup.object().shape({
  firstName: Yup.string().required('First name is required').max(255, 'Name is too long!'),
  lastName: Yup.string().required('Last name is required').max(255, 'Last name is too long!'),
  position: Yup.object().nullable(),
  projectType: Yup.object().nullable(),
  state: Yup.object().nullable().required('State is required!'),
  city: Yup.object().nullable().required('City is required!'),
  email: Yup.string()
    .email('Email is invalid!')
    .max(254, 'Email is too long!')
    .required('Business contact email is required'),
  phone: validations.phone,
});

export const CreateCandidateTimesheetFormValidation = Yup.object().shape({
  rows: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Project name is required').max(255, 'Project name is too long!'),
      description: Yup.string()
        .required('Description is required')
        .max(255, 'Description is too long!'),
    }),
  ),
  week: Yup.string().required('Week is required'),
});

export const CreateTaskValidation = Yup.object().shape({
  title: Yup.string().required('Title is required').max(255, 'Title is too long!'),
  description: Yup.string().max(1023, 'Description is too long!'),
  priority: Yup.number().required('Please select priority!'),
  dueDate: Yup.date().min(startOfToday(), 'Chosen date is passed!'),
});

export const InviteAdminFormValidation = Yup.object().shape({
  email: Yup.string()
    .required('Email is required!')
    .email('Email is invalid!')
    .max(255, 'Email is too long!'),
  firstName: Yup.string().required('First name is required!').max(255, 'First name is too long!'),
  lastName: Yup.string().required('Last name is required!').max(255, 'Last name is too long!'),
});

export const ForgotPasswordFormValidation = Yup.object().shape({
  email: Yup.string().required('Email is required!').email('Email is invalid!'),
});

export const SendEmailFormValidation = Yup.object().shape({
  to: Yup.string().required('Email is required!'),
  subject: Yup.string().required('Subject is required'),
  messageText: Yup.string().required('Message is required!').max(2000, 'Message is too long!'),
});

export const ResetPasswordFormValidation = Yup.object().shape({
  password: Yup.string()
    .required('Password is required!')
    .min(6, 'Password is too short!')
    .max(256, 'Password is too long!'),
  repeatPassword: Yup.string()
    .required('Repeat password is required!')
    .equals([Yup.ref('password')], 'Password mismatch!'),
});

export const SendResumeFormValidation = Yup.object().shape({
  candidate: Yup.object().nullable().required('Candidate is required!'),
  subject: Yup.string().required('Subject is required!'),
  receiverType: Yup.number(),
  companies: Yup.array()
    .when('receiverType', {
      is: 1,
      then: Yup.array().of(
        Yup.object().shape({
          id: Yup.object().nullable().required('Company is required!'),
          hiringManagers: Yup.array().nullable(),
        }),
      ),
    })
    .when('receiverType', {
      is: 2,
      then: Yup.array().of(
        Yup.object().shape({
          hiringManagers: Yup.array().min(1, 'At least 1 hiring manager is required!'),
        }),
      ),
    }),
});

export const ManagerNotesFormValidation = Yup.object().shape({
  note: Yup.string().required('Note is required!').max(5000, 'Note is too long!'),
});

export const ContactUsValidation = Yup.object().shape({
  name: Yup.string().required('Name is required!').max(100, 'Name is too long!'),
  email: Yup.string().required('Email is required!').max(100, 'Email is too long!'),
  comment: Yup.string().required('Comment is required!').max(1000, 'Comment is too long'),
});

export const CreateNoteValidation = Yup.object().shape({
  description: Yup.string()
    .required('Description is required!')
    .max(1000, 'Description is too long!'),
  value: Yup.string().matches(/^[0-9.,$]*$/, 'Value is invalid'),
});

export const UploadLicenseValidation = Yup.object().shape({
  expirationDate: Yup.date()
    .nullable()
    .min(new Date(), 'Expiry date should be greater or equal current date'),
});
