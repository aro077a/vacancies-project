import React, { memo, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { setCompanyContact } from '~/modules/adminContacts/actions';
import { useDispatch, useSelector } from '~/store';
import { CommonRouter } from '~/utils/router';
import { Button } from '~/view/components/button';
import { Icon } from '~/view/components/icon';
import { Image } from '~/view/components/image';
import { RightModal } from '~/view/components/modals';
import { Tab, Tabs } from '~/view/components/tabs';

import { EmailsSection } from './components/emails';
import { ManagerNotes } from './components/notes';
import { SendResumeSection } from './components/send-resume';
import styles from './styles.scss';

interface ContactNotesProps {
  visible: boolean;
  onClose: () => void;
  tabs: Tab[];
  setActiveTab: (arg0: number) => void;
  handleTabChange: (arg0: number) => void;
  activeTab: number;
}

export const ContactThreadModal: React.FC<ContactNotesProps> = memo(function ContactThreadModal({
  visible,
  onClose,
  tabs,
  setActiveTab,
  handleTabChange,
  activeTab,
}) {
  const selectedContact = useSelector(state => state.adminContacts.selectedCompanyContact);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!visible) {
      dispatch(setCompanyContact(null));
      setActiveTab(tabs[0].id);
    }
  }, [visible, dispatch, tabs, setActiveTab]);

  const handleEditCompany = useCallback(() => {
    if (selectedContact) {
      history.push(
        CommonRouter.editEmployer.editEmployerHiringManagers(String(selectedContact.company)),
      );
    }
  }, [history, selectedContact]);

  if (!selectedContact) {
    return null;
  }

  return (
    <RightModal className={styles['modal']} onClose={onClose} visible={visible} backTitle="< Back">
      <div className={styles['modal__header']}>
        <div className={styles['modal__company']}>
          <Image
            type="company"
            className={styles['modal__company-image']}
            src={selectedContact.companyLogo}
            alt="company"
          />
          <div>
            <p className={styles['modal__job-title']}>{selectedContact.companyName}</p>
            <div className={styles['modal__location-info']}>
              <Icon className={styles['modal__location-icon']} name="location" />
              <p>{selectedContact.location}</p>
            </div>
          </div>
        </div>
        <Button
          size="medium"
          variant="secondary"
          title="Edit profile"
          className={styles['modal__edit-job-button']}
          inlineIcon="pencil"
          inlineIconClassName={styles['modal__edit-job-button-icon']}
          onClick={handleEditCompany}
        />
      </div>
      <Tabs
        className={styles['modal__tabs']}
        activeTabId={activeTab}
        onChange={handleTabChange}
        tabs={tabs}
      />
      {activeTab === 1 && <EmailsSection />}
      {activeTab === 2 && <SendResumeSection />}
      {activeTab === 3 && <ManagerNotes />}
    </RightModal>
  );
});
