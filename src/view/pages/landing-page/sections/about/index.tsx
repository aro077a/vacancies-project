import React from 'react';

import styles from './styles.scss';

export const AboutSection: React.FC = () => {
  return (
    <section className={styles['section']}>
      <div className={styles['section__column']}>
        <span className={styles['section__caption']}>About us area</span>
        <h2 className={styles['section__title']}>get matched with TIMBYR</h2>
      </div>
      <div className={styles['section__column']}>
        <p className={styles['section__description']}>
          Australia's #1 CONSTRUCTION JOBS MARKETPLACE MATCHING TOP TALENT WITH THE BEST BUILDERS.
        </p>
        <p className={styles['section__description']}>
          TRANSPARENCY - You can see the builders who are hiring.
        </p>
        <p className={styles['section__description']}>
          ANONYMITY - Your profile is only seen by builders you allow.
        </p>
        <p className={styles['section__description']}>
          INSTANTANEOUS MATCHING - As soon as relevant job goes live, you will be notified.
        </p>
      </div>
    </section>
  );
};
