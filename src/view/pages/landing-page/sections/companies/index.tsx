import React from 'react';

import banner from '~/view/pages/landing-page/assets/companies-banner.png';

import { Card, CardProps } from './components/card';
import styles from './styles.scss';

const items: CardProps[] = [
  {
    id: '01',
    text: 'Create account and add jobs',
  },
  {
    id: '02',
    text: 'Search, view video profiles and offer',
  },
  {
    id: '03',
    text: 'Engage with vetted talent',
  },
  {
    id: '04',
    text: 'Request to meet job seekers',
  },
  {
    id: '05',
    text: 'Arrange interviews and hire',
  },
  {
    id: '06',
    text: 'Authorise and verify timesheets',
  },
  {
    id: '07',
    text: 'Manage and approve invoices',
  },
  {
    id: '08',
    text: 'Send feedback',
  },
];

export const CompaniesSection: React.FC = () => {
  return (
    <section className={styles['section']}>
      <h2 className={styles['section__title']}>Hiring companies</h2>
      <p className={styles['section__subtitle']}>Via your dedicated dashboard you can:</p>
      <div className={styles['section__content']}>
        <div className={styles['section__list']}>
          {items.map(item => (
            <Card {...item} key={item.id} />
          ))}
        </div>
        <div className={styles['section__banner']}>
          <img src={banner} alt="banner" />
        </div>
      </div>
    </section>
  );
};
