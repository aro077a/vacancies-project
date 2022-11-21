import React, { memo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { Candidate } from '~/models/admin';
import {
  deleteCandidate,
  getCandidates,
  setSelectedCandidateId,
} from '~/modules/adminCandidates/actions';
import { useDispatch, useSelector } from '~/store';
import { CommonRouter } from '~/utils/router';
import { DotsDropdown, DropdownItem } from '~/view/components/dots-dropdown';
import { Icon } from '~/view/components/icon';
import { Image } from '~/view/components/image';
import { Tag } from '~/view/components/tag';

import styles from './styles.scss';

type Props = {
  candidate: Candidate;
  onClick: (candidate: Candidate) => void;
};

export const RejectedCandidatesCard: React.FC<Props> = memo(function CandidateCard({
  candidate,
  onClick,
}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const candidatesList = useSelector(state => state.adminCandidates.candidates.results);
  const { avatar, name, location, jobPositions, projectTypes, salary, id, email, phone } =
    candidate;

  const dropdownItems: DropdownItem[] = [
    {
      label: 'Edit profile',
      icon: 'user-outline',
      onClick: () => onEditProfileClick(),
    },
    {
      label: 'Delete candidate',
      icon: 'trash',
      onClick: () => handleRemoveCandidate(),
    },
  ];

  const onEditProfileClick = useCallback(() => {
    history.push(CommonRouter.editCandidate.editCandidateProfile(String(id)));
  }, [history, id]);

  const handleRemoveCandidate = useCallback(() => {
    dispatch(setSelectedCandidateId({ candidateId: id }));
    if (id) {
      if (candidatesList.length < 4) {
        dispatch(getCandidates.init({ initialFetch: true, status: 2 }));
      }
      dispatch(
        deleteCandidate.request({
          candidateId: id,
          onSuccess: () => {
            dispatch(getCandidates.init({ initialFetch: true, status: 2 }));
          },
        }),
      );
    }
  }, [dispatch, id, candidatesList.length]);

  return (
    <div className={styles['card']}>
      <div onClick={() => onClick(candidate)} className={styles['card__inner']}>
        <div className={styles['card__user-general-info']}>
          <Image
            type="candidate"
            className={styles['card__user-img']}
            alt="candidate"
            src={avatar}
          />
          <div className={styles['card__user-personal-info']}>
            <h4 className={styles['card__user-name']}>{name}</h4>
            <div className={styles['card__user-location-info']}>
              <Icon name="location" className={styles['card__user-location-icon']} />
              <p className={styles['card__user-location']}>{location}</p>
            </div>
          </div>
        </div>
        <div className={styles['card__user-experience']}>
          <p className={styles['card__pref-info-title']}>Preferable positions</p>
          <div className={styles['card__user-tags']}>
            {jobPositions.slice(0, 2).map(tag => (
              <Tag key={tag} text={tag} variant="primary" />
            ))}
            {jobPositions.length > 2 && (
              <Tag
                className={styles['card__user-tags--extra']}
                text={`+${jobPositions.length - 2}`}
                variant="primary"
              />
            )}
          </div>
          <p className={styles['card__pref-info-title']}>Preferable project types</p>
          <div className={styles['card__user-tags']}>
            {projectTypes.slice(0, 2).map(tag => (
              <Tag key={tag} text={tag} variant="secondary" />
            ))}
            {projectTypes.length > 2 && (
              <Tag
                className={styles['card__user-tags--extra']}
                text={`+${projectTypes.length - 2}`}
                variant="secondary"
              />
            )}
          </div>
        </div>
        <div className={styles['card__email-info']}>
          <div>
            <p className={styles['card__email-info--label']}>Email</p>
            <p className={styles['card__email-info--email']}>{email}</p>
          </div>
        </div>
        <div className={styles['card__phone-info']}>
          <p className={styles['card__phone-info--label']}>Phone</p>
          <p className={styles['card__phone-info--phone']}>{phone}</p>
        </div>
        <div className={styles['card__user-status-info']}>
          <p className={styles['card__user-salary-info']}>
            <span>${salary}</span> / year
          </p>
        </div>
      </div>
      <DotsDropdown className={styles['card__dropdown']} items={dropdownItems} />
    </div>
  );
});
