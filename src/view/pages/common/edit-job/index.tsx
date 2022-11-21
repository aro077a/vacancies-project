import React, { useCallback, useEffect, useState } from 'react';
import {
  NavLink,
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';

import { UserType } from '~/models/common';
import { getJobDataForEdit, resetEditing } from '~/modules/createJob/actions';
import { useDispatch, useSelector } from '~/store';
import { CommonRouter } from '~/utils/router';
import { BackButton } from '~/view/components/back-button';
import { Loader } from '~/view/components/loader';
import { Tab, Tabs } from '~/view/components/tabs';
import { CreateHiringManagerPage } from '~/view/pages/common/create-job/create-hiring-manager';
import { CreateJobDescriptionPage } from '~/view/pages/common/create-job/create-job-description';
import { CreateJobInfoPage } from '~/view/pages/common/create-job/create-job-info';

import { DeleteModal } from './components/delete-modal';
import styles from './styles.scss';

const mobileMenuTabs: Tab[] = [
  { id: 1, label: 'Basic Info' },
  { id: 2, label: 'Hiring Company info' },
  { id: 3, label: 'Job description' },
];

export const EditJobPage: React.FC<RouteComponentProps> = () => {
  const history = useHistory();
  const location = useLocation();
  const params = useParams<{ jobId: string }>();
  const dispatch = useDispatch();
  const loadingJobDataForEdit = useSelector(state => state.createJob.loadingJobDataForEdit);
  const createdJobInfo = useSelector(state => state.createJob.createdJobInfo);
  const [activeMobileMenuTab, setActiveMobileMenuTab] = useState(mobileMenuTabs[0].id);
  const loggedInUserType = useSelector(state => state.user.loggedInUserType);

  useEffect(() => {
    dispatch(getJobDataForEdit.request({ jobId: Number(params.jobId) }));
    return () => {
      dispatch(resetEditing());
    };
  }, [dispatch, params.jobId]);

  useEffect(() => {
    if (location.pathname === CommonRouter.editJob.editJobInfo(params.jobId)) {
      setActiveMobileMenuTab(mobileMenuTabs[0].id);
    } else if (location.pathname === CommonRouter.editJob.editHiringManager(params.jobId)) {
      setActiveMobileMenuTab(mobileMenuTabs[1].id);
    } else if (location.pathname === CommonRouter.editJob.editJobDescription(params.jobId)) {
      setActiveMobileMenuTab(mobileMenuTabs[2].id);
    }
  }, [location.pathname, params.jobId]);

  const handleActiveMobileMenuTabChange = useCallback(
    (tabId: number) => {
      if (tabId === mobileMenuTabs[0].id) {
        history.push(CommonRouter.editJob.editJobInfo(params.jobId));
      } else if (tabId === mobileMenuTabs[1].id) {
        history.push(CommonRouter.editJob.editHiringManager(params.jobId));
      } else if (tabId === mobileMenuTabs[2].id) {
        history.push(CommonRouter.editJob.editJobDescription(params.jobId));
      }
    },
    [history, params.jobId],
  );

  return (
    <>
      <div className={styles['page']}>
        <BackButton
          goTo={
            loggedInUserType === UserType.ADMIN || loggedInUserType === UserType.SUPER_ADMIN
              ? '/live-jobs'
              : '/my-jobs'
          }
        />

        <h1 className={styles['page__title']}>Edit Job Position</h1>
        <div className={styles['page__content']}>
          <Tabs
            className={styles['page__mobile-menu']}
            tabs={mobileMenuTabs}
            activeTabId={activeMobileMenuTab}
            onChange={handleActiveMobileMenuTabChange}
          />
          <div className={styles['page__menu']}>
            <NavLink
              to={CommonRouter.editJob.editJobInfo(params.jobId)}
              className={styles['page__menu-link']}
              activeClassName={styles['page__menu-link--active']}
            >
              Basic Information
            </NavLink>
            <NavLink
              to={CommonRouter.editJob.editHiringManager(params.jobId)}
              className={styles['page__menu-link']}
              activeClassName={styles['page__menu-link--active']}
            >
              Hiring company info
            </NavLink>
            <NavLink
              to={CommonRouter.editJob.editJobDescription(params.jobId)}
              className={styles['page__menu-link']}
              activeClassName={styles['page__menu-link--active']}
            >
              Job description
            </NavLink>
          </div>
          {loadingJobDataForEdit || !createdJobInfo ? (
            <Loader loading />
          ) : (
            <div className={styles['page__subpage']}>
              <Switch>
                <Route
                  exact
                  path={CommonRouter.editJob.editJobInfo(params.jobId)}
                  component={CreateJobInfoPage}
                />
                <Route
                  exact
                  path={CommonRouter.editJob.editHiringManager(params.jobId)}
                  component={CreateHiringManagerPage}
                />
                <Route
                  exact
                  path={CommonRouter.editJob.editJobDescription(params.jobId)}
                  component={CreateJobDescriptionPage}
                />
                <Route path="*">
                  <Redirect to={CommonRouter.editJob.editJobInfo(params.jobId)} />
                </Route>
              </Switch>
            </div>
          )}
        </div>
      </div>
      <DeleteModal />
    </>
  );
};
