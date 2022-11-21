import React, { memo, useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import Switch from 'react-switch';

import { LookingJobStatus } from '~/models/candidate';
import { UserType } from '~/models/common';
import { updateCandidateLookingForJobStatus } from '~/modules/createCandidate/actions';
import { useSelector } from '~/store';
import { Image } from '~/view/components/image';
import { DropdownItem } from '~/view/components/status-dropdown';

import { CandidateStatusDropdown } from './components/status-dropdown';
import styles from './styles.scss';

const statusDropdownItems: DropdownItem[] = [
  { label: 'Active', value: LookingJobStatus.ACTIVE },
  { label: 'Passive', value: LookingJobStatus.PASSIVE },
  { label: 'Not looking', value: LookingJobStatus.NOT_LOOKING },
];

export const EditCandidateHeader: React.FC = memo(function EditCandidateHeader() {
  const [checked, setChecked] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { candidatePhoto, candidateProfessionalDetailsCreated, candidateProfileCreated } =
    useSelector(state => state.createCandidate);

  const name = `${candidateProfileCreated?.firstName} ${candidateProfileCreated?.lastName}`;

  const publicLink = 'asdfafsd';

  const type = useSelector(state => state.user.loggedInUserType);

  const copyToClipBoard = useCallback(() => {
    if (publicLink) {
      navigator.clipboard.writeText(publicLink);
    }
  }, [publicLink]);

  const handleJobStatusChange = useCallback(
    (statusDropdownItem: DropdownItem) => {
      dispatch(updateCandidateLookingForJobStatus.request({ status: statusDropdownItem.value }));
    },
    [dispatch],
  );

  const candidateStatus = useMemo(() => {
    return statusDropdownItems.find(item => {
      return item.value === candidateProfessionalDetailsCreated?.status || null;
    });
  }, [candidateProfessionalDetailsCreated]);

  const handleChange = useCallback(() => {
    setChecked(!checked);
  }, [checked]);

  return (
    <div className={styles['edit-candidate__header']}>
      <div className={styles['edit-candidate__info']}>
        <Image
          className={styles['edit-candidate__img']}
          src={candidatePhoto?.file || null}
          type="candidate"
          alt="Candidate photo"
        />
        <div>
          <h4 className={styles['edit-candidate__candidate-name']}>{name}</h4>
          <div className={styles['edit-candidate__status-wrapper']}>
            <CandidateStatusDropdown
              items={statusDropdownItems}
              selectedItem={candidateStatus || null}
              onChange={handleJobStatusChange}
              className={styles['edit-candidate__status-dropdown']}
            />
          </div>
        </div>
      </div>
      {type === (UserType.ADMIN || UserType.SUPER_ADMIN) ? (
        <div>
          <p className={styles['edit-candidate__link-description']}>Public link to edit profile</p>
          <div className={styles['edit-candidate__link-wrapper']}>
            <p className={styles['edit-candidate__public-link']}>{publicLink}</p>
            <button onClick={copyToClipBoard} className={styles['edit-candidate__copy-btn']}>
              Copy
            </button>
          </div>
        </div>
      ) : (
        <div className={styles['edit-candidate__toggle']}>
          <p>Accept interview notifications</p>
          <Switch
            onChange={handleChange}
            checked={checked}
            checkedIcon={false}
            uncheckedIcon={false}
            onColor="#66d184"
            width={45}
            height={26}
          />
        </div>
      )}
    </div>
  );
});
