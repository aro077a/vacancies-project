/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { useLocation } from 'react-router-dom';

import { AdminRouter, CandidateRouter, CommonRouter, CompanyRouter } from '~/utils/router';

import styles from './styles.scss';

const pagesWithSecondaryContainer: string[] = [
  CommonRouter.createJob.createJobInfo,
  CommonRouter.createJob.createHiringManager,
  CommonRouter.createJob.createJobDescription,
  CommonRouter.createCandidate.createCandidateInfo,
  CommonRouter.createCandidate.createCandidateDetails,
  CommonRouter.createCandidate.createCandidateCV,
  CommonRouter.createCandidate.createCandidateLicenses,
  CommonRouter.createCandidate.createCandidatePhoto,
  CommonRouter.createEmployer.createEmployerCompanyInfo,
  CommonRouter.createEmployer.createCompanyLogo,
  CommonRouter.createEmployer.createHiringManager,
];

const pagesWithThirdContainer: string[] = [
  CommonRouter.editJob.getBase().slice(0, CommonRouter.editJob.getBase().lastIndexOf('/')),
  CommonRouter.editCandidate
    .getBase()
    .slice(0, CommonRouter.editCandidate.getBase().lastIndexOf('/')),
  CommonRouter.editEmployer
    .getBase()
    .slice(0, CommonRouter.editEmployer.getBase().lastIndexOf('/')),
  CommonRouter.editProfile.getBase(),
  CandidateRouter.editCandidate.getBase(),
  CompanyRouter.editCompany.getBase(),
  CandidateRouter.interview,
];

const pagesWithFourthContainer: string[] = [CandidateRouter.findJobs, CompanyRouter.addJobs];

const pagesWithFifthContainer: string[] = [
  CommonRouter.shortList,
  CandidateRouter.timesheet,
  CompanyRouter.timesheet,
  CompanyRouter.interestedIn,
];

const pagesWithSixthContainer: string[] = [
  CommonRouter.privacyPage,
  CommonRouter.termsPage,
  CommonRouter.contactUsPage,
];

const pagesWithoutPaddings: string[] = [
  AdminRouter.pipeline,
  CandidateRouter.proposals,
  CompanyRouter.interviews,
];

const landingPageWrapper: string[] = [CommonRouter.landingPage];

export const HomeContainer: React.FC = ({ children }) => {
  const location = useLocation();
  if (pagesWithSecondaryContainer.includes(location.pathname)) {
    return (
      <div className={styles['home-secondary-wrapper']}>
        <div className={styles['home-secondary-wrapper__content']}>{children}</div>
      </div>
    );
  }

  if (pagesWithThirdContainer.find(page => location.pathname.startsWith(page))) {
    return (
      <div className={styles['home-third-wrapper']}>
        <div className={styles['home-third-wrapper__content']}>{children}</div>
      </div>
    );
  }

  if (pagesWithoutPaddings.includes(location.pathname)) {
    return (
      <div className={styles['home-primary-wrapper']}>
        <div className={styles['home-primary-wrapper__content--without-paddings']}>{children}</div>
      </div>
    );
  }

  if (pagesWithFourthContainer.includes(location.pathname)) {
    return (
      <div className={styles['home-fourth-wrapper']}>
        <div className={styles['home-primary-wrapper__content']}>{children}</div>
      </div>
    );
  }

  if (pagesWithFifthContainer.includes(location.pathname)) {
    return (
      <div className={styles['home-fifth-wrapper']}>
        <div className={styles['home-fifth-wrapper__content']}>{children}</div>
      </div>
    );
  }

  if (pagesWithSixthContainer.includes(location.pathname)) {
    return (
      <div className={styles['home-sixth-wrapper']}>
        <div className={styles['home-sixth-wrapper__content']}>{children}</div>
      </div>
    );
  }

  if (landingPageWrapper.includes(location.pathname)) {
    return <div>{children}</div>;
  }

  return (
    <div className={styles['home-primary-wrapper']}>
      <div className={styles['home-primary-wrapper__content']}>{children}</div>
    </div>
  );
};
