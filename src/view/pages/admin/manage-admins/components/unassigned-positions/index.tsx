import React, { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { AdminJobs } from '~/models/admin';
import { getAdminJobs, setJobId } from '~/modules/manageAdmins/actions';
import { useDispatch, useSelector } from '~/store';
import { RootState } from '~/store/types';
import { Button } from '~/view/components/button';
import { DotsDropdown } from '~/view/components/dots-dropdown';
import { Icon } from '~/view/components/icon';
import { Image } from '~/view/components/image';

// eslint-disable-next-line no-restricted-imports
import { InviteAdminModal } from '../invite-admin-modal';
import styles from './styles.scss';
import { AssignToOnlyAdminModal } from './unassigned-admin-modal';

export const UnassignedAdminPositionPage: React.FC<RouteComponentProps> = () => {
  const [inviteAdminModalVisible, setInviteAdminModalVisible] = useState(false);
  const [assignAdminModalVisible, setAssignAdminModalVisible] = useState(false);
  const { adminJobs } = useSelector((state: RootState) => state.manageAdmins);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAdminJobs.init({ initialFetch: true }));
  }, [dispatch]);

  const toggleInviteAdminModalVisibility = useCallback(() => {
    setInviteAdminModalVisible(prevValue => !prevValue);
  }, []);

  const toggleAssignAdminModalVisibility = useCallback(
    (jobId?: number) => {
      setAssignAdminModalVisible(prevValue => !prevValue);
      if (jobId) {
        dispatch(setJobId({ jobId }));
      }
    },
    [dispatch],
  );

  return (
    <div className={styles['unassigned-positions']}>
      <div className={styles['unassigned-positions__title-wrapper']}>
        <h1 className={styles['unassigned-positions__title']}>Unassigned positions</h1>
        <Button title="Invite Admin" variant="accent" onClick={toggleInviteAdminModalVisibility} />
      </div>
      <div className={styles['unassigned-positions__table']}>
        <div className={styles['unassigned-positions__table-header']}>
          <div className={styles['unassigned-positions__table-header-company']}>
            <p>Company</p>
            <Icon
              name="double-arrow"
              className={styles['unassigned-positions__table-header-company-arrow']}
            />
          </div>
          <div className={styles['unassigned-positions__table-header-region']}>
            <p>Region</p>
            <Icon
              name="double-arrow"
              className={styles['unassigned-positions__table-header-region-arrow']}
            />
          </div>
          <div className={styles['unassigned-positions__table-header-position']}>
            <p>Position</p>
            <Icon
              name="double-arrow"
              className={styles['unassigned-positions__table-header-position-arrow']}
            />
          </div>
          <div className={styles['unassigned-positions__table-header-status']}>
            <p>Status</p>
            <Icon
              name="double-arrow"
              className={styles['unassigned-positions__table-header-status-arrow']}
            />
          </div>
        </div>
        <div className={styles['unassigned-positions__table-content']}>
          <div className={styles['unassigned-positions__table-content-items']}>
            {adminJobs.results.map((job: AdminJobs) => {
              return (
                <div className={styles['unassigned-positions__table-content-item']} key={job.id}>
                  <div className={styles['unassigned-positions__table-content-item-img']}>
                    <Image type="company" alt="company" src={job.company.logo} className="" />
                    <p>{job.company.name}</p>
                  </div>
                  <p className={styles['unassigned-positions__table-content-item-region']}>
                    {job.location}
                  </p>
                  <p className={styles['unassigned-positions__table-content-item-position']}>
                    {job.positionName}
                  </p>
                  <div className={styles['unassigned-positions__table-content-item-dots']}>
                    <Button
                      title="Unassigned"
                      variant="secondary"
                      onClick={() => toggleAssignAdminModalVisibility(job.id)}
                    />
                    <DotsDropdown
                      className={styles['unassigned-positions__table-content-item-dropdown']}
                      items={[]}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <InviteAdminModal
        visible={inviteAdminModalVisible}
        onClose={toggleInviteAdminModalVisibility}
      />
      <AssignToOnlyAdminModal
        visible={assignAdminModalVisible}
        onClose={toggleAssignAdminModalVisibility}
      />
    </div>
  );
};
