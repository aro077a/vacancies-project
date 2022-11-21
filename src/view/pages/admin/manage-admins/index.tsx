import React, { useCallback, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { AdminsList } from '~/models/admin';
import { getListOfAdmins } from '~/modules/manageAdmins/actions';
import { useDispatch, useSelector } from '~/store';
import { RootState } from '~/store/types';
import { Button } from '~/view/components/button';
import { Icon } from '~/view/components/icon';
import { Loader } from '~/view/components/loader';
import { usePaginatedDataScrollList } from '~/view/hooks/usePaginatedDataScrollList';

import { AdminCard } from './components/admin-card';
import { InviteAdminModal } from './components/invite-admin-modal';
import styles from './styles.scss';

export const ManageAdminsPage: React.FC<RouteComponentProps> = () => {
  const [inviteAdminModalVisible, setInviteAdminModalVisible] = useState(false);
  const { listOfAdmins, loadingListOfAdmins } = useSelector(
    (state: RootState) => state.manageAdmins,
  );

  const dispatch = useDispatch();

  const { scrollListRef } = usePaginatedDataScrollList<HTMLDivElement>({
    useWindowScroll: true,
    loadingData: loadingListOfAdmins,
    fetchDataFn: useCallback(
      initialFetch => {
        dispatch(getListOfAdmins.init({ initialFetch }));
      },
      [dispatch],
    ),
  });

  const toggleInviteAdminModalVisibility = useCallback(() => {
    setInviteAdminModalVisible(prevValue => !prevValue);
  }, []);

  return (
    <div className={styles['manage-admins']}>
      <div className={styles['manage-admins__title-wrapper']}>
        <h1 className={styles['manage-admins__title']}>Manage admins</h1>
        <Button title="Invite Admin" variant="accent" onClick={toggleInviteAdminModalVisibility} />
      </div>
      <div className={styles['manage-admins__table']}>
        <div className={styles['manage-admins__table-header']}>
          <div className={styles['manage-admins__table-header-admin']}>
            <p>Admin Name</p>
          </div>
          <div className={styles['manage-admins__table-header-companies']}>
            <p>Positions</p>
          </div>
          <div className={styles['manage-admins__table-header-regions']}>
            <p>Regions</p>
          </div>
          <div className={styles['manage-admins__table-header-position']}>
            <p>Total positions assigned</p>
            <Icon
              name="double-arrow"
              className={styles['manage-admins__table-header-position-arrow']}
            />
          </div>
          <div className={styles['manage-admins__table-header-actions']}>
            <p>Actions</p>
            <Icon
              name="double-arrow"
              className={styles['manage-admins__table-header-actions-arrow']}
            />
          </div>
        </div>
        <div className={styles['manage-admins__table-content']}>
          {!loadingListOfAdmins && !listOfAdmins.results.length ? (
            <div ref={scrollListRef} className={styles['page__timesheet-content-not-found']}>
              No Admins found
            </div>
          ) : (
            <div ref={scrollListRef} className={styles['page__timesheet-content-items']}>
              {listOfAdmins.results.map((admins: AdminsList) => (
                <AdminCard key={admins.id} admins={admins} />
              ))}
              {loadingListOfAdmins && (
                <div className={styles['page__timesheet-content-items-loader']}>
                  <Loader loading />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <InviteAdminModal
        visible={inviteAdminModalVisible}
        onClose={toggleInviteAdminModalVisibility}
      />
    </div>
  );
};
