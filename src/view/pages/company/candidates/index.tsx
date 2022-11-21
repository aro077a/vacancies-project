import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { getCompanyCandidates, resetFilters } from '~/modules/companyCandidates/actions';
import { getCompanyJobs } from '~/modules/companyJobs/actions';
import { useDispatch, useSelector } from '~/store';
import { CandidateCard } from '~/view/components/candidate-card';
import { CompanyCandidateModal } from '~/view/components/company-candidate-modal';
import { Loader } from '~/view/components/loader';
import { Pagination } from '~/view/components/pagination';

import { FilterModal } from './components/filters-modal';
import { SearchInput } from './components/search-input';
import styles from './styles.scss';

export const AllCandidatesPage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const [isCandidateModalVisible, setIsCandidateModalVisible] = useState(false);
  const { candidates, loadingCandidates } = useSelector(state => state.companyCandidates);
  const [currentPage, setCurrentPage] = useState<number | string>(1);
  const [filterModalVisibility, setFilterModalVisibility] = useState(false);

  const currentPageSetHandler = useCallback((page: string | number) => {
    setCurrentPage(page);
  }, []);

  useEffect(() => {
    dispatch(getCompanyCandidates.request(currentPage));
    dispatch(getCompanyJobs.request());

    return () => {
      dispatch(resetFilters());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(getCompanyCandidates.request(currentPage));
  }, [currentPage, dispatch]);

  const toggleFilterModalVisibility = useCallback(() => {
    setFilterModalVisibility(prevValue => !prevValue);
  }, []);

  const toggleCandidateModalVisibility = useCallback(() => {
    setIsCandidateModalVisible(prevValue => !prevValue);
  }, []);

  const companyCandidates = useMemo(() => {
    return candidates.results.map(candidate => (
      <CandidateCard
        onClick={toggleCandidateModalVisibility}
        key={candidate.id}
        candidate={candidate}
        isShortListPage={false}
      />
    ));
  }, [candidates, toggleCandidateModalVisibility]);
  return (
    <div className={styles['page']}>
      <div className={styles['page__title-wrapper']}>
        <h1 className={styles['page__title']}>Candidates</h1>
      </div>
      <SearchInput toggleFilterModal={toggleFilterModalVisibility} />
      {loadingCandidates ? (
        <Loader loading />
      ) : (
        <div className={styles['page__job-list']}>{companyCandidates}</div>
      )}
      {!loadingCandidates && candidates.results.length > 0 && (
        <Pagination
          itemsPerPage={8}
          setCurrentPage={currentPageSetHandler}
          itemsCount={candidates.count}
          currentPage={currentPage}
        />
      )}
      <CompanyCandidateModal
        visible={isCandidateModalVisible}
        onClose={toggleCandidateModalVisibility}
      />
      <FilterModal onClose={toggleFilterModalVisibility} visible={filterModalVisibility} />
    </div>
  );
};
