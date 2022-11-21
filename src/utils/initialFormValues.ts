import dateFnsFormat from 'date-fns/format';

import { LookingJobStatus, ProfessionalDetails, Profile } from '~/models/candidate';
import {
  JobInfo,
  ManagerSelectOption,
  MatchedContract,
  PaymentRateType,
  PaymentType,
  PayOption,
  PermissionType,
  PositionType,
  SuperType,
  UserType,
} from '~/models/common';
import { CompanyHiringManger, CompanyMainInfo } from '~/models/company';
import { CreateCompany } from '~/models/employer';
import { store } from '~/store';
import {
  ArrangeInterviewFormValues,
  CreateCandidateProfessionalDetailsFormValues,
  CreateCandidateProfileFormValues,
  CreateEmployerBusinessFormValues,
  CreateJobContractFormValues,
  CreateJobHiringManagerFormValues,
  CreateJobInfoFormValues,
  CreateNewEmployerFormValues,
  GetCompanyInfoFormValues,
  UpdateCandidateProfessionalDetailsAdminFormValues,
  UpdateCandidateProfileFormValues,
} from '~/types/formValues';
import { SelectOption } from '~/view/components/select';

import { timeConversionSlicker } from './helpers';

export const getCreateJobInfoFormValues = (
  jobInfo: JobInfo | null | any,
): CreateJobInfoFormValues => {
  const storeState = store.getState();

  const isCompany =
    storeState.user.loggedInUserType === UserType.COMPANY ||
    storeState.user.loggedInUserType === UserType.MANAGER;

  if (jobInfo) {
    const jobPosition = !storeState.createJob.saveCreatedJobInfo
      ? storeState.common.jobPositions.find(jobPosition => jobPosition.id === jobInfo.position)!
      : storeState.common.jobPositions.find(
          jobPosition =>
            jobPosition.id === storeState.createJob.saveCreatedJobInfo.formValues.position?.value,
        )!;
    const projectType = !storeState.createJob.saveCreatedJobInfo
      ? storeState.common.projectTypes.find(projectType => projectType.id === jobInfo.projectType)!
      : storeState.common.projectTypes.find(
          projectType =>
            projectType.id ===
            storeState.createJob.saveCreatedJobInfo.formValues.projectType?.value,
        )!;
    const city = !storeState.createJob.saveCreatedJobInfo
      ? storeState.common.cities.find(city => city.id === jobInfo.city)!
      : storeState.common.cities.find(
          city => city.id === storeState.createJob.saveCreatedJobInfo.formValues.city?.value,
        )!;
    const state = !storeState.createJob.saveCreatedJobInfo
      ? storeState.common.states.find(state => state.id === jobInfo.state)!
      : storeState.common.states.find(
          state => state.id === storeState.createJob.saveCreatedJobInfo.formValues?.state,
        )!;

    return {
      company: !storeState.createJob.saveCreatedJobInfo
        ? { value: jobInfo.company, label: jobInfo.companyName, image: jobInfo.companyLogo }
        : {
            value: storeState.createJob.saveCreatedJobInfo.formValues.company?.value,
            label: storeState.createJob.saveCreatedJobInfo.formValues.company?.label,
            image: storeState.createJob.saveCreatedJobInfo.formValues.company?.image,
          },
      position: { value: jobPosition?.id, label: jobPosition?.name },
      projectType: { value: projectType?.id, label: projectType?.name },
      overview: jobInfo.overview,
      positionType: jobInfo.positionType,
      city: { value: city?.id, label: city?.name, meta: { stateId: city?.stateId } },
      state: { value: state?.id, label: state?.name },
      salary: typeof jobInfo?.salary === 'string' ? jobInfo?.salary : `$${jobInfo?.salary}`,
      disclose: jobInfo?.disclose,
      superAmount: jobInfo.superAmount ? `${jobInfo.superAmount}` : '',
      superType: jobInfo.superAmount ? SuperType.EXCLUDING : SuperType.INCLUDING,
      paymentType: jobInfo.paymentType,
      admin: jobInfo.admin,
      projectNumber: jobInfo.projectNumber,
      address: jobInfo.address,
      representative: jobInfo.representative,
    };
  }

  if (isCompany) {
    return {
      company: { label: storeState.companyUser.company, value: storeState.companyUser.typeId },
      position: null,
      projectType: null,
      overview: '',
      positionType: PositionType.PERMANENT,
      city: null,
      state: null,
      salary: '',
      disclose: true,
      superAmount: '',
      superType: SuperType.INCLUDING,
      paymentType: PaymentRateType.HOURLY,
      admin: null,
      address: '',
      projectNumber: '',
      representative: false,
    };
  }

  return {
    company: null,
    position: null,
    projectType: null,
    overview: '',
    positionType: PositionType.PERMANENT,
    city: null,
    state: null,
    salary: '',
    disclose: true,
    superType: SuperType.INCLUDING,
    superAmount: '',
    paymentType: PaymentRateType.HOURLY,
    admin: null,
    address: '',
    projectNumber: '',
    representative: false,
  };
};

export const getCreateJobHiringManagerFormValues = (
  hiringManager: CompanyHiringManger | null,
): CreateJobHiringManagerFormValues => {
  if (hiringManager) {
    const { id, firstName, lastName, phone, email, office, position, permission, representative } =
      hiringManager;

    const newObject: ManagerSelectOption = {
      value: id,
      label: `${firstName} ${lastName}`,
      phone,
      email,
      position,
      office,
      id,
      permission,
    };
    return {
      manager: newObject,
      representative,
    };
  }
  return {
    manager: null,
    representative: false,
  };
};

export const getCreateCandidateProfileFormValue = (
  profile: Profile | null,
): CreateCandidateProfileFormValues | UpdateCandidateProfileFormValues => {
  if (profile) {
    return {
      user: {
        email: profile.user.email,
      },
      firstName: profile.firstName,
      lastName: profile.lastName,
      relocate: profile.relocate,
      linkedInResume: profile.linkedInResume || null,
      phone: profile.phone || '',
      city: profile.city,
      state: profile.state,
      admin: profile.admin,
    };
  }

  return {
    user: {
      email: '',
    },
    firstName: '',
    lastName: '',
    city: null,
    state: null,
    relocate: false,
    phone: '',
    linkedInResume: null,
    admin: null,
  };
};

export const getCreateCandidateProfessionalDetails = (
  profDetails: ProfessionalDetails | null,
): CreateCandidateProfessionalDetailsFormValues => {
  if (profDetails) {
    const storeState = store.getState();

    const formattedProjectTypes = profDetails?.projectTypes.map(projectType => {
      if (typeof projectType !== 'number') {
        return { value: projectType.id, label: projectType.name };
      }

      if (typeof projectType === 'number') {
        const currentProjectType = storeState.common.projectTypes.find(
          project => project.id === projectType,
        );
        return { value: currentProjectType?.id, label: currentProjectType?.name };
      }

      return 0;
    }) as SelectOption[];

    const formattedJobPositions = profDetails?.jobPositions.map(jobPosition => {
      if (typeof jobPosition !== 'number') {
        return { value: jobPosition.id, label: jobPosition.name };
      }

      if (typeof jobPosition === 'number') {
        const currentJobPos = storeState.common.jobPositions.find(job => job.id === jobPosition);
        return { value: currentJobPos?.id, label: currentJobPos?.name };
      }

      return 0;
    }) as SelectOption[];

    const formattedInterestedCompanies = profDetails?.interestedCompanies.map(interestedCompany => {
      if (typeof interestedCompany !== 'number') {
        return { value: interestedCompany.id, label: interestedCompany.name };
      }

      if (typeof interestedCompany === 'number') {
        const currentCompany = storeState.companies.companies.find(
          company => company.id === interestedCompany,
        );
        return { value: currentCompany?.id, label: currentCompany?.name };
      }

      return 0;
    }) as SelectOption[];

    const formattedNotInterestedCompanies = profDetails?.notInterestedCompanies.map(
      notInterestedCompany => {
        if (typeof notInterestedCompany !== 'number') {
          return { value: notInterestedCompany.id, label: notInterestedCompany.name };
        }

        if (typeof notInterestedCompany === 'number') {
          const currentCompany = storeState.companies.companies.find(
            company => company.id === notInterestedCompany,
          );
          return { value: currentCompany?.id, label: currentCompany?.name };
        }

        return 0;
      },
    ) as SelectOption[];

    const jobTitle = storeState.common.jobPositions.find(
      jobPosition => jobPosition.id === profDetails.jobTitle,
    );

    return {
      minSalary: `$${profDetails.minSalary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
      yearsOfExp: profDetails.yearsOfExp,
      status: profDetails.status,
      availability: profDetails.availability,
      jobPositions: formattedJobPositions,
      projectTypes: formattedProjectTypes,
      workExps: profDetails.workExps,
      keyProjects: profDetails.keyProjects,
      interestedCompanies: formattedInterestedCompanies,
      notInterestedCompanies: formattedNotInterestedCompanies,
      projectValues: profDetails.projectValues,
      keySkills: profDetails.keySkills,
      qualifications: profDetails.qualifications,
      jobTitle: jobTitle ? { value: jobTitle!.id, label: jobTitle!.name } : null,
      permission: profDetails.permission,
    };
  }

  return {
    jobPositions: [],
    projectTypes: [],
    projectValues: [],
    interestedCompanies: [],
    notInterestedCompanies: [],
    yearsOfExp: 0,
    minSalary: '',
    availability: [],
    status: LookingJobStatus.ACTIVE,
    workExps: [],
    keyProjects: [],
    keySkills: [],
    qualifications: [],
    jobTitle: null,
    permission: PermissionType.Both,
  };
};

export const updateCandidateProfessionalDetailsAdmin = (
  profDetails: (ProfessionalDetails & { additionalInformation: string }) | null,
): UpdateCandidateProfessionalDetailsAdminFormValues => {
  if (profDetails) {
    const storeState = store.getState();

    const formattedProjectTypes = profDetails?.projectTypes.map(projectType => {
      if (typeof projectType !== 'number') {
        return { value: projectType.id, label: projectType.name };
      }

      if (typeof projectType === 'number') {
        const currentProjectType = storeState.common.projectTypes.find(
          project => project.id === projectType,
        );
        return { value: currentProjectType?.id, label: currentProjectType?.name };
      }

      return 0;
    }) as SelectOption[];

    const formattedJobPositions = profDetails?.jobPositions.map(jobPosition => {
      if (typeof jobPosition !== 'number') {
        return { value: jobPosition.id, label: jobPosition.name };
      }

      if (typeof jobPosition === 'number') {
        const currentJobPos = storeState.common.jobPositions.find(job => job.id === jobPosition);
        return { value: currentJobPos?.id, label: currentJobPos?.name };
      }

      return 0;
    }) as SelectOption[];

    const formattedInterestedCompanies = profDetails?.interestedCompanies.map(interestedCompany => {
      if (typeof interestedCompany !== 'number') {
        return { value: interestedCompany.id, label: interestedCompany.name };
      }

      if (typeof interestedCompany === 'number') {
        const currentCompany = storeState.companies.companies.find(
          company => company.id === interestedCompany,
        );
        return { value: currentCompany?.id, label: currentCompany?.name };
      }

      return 0;
    }) as SelectOption[];

    const formattedNotInterestedCompanies = profDetails?.notInterestedCompanies.map(
      notInterestedCompany => {
        if (typeof notInterestedCompany !== 'number') {
          return { value: notInterestedCompany.id, label: notInterestedCompany.name };
        }

        if (typeof notInterestedCompany === 'number') {
          const currentCompany = storeState.companies.companies.find(
            company => company.id === notInterestedCompany,
          );
          return { value: currentCompany?.id, label: currentCompany?.name };
        }

        return 0;
      },
    ) as SelectOption[];

    const jobTitle = storeState.common.jobPositions.find(
      jobPosition => jobPosition.id === profDetails.jobTitle,
    );

    return {
      minSalary: `$${profDetails.minSalary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
      yearsOfExp: profDetails.yearsOfExp,
      availability: profDetails.availability,
      jobPositions: formattedJobPositions,
      projectTypes: formattedProjectTypes,
      workExps: profDetails.workExps,
      keyProjects: profDetails.keyProjects,
      interestedCompanies: formattedInterestedCompanies,
      notInterestedCompanies: formattedNotInterestedCompanies,
      projectValues: profDetails.projectValues,
      additionalInformation: profDetails.additionalInformation,
      interest: profDetails.interest,
      visaStatus: profDetails.visaStatus,
      overview: profDetails.overview,
      qualifications: profDetails.qualifications,
      professionalExperience: profDetails.professionalExperience,
      references: profDetails.references,
      generalSummary: profDetails.generalSummary,
      keySkills: profDetails.keySkills,
      jobTitle: jobTitle ? { value: jobTitle!.id, label: jobTitle!.name } : null,
      permission: profDetails.permission,
    };
  }
  return {
    permission: PermissionType.Both,
    jobPositions: [],
    projectTypes: [],
    projectValues: [],
    jobTitle: null,
    interestedCompanies: [],
    notInterestedCompanies: [],
    yearsOfExp: 0,
    minSalary: '',
    availability: [],
    interest: '',
    visaStatus: '',
    overview: '',
    qualifications: [],
    professionalExperience: '',
    references: '',
    generalSummary: '',
    workExps: [],
    keyProjects: [],
    additionalInformation: '',
    keySkills: [],
  };
};
export const getCreateEmployerFormValues = (
  employer: CreateCompany | null,
): CreateNewEmployerFormValues => {
  if (employer) {
    return {
      user: {
        email: employer.user.email,
        password: '',
      },
      lastName: employer.lastName || '',
      firstName: employer.firstName || '',
      phone: employer.phone || '',
      name: employer.name || '',
      address: employer.address || '',
      abn: employer.abn || '',
      site: employer.site || '',
      city: employer.city,
      state: employer.state,
      admin: employer.admin,
    };
  }

  return {
    user: {
      email: '',
      password: '',
    },
    firstName: '',
    lastName: '',
    phone: '',
    name: '',
    address: '',
    abn: '',
    site: '',
    city: null,
    state: null,
    admin: null,
  };
};

export const getCreateBusinessEmployerFormValues = (
  employer: CreateEmployerBusinessFormValues | null,
): CreateEmployerBusinessFormValues => {
  if (employer) {
    return {
      name: employer.name,
      position: employer.position || '',
      email: employer.email,
      phone: employer.phone,
    };
  }

  return {
    name: '',
    position: '',
    email: '',
    phone: '',
  };
};

export const getArrangeInterviewFormValues = (
  interview: (Omit<ArrangeInterviewFormValues, 'admin'> & { admin: number }) | null,
): ArrangeInterviewFormValues => {
  if (interview) {
    const storeState = store.getState();

    const participantsAsSelectOptions = interview.participants.map((participant, index) => {
      if (typeof participant === 'string') {
        return { value: index, label: participant };
      }
      return 0;
    }) as SelectOption[];

    const admin = storeState.manageAdmins.listOfAdmins.results.find(
      admin => admin.id === interview.admin,
    );

    const adminAsSelect = {
      value: admin?.id,
      label: `${admin?.firstName} ${admin?.lastName}`,
    } as SelectOption;

    return {
      admin: adminAsSelect,
      message: interview.message,
      location: interview.location,
      date: dateFnsFormat(new Date(interview.date), 'dd/MM/yyyy'),
      participants: participantsAsSelectOptions,
      time: new Date(timeConversionSlicker(interview.time as string)),
    };
  }

  return {
    message: '',
    location: '',
    date: new Date(),
    participants: [],
    time: '',
    admin: null,
  };
};

export const getCompanyFormValues = (company: CompanyMainInfo | null): GetCompanyInfoFormValues => {
  const storeState = store.getState();
  if (company) {
    const city = storeState.common.cities.find(city => city.id === company.city)!;
    const state = storeState.common.states.find(state => state.id === company.state)!;
    const data: GetCompanyInfoFormValues = {
      user: {
        email: company.user.email,
      },
      firstName: company.firstName || '',
      lastName: company.lastName || '',
      phone: company.phone || '',
      name: company.name || '',
      status: company.status,
      address: company.address || '',
      abn: company.abn || '',
      site: company.site || '',
      city: { value: city?.id, label: city?.name, meta: { stateId: city?.stateId } },
      state: { value: state?.id, label: state?.name },
      admin: company.admin,
    };
    return data;
  }

  return {
    user: {
      email: '',
    },
    phone: '',
    name: '',
    status: 0,
    address: '',
    abn: '',
    site: '',
    city: null,
    state: null,
    admin: null,
    firstName: '',
    lastName: '',
  };
};

export const getContractFormValues = (
  contract: MatchedContract | null,
): CreateJobContractFormValues => {
  if (contract) {
    return {
      paymentType: contract.paymentType,
      agreementDate: contract.agreementDate,
      commencementDate: contract.commencementDate,
      hoursOfWork: contract.hoursOfWork,
      candidateRate: `$${contract.candidateRate}`,
      companyRate: `$${contract.companyRate}`,
      timesheetDeadline: contract.timesheetDeadline,
      payOption: contract.payOption,
      supervisor: null,
    };
  }

  return {
    paymentType: PaymentType.Hourly,
    agreementDate: new Date(),
    commencementDate: new Date(),
    hoursOfWork: '',
    candidateRate: '',
    companyRate: '',
    timesheetDeadline: '',
    payOption: PayOption.ABN,
    supervisor: null,
  };
};
