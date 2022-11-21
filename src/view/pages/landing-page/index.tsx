import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { Header } from './components/header';
import { AboutSection } from './sections/about';
import { CommunitySection } from './sections/community';
import { CompaniesSection } from './sections/companies';
import { FeaturesSection } from './sections/features';
import { QuestionSection } from './sections/form';
import { MainSection } from './sections/main';
import { SlideSection } from './sections/slider';
import styles from './styles.scss';

export const LandingPage: React.FC<RouteComponentProps> = () => {
  return (
    <div className={styles['content']}>
      <Header />
      <main>
        <MainSection />
        <SlideSection />
        <AboutSection />
        <CompaniesSection />
        <CommunitySection />
        <FeaturesSection />
        <QuestionSection />
      </main>
    </div>
  );
};
