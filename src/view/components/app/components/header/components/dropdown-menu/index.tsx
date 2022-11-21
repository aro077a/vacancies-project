import React, { memo, useCallback } from 'react';

import { UserType } from '~/models/common';
import { getPendingApprovalCount } from '~/modules/adminCandidates/actions';
import { getPendingEmployersCount } from '~/modules/adminEmployers/actions';
import { useDispatch, useSelector } from '~/store';
import { RootState } from '~/store/types';
import { AdminRouter } from '~/utils/router';
import { NavDropdown, NavDropdownProps } from '~/view/components/nav-dropdown';

import styles from './styles.scss';

export const DropdownMenu: React.FC = memo(function NotificationsModal() {
  const pendingCandidatesCount = useSelector(state => state.adminCandidates.pendingApprovalCount);
  const pendingEmployersCount = useSelector(state => state.adminEmployers.pendingApprovalCount);
  const loggedInUserType = useSelector((state: RootState) => state.user.loggedInUserType);
  const dispatch = useDispatch();
  const navDropdownItems: NavDropdownProps[] = [
    {
      text: 'Candidates list',
      path: `${AdminRouter.candidates}`,
    },
    {
      text: 'Pending approval',
      count: pendingCandidatesCount,
      path: `${AdminRouter.pendingCandidates}`,
    },
    {
      text: 'Rejected candidates list',
      path: `${AdminRouter.rejectedCandidates}`,
    },
  ];

  const navEmployersDropdownItems: NavDropdownProps[] = [
    {
      text: 'Employers list',
      path: `${AdminRouter.employers}`,
    },
    {
      text: 'Pending approval',
      count: pendingEmployersCount,
      path: `${AdminRouter.pendingEmployers}`,
    },
  ];

  const navAdminsDropdownItems: NavDropdownProps[] = [
    {
      text: 'Manage Admins',
      path: `${AdminRouter.admins}`,
    },
    {
      text: 'Unassigned  positions',
      path: `${AdminRouter.unAssignedPositions}`,
    },
  ];

  const getPendingCandidatesCountHandler = useCallback(() => {
    dispatch(getPendingApprovalCount.request());
  }, [dispatch]);

  const getPendingEmployersCountHandler = useCallback(() => {
    dispatch(getPendingEmployersCount.request());
  }, [dispatch]);

  return (
    <nav>
      <ul className={styles['dropdown__nav']}>
        <li>
          <p className={styles['dropdown__nav-title']}>Manage users</p>
          <ul
            style={
              loggedInUserType !== UserType.SUPER_ADMIN ? { height: '73px' } : { height: '103px' }
            }
          >
            <li className={styles['dropdown__nav-link']}>
              <div className={styles['dropdown__nav-link-name']}>Candidates</div>
              <NavDropdown
                className={styles['dropdown__link-child--candidate']}
                items={navDropdownItems}
                cb={getPendingCandidatesCountHandler}
              />
            </li>
            <li className={styles['dropdown__nav-link']}>
              <div className={styles['dropdown__nav-link-name']}>Employers</div>
              <NavDropdown
                className={styles['dropdown__link-child--employer']}
                items={navEmployersDropdownItems}
                cb={getPendingEmployersCountHandler}
              />
            </li>
            {loggedInUserType === UserType.SUPER_ADMIN && (
              <li className={styles['dropdown__nav-link']}>
                <div className={styles['dropdown__nav-link-name']}>Admins</div>
                <NavDropdown
                  className={styles['dropdown__link-child--employer']}
                  items={navAdminsDropdownItems}
                />
              </li>
            )}
          </ul>
        </li>
      </ul>
    </nav>
  );
});
