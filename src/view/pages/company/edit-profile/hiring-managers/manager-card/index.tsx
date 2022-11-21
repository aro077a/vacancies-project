import React, { memo, useCallback } from 'react';

import { CompanyHiringManger } from '~/models/company';
import {
  citiesAsSelectOptionsSelector,
  hiringManagerJobPositionsAsSelectOptionsSelector,
} from '~/modules/common/selectors';
import { deleteHiringManager, setHiringManagerId } from '~/modules/companyEditProfile/actions';
import {
  setHiringManagerEditMode,
  setHiringManagerForEdit,
} from '~/modules/createEmployer/actions';
import { useDispatch, useSelector } from '~/store';
import { DotsDropdown, DropdownItem } from '~/view/components/dots-dropdown';

import styles from './styles.scss';

interface ManagerCardProps {
  managers: CompanyHiringManger;
  companyManagers: {
    results: CompanyHiringManger[];
  };
  toggleOpenAddManagerModalVisibility: () => void;
}

export const ManagerCard: React.FC<ManagerCardProps> = memo(function ManagerCard({
  managers,
  companyManagers,
  toggleOpenAddManagerModalVisibility,
}) {
  const dispatch = useDispatch();

  const { id, lastName, firstName, email, position, phone, office } = managers;
  const hrPosition = useSelector(hiringManagerJobPositionsAsSelectOptionsSelector).find(
    jobPosition => jobPosition.value === position,
  );

  const hrOffice = useSelector(citiesAsSelectOptionsSelector).find(city => city.value === office);

  const removeHiringManager = (): void => {
    dispatch(setHiringManagerId({ managerId: id }));
    const managerId = companyManagers?.results.find((item: CompanyHiringManger) => item?.id === id);
    dispatch(setHiringManagerId({ managerId: id }));
    if (managerId) {
      dispatch(
        deleteHiringManager.request({
          managerId: managerId.id,
        }),
      );
    }
  };

  const handleEditHiringManager = useCallback(() => {
    const selectedManager = companyManagers?.results.find(
      (item: CompanyHiringManger) => item?.id === id,
    );
    dispatch(setHiringManagerId({ managerId: id }));
    dispatch(setHiringManagerEditMode({ editMode: true }));
    if (selectedManager) {
      dispatch(setHiringManagerForEdit({ hiringManager: selectedManager }));
    }
    toggleOpenAddManagerModalVisibility();
  }, [dispatch, toggleOpenAddManagerModalVisibility, id, companyManagers?.results]);

  const dropdownItems: DropdownItem[] = [
    {
      label: 'Edit user',
      onClick: () => handleEditHiringManager(),
    },
    {
      label: 'Delete user',
      onClick: () => removeHiringManager(),
    },
  ];

  return (
    <div className={styles['manager-card']}>
      <div className={styles['manager-card__info']}>
        <p className={styles['manager-card__info-name']}>{`${firstName} ${lastName}`}</p>
        <p className={styles['manager-card__info-address']}>
          {hrPosition?.value || 'No position'} <span>&#183;</span> {hrOffice?.value || 'No office'}
        </p>
      </div>
      <div className={styles['manager-card__contacts']}>
        <p className={styles['manager-card__contacts-email']}>{email || 'No email'}</p>
        <p className={styles['manager-card__contacts-separator']} />
        <p className={styles['manager-card__contacts-phone']}>{phone || 'No phone'}</p>
      </div>
      <DotsDropdown className={styles['manager-card__dropdown']} items={dropdownItems} />
    </div>
  );
});
