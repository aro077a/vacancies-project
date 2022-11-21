import React, { useCallback, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { setSelectedEmployer } from '~/modules/adminEmployers/actions';
import { setSelectedCompanyId, toggleJobModalVisibility } from '~/modules/adminLiveJobs/actions';
import { useDispatch, useSelector } from '~/store';
import { CommonRouter } from '~/utils/router';
import { Button } from '~/view/components/button';
import { JobModal } from '~/view/components/job-modal';
import { Tab } from '~/view/components/tabs';

import { CompaniesWithLiveJobsCount } from './components/companies-with-live-jobs-count';
import { JobsListing } from './components/jobs-listing';
import { SearchInput } from './components/search-input';
import styles from './styles.scss';

const tabs: Tab[] = [
  { id: 1, label: 'Description' },
  { id: 2, label: 'Candidates' },
  { id: 3, label: 'Feedback' },
  { id: 4, label: 'My records' },
];

export const LiveJobsPage: React.FC<RouteComponentProps> = ({ history }) => {
  const dispatch = useDispatch();
  const selectedCompany = useSelector(state => state.adminEmployers.selectedCompany);
  const navigateToAddJob = useCallback(() => {
    dispatch(setSelectedEmployer(null));

    history.push(CommonRouter.createJob.createJobInfo);
  }, [dispatch, history]);

  const toggleModalVisibility = useCallback(() => {
    dispatch(toggleJobModalVisibility());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCompany) {
      dispatch(setSelectedCompanyId(selectedCompany?.id));
    }
  }, [dispatch, selectedCompany, selectedCompany?.id]);

  return (
    <>
      <div className={styles['page']}>
        <div className={styles['page__title-wrapper']}>
          <h1 className={styles['page__title']}>Live jobs</h1>
          <Button
            variant="accent"
            title="+ Add job position"
            className={styles['page__add-job-button']}
            onClick={navigateToAddJob}
          />
        </div>
        <SearchInput />
        <div className={styles['page__content-wrapper']}>
          <CompaniesWithLiveJobsCount />
          <JobsListing onJobClick={toggleModalVisibility} />
        </div>
      </div>
      <JobModal tabs={tabs} />
    </>
  );
};
