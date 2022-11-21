import React, { useCallback, useState } from 'react';

import { Button } from '~/view/components/button';
import ellipse from '~/view/pages/landing-page/assets/form-ellipse.png';
import phone from '~/view/pages/landing-page/assets/phones.png';
import { Input } from '~/view/pages/landing-page/components/input';

import styles from './styles.scss';

export const QuestionSection: React.FC = () => {
  const [email, setEmail] = useState('');

  const inputChangeHandler = useCallback((value: string) => {
    setEmail(value);
  }, []);

  const onSubmit = useCallback(() => {
    console.log(email);
  }, [email]);

  return (
    <section className={styles['section']}>
      <div className={styles['section__subscribe']}>
        <div className={styles['section__modal']}>
          <h3 className={styles['section__modal-title']}>Actively seeking or only peeking</h3>
          <p className={styles['section__modal-description']}>
            No matter if you are in the market to change employers or if you only want to understand
            the market trends and who is hiring, TIMBYR will ensure privacy and only connect you
            with companies you wish to be connected with.
          </p>
          <div className={styles['section__modal-form']}>
            <Input placeholder="Email" onChange={inputChangeHandler} name="email" />
            <Button
              onClick={onSubmit}
              className={styles['section__subscribe-btn']}
              title="Subscribe"
              variant="accent"
            />
          </div>
        </div>
        <div className={styles['section__ellipse']}>
          <img src={ellipse} alt="backgroudn" />
        </div>
        <div className={styles['section__phones']}>
          <img src={phone} alt="phone" />
        </div>
      </div>
    </section>
  );
};
