import classNames from 'classnames';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useHistory, useLocation } from 'react-router-dom';

import { LoggedInCandidateStatus } from '~/models/candidate';
import { UserType } from '~/models/common';
import { toggleNotificationModalVisibility } from '~/modules/notifications/actions';
import { logout } from '~/modules/user/actions';
import { useDispatch, useSelector } from '~/store';
import { AdminRouter, CandidateRouter, CommonRouter, CompanyRouter } from '~/utils/router';
import logo from '~/view/assets/images/logo.svg';
import { Button } from '~/view/components/button';
import { CandidateThreadModal } from '~/view/components/candidate-thread-modal';
import { DotsDropdown } from '~/view/components/dots-dropdown';
import { Icon } from '~/view/components/icon';
import { JobThreadModal } from '~/view/components/job-thread-modal';
import { UserBadge } from '~/view/components/user-badge';

import { Checkbox } from './components/checkbox';
import { DropdownMenu } from './components/dropdown-menu';
import { MenuModal } from './components/menu-modal';
import { NotificationsModal } from './components/notifications-modal';
import { CancelSignupModal } from './components/signup-cancel-modal';
import styles from './styles.scss';
import { HeaderLink } from './types';

const isMenuVisible = window.innerWidth < 1400;

const adminHeaderLinks: HeaderLink[] = [
  { path: AdminRouter.dashboard, label: 'Dashboard' },
  { path: AdminRouter.whiteboard, label: 'Whiteboard' },
  { path: AdminRouter.liveJobs, label: 'Live jobs' },
  { path: AdminRouter.pipeline, label: 'Pipeline' },
  { path: AdminRouter.messaging.inboxMessages(), label: 'Messaging' },
  { path: AdminRouter.contact, label: 'Contact' },
  { path: AdminRouter.admins, label: 'Manage users' },
  { path: AdminRouter.timesheet, label: 'Timesheet' },
];

const adminMobileHeaderLinks: HeaderLink[] = [
  { path: AdminRouter.dashboard, label: 'Dashboard' },
  { path: AdminRouter.whiteboard, label: 'Whiteboard' },
  { path: AdminRouter.liveJobs, label: 'Live jobs' },
  { path: AdminRouter.pipeline, label: 'Pipeline' },
  { path: AdminRouter.messaging.inboxMessages(), label: 'Messaging' },
  { path: AdminRouter.contact, label: 'Contact' },
  { path: AdminRouter.candidates, label: 'Candidates' },
  { path: AdminRouter.pendingCandidates, label: 'Pending approvals' },
  { path: AdminRouter.rejectedCandidates, label: 'Rejected candidates list' },
  { path: AdminRouter.employers, label: 'Employers' },
  { path: AdminRouter.pendingEmployers, label: 'Pending employers' },
  { path: AdminRouter.admins, label: 'Manage admins' },
  { path: AdminRouter.timesheet, label: 'Timesheet' },
];

const companyHeaderLinks: HeaderLink[] = [
  { path: CompanyRouter.addJobs, label: 'Add jobs' },
  { path: CompanyRouter.candidates, label: 'Candidates' },
  { path: CompanyRouter.interviews, label: 'Interviews' },
  { path: CompanyRouter.timesheet, label: 'Timesheet' },
  { path: CommonRouter.shortList, label: 'Shortlist' },
  { path: CompanyRouter.interestedIn, label: 'Interested in' },
  { path: CompanyRouter.editCompany.editCompanyInformation(), label: 'Edit profile' },
];

const mobileBreakpointToHideAdminMenuClassName = styles['header__admin-mobile-breakpoint--hide'];
const mobileBreakpointToShowAdminMenuClassName = styles['header__admin-mobile-breakpoint--show'];
const mobileBreakpointToHideCandidateMenuClassName =
  styles['header__candidate-mobile-breakpoint--hide'];
const mobileBreakpointToShowCandidateMenuClassName =
  styles['header__candidate-mobile-breakpoint--show'];

export const Header: React.FC = memo(function Header() {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const userLoggedIn = useSelector(state => state.user.loggedIn);
  const loggedInUserType = useSelector(state => state.user.loggedInUserType);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const isUpToDate = useSelector(state => state.notifications.isUpToDate);
  const isAdmin = loggedInUserType === UserType.SUPER_ADMIN || loggedInUserType === UserType.ADMIN;
  const [cancelSignupModalVisible, setCancelSignupModalVisible] = useState(false);
  const { notificationsModalVisibility } = useSelector(state => state.notifications);
  const { assigned } = useSelector(state => state.adminAssigned);
  const { userStatus } = useSelector(state => state.candidateUser);
  const { control } = useForm({
    defaultValues: {
      assigned,
    },
  });

  const isCandidateApproved = userStatus === LoggedInCandidateStatus.APPROVED;

  const candidateHeaderLinks: HeaderLink[] = useMemo(
    () => [
      { path: CandidateRouter.findJobs, label: 'Find jobs' },
      ...(isCandidateApproved ? [{ path: CandidateRouter.proposals, label: 'Opportunities' }] : []),
      ...(isCandidateApproved
        ? [{ path: CandidateRouter.timesheet, label: 'Timesheet', isCandidateApproved }]
        : []),
      ...(isCandidateApproved ? [{ path: CommonRouter.shortList, label: 'Shortlist' }] : []),
      { path: CandidateRouter.editCandidate.editProfileInformation(), label: 'Edit profile' },
    ],
    [isCandidateApproved],
  );

  const toggleCancelSignupModalVisibility = useCallback(() => {
    setCancelSignupModalVisible(prevValue => !prevValue);
  }, []);

  const toggleNotificationsModalVisibility = useCallback(() => {
    dispatch(toggleNotificationModalVisibility());
  }, [dispatch]);

  const toggleMenuModalVisibility = useCallback(() => {
    setMenuModalVisible(!menuModalVisible);
  }, [menuModalVisible]);

  const handleNotLoggedInHeaderButtonClick = useCallback(() => {
    history.push(CommonRouter.auth.register.chooseUserType);
  }, [history]);

  const onEditProfile = useCallback(() => {
    if (loggedInUserType === UserType.ADMIN || loggedInUserType === UserType.SUPER_ADMIN) {
      history.push(CommonRouter.editProfile.editAdminProfileDetails());
    } else if (loggedInUserType === UserType.CANDIDATE) {
      history.push(CandidateRouter.editCandidate.editProfileInformation());
    } else {
      history.push(CompanyRouter.editCompany.editCompanyInformation());
    }
  }, [history, loggedInUserType]);

  const handleLogout = useCallback(() => {
    history.push(CommonRouter.auth.login);
    dispatch(logout());
  }, [history, dispatch]);

  const dropdownItems = {
    admin: [
      { label: 'Edit Profile', icon: 'user-outline', onClick: () => onEditProfile() },
      { label: 'Log out', icon: 'logout', onClick: () => handleLogout() },
    ],
    super_admin: [
      { label: 'Edit Profile', icon: 'user-outline', onClick: () => onEditProfile() },
      { label: 'Log out', icon: 'logout', onClick: () => handleLogout() },
    ],
    company: [{ label: 'Log out', icon: 'logout', onClick: () => handleLogout() }],
    candidate: [{ label: 'Log out', icon: 'logout', onClick: () => handleLogout() }],
    hiring_manager: [{ label: 'Log out', icon: 'logout', onClick: () => handleLogout() }],
  };

  const headerLinks = useMemo(() => {
    switch (loggedInUserType) {
      case UserType.SUPER_ADMIN:
        if (isMenuVisible) {
          return adminMobileHeaderLinks;
        }
        return adminHeaderLinks;
      case UserType.ADMIN:
        if (isMenuVisible) {
          return adminMobileHeaderLinks;
        }
        return adminHeaderLinks;
      case UserType.CANDIDATE:
        if (isMenuVisible) {
          return candidateHeaderLinks.slice(0, candidateHeaderLinks.length - 1);
        }
        return candidateHeaderLinks;
      case UserType.COMPANY:
        if (isMenuVisible) {
          return companyHeaderLinks.slice(0, companyHeaderLinks.length - 1);
        }
        return companyHeaderLinks;
      case UserType.MANAGER:
        if (isMenuVisible) {
          return companyHeaderLinks.slice(0, companyHeaderLinks.length - 1);
        }
        return companyHeaderLinks;
      default:
        return [];
    }
  }, [loggedInUserType, candidateHeaderLinks]);

  const mobileBreakpointToShowMenuClassName = isAdmin
    ? mobileBreakpointToShowAdminMenuClassName
    : mobileBreakpointToShowCandidateMenuClassName;
  const mobileBreakpointToHideMenuClassName = isAdmin
    ? mobileBreakpointToHideAdminMenuClassName
    : mobileBreakpointToHideCandidateMenuClassName;

  const navigateToHome = useCallback(() => {
    if (loggedInUserType === UserType.ADMIN || loggedInUserType === UserType.SUPER_ADMIN) {
      history.push(AdminRouter.dashboard);
    } else if (loggedInUserType === UserType.CANDIDATE) {
      history.push(CandidateRouter.findJobs);
    } else if (loggedInUserType === UserType.COMPANY || loggedInUserType === UserType.MANAGER) {
      history.push(CompanyRouter.addJobs);
    }
    if (loggedInUserType === null) {
      history.push(CommonRouter.landingPage);
      dispatch(logout());
    }
  }, [history, loggedInUserType, dispatch]);

  const handleLeavePage = useCallback(() => {
    handleLogout();
    toggleCancelSignupModalVisibility();
  }, [handleLogout, toggleCancelSignupModalVisibility]);

  if (userLoggedIn) {
    return (
      <>
        <header className={classNames(styles['header'], styles['header--logged-in'])}>
          <div className={styles['header__column-wrapper']}>
            <div onClick={navigateToHome}>
              <img src={logo} alt="Logo" className={styles['header__logo']} />
            </div>
            <div
              className={classNames(
                styles['header__links-wrapper'],
                mobileBreakpointToHideMenuClassName,
              )}
            >
              {headerLinks.map(link => {
                if (link.mobileOnly) return null;
                if (link.label === 'Manage users') {
                  return <DropdownMenu key={link.path} />;
                }
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={styles['header__link']}
                    activeClassName={styles['header__link--active']}
                  >
                    {link.label}
                  </NavLink>
                );
              })}
            </div>
          </div>
          <div className={styles['header__column-wrapper']}>
            {isAdmin && (
              <div className={styles['header__assigned-wrapper']}>
                <p className={styles['header__assigned-text']}>Assigned to me</p>
                <Checkbox name="assigned" control={control} />
              </div>
            )}
            <button
              className={styles['header__notification-button']}
              onClick={toggleNotificationsModalVisibility}
            >
              <Icon name="notification" className={styles['header__notification-icon']} />
              {!isUpToDate && <div className={styles['header__notification-indicator']} />}
            </button>
            <UserBadge
              className={classNames(
                styles['header__user-info-wrapper'],
                mobileBreakpointToHideMenuClassName,
              )}
            />
            <DotsDropdown
              className={classNames(
                styles['header__account-dropdown'],
                mobileBreakpointToHideMenuClassName,
              )}
              items={dropdownItems[loggedInUserType!]}
            />
            <button
              className={classNames(
                styles['header__menu-button'],
                mobileBreakpointToShowMenuClassName,
              )}
              onClick={toggleMenuModalVisibility}
            >
              <Icon name="menu" className={styles['header__menu-icon']} />
            </button>
          </div>
        </header>
        {notificationsModalVisibility && <NotificationsModal />}
        <JobThreadModal />
        <CandidateThreadModal />
        <MenuModal
          links={headerLinks}
          visible={menuModalVisible}
          onClose={toggleMenuModalVisibility}
          onEditProfile={onEditProfile}
        />
      </>
    );
  }

  return (
    <header className={classNames(styles['header'], styles['header--not-logged-in'])}>
      <div onClick={navigateToHome}>
        <img src={logo} alt="Logo" className={styles['header__logo']} />
      </div>
      {location.pathname === CommonRouter.auth.login ? (
        <Button
          title="Create Account"
          size="medium"
          variant="accent"
          onClick={handleNotLoggedInHeaderButtonClick}
        />
      ) : (
        <Button
          title="Sign in"
          size="medium"
          variant="accent"
          onClick={toggleCancelSignupModalVisibility}
        />
      )}
      <CancelSignupModal
        visible={cancelSignupModalVisible}
        onClose={toggleCancelSignupModalVisibility}
        handleLeavePage={handleLeavePage}
      />
    </header>
  );
});
