import classNames from 'classnames';
import React, { BaseSyntheticEvent, memo, useCallback, useEffect, useMemo, useState } from 'react';

import { JobGroupPositionType, PositionType } from '~/models/common';
import {
  getCompaniesWithJobs,
  getFindJobs,
  resetFilters,
  setLocation,
  setPositionType,
  setProjectType,
  setSalary,
  setSearchValue,
  setSelectedJob,
  setSelectedJobGrop,
} from '~/modules/candidateFindJobs/actions';
import {
  citiesAsSelectOptionsSelector,
  projectTypesAsSelectOptionsSelector,
} from '~/modules/common/selectors';
import { useDispatch, useSelector } from '~/store';
import { SalaryRangeFormValues } from '~/types/formValues';
import { Icon } from '~/view/components/icon';
import { JobDropdown } from '~/view/components/job-dropdown';
import { SalaryDropdown } from '~/view/components/salary-dropdown';
import { SelectOption } from '~/view/components/select';
import useDebounce from '~/view/hooks/useDebounce';
import { useOutsideClick } from '~/view/hooks/useOutsideClick';

import { CustomSelect } from './components/custom-select';
import styles from './styles.scss';

const hideOnMobileClass = 'search-box__filters--hide';
const showOnMobileClass = 'search-box__mobile-filters--show';

const defaultLocationOption: SelectOption = {
  value: 0,
  label: 'Location',
};

const defaultProjectTypeOption: SelectOption = {
  value: 0,
  label: 'Project type',
};

const positionTypeOptions: SelectOption[] = [
  {
    value: 0,
    label: 'Position type',
  },
  {
    value: PositionType.PERMANENT,
    label: 'Permanent',
  },
  {
    value: PositionType.TEMPORARY,
    label: 'Temporary',
  },
];

export const SearchInput: React.FC<{
  toggleFilterModal: () => void;
}> = memo(function SearchInput({ toggleFilterModal }) {
  const dispatch = useDispatch();
  const citiesAsSelectOptions = useSelector(citiesAsSelectOptionsSelector);
  const projectTypesAsSelectOptions = useSelector(projectTypesAsSelectOptionsSelector);
  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  const {
    searchJobBySalaryGte,
    searchJobBySalaryLte,
    searchJobByPositionType,
    searchJobByLocationFilter,
    searchProjectByProjectType,
    searchJobByKeyWord,
    searchSelectedJobs,
    searchSelectedJobGroups,
  } = useSelector(state => state.candidateFindJobs);
  const debouncedValue = useDebounce<string>(searchJobByKeyWord, 200);
  const [jobDropdownMenuVisibility, setJobDropdownMenuVisibility] = useState<boolean>(false);
  const [jobDropdownSubMenuVisibility, setJobDropdownSubMenuVisibility] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState<number>(0);
  const groupData = useSelector(state => state.common.jobGroups);

  const toggleJobDropdownSubMenuVisibility = useCallback((e: BaseSyntheticEvent, id) => {
    e.stopPropagation();
    // eslint-disable-next-line no-prototype-builtins
    if (!e.target.hasOwnProperty('checked')) {
      setActiveMenu(id);

      setJobDropdownSubMenuVisibility(prevValue => !prevValue);
    }
  }, []);

  useEffect(() => {
    dispatch(getFindJobs.init({ initialFetch: true }));
  }, [debouncedValue, dispatch]);

  const isPermanent = searchJobByPositionType.value === PositionType.PERMANENT;

  const prefix = isPermanent ? '/year' : '/hour';

  const citiesOptions = useMemo(() => {
    const newArr = citiesAsSelectOptions.slice();
    newArr.unshift({ value: 0, label: 'Location' });
    return newArr;
  }, [citiesAsSelectOptions]);

  const projectTypesOptions = useMemo(() => {
    const newArr = projectTypesAsSelectOptions.slice();
    newArr.unshift(defaultProjectTypeOption);
    return newArr;
  }, [projectTypesAsSelectOptions]);

  const salary =
    searchJobBySalaryGte && searchJobBySalaryLte
      ? `${searchJobBySalaryGte} - ${searchJobBySalaryLte}${
          searchJobByPositionType.value ? prefix : ''
        }`
      : '';

  const toggleDropdownVisibility = useCallback(() => {
    setDropdownVisibility(prevValue => !prevValue);
  }, []);

  const onLocationChangeHandler = useCallback(
    (option: SelectOption) => {
      dispatch(setLocation(option));
      dispatch(getFindJobs.init({ initialFetch: true }));
    },
    [dispatch],
  );

  const onProjectTypeChangeHandler = useCallback(
    (option: SelectOption) => {
      dispatch(setProjectType(option));
      dispatch(getFindJobs.init({ initialFetch: true }));
    },
    [dispatch],
  );

  const onPositionTypeChangeHandler = useCallback(
    (option: SelectOption) => {
      dispatch(setPositionType(option));
      dispatch(getFindJobs.init({ initialFetch: true }));
    },
    [dispatch],
  );

  const inputChangeHandler = (e: BaseSyntheticEvent): void => {
    dispatch(setSearchValue(e.target.value));
  };

  const setSalaryHandler = useCallback(
    (values: SalaryRangeFormValues) => {
      dispatch(setSalary({ salaryGte: values.salaryGte, salaryLte: values.salaryLte }));
      setDropdownVisibility(false);
      dispatch(getFindJobs.init({ initialFetch: true }));
    },
    [dispatch],
  );

  const toggleJobMenuDropdownVisibility = useCallback(() => {
    setJobDropdownMenuVisibility(prevValue => !prevValue);
  }, []);

  const wrapperRef = useOutsideClick<HTMLDivElement>({
    handler: useCallback(() => {
      if (dropdownVisibility) {
        setDropdownVisibility(false);
      }
    }, [dropdownVisibility]),
  });

  const handleSelect = useCallback(
    (id: number) => {
      const currentId = searchSelectedJobs.find(x => x === id);
      if (currentId) {
        const filteredArr = searchSelectedJobs.filter(x => x !== id);
        dispatch(setSelectedJob(filteredArr));
      } else {
        dispatch(setSelectedJob([...searchSelectedJobs, id]));
      }
    },
    [searchSelectedJobs, dispatch],
  );

  const handleJobGroupSelect = useCallback(
    (id: number) => {
      const currentId = searchSelectedJobGroups.find(x => x === id);
      if (currentId) {
        const filteredArr = searchSelectedJobGroups.filter(x => x !== id);
        dispatch(setSelectedJobGrop(filteredArr));
      } else {
        dispatch(setSelectedJobGrop([...searchSelectedJobGroups, id]));
      }
    },
    [dispatch, searchSelectedJobGroups],
  );

  const handleSelectGroup = useCallback(
    (e: BaseSyntheticEvent, id: number, items: JobGroupPositionType[]) => {
      e.stopPropagation();

      const newArr: number[] = items.map(item => item.id);

      handleJobGroupSelect(id);

      if (e.target.checked) {
        dispatch(setSelectedJob([...searchSelectedJobs, ...newArr]));
      } else {
        const filteredArr = searchSelectedJobs.filter(id => !newArr.includes(id));

        dispatch(setSelectedJob(filteredArr));
      }
    },
    [dispatch, searchSelectedJobs, handleJobGroupSelect],
  );

  const handleClearSelected = useCallback(() => {
    dispatch(setSelectedJob([]));
    dispatch(setSelectedJobGrop([]));
    dispatch(getFindJobs.init({ initialFetch: true }));
  }, [dispatch]);

  const handleSearch = useCallback(() => {
    dispatch(getFindJobs.init({ initialFetch: true }));
  }, [dispatch]);

  const handleClear = (): void => {
    dispatch(resetFilters());
    dispatch(getFindJobs.init({ initialFetch: true }));
    dispatch(getCompaniesWithJobs.init({ initialFetch: true }));
  };

  const dropdownRef = useOutsideClick<HTMLDivElement>({
    handler: useCallback(() => {
      if (jobDropdownMenuVisibility) {
        setJobDropdownMenuVisibility(false);
      }
    }, [jobDropdownMenuVisibility]),
  });

  const handleClick = useCallback((e: BaseSyntheticEvent) => {
    e.stopPropagation();
  }, []);

  useEffect(() => {
    return () => {
      dispatch(resetFilters());
    };
  }, [dispatch]);

  return (
    <div className={styles['search-box']}>
      <div className={styles['search-box__row']}>
        <input
          onChange={inputChangeHandler}
          className={styles['search-box__input']}
          placeholder="Search jobs by keywords"
          autoComplete="on"
          value={searchJobByKeyWord}
        />
        <div
          className={classNames(styles['search-box__mobile-filters'], styles[showOnMobileClass])}
        >
          <button onClick={toggleFilterModal} className={styles['search-box__mobile-filters-btn']}>
            <Icon className={styles['filter-icon']} name="filter" />
          </button>
        </div>
      </div>
      <div className={classNames(styles['search-box__row'], styles[hideOnMobileClass])}>
        <div className={styles['search-box__filters']}>
          <div className={styles['search-box__filter']}>
            <CustomSelect
              onChange={onLocationChangeHandler}
              selectOptions={citiesOptions}
              icon="location"
              defaultValue={defaultLocationOption}
              value={searchJobByLocationFilter}
            />
          </div>
          {/* <div className={styles['search-box__filter']}>
            <CustomSelect
              onChange={onJobPositionChangeHandler}
              selectOptions={jobTypesOptions}
              icon="job-type"
              defaultValue={defaultJobTypeOption}
              value={searchJobByJobType}
            />
          </div> */}
          <div
            ref={dropdownRef}
            className={styles['search-box__group-dropdown']}
            onClick={toggleJobMenuDropdownVisibility}
          >
            <Icon name="job-type" className={styles['search-box__group-dropdown--icon']} />
            <p>
              {searchSelectedJobs.length > 0
                ? `Job positions: ${searchSelectedJobs.length}`
                : 'Job type'}
            </p>
            <Icon
              name="chevron-down"
              className={styles['search-box__group-dropdown--icon-right']}
            />
            <JobDropdown
              handleSelectGroup={handleSelectGroup}
              isJob
              handleClick={handleClick}
              handleSearch={handleSearch}
              handleClear={handleClearSelected}
              handleSelect={handleSelect}
              isMenuOpen={jobDropdownMenuVisibility}
              isSubMenuOpen={jobDropdownSubMenuVisibility}
              openSubMenu={toggleJobDropdownSubMenuVisibility}
              groupData={groupData}
              activeMenu={activeMenu}
              className={styles['dropdown']}
              selectedJobPositions={searchSelectedJobs}
              selectedJobGrous={searchSelectedJobGroups}
            />
          </div>
          <div className={styles['search-box__filter']}>
            <CustomSelect
              onChange={onProjectTypeChangeHandler}
              selectOptions={projectTypesOptions}
              icon="job-type"
              defaultValue={defaultProjectTypeOption}
              value={searchProjectByProjectType}
            />
          </div>
          <div className={styles['search-box__filter']}>
            <CustomSelect
              onChange={onPositionTypeChangeHandler}
              selectOptions={positionTypeOptions}
              icon="bag"
              defaultValue={positionTypeOptions[0]}
              value={searchJobByPositionType}
            />
          </div>
          <div
            ref={wrapperRef}
            onClick={toggleDropdownVisibility}
            className={styles['search-box__salary-label']}
          >
            <Icon className={styles['search-box__salary-icon']} name="pocket" />
            <p className={styles['search-box__salary']}>{salary || 'Salary'}</p>
            <Icon
              className={classNames(styles['search-box__arrow-down'], {
                [styles['search-box__arrow-up']]: dropdownVisibility,
              })}
              name="chevron-right"
            />
            <SalaryDropdown
              className={styles['search-box__dropdown']}
              visible={dropdownVisibility}
              setSalary={setSalaryHandler}
              withAmount
            />
          </div>
          <button onClick={handleClear}>Clear</button>
        </div>
      </div>
    </div>
  );
});
