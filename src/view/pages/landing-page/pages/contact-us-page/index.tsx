import React from 'react';

import { useSelector } from '~/store';
import { Header } from '~/view/components/app/components/header';
import { Icon } from '~/view/components/icon';
import { Header as LandingHeader } from '~/view/pages/landing-page/components/header';

import { ContactForm } from './components/form';
import styles from './styles.scss';

export const ContactUsPage: React.FC = () => {
  const userLoggedIn = useSelector(state => state.user.loggedIn);
  return (
    <div>
      {!userLoggedIn ? <LandingHeader /> : <Header />}
      <div className={styles['content']}>
        <div className={styles['content__left-side']}>
          <p className={styles['content__caption']}>Contact Us</p>
          <h1 className={styles['content__title']}>We'd love to hear from you. Let's chat.</h1>
          <span className={styles['content__cta']}>
            Got a question? Write us directly to our email!
          </span>
          <div className={styles['mail-wrapper']}>
            <div className={styles['mail-wrapper__icon-wrapper']}>
              <Icon className={styles['mail-wrapper__icon']} name="mail" />
            </div>
            <div className={styles['mail-wrapper__email']}>
              <span className={styles['mail-wrapper__caption']}>Mail me at:</span>
              <a className={styles['mail-wrapper__link']} href="mailto:support@timbyr.tech">
                support@timbyr.tech
              </a>
            </div>
          </div>
        </div>
        <div className={styles['content__right-side']}>
          <ContactForm />
        </div>
      </div>
    </div>
  );
};
