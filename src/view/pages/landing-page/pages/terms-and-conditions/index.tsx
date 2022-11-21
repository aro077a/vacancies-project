import React from 'react';

import { useSelector } from '~/store';
import { Header } from '~/view/components/app/components/header';
import { DescriptionCard } from '~/view/components/text-card';
import { Header as LandingHeader } from '~/view/pages/landing-page/components/header';

import { termsData } from './data';
import styles from './styles.scss';

export const TermsAndConditionsPage: React.FC = () => {
  const userLoggedIn = useSelector(state => state.user.loggedIn);

  return (
    <div>
      {!userLoggedIn ? <LandingHeader /> : <Header />}
      <div className={styles['terms']}>
        <div className={styles['terms__header']}>
          <p className={styles['terms__header--caption']}>timbyr</p>
          <h1 className={styles['terms__header--title']}>Terms and Conditions</h1>
        </div>
        {termsData?.map(item => (
          <DescriptionCard
            key={item.id}
            title={item.title}
            description={item.description}
            additionalDesc={item.additionalDesc}
            isAdditionalDescBold={item.isAdditionalDescBold}
            list={item.list}
            link={item.link}
          />
        ))}
      </div>
    </div>
  );
};
