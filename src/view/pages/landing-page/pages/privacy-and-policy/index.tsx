import React from 'react';

import { useSelector } from '~/store';
import { Header } from '~/view/components/app/components/header';
import { DescriptionCard } from '~/view/components/text-card';
import { Header as LandingHeader } from '~/view/pages/landing-page/components/header';

import { privacyData } from './data';
import styles from './styles.scss';

export const PrivacyAndPolicyPage: React.FC = () => {
  const userLoggedIn = useSelector(state => state.user.loggedIn);

  return (
    <div>
      {!userLoggedIn ? <LandingHeader /> : <Header />}
      <div className={styles['privacy']}>
        <div className={styles['privacy__header']}>
          <p className={styles['privacy__header--caption']}>timbyr</p>
          <h1 className={styles['privacy__header--title']}>Privacy Policy</h1>
        </div>
        {privacyData?.map(item => (
          <DescriptionCard
            key={item.id}
            title={item.title}
            description={item.description}
            additionalDesc={item.additionalDesc}
            isAdditionalDescBold={item.isAdditionalDescBold}
            titleWrap={item.titleWrap}
            list={item.list}
            link={item.link}
            listBold={item.isListBold}
            listTypeNone={item.listTypeNone}
          />
        ))}
      </div>
    </div>
  );
};
