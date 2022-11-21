import React, { memo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { Candidate, ContactCandidates } from '~/models/admin';
import { navigateFromContacts, setSelectedCandidate } from '~/modules/adminCandidates/actions';
import {
  deleteContactCandidate,
  getContactCandidates,
  setSelectedContactCandidateId,
} from '~/modules/adminContacts/actions';
import { useDispatch, useSelector } from '~/store';
import { RootState } from '~/store/types';
import { generateUuid } from '~/utils/helpers';
import { CommonRouter } from '~/utils/router';
import { DotsDropdown, DropdownItem } from '~/view/components/dots-dropdown';
import { Icon } from '~/view/components/icon';
import { Image } from '~/view/components/image';

import styles from './styles.scss';

interface CandidatesListProps {
  candidate: ContactCandidates;
  onClick: () => void;
}

export const CandidatesList: React.FC<CandidatesListProps> = memo(function CandidatesList({
  candidate,
  onClick,
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const candidatesList = useSelector((state: RootState) => state.adminContacts.candidates.results);

  const { id, avatar, location, firstName, lastName, email, phone, positions } = candidate;

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

  const onCardClickHandler = useCallback(() => {
    dispatch(
      setSelectedCandidate({ id, avatar, location, name: `${firstName} ${lastName}` } as Candidate),
    );
    onClick();
  }, [onClick, avatar, dispatch, id, location, firstName, lastName]);

  const onEditProfileClick = useCallback(() => {
    dispatch(navigateFromContacts(true));
    history.push({
      pathname: CommonRouter.editCandidate.editCandidateProfile(String(id)),
    });
  }, [history, id, dispatch]);

  const handleRemoveCandidate = useCallback(() => {
    dispatch(setSelectedContactCandidateId({ contactCandidateId: id }));

    if (id) {
      if (candidatesList.length < 12) {
        dispatch(getContactCandidates.init({ initialFetch: true }));
      }
      dispatch(deleteContactCandidate.request({ contactCandidateId: id }));
    }
  }, [dispatch, id, candidatesList.length]);

  return (
    <div onClick={onCardClickHandler} className={styles['candidate']}>
      <div className={styles['candidate__general-info']}>
        <Image
          type="candidate"
          className={styles['candidate__general-avatar']}
          alt="candidate"
          src={avatar}
        />
        <div className={styles['candidate__info']}>
          <h4 className={styles['candidate__name']}>{`${firstName} ${lastName}`} </h4>
          <div className={styles['candidate__location-info']}>
            <Icon name="location" className={styles['candidate__location-icon']} />
            <p className={styles['candidate__location']}>{location}</p>
          </div>
        </div>
      </div>
      <div className={styles['candidate__job']}>
        {positions.slice(0, 3).map((position: string) => {
          return (
            <p key={generateUuid()} className={styles['candidate__job--name']}>
              {position}
            </p>
          );
        })}
      </div>
      <div className={styles['candidate__email-info']}>
        <p className={styles['candidate__email-info--label']}>Email</p>
        <p className={styles['candidate__email-info--email']}>{email}</p>
      </div>
      <div className={styles['candidate__phone-info']}>
        <p className={styles['candidate__phone-info--label']}>Phone</p>
        <p className={styles['candidate__phone-info--phone']}>{phone}</p>
      </div>
      <DotsDropdown className={styles['candidate__dropdown']} items={dropdownItems} />
    </div>
  );
});
