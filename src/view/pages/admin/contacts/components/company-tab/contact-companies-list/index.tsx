import React, { memo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { ContactCompanies } from '~/models/admin';
import {
  deleteContactCompany,
  getContactCompanies,
  setSelectedContactCompanyId,
} from '~/modules/adminContacts/actions';
import { setReceiver } from '~/modules/adminMessaging/actions';
import { hiringManagerJobPositionsAsSelectOptionsSelector } from '~/modules/common/selectors';
import { useDispatch, useSelector } from '~/store';
import { RootState } from '~/store/types';
import { CommonRouter } from '~/utils/router';
import { DotsDropdown, DropdownItem } from '~/view/components/dots-dropdown';
import { Icon } from '~/view/components/icon';
import { Image } from '~/view/components/image';

import styles from './styles.scss';

interface CompaniesListProps {
  toggleSendMessageModalVisibility: () => void;
  company: ContactCompanies;
  toggleThreadModalVisibility: (company: ContactCompanies) => void;
  setActiveTab: (arg0: number) => void;
}

export const CompaniesList: React.FC<CompaniesListProps> = memo(function CompaniesList({
  toggleSendMessageModalVisibility,
  toggleThreadModalVisibility,
  setActiveTab,
  company,
}) {
  const companies = useSelector((state: RootState) => state.adminContacts.companies.results);
  const positions = useSelector(hiringManagerJobPositionsAsSelectOptionsSelector);
  const { id, companyLogo, companyName, location, lastName, email, firstName, phone, position } =
    company;
  const history = useHistory();
  const dispatch = useDispatch();
  const dropdownItems: DropdownItem[] = [
    {
      label: 'Edit profile',
      icon: 'user-outline',
      onClick: () => onEditProfileClick(),
    },
    {
      label: 'Delete manager',
      icon: 'trash',
      onClick: () => handleRemoveContactCompany(),
    },
  ];

  const hrPosition = positions.find(managerPosition => managerPosition.value === position);

  const handleSendMessage = (email: string): void => {
    dispatch(setReceiver(email));
    toggleSendMessageModalVisibility();
  };

  const onCardClickHandler = (): void => {
    toggleThreadModalVisibility(company);
  };

  const onNotesClickHandler = (): void => {
    setActiveTab(3);
    toggleThreadModalVisibility(company);
  };

  const handleRemoveContactCompany = useCallback(() => {
    dispatch(setSelectedContactCompanyId({ contactCompanyId: id }));

    if (id) {
      if (companies.length < 12) {
        dispatch(getContactCompanies.init({ initialFetch: true }));
      }
      dispatch(deleteContactCompany.request({ contactCompanyId: id }));
    }
  }, [dispatch, companies.length, id]);

  const onEditProfileClick = useCallback(() => {
    history.push(CommonRouter.editEmployer.editEmployerInformation(String(company.company)));
  }, [history, company.company]);

  return (
    <div className={styles['companies']}>
      <div onClick={onCardClickHandler}>
        <div className={styles['companies__general-info']}>
          <Image
            type="company"
            className={styles['companies__general-img']}
            alt="company"
            src={companyLogo}
          />
          <div className={styles['companies__info']}>
            <h4 className={styles['companies__name']}>{companyName} </h4>
            <div className={styles['companies__location-info']}>
              <Icon name="location" className={styles['companies__location-icon']} />
              <p className={styles['companies__location-name']}>{location}</p>
            </div>
          </div>
        </div>
        <div className={styles['companies__email-info']}>
          <p className={styles['companies__email-info--label']}>Name</p>
          <p className={styles['companies__email-info--email']}>{`${firstName} ${lastName}`}</p>
        </div>
        <div className={styles['companies__email-info']}>
          <p className={styles['companies__email-info--label']}>Position</p>
          <p className={styles['companies__email-info--email']}>
            {hrPosition?.label || 'No position'}
          </p>
        </div>
        <div className={styles['companies__email-info']}>
          <p className={styles['companies__email-info--label']}>Email</p>
          <p className={styles['companies__email-info--email']}>{email}</p>
        </div>
        <div className={styles['companies__email-info']}>
          <p className={styles['companies__email-info--label']}>Phone</p>
          <p className={styles['companies__email-info--email']}>{phone || 'No phone'}</p>
        </div>
      </div>
      <div className={styles['companies__actions']}>
        <div className={styles['companies__actions--add']} onClick={onNotesClickHandler}>
          Add notes
        </div>
        <div
          className={styles['companies__actions--send']}
          onClick={() => handleSendMessage(email)}
        >
          Send email
        </div>
      </div>
      <DotsDropdown className={styles['companies__dropdown']} items={dropdownItems} />
    </div>
  );
});
