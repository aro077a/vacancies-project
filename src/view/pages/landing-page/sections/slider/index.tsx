import React from 'react';

import company1 from '~/view/assets/images/company-1.svg';
import company2 from '~/view/assets/images/company-2.svg';
import company3 from '~/view/assets/images/company-3.svg';
import company4 from '~/view/assets/images/company-4.svg';
import company5 from '~/view/assets/images/company-5.svg';
import company6 from '~/view/assets/images/company-6.svg';
import { useAutoScroll } from '~/view/hooks/useAutoScroll';

import styles from './styles.scss';

export const SlideSection: React.FC = () => {
  const autoScrollableElementRef = useAutoScroll<HTMLDivElement>();

  return (
    <section className={styles['section']}>
      <h2 className={styles['section__title']}>Search jobs with</h2>
      <div className={styles['section__list']} ref={autoScrollableElementRef}>
        <img className={styles['section__list-item']} src={company1} alt="company logo" />
        <img className={styles['section__list-item']} src={company2} alt="company logo" />
        <img className={styles['section__list-item']} src={company3} alt="company logo" />
        <img className={styles['section__list-item']} src={company4} alt="company logo" />
        <img className={styles['section__list-item']} src={company5} alt="company logo" />
        <img className={styles['section__list-item']} src={company6} alt="company logo" />
        <img className={styles['section__list-item']} src={company1} alt="company logo" />
        <img className={styles['section__list-item']} src={company2} alt="company logo" />
        <img className={styles['section__list-item']} src={company3} alt="company logo" />
        <img className={styles['section__list-item']} src={company4} alt="company logo" />
        <img className={styles['section__list-item']} src={company5} alt="company logo" />
        <img className={styles['section__list-item']} src={company6} alt="company logo" />
      </div>
    </section>
  );
};
