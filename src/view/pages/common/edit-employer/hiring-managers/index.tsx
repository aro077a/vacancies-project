import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { CompanyHiringManger } from '~/models/company';
import { getHiringManagers, setHiringManagerEditMode } from '~/modules/createEmployer/actions';
import { useDispatch } from '~/store';
import { RootState } from '~/store/types';
import { Loader } from '~/view/components/loader';
import { usePaginatedDataScrollList } from '~/view/hooks/usePaginatedDataScrollList';

import { AddManagerModal } from './add-manager-modal';
import { ManagerCard } from './manager-card';
import styles from './styles.scss';

export const EditHiringManagersPage: React.FC = () => {
  const [addManagerModalVisible, setAddManagerModalVisible] = useState(false);
  const { companyManagers, loadingHiringManagers } = useSelector(
    (state: RootState) => state.createEmployer,
  );
  const dispatch = useDispatch();
  const { scrollListRef } = usePaginatedDataScrollList<HTMLDivElement>({
    useWindowScroll: true,
    loadingData: loadingHiringManagers,
    fetchDataFn: useCallback(
      initialFetch => {
        dispatch(getHiringManagers.init({ initialFetch }));
      },
      [dispatch],
    ),
  });

  const toggleOpenAddManagerModalVisibility = useCallback(() => {
    setAddManagerModalVisible(true);
  }, []);

  const toggleCloseAddManagerModalVisibility = useCallback(() => {
    setAddManagerModalVisible(false);
    dispatch(setHiringManagerEditMode({ editMode: false }));
  }, [dispatch]);

  return (
    <div className={styles['page']}>
      <div className={styles['page__header-wrapper']}>
        <h1 className={styles['page__title']}>Hiring managers</h1>
      </div>
      <p className={styles['page__header-info']}>
        Great work connecting with our clients, who else can we link with?
      </p>
      <div className={styles['page__add-manager']} onClick={toggleOpenAddManagerModalVisibility}>
        <p className={styles['page__add-manager-text']}> + Add Hiring Manager</p>
      </div>
      {!loadingHiringManagers && !companyManagers.results.length ? (
        <div ref={scrollListRef} className={styles['page__manager-not-found']}>
          No hiring managers found
        </div>
      ) : (
        <div ref={scrollListRef} className={styles['page__managers']}>
          {companyManagers.results.map((managers: CompanyHiringManger) => (
            <ManagerCard
              key={managers.id}
              managers={managers}
              companyManagers={companyManagers}
              toggleOpenAddManagerModalVisibility={toggleOpenAddManagerModalVisibility}
            />
          ))}
          {loadingHiringManagers && <Loader loading />}
        </div>
      )}
      <AddManagerModal
        visible={addManagerModalVisible}
        onClose={toggleCloseAddManagerModalVisibility}
      />
    </div>
  );
};
