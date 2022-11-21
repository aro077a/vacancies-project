import React, { BaseSyntheticEvent, useCallback, useEffect, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';

import { getEmployers, setAdminEmployersSearch } from '~/modules/adminEmployers/actions';
import { useDispatch, useSelector } from '~/store';
import { CommonRouter } from '~/utils/router';
import { Button } from '~/view/components/button';
import { SearchInput } from '~/view/components/search-input';
import useDebounce from '~/view/hooks/useDebounce';
import { EmployersList } from '~/view/pages/admin/employers/components/employers-list';

import { EmployerModal } from './components/employer-modal';
import styles from './styles.scss';

export const EmployersPage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { searchText, employers } = useSelector(state => state.adminEmployers);
  const [isEmployerModalVisible, setIsEmployerModalVisible] = useState(false);
  const debouncedValue = useDebounce(searchText, 200);

  useEffect(() => {
    dispatch(getEmployers.init({ initialFetch: true }));
  }, [debouncedValue]);

  const addEmployerHandle = useCallback(() => {
    history.push(CommonRouter.createEmployer.createEmployerCompanyInfo);
  }, [history]);

  const toggleEmployerModalVisibility = useCallback(() => {
    setIsEmployerModalVisible(prevValue => !prevValue);
  }, []);

  return (
    <div className={styles['page']}>
      <div className={styles['page__title-wrapper']}>
        <h1 className={styles['page__title']}>Employers</h1>
        <Button onClick={addEmployerHandle} variant="accent" title="+ Add employer" />
      </div>
      <SearchInput
        hideIcon
        placeholder="Search employer by keywords"
        className={styles['page__input']}
        value={searchText}
        onChange={(e: BaseSyntheticEvent) => dispatch(setAdminEmployersSearch(e.target.value))}
      />
      <p className={styles['page__results-count']}>{employers.count} results found</p>
      <EmployersList
        onEmployerClick={toggleEmployerModalVisibility}
        employers={employers.results}
      />
      <EmployerModal visible={isEmployerModalVisible} onClose={toggleEmployerModalVisibility} />
    </div>
  );
};
