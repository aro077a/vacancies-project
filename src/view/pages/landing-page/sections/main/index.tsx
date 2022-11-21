import React, { memo } from 'react';

import banner from '~/view/pages/landing-page/assets/banner.png';
import background from '~/view/pages/landing-page/assets/main-bg.png';
import mobile from '~/view/pages/landing-page/assets/mobile-mockup.png';

import styles from './styles.scss';

export const MainSection: React.FC = memo(function MainSection() {
  return (
    <section className={styles['section']}>
      <div className={styles['section__content']}>
        <h1 className={styles['section__title']}>
          Connecting top construction talent with the best building contractors
        </h1>
        <p className={styles['section__description']}>If you are not on it, you are not in it</p>
        <div className={styles['section__banner']}>
          <img src={banner} alt="Banner" />
          <div className={styles['section__mobile']}>
            <img src={mobile} alt="mobile" />
          </div>
        </div>
      </div>
      <div className={styles['section__background']}>
        <img src={background} alt="background" />
      </div>
    </section>
  );
});
