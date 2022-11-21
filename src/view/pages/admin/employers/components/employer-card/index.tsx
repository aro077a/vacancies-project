import React, { memo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { Employers } from '~/models/admin';
import {
  deleteEmployer,
  getEmployers,
  resetCreateEmployerForm,
  setEmployerId,
  setSelectedEmployer,
} from '~/modules/adminEmployers/actions';
import { useDispatch, useSelector } from '~/store';
import { AdminRouter, CommonRouter } from '~/utils/router';
import { formatSalary } from '~/utils/strings';
import { Button } from '~/view/components/button';
import { DotsDropdown } from '~/view/components/dots-dropdown';
import { Icon } from '~/view/components/icon';
import { Image } from '~/view/components/image';

import styles from './styles.scss';

export interface Props {
  employer: Employers;
  onClick: (employer: Employers) => void;
}

export const EmployerCard: React.FC<Props> = memo(function EmployerCard({ employer, onClick }) {
  const { employers } = useSelector(state => state.adminEmployers);
  const { id, name, companyLogo, state, city, jobs } = employer;
  const history = useHistory();
  const dispatch = useDispatch();

  const editTabItem = [
    {
      label: 'Edit Profile',
      icon: 'user-outline',
      onClick: () => {
        dispatch(setSelectedEmployer(employer));
        dispatch(setEmployerId({ employerId: id }));
        dispatch(resetCreateEmployerForm());
        onEditProfileClick();
      },
    },
    {
      label: 'Delete employer',
      icon: 'trash',
      onClick: () => handleRemoveEmployer(),
    },
  ];

  const onEditProfileClick = useCallback(() => {
    history.push(CommonRouter.editEmployer.editEmployerInformation(String(id)));
  }, [history, id]);

  const handleRemoveEmployer = useCallback(() => {
    dispatch(setEmployerId({ employerId: id }));
    if (id) {
      if (employers.results.length < 12) {
        dispatch(getEmployers.init({ initialFetch: true }));
      }
      dispatch(deleteEmployer.request({ employerId: id }));
    }
  }, [dispatch, id, employers.results.length]);

  const navigateToAddJob = useCallback(() => {
    dispatch(setSelectedEmployer(employer));
    history.push(CommonRouter.createJob.createJobInfo);
  }, [history, dispatch, employer]);

  const navigateToSelectedCompany = useCallback(() => {
    history.push({
      pathname: `${AdminRouter.liveJobs}`,
      state: { companyId: employer.id },
    });
  }, [history, employer.id]);

  const renderJobCard = useCallback(() => {
    if (jobs.length) {
      return (
        <>
          <div className={styles['card--job']}>
            <p className={styles['card--job-name']}>{jobs[0].position.name}</p>
            <div className={styles['card--job-center']}>
              <p className={styles['card--job-name2']}>Brisbane CBD </p>
              <p className={styles['card--job-separator']} />
              <p className={styles['card--job-salary']}>{formatSalary(jobs[0].salary)}</p>
            </div>
            <div className={styles['card--job-type']}>{jobs[0].projectType.name}</div>
          </div>
          {jobs.length >= 1 && (
            <div onClick={navigateToSelectedCompany} className={styles['card--job-more']}>
              View more {jobs.length} position(-s)
            </div>
          )}
        </>
      );
    }
    return null;
  }, [jobs, navigateToSelectedCompany]);

  return (
    <div className={styles['card']}>
      <div className={styles['card--inner']} onClick={() => onClick(employer)}>
        <div className={styles['card__user-general-info']}>
          <Image
            type="company"
            className={styles['card__user-img']}
            alt="candidate"
            src={companyLogo}
          />
          <div className={styles['card__user-personal-info']}>
            <h4 className={styles['card__user-name']}>{name}</h4>
            <div className={styles['card--location-info']}>
              <Icon
                name="location"
                height={18}
                width={18}
                className={styles['card--location-icon']}
              />
              <p
                className={styles['card__user-location-name']}
              >{`${city?.name} , ${state?.abbr}`}</p>
            </div>
          </div>
        </div>
        {renderJobCard()}
      </div>
      <div className={styles['card--add']}>
        <Button
          className={styles['card--add-button']}
          size="large"
          variant="secondary"
          title="Add job position"
          onClick={navigateToAddJob}
        />
      </div>
      <DotsDropdown className={styles['card__dropdown']} items={editTabItem} />
    </div>
  );
});
