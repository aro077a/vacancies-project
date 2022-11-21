import React, { memo, useCallback, useEffect, useState } from 'react';

import { ContactCompanies } from '~/models/admin';
import {
  getContactCompanies,
  resetContactSearchFilters,
  setCompanyContact,
} from '~/modules/adminContacts/actions';
import { setReceiver } from '~/modules/adminMessaging/actions';
import { useDispatch, useSelector } from '~/store';
import { RootState } from '~/store/types';
import { Loader } from '~/view/components/loader';
import { SendEmailModal } from '~/view/components/send-email-modal';
import { Tab } from '~/view/components/tabs';
import { usePaginatedDataScrollList } from '~/view/hooks/usePaginatedDataScrollList';

import { CompaniesList } from './contact-companies-list';
import styles from './styles.scss';
import { ContactThreadModal } from './thread-modal';

const tabs: Tab[] = [
  {
    id: 1,
    label: 'Emails',
  },
  {
    id: 2,
    label: 'Send resume',
  },
  {
    id: 3,
    label: 'Notes',
  },
];

export const CompanyTab: React.FC = memo(function CompanyTab() {
  const dispatch = useDispatch();
  const [sendMessageModalVisible, setSendMessageModalVisible] = useState(false);
  const companies = useSelector((state: RootState) => state.adminContacts.companies.results);
  const { loadingCompanies } = useSelector((state: RootState) => state.adminContacts);
  const [threadModalVisible, setThreadModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const toggleThreadModalVisibility = useCallback(
    (company: ContactCompanies) => {
      dispatch(setCompanyContact(company));
      setThreadModalVisible(prevValue => !prevValue);
    },
    [dispatch],
  );

  useEffect(() => {
    if (!sendMessageModalVisible) {
      dispatch(setReceiver(null));
    }
  }, [sendMessageModalVisible, dispatch]);

  const hideThreadModal = useCallback(() => {
    setThreadModalVisible(false);
  }, []);

  const { scrollListRef } = usePaginatedDataScrollList<HTMLDivElement>({
    useWindowScroll: true,
    loadingData: loadingCompanies,
    fetchDataFn: useCallback(
      initialFetch => {
        dispatch(getContactCompanies.init({ initialFetch }));
      },
      [dispatch],
    ),
  });

  const toggleSendMessageModalVisibility = useCallback(() => {
    setSendMessageModalVisible(prevValue => !prevValue);
  }, []);

  const handleTabChange = useCallback((tabId: number) => {
    setActiveTab(tabId);
  }, []);

  useEffect(
    () => () => {
      dispatch(resetContactSearchFilters());
    },
    [dispatch],
  );

  return (
    <>
      {!loadingCompanies && !companies.length ? (
        <div ref={scrollListRef} className={styles['page__content-not-found']}>
          No companies found
        </div>
      ) : (
        <div ref={scrollListRef} className={styles['page__content-body']}>
          {companies.map((company: ContactCompanies) => (
            <CompaniesList
              key={company.id}
              toggleSendMessageModalVisibility={toggleSendMessageModalVisibility}
              company={company}
              toggleThreadModalVisibility={toggleThreadModalVisibility}
              setActiveTab={setActiveTab}
            />
          ))}
          {loadingCompanies && <Loader loading />}
        </div>
      )}
      <ContactThreadModal
        visible={threadModalVisible}
        onClose={hideThreadModal}
        tabs={tabs}
        setActiveTab={setActiveTab}
        handleTabChange={handleTabChange}
        activeTab={activeTab}
      />
      {sendMessageModalVisible && (
        <SendEmailModal
          onClose={toggleSendMessageModalVisibility}
          visible={sendMessageModalVisible}
        />
      )}
    </>
  );
});
