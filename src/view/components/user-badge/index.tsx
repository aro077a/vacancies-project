import classNames from 'classnames';
import React, { memo, useEffect, useMemo } from 'react';

import { CandidateJobStatus, LookingJobStatus } from '~/models/candidate';
import { UserType } from '~/models/common';
import { getCandidateStatus } from '~/modules/createCandidate/actions';
import { useDispatch, useSelector } from '~/store';

import styles from './styles.scss';

type Props = {
  infoVisible?: boolean;
  className?: string;
  avatarWrapperClassName?: string;
  avatarTextClassName?: string;
};

export const UserBadge: React.FC<Props> = memo(function UserBadge({
  infoVisible = true,
  className,
  avatarWrapperClassName,
  avatarTextClassName,
}) {
  const loggedInUserType = useSelector(state => state.user.loggedInUserType);
  const adminUserEmail = useSelector(state => state.adminUser.email);
  const candidateUsername = useSelector(state => state.candidateUser.username);
  const candidatePhoto = useSelector(state => state.candidateUser.photo);
  const companyName = useSelector(state => state.companyUser.company);
  const companyLogo = useSelector(state => state.companyProfile.companyLogo?.file);
  const hiringManagerName = useSelector(state => state.hiringManagerUser.username);
  const superAdminUserEmail = useSelector(state => state.superAdminUser.email);
  const status = useSelector(state => state.createCandidate.candidateStatus);
  const dispatch = useDispatch();
  useEffect(() => {
    if (loggedInUserType === UserType.CANDIDATE) {
      dispatch(getCandidateStatus.request());
    }
  }, [dispatch, loggedInUserType]);
  const currentUsername = useMemo(() => {
    switch (loggedInUserType) {
      case UserType.SUPER_ADMIN:
        return 'Super Admin';
      case UserType.ADMIN:
        return 'Admin';
      case UserType.CANDIDATE:
        return candidateUsername;
      case UserType.COMPANY:
        return companyName;
      case UserType.MANAGER:
        return hiringManagerName;
      default:
        return '';
    }
  }, [loggedInUserType, candidateUsername, companyName, hiringManagerName]);

  const currentUserAvatar = useMemo(() => {
    switch (loggedInUserType) {
      case UserType.SUPER_ADMIN:
        return (
          <h3 className={classNames(styles['block__avatar-text'], avatarTextClassName)}>SA</h3>
        );
      case UserType.ADMIN:
        return <h3 className={classNames(styles['block__avatar-text'], avatarTextClassName)}>A</h3>;
      case UserType.CANDIDATE:
        if (candidatePhoto) {
          return (
            <img className={styles['block__avatar-picture']} src={candidatePhoto} alt="user" />
          );
        }
        return <h3 className={classNames(styles['block__avatar-text'], avatarTextClassName)}>C</h3>;
      case UserType.COMPANY:
        if (companyLogo) {
          return <img className={styles['block__avatar-picture']} src={companyLogo} alt="user" />;
        }
        return <h3 className={classNames(styles['block__avatar-text'], avatarTextClassName)}>C</h3>;
      case UserType.MANAGER:
        return <h3 className={classNames(styles['block__avatar-text'], avatarTextClassName)}>H</h3>;
      default:
        return '';
    }
  }, [loggedInUserType, candidatePhoto, companyLogo, avatarTextClassName]);

  return (
    <div className={classNames(styles['block'], className)}>
      <div className={classNames(styles['block__avatar-wrapper'], avatarWrapperClassName)}>
        {currentUserAvatar}
      </div>
      {infoVisible && (
        <div className={styles['block__info-wrapper']}>
          <h5 className={styles['block__user-name']}>{currentUsername}</h5>
          <div className={styles['block__user-info']}>
            {loggedInUserType === UserType.SUPER_ADMIN ? (
              <p className={styles['block__user-info-email']}>{superAdminUserEmail}</p>
            ) : loggedInUserType === UserType.ADMIN ? (
              <p className={styles['block__user-info-email']}>{adminUserEmail}</p>
            ) : loggedInUserType === UserType.CANDIDATE ? (
              <p className={styles['block__user-info-status']}>
                <span
                  className={classNames(
                    styles['block__user-info-status-dot'],
                    status === LookingJobStatus.ACTIVE
                      ? styles['block__user-info-status-dot--active']
                      : status === LookingJobStatus.PASSIVE
                      ? styles['block__user-info-status-dot--passive']
                      : status === LookingJobStatus.NOT_LOOKING
                      ? styles['block__user-info-status-dot--not-looking']
                      : '',
                  )}
                />
                {status === LookingJobStatus.ACTIVE
                  ? CandidateJobStatus.ACTIVE
                  : status === LookingJobStatus.PASSIVE
                  ? CandidateJobStatus.PASSIVE
                  : status === LookingJobStatus.NOT_LOOKING
                  ? CandidateJobStatus.NOT_LOOKING
                  : ''}
              </p>
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </div>
  );
});
