import React, { memo, useCallback, useEffect, useState } from 'react';

import { AdminsList } from '~/models/admin';
import {
  deleteAdmin,
  getAdminPositionsList,
  getAdminRegions,
  setAdminId,
} from '~/modules/manageAdmins/actions';
import { useDispatch } from '~/store';
import { Button } from '~/view/components/button';
import { DotsDropdown, DropdownItem } from '~/view/components/dots-dropdown';
import { Image } from '~/view/components/image';

import { AssignToAdminModal } from './assign-to-admin';
import { ConfirmDeleteAdminModal } from './assign-to-admin/confirm-admin-delete';
import styles from './styles.scss';

type Props = {
  admins: AdminsList;
};

type totalType = {
  positionsCount: number;
  regionsCount: number;
  jobsCount: number;
};

export const AdminCard: React.FC<Props> = memo(function AdminCard({ admins }) {
  const dropdownItems: DropdownItem[] = [
    {
      label: 'Delete admin',
      onClick: () => toggleRemoveAdminModalVisibility(),
    },
  ];

  const [assignToAdminModalVisible, setAssignToAdminModalVisible] = useState(false);
  const [removeAdminModalVisible, setRemoveAdminModalVisible] = useState(false);
  const [totalCount, setTotalCount] = useState<totalType>({
    positionsCount: 0,
    regionsCount: 0,
    jobsCount: 0,
  });
  const dispatch = useDispatch();

  const toggleAssignToAdminModalVisibility = useCallback(() => {
    setAssignToAdminModalVisible(prevValue => !prevValue);
    dispatch(setAdminId({ adminId: admins.id }));
    dispatch(getAdminPositionsList.init({ initialFetch: true, adminId: admins.id }));
    dispatch(getAdminRegions.init({ initialFetch: true, adminId: admins.id }));
  }, [admins.id, dispatch]);

  const toggleRemoveAdminModalVisibility = useCallback(() => {
    setRemoveAdminModalVisible(prevValue => !prevValue);
  }, []);

  const handleRemoveAdmin = useCallback(() => {
    dispatch(
      deleteAdmin.request({
        adminId: admins.id,
        onSuccess: () => {
          setAssignToAdminModalVisible(false);
        },
      }),
    );
  }, [dispatch, admins.id]);

  useEffect(() => {
    const totalPositions = admins?.positions?.reduce((curr, next) => curr + next, 0);
    setTotalCount(prev => ({
      ...prev,
      positionsCount: totalPositions,
    }));
    const totalRegions = admins?.regions?.reduce((curr, next) => curr + next, 0);
    setTotalCount(prev => ({
      ...prev,
      regionsCount: totalRegions,
    }));
    const totalJobs = admins?.jobs?.reduce((curr, next) => curr + next, 0);
    setTotalCount(prev => ({
      ...prev,
      jobsCount: totalJobs,
    }));
  }, [admins?.positions, admins?.jobs, admins?.regions]);

  return (
    <div className={styles['manage-admins__table-content-items']}>
      <div className={styles['manage-admins__table-content-item']}>
        <div className={styles['manage-admins__table-content-item-img']}>
          <Image type="candidate" alt="candidate" src={admins.photo} className="" />
          <p>{`${admins.firstName} ${admins.lastName}`}</p>
        </div>
        <p className={styles['manage-admins__table-content-item--companies']}>
          {totalCount.positionsCount}
        </p>
        <p className={styles['manage-admins__table-content-item--regions']}>
          {totalCount.regionsCount}
        </p>
        <p className={styles['manage-admins__table-content-item--position']}>
          {totalCount.jobsCount}
        </p>
        <div className={styles['manage-admins__table-content-item-dots']}>
          {admins.actions ? (
            <Button
              title="Assign"
              variant="secondary"
              onClick={toggleAssignToAdminModalVisibility}
            />
          ) : (
            <Button
              title="Invite sent"
              variant="secondary"
              disabled
              className={styles['manage-admins__table-content-item-dots--disabled']}
            />
          )}
          <DotsDropdown
            className={styles['manage-admins__table-content-item-dropdown']}
            items={dropdownItems}
          />
        </div>
      </div>
      <AssignToAdminModal
        visible={assignToAdminModalVisible}
        onClose={toggleAssignToAdminModalVisibility}
      />
      <ConfirmDeleteAdminModal
        visible={removeAdminModalVisible}
        onClose={toggleRemoveAdminModalVisibility}
        handleRemoveAdmin={handleRemoveAdmin}
      />
    </div>
  );
});
