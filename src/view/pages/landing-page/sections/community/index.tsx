import React from 'react';

import banner from '~/view/pages/landing-page/assets/community-banner.png';

import styles from './styles.scss';

export const CommunitySection: React.FC = () => {
  return (
    <section className={styles['section']}>
      <div className={styles['section__banner']}>
        <img src={banner} alt="banner" />
      </div>
      <div className={styles['section__content']}>
        <span className={styles['section__caption']}>Job seekers</span>
        <h2 className={styles['section__title']}>Construction community</h2>
        <p className={styles['section__description']}>
          Job seekers register via your LinkedIn account to create a profile that is anonymous and
          no builder can see without your authorisation. WIth your account you can:
        </p>
        <ul className={styles['section__list']}>
          <li className={styles['section__list-item']}>Search jobs</li>
          <li className={styles['section__list-item']}>Create a hot list of preferred builders</li>
          <li className={styles['section__list-item']}>Add resume</li>
          <li className={styles['section__list-item']}>Record video profile</li>
        </ul>
      </div>
    </section>
  );
};
