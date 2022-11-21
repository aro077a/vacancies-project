import React, { BaseSyntheticEvent, useCallback, useEffect } from 'react';
import { RouteComponentProps, useLocation } from 'react-router-dom';

import { Employers, EmployerStatus } from '~/models/admin';
import {
  getEmployers,
  getEmployersPendingApprovals,
  resetEmployersFilters,
  setAdminEmployersSearch,
  setSelectedEmployer,
  toggleEmployerModalVisibility,
  updateEmployerStatus,
} from '~/modules/adminEmployers/actions';
import { useDispatch, useSelector } from '~/store';
import { Icon } from '~/view/components/icon';
import { Loader } from '~/view/components/loader';
import useDebounce from '~/view/hooks/useDebounce';
import { usePaginatedDataScrollList } from '~/view/hooks/usePaginatedDataScrollList';
import { EmployerDetailsModal } from '~/view/pages/admin/employers-approval/components/modal-details';

import { EmployerCard } from './components/card';
import styles from './styles.scss';

export const EmployersApprovalPage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const { employers, loadingEmployers, searchText } = useSelector(state => state.adminEmployers);
  const employerModalVisibility = useSelector(
    state => state.adminEmployers.employerModalVisibility,
  );
  const debouncedValue = useDebounce(searchText, 200);
  const location = useLocation();
  useEffect(() => {
    dispatch(resetEmployersFilters());
  }, [location, dispatch]);

  useEffect(() => {
    dispatch(getEmployersPendingApprovals());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getEmployers.init({ initialFetch: true }));
  }, [debouncedValue]);

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

  const handleModalVisibilityToggle = useCallback(() => {
    dispatch(toggleEmployerModalVisibility());
  }, [dispatch]);

  const handleCandidateClick = useCallback(
    (candidate: Employers) => {
      dispatch(setSelectedEmployer(candidate));

      handleModalVisibilityToggle();
    },
    [dispatch, handleModalVisibilityToggle],
  );

  const handleEmployerApprove = useCallback(
    employerId => {
      dispatch(
        updateEmployerStatus.request({
          employerId,
          status: EmployerStatus.APPROVED,
        }),
      );
    },
    [dispatch],
  );

  const handleEmployerReject = useCallback(
    employerId => {
      dispatch(
        updateEmployerStatus.request({
          employerId,
          status: EmployerStatus.REJECTED,
        }),
      );
    },
    [dispatch],
  );

  const handleInputChange = (e: BaseSyntheticEvent): void => {
    dispatch(setAdminEmployersSearch(e.target.value));
  };

  return (
    <>
      <div className={styles['page']}>
        <h1 className={styles['page__title']}>Pending approval</h1>
        <div className={styles['page__search-box']}>
          <input
            onChange={handleInputChange}
            className={styles['page__search-input']}
            placeholder="Search candidates by keywords"
          />
        </div>
        <div className={styles['employers']}>
          <div className={styles['employers__search-filters']}>
            <div className={styles['employers__user-name-filter']}>
              <p>User name</p>
            </div>
            <div className={styles['employers__user-location-filter']}>
              <p>Location</p>
              <Icon name="double-arrow" className={styles['employers__filter-arrow']} />
            </div>
            <div className={styles['employers__user-status-filter']}>
              <p>Action or status</p>
              <Icon name="double-arrow" className={styles['employers__filter-arrow']} />
            </div>
          </div>
          <div ref={scrollListRef}>
            <ul className={styles['employers__list']}>
              {employers.results.map(employer => (
                <EmployerCard
                  onRejectClick={handleEmployerReject}
                  onApproveClick={handleEmployerApprove}
                  onClick={handleCandidateClick}
                  key={employer.id}
                  employer={employer}
                />
              ))}
            </ul>
          </div>
          {loadingEmployers && <Loader loading />}
        </div>
      </div>
      <EmployerDetailsModal
        visible={employerModalVisibility}
        onClose={handleModalVisibilityToggle}
        onRejectClick={handleEmployerReject}
        onApproveClick={handleEmployerApprove}
      />
    </>
  );
};
