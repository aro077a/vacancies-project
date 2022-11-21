import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { CompanyHiringManger } from '~/models/company';
import { getHiringManagers, setHiringManagerEditMode } from '~/modules/createEmployer/actions';
import { useDispatch } from '~/store';
import { RootState } from '~/store/types';
import { CommonRouter } from '~/utils/router';
import { Button } from '~/view/components/button';
import { Loader } from '~/view/components/loader';
import { usePaginatedDataScrollList } from '~/view/hooks/usePaginatedDataScrollList';

import { AddManagerModal } from './add-manager-modal';
import { ManagerCard } from './manager-card';
import styles from './styles.scss';

export const CreateHiringManagerPage: React.FC = () => {
  const [addManagerModalVisible, setAddManagerModalVisible] = useState(false);
  const [isManagerEmptyError, setIsManagerEmptyError] = useState<boolean>(false);
  const { companyManagers, loadingHiringManagers } = useSelector(
    (state: RootState) => state.createEmployer,
  );
  const dispatch = useDispatch();
  const history = useHistory();
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

  const onSubmit = useCallback(() => {
    if (companyManagers.results.length) {
      setIsManagerEmptyError(false);
      history.push(CommonRouter.createEmployer.createCompanyLogo);
    } else {
      setIsManagerEmptyError(!isManagerEmptyError);
    }
  }, [history, companyManagers.results.length, isManagerEmptyError]);

  useEffect(() => {
    if (companyManagers.results.length) {
      setIsManagerEmptyError(false);
    }
  }, [companyManagers.results.length]);

  return (
    <div className={styles['page']}>
      <div className={styles['page__header-wrapper']}>
        <h1 className={styles['page__title']}>Hiring managers</h1>
        <p className={styles['page__order-number']}>
          2 <span>/3</span>
        </p>
      </div>
      <p className={styles['page__header-info']}>
        Great work connecting with our clients, who else can we link with?
      </p>
      <div className={styles['page__add-manager']} onClick={toggleOpenAddManagerModalVisibility}>
        <p className={styles['page__add-manager-text']}> + Add Hiring Manager</p>
      </div>
      {isManagerEmptyError && (
        <p className={styles['page__add-manager-error']}>
          You need to create at least one hiring manager
        </p>
      )}
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
      <div className={styles['page__footer-buttons']}>
        <Button
          title="Next"
          variant="primary"
          className={styles['page__form-footer-button']}
          onClick={onSubmit}
        />
      </div>
      <AddManagerModal
        visible={addManagerModalVisible}
        onClose={toggleCloseAddManagerModalVisibility}
      />
    </div>
  );
};
