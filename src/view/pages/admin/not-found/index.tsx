import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { UserType } from '~/models/common';
import { useSelector } from '~/store';
import { AdminRouter, CandidateRouter, CompanyRouter } from '~/utils/router';
import { NotFoundPageImage } from '~/view/assets/images/not-found';
import { Button } from '~/view/components/button';

import styles from './styles.scss';

export const NotFoundPage: React.FC = () => {
  const loggedInUserType = useSelector(state => state.user.loggedInUserType);
  const history = useHistory();
  const navigateToDashboard = useCallback(() => {
    if (loggedInUserType === UserType.ADMIN || loggedInUserType === UserType.SUPER_ADMIN) {
      history.push(AdminRouter.dashboard);
    } else if (loggedInUserType === UserType.CANDIDATE) {
      history.push(CandidateRouter.findJobs);
    } else {
      history.push(CompanyRouter.addJobs);
    }
  }, [history, loggedInUserType]);

  return (
    <div className={styles['not-found']}>
      <div className={styles['not-found__body-wrapper']}>
        <div className={styles['not-found__image-wrapper']}>
          <NotFoundPageImage />
        </div>
        <h2 className={styles['not-found__title']}>
          Oops! Something went wrong. Please try again later
        </h2>
        <Button
          variant="accent"
          title={
            loggedInUserType === UserType.ADMIN || loggedInUserType === UserType.SUPER_ADMIN
              ? 'Go to dashboard'
              : loggedInUserType === UserType.CANDIDATE
              ? 'Go to find jobs'
              : 'Go to my jobs'
          }
          onClick={navigateToDashboard}
        />
      </div>
    </div>
  );
};
