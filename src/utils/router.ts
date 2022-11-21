export const CommonRouter = {
  auth: {
    login: '/login',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    register: {
      base: 'register',
      get chooseUserType(): string {
        return `/${this.base}/choose-user-type`;
      },
    },
  },
  editProfile: {
    getBase: (): string => `/edit-profile`,
    editAdminProfileDetails(): string {
      return `${this.getBase()}/profile-details`;
    },
    editAdminPaymentDetails(): string {
      return `${this.getBase()}/payment-details`;
    },
    editAdminPassword(): string {
      return `${this.getBase()}/password`;
    },
    editAdminTermsAndConditions(): string {
      return `${this.getBase()}/terms-conditions`;
    },
    editAdminInterviewQuestions(): string {
      return `${this.getBase()}/interview-questions`;
    },
  },
  createJob: {
    base: 'create-job',
    get createJobInfo(): string {
      return `/${this.base}/info`;
    },
    get createHiringManager(): string {
      return `/${this.base}/hiring-manager`;
    },
    get createJobDescription(): string {
      return `/${this.base}/description`;
    },
  },
  editJob: {
    getBase: (jobId: string | number = ':jobId'): string => `/edit-job/${jobId}`,
    editJobInfo(jobId: string): string {
      return `${this.getBase(jobId)}/info`;
    },
    editHiringManager(jobId: string): string {
      return `${this.getBase(jobId)}/hiring-manager`;
    },
    editJobDescription(jobId: string): string {
      return `${this.getBase(jobId)}/description`;
    },
  },
  createCandidate: {
    base: 'create-candidate',
    get createCandidateInfo(): string {
      return `/${this.base}/profile`;
    },
    get createCandidateDetails(): string {
      return `/${this.base}/professional-details`;
    },
    get createCandidateCV(): string {
      return `/${this.base}/upload-cv`;
    },
    get createCandidateLicenses(): string {
      return `/${this.base}/upload-licenses`;
    },
    get createCandidatePhoto(): string {
      return `/${this.base}/upload-photo`;
    },
  },
  editCandidate: {
    getBase: (candidateId: string | number = ':candidateId'): string =>
      `/edit-candidate/${candidateId}`,
    editCandidateProfile(candidateId: string): string {
      return `${this.getBase(candidateId)}/profile`;
    },
    editCandidateDetails(candidateId: string): string {
      return `${this.getBase(candidateId)}/professional-details`;
    },
    editCandidateCV(candidateId: string): string {
      return `${this.getBase(candidateId)}/cv`;
    },
    editCandidateBrandedCV(candidateId: string): string {
      return `${this.getBase(candidateId)}/branded-cv`;
    },
    editCandidateLicenses(candidateId: string): string {
      return `${this.getBase(candidateId)}/licenses`;
    },
    editCandidatePhoto(candidateId: string): string {
      return `${this.getBase(candidateId)}/photo`;
    },
    editCandidateInterview(candidateId: string): string {
      return `${this.getBase(candidateId)}/video-interview`;
    },
    editCandidateRecords(candidateId: string): string {
      return `${this.getBase(candidateId)}/my-records`;
    },
    editCandidateDocuments(candidateId: string): string {
      return `${this.getBase(candidateId)}/documents`;
    },
  },
  createEmployer: {
    base: 'create-employer',
    get createEmployerCompanyInfo(): string {
      return `/${this.base}/company-info`;
    },
    get createCompanyLogo(): string {
      return `/${this.base}/upload-logo`;
    },
    get createHiringManager(): string {
      return `/${this.base}/add-hiring-manager`;
    },
  },
  editEmployer: {
    getBase: (employerId: string | number = ':employerId'): string =>
      `/edit-employer/${employerId}`,
    editEmployerInformation(employerId: string): string {
      return `${this.getBase(employerId)}/employer-information`;
    },
    editEmployerDetails(employerId: string): string {
      return `${this.getBase(employerId)}/contact-details`;
    },
    editEmployerPassword(employerId: string): string {
      return `${this.getBase(employerId)}/password`;
    },
    editEmployerLogo(employerId: string): string {
      return `${this.getBase(employerId)}/logo`;
    },
    editEmployerHiringManagers(employerId: string): string {
      return `${this.getBase(employerId)}/hiring-managers`;
    },
  },
  shortList: '/shortlist',
  landingPage: '/landing',
  contactUsPage: '/landing/contact-us',
  privacyPage: '/landing/privacy-policy',
  termsPage: '/landing/terms-and-conditions',
  faq: '/landing/faq',
};

export const AdminRouter = {
  dashboard: '/dashboard',
  liveJobs: '/live-jobs',
  candidates: '/candidates',
  pendingCandidates: '/candidates/pending-approval',
  rejectedCandidates: '/candidates/rejected-list',
  employers: '/employers',
  pendingEmployers: '/employers/pending-approval',
  pipeline: '/pipeline',
  whiteboard: '/whiteboard',
  messaging: {
    getBase: (): string => '/messaging',
    inboxMessages(): string {
      return `${this.getBase()}/inbox`;
    },
    sentMessages(): string {
      return `${this.getBase()}/sent-messages`;
    },
    emailResponses(): string {
      return `${this.getBase()}/email-responses`;
    },
  },
  contact: '/contact',
  admins: '/admins',
  unAssignedPositions: '/position',
  timesheet: '/timesheet',
};

export const CandidateRouter = {
  auth: {
    register: {
      base: `${CommonRouter.auth.register.base}/candidate`,
      get createProfile(): string {
        return `/${this.base}/create-profile`;
      },
      get createProfessionalDetails(): string {
        return `/${this.base}/create-professional-details`;
      },
      get uploadCV(): string {
        return `/${this.base}/upload-cv`;
      },
      get uploadLicenses(): string {
        return `/${this.base}/upload-licenses`;
      },
      get uploadPhoto(): string {
        return `/${this.base}/upload-photo`;
      },
    },
  },
  findJobs: '/find-jobs',
  proposals: '/proposals',
  timesheet: '/timesheet',
  editCandidate: {
    getBase: (): string => `/edit-profile`,
    editProfileInformation(): string {
      return `${this.getBase()}/personal-information`;
    },
    editPassword(): string {
      return `${this.getBase()}/password`;
    },
    editProfessionalDetails(): string {
      return `${this.getBase()}/professional-details`;
    },
    editCV(): string {
      return `${this.getBase()}/cv`;
    },
    editLicenses(): string {
      return `${this.getBase()}/licenses`;
    },
    editPhoto(): string {
      return `${this.getBase()}/photo`;
    },
    editVideoInterview(): string {
      return `${this.getBase()}/video-interview`;
    },
  },
  interview: '/create-interview',
};

export const CompanyRouter = {
  auth: {
    register: {
      base: `${CommonRouter.auth.register.base}/company`,
      get enterMainInfo(): string {
        return `/${this.base}/enter-main-info`;
      },
      get uploadLogo(): string {
        return `/${this.base}/upload-logo`;
      },
      get addHiringManager(): string {
        return `/${this.base}/add-hiring-manager`;
      },
    },
  },
  addJobs: '/add-jobs',
  candidates: '/candidates',
  interviews: '/interviews',
  timesheet: '/timesheet',
  interestedIn: '/interested-in',
  editCompany: {
    getBase: (): string => `/edit-profile`,
    editCompanyInformation(): string {
      return `${this.getBase()}/company-information`;
    },
    editPassword(): string {
      return `${this.getBase()}/password`;
    },
    editCompanyLogo(): string {
      return `${this.getBase()}/logo`;
    },
    editHiringManagers(): string {
      return `${this.getBase()}/hiring-managers`;
    },
  },
};
