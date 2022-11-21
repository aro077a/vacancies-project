import React, { memo, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { Employers } from '~/models/admin';
import {
  getEmployers,
  resetEmployersFilters,
  setSelectedEmployer,
} from '~/modules/adminEmployers/actions';
import { useDispatch, useSelector } from '~/store';
import { Loader } from '~/view/components/loader';
import { usePaginatedDataScrollList } from '~/view/hooks/usePaginatedDataScrollList';
import { EmployerCard } from '~/view/pages/admin/employers/components/employer-card';

import styles from './styles.scss';

type Props = {
  onEmployerClick: () => void;
  employers: Employers[];
};

export const EmployersList: React.FC<Props> = memo(function EmployersList({
  onEmployerClick,
  employers,
}) {
  const dispatch = useDispatch();
  const { loadingEmployers } = useSelector(state => state.adminEmployers);
  const location = useLocation();

  useEffect(() => {
    dispatch(resetEmployersFilters());
  }, [dispatch, location]);

  const { scrollListRef } = usePaginatedDataScrollList<HTMLDivElement>({
    useWindowScroll: true,
    loadingData: loadingEmployers,
    fetchDataFn: useCallback(
      initialFetch => {
        dispatch(getEmployers.init({ initialFetch }));
      },
      [dispatch],
    ),
  });

  const handleEmployerClick = useCallback(
    (employer: Employers) => {
      dispatch(setSelectedEmployer(employer));

      onEmployerClick();
    },
    [dispatch, onEmployerClick],
  );

  return (
    <div ref={scrollListRef} className={styles['employers-list']}>
      {!loadingEmployers && !employers.length && (
        <div ref={scrollListRef} className={styles['employers-not-found']}>
          No employers found
        </div>
      )}
      {employers.map((employer: Employers) => (
        <EmployerCard
          employer={employer}
          key={employer.id}
          onClick={() => handleEmployerClick(employer)}
        />
      ))}
      {loadingEmployers && <Loader loading />}
    </div>
  );
});
