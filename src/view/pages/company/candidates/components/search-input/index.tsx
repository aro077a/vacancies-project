import classNames from 'classnames';
import React, {
  BaseSyntheticEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { JobGroupPositionType } from '~/models/common';
import {
  citiesAsSelectOptionsSelector,
  projectTypesAsSelectOptionsSelector,
  statesAsSelectOptionsSelector,
} from '~/modules/common/selectors';
import {
  getCompanyCandidates,
  resetFilters,
  setAvailability,
  setCity,
  setProjectType,
  setProjectValue,
  setRegion,
  setSalary,
  setSearchValue,
  setSelectedJob,
  setSelectedJobGrop,
} from '~/modules/companyCandidates/actions';
import { useDispatch, useSelector } from '~/store';
import { SalaryRangeFormValues } from '~/types/formValues';
import { availabilityOptions, projectValueOptions } from '~/utils/staticData';
import { CustomAvailabilitySelect } from '~/view/components/custom-availability-select';
import { Icon } from '~/view/components/icon';
import { JobDropdown } from '~/view/components/job-dropdown';
import { SalaryDropdown } from '~/view/components/salary-dropdown';
import { SelectOption } from '~/view/components/select';
import useDebounce from '~/view/hooks/useDebounce';
import { useOutsideClick } from '~/view/hooks/useOutsideClick';

import { CustomSelect } from './components/custom-select';
import styles from './styles.scss';

const defaultRegionOption: SelectOption = {
  value: 0,
  label: 'Region',
};

const defaultCityOption: SelectOption = {
  value: 0,
  label: 'City',
};

const defaultProjectTypeOption: SelectOption = {
  value: 0,
  label: 'Project type',
};

const defaultProjectValueOption: SelectOption = {
  value: 0,
  label: 'Project value',
};

type Props = {
  toggleFilterModal: () => void;
};

export const SearchInput: React.FC<Props> = memo(function SearchInput({ toggleFilterModal }) {
  const dispatch = useDispatch();
  const projectTypesAsSelectOptions = useSelector(projectTypesAsSelectOptionsSelector);
  const citiesAsSelectOptions = useSelector(citiesAsSelectOptionsSelector);
  const statesAsSelectOptions = useSelector(statesAsSelectOptionsSelector);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  const {
    searchCandidateSalaryGte,
    searchCandidateSalaryLte,
    searchCandidateKeyWord,
    searchCandidateRegionFilter,
    searchCandidateCityFilter,
    searchCandidateByProjectType,
    searchCandidateByProjectValue,
    searchSelectedJobs,
    searchSelectedJobGroups,
  } = useSelector(state => state.companyCandidates);
  const [activeMenu, setActiveMenu] = useState<number>(0);
  const debouncedValue = useDebounce<string>(searchCandidateKeyWord);
  const [jobDropdownMenuVisibility, setJobDropdownMenuVisibility] = useState<boolean>(false);
  const [jobDropdownSubMenuVisibility, setJobDropdownSubMenuVisibility] = useState<boolean>(false);
  const groupData = useSelector(state => state.common.jobGroups);

  useEffect(() => {
    if (searchCandidateKeyWord !== '') {
      dispatch(getCompanyCandidates.request(1));
    }
  }, [dispatch, debouncedValue]);

  const citiesOptions = useMemo(() => {
    const newArr = citiesAsSelectOptions.slice();
    newArr.unshift({ value: 0, label: 'City' });
    return newArr;
  }, [citiesAsSelectOptions]);

  const regionsOptions = useMemo(() => {
    const newArr = statesAsSelectOptions.slice();
    newArr.unshift({ value: 0, label: 'Region' });
    return newArr;
  }, [statesAsSelectOptions]);

  const projectTypesOptions = useMemo(() => {
    const newArr = projectTypesAsSelectOptions.slice();
    newArr.unshift({ value: 0, label: 'Project type' });
    return newArr;
  }, [projectTypesAsSelectOptions]);

  const salary =
    searchCandidateSalaryGte && searchCandidateSalaryLte
      ? `${searchCandidateSalaryGte} - ${searchCandidateSalaryLte}`
      : '';

  const projectValuesOptions = useMemo(() => {
    const newArr = projectValueOptions.slice();
    newArr.unshift(defaultProjectValueOption);
    return newArr;
  }, []);

  const toggleDropdownVisibility = useCallback(() => {
    setDropdownVisibility(prevValue => !prevValue);
  }, []);

  const onRegionChangeHandler = useCallback(
    (option: SelectOption) => {
      dispatch(setRegion(option));
      dispatch(getCompanyCandidates.request(1));
    },
    [dispatch],
  );

  const onCityChangeHandler = useCallback(
    (option: SelectOption) => {
      dispatch(setCity(option));
      dispatch(getCompanyCandidates.request(1));
    },
    [dispatch],
  );

  const onProjectTypeChangeHandler = useCallback(
    (option: SelectOption) => {
      dispatch(setProjectType(option));
      dispatch(getCompanyCandidates.request(1));
    },
    [dispatch],
  );

  const inputChangeHandler = (e: BaseSyntheticEvent): void => {
    if (e.target.value !== '') {
      dispatch(setSearchValue(e.target.value));
    }
  };

  const onAvailabilityChangeHandler = useCallback(
    (option: SelectOption[]) => {
      dispatch(setAvailability(option));
      dispatch(getCompanyCandidates.request(1));
    },
    [dispatch],
  );

  const setSalaryHandler = useCallback(
    (values: SalaryRangeFormValues) => {
      dispatch(setSalary({ salaryGte: values.salaryGte, salaryLte: values.salaryLte }));
      setDropdownVisibility(false);
      dispatch(getCompanyCandidates.request(1));
    },
    [dispatch],
  );

  const onProjectValueChangeHandler = useCallback(
    (option: SelectOption) => {
      dispatch(setProjectValue(option));
      dispatch(getCompanyCandidates.request(1));
    },
    [dispatch],
  );

  const handleClear = (): void => {
    inputRef!.current!.value = '';
    dispatch(resetFilters());
    dispatch(getCompanyCandidates.request(1));
  };

  const wrapperRef = useOutsideClick<HTMLDivElement>({
    handler: useCallback(() => {
      if (dropdownVisibility) {
        setDropdownVisibility(false);
      }
    }, [dropdownVisibility]),
  });

  const toggleJobMenuDropdownVisibility = useCallback(() => {
    setJobDropdownMenuVisibility(prevValue => !prevValue);
  }, []);

  const hideOnMobileClass = 'search-box__row--hide';

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
    dispatch(getCompanyCandidates.request(1));
  }, [dispatch]);

  const handleSearch = useCallback(() => {
    dispatch(getCompanyCandidates.request(1));
  }, [dispatch]);

  const toggleJobDropdownSubMenuVisibility = useCallback((e: BaseSyntheticEvent, id) => {
    e.stopPropagation();
    // eslint-disable-next-line no-prototype-builtins
    if (!e.target.hasOwnProperty('checked')) {
      setActiveMenu(id);

      setJobDropdownSubMenuVisibility(prevValue => !prevValue);
    }
  }, []);

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
          ref={inputRef}
          onChange={inputChangeHandler}
          className={styles['search-box__input']}
          placeholder="Search candidates by keywords"
          autoComplete="on"
        />
        <button onClick={toggleFilterModal} className={styles['search-box__mobile-filters-btn']}>
          <Icon className={styles['filter-icon']} name="filter" />
        </button>
      </div>
      <div className={classNames(styles['search-box__row'], styles[hideOnMobileClass])}>
        <div className={styles['search-box__filters']}>
          {/* <div className={styles['search-box__location-filter']}>
            <CustomSelect
              onChange={onJobTitleChangeHandler}
              selectOptions={jobTypesOptions}
              icon="job-type"
              defaultValue={defaultJobTypeOption}
              value={searchCandidateJobType}
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

            {/* <CustomSelect
              onChange={onJobPositionChangeHandler}
              selectOptions={jobTypesOptions}
              icon="job-type"
              defaultValue={defaultJobTypeOption}
              value={searchLiveJobsJobType}
            /> */}
            <JobDropdown
              handleSelectGroup={handleSelectGroup}
              isJob={false}
              handleClick={handleClick}
              className={styles['dropdown']}
              handleSearch={handleSearch}
              handleClear={handleClearSelected}
              handleSelect={handleSelect}
              isMenuOpen={jobDropdownMenuVisibility}
              isSubMenuOpen={jobDropdownSubMenuVisibility}
              openSubMenu={toggleJobDropdownSubMenuVisibility}
              groupData={groupData}
              activeMenu={activeMenu}
              selectedJobPositions={searchSelectedJobs}
              selectedJobGrous={searchSelectedJobGroups}
            />
          </div>
          <div className={styles['search-box__job-filter']}>
            <CustomSelect
              onChange={onRegionChangeHandler}
              selectOptions={regionsOptions}
              icon="location"
              defaultValue={defaultRegionOption}
              value={searchCandidateRegionFilter}
            />
          </div>
          <div className={styles['search-box__job-filter']}>
            <CustomSelect
              onChange={onCityChangeHandler}
              selectOptions={citiesOptions}
              icon="location"
              defaultValue={defaultCityOption}
              value={searchCandidateCityFilter}
            />
          </div>
          <div className={styles['search-box__job-filter']}>
            <CustomSelect
              onChange={onProjectTypeChangeHandler}
              selectOptions={projectTypesOptions}
              icon="job-type"
              defaultValue={defaultProjectTypeOption}
              value={searchCandidateByProjectType}
            />
          </div>
          <div className={styles['search-box__job-filter']}>
            <CustomSelect
              value={searchCandidateByProjectValue}
              onChange={onProjectValueChangeHandler}
              selectOptions={projectValuesOptions}
              icon="job-type"
              defaultValue={defaultProjectValueOption}
            />
          </div>
          <div
            ref={wrapperRef}
            onClick={toggleDropdownVisibility}
            className={classNames(
              styles['search-box__salary-label'],
              styles['search-box__job-filter'],
            )}
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
              withAmount={false}
              className={styles['search-box__dropdown']}
              visible={dropdownVisibility}
              setSalary={setSalaryHandler}
            />
          </div>
          <div className={styles['search-box__job-filter']}>
            <CustomAvailabilitySelect
              onChange={onAvailabilityChangeHandler}
              options={availabilityOptions}
              icon="calendar"
            />
          </div>
          <button onClick={handleClear} className={styles['search-box__clear-btn']}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
});
