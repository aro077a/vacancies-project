import classNames from 'classnames';
import React, { BaseSyntheticEvent, memo, useCallback, useEffect, useMemo, useState } from 'react';

import { LookingJobStatus } from '~/models/candidate';
import { JobGroupPositionType, PermissionType } from '~/models/common';
import {
  getCandidates,
  resetCandidateFilters,
  setAvailability,
  setCandidateStatus,
  setCity,
  setPermissionType,
  setProjectType,
  setProjectValue,
  setRegion,
  setSalary,
  setSearchValue,
  setSelectedJob,
  setSelectedJobGrop,
} from '~/modules/adminCandidates/actions';
import {
  citiesAsSelectOptionsSelector,
  projectTypesAsSelectOptionsSelector,
  statesAsSelectOptionsSelector,
} from '~/modules/common/selectors';
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

const lookingForJobStatus: SelectOption[] = [
  {
    value: 0,
    label: 'Looking for job status',
  },
  {
    value: LookingJobStatus.ACTIVE,
    label: 'Active',
  },
  {
    value: LookingJobStatus.PASSIVE,
    label: 'Passive',
  },
  {
    value: LookingJobStatus.NOT_LOOKING,
    label: 'Not looking',
  },
];

const permissionTypeOptions: SelectOption[] = [
  {
    value: 0,
    label: 'Position type',
  },
  {
    value: PermissionType.Permanent,
    label: 'Permanent',
  },
  {
    value: PermissionType.Temporary,
    label: 'Temporary',
  },
  {
    value: PermissionType.Both,
    label: 'Both',
  },
];

export const SearchInput: React.FC = memo(function SearchInput() {
  const dispatch = useDispatch();
  const citiesAsSelectOptions = useSelector(citiesAsSelectOptionsSelector);
  const statesAsSelectOptions = useSelector(statesAsSelectOptionsSelector);
  const projectTypesAsSelectOptions = useSelector(projectTypesAsSelectOptionsSelector);
  const [activeMenu, setActiveMenu] = useState<number>(0);
  const [jobDropdownSubMenuVisibility, setJobDropdownSubMenuVisibility] = useState<boolean>(false);
  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  const {
    searchCandidateSalaryGte,
    searchCandidateSalaryLte,
    searchCandidateKeyWord,
    searchCandidateCityFilter,
    searchCandidateRegionFilter,
    searchCandidateByProjectType,
    searchCandidateByProjectValue,
    searchCandidateByPermission,
    searchCandidateByStatus,
    searchSelectedJobs,
    searchSelectedJobGroups,
  } = useSelector(state => state.adminCandidates);
  const groupData = useSelector(state => state.common.jobGroups);
  const debouncedValue = useDebounce<string>(searchCandidateKeyWord, 200);
  const [jobDropdownMenuVisibility, setJobDropdownMenuVisibility] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getCandidates.init({ initialFetch: true, status: 2 }));
  }, [debouncedValue, dispatch]);

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

  const salary =
    searchCandidateSalaryGte && searchCandidateSalaryLte
      ? `${searchCandidateSalaryGte} - ${searchCandidateSalaryLte}`
      : '';

  const projectTypesOptions = useMemo(() => {
    const newArr = projectTypesAsSelectOptions.slice();
    newArr.unshift(defaultProjectTypeOption);
    return newArr;
  }, [projectTypesAsSelectOptions]);

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
      dispatch(getCandidates.init({ initialFetch: true, status: 2 }));
    },
    [dispatch],
  );

  const onCityChangeHandler = useCallback(
    (option: SelectOption) => {
      dispatch(setCity(option));
      dispatch(getCandidates.init({ initialFetch: true, status: 2 }));
    },
    [dispatch],
  );

  const onPermissionTypeChangeHandler = useCallback(
    (option: SelectOption) => {
      dispatch(setPermissionType(option));
      dispatch(getCandidates.init({ initialFetch: true, status: 2 }));
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
      dispatch(getCandidates.init({ initialFetch: true, status: 2 }));
    },
    [dispatch],
  );

  const onProjectTypeChangeHandler = useCallback(
    (option: SelectOption) => {
      dispatch(setProjectType(option));
      dispatch(getCandidates.init({ initialFetch: true, status: 2 }));
    },
    [dispatch],
  );

  const onProjectValueChangeHandler = useCallback(
    (option: SelectOption) => {
      dispatch(setProjectValue(option));
      dispatch(getCandidates.init({ initialFetch: true, status: 2 }));
    },
    [dispatch],
  );

  const onAvailabilityChangeHandler = useCallback(
    (option: SelectOption[]) => {
      dispatch(setAvailability(option));
      dispatch(getCandidates.init({ initialFetch: true, status: 2 }));
    },
    [dispatch],
  );

  const onLookingJobStatusChange = useCallback(
    (option: SelectOption) => {
      dispatch(setCandidateStatus(option));
      dispatch(getCandidates.init({ initialFetch: true, status: 2 }));
    },
    [dispatch],
  );

  const wrapperRef = useOutsideClick<HTMLDivElement>({
    handler: useCallback(() => {
      if (dropdownVisibility) {
        setDropdownVisibility(false);
      }
    }, [dropdownVisibility]),
  });

  const handleClear = (): void => {
    dispatch(resetCandidateFilters());
    dispatch(getCandidates.init({ initialFetch: true, status: 2 }));
  };

  const toggleJobMenuDropdownVisibility = useCallback(() => {
    setJobDropdownMenuVisibility(prevValue => !prevValue);
  }, []);

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

  const toggleJobDropdownSubMenuVisibility = useCallback((e: BaseSyntheticEvent, id) => {
    e.stopPropagation();
    // eslint-disable-next-line no-prototype-builtins
    if (!e.target.hasOwnProperty('checked')) {
      setActiveMenu(id);

      setJobDropdownSubMenuVisibility(prevValue => !prevValue);
    }
  }, []);

  const hideOnMobileClass = 'search-box__filters--hide';

  const handleClearSelected = useCallback(() => {
    dispatch(setSelectedJob([]));
    dispatch(setSelectedJobGrop([]));
    dispatch(getCandidates.init({ initialFetch: true, status: 2 }));
  }, [dispatch]);

  const handleSearch = useCallback(() => {
    dispatch(getCandidates.init({ initialFetch: true, status: 2 }));
  }, [dispatch]);

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
      dispatch(resetCandidateFilters());
    };
  }, [dispatch]);

  return (
    <div className={styles['search-box']}>
      <div className={styles['search-box__row']}>
        <input
          onChange={inputChangeHandler}
          className={styles['search-box__input']}
          placeholder="Search candidates by keywords"
          autoComplete="on"
        />
      </div>
      <div className={styles['search-box__row']}>
        <div className={classNames(styles['search-box__filters'], styles[hideOnMobileClass])}>
          {/* <div className={styles['search-box__filter']}>
            <CustomSelect
              value={searchCandidateJobType}
              onChange={onJobPositionChangeHandler}
              selectOptions={jobTypesOptions}
              icon="job-type"
              defaultValue={defaultJobTypeOption}
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
          <div className={styles['search-box__filter']}>
            <CustomSelect
              value={searchCandidateByPermission}
              onChange={onPermissionTypeChangeHandler}
              selectOptions={permissionTypeOptions}
              icon="user"
              defaultValue={permissionTypeOptions[0]}
            />
          </div>
          <div className={styles['search-box__filter']}>
            <CustomSelect
              value={searchCandidateRegionFilter}
              onChange={onRegionChangeHandler}
              selectOptions={regionsOptions}
              icon="location"
              defaultValue={defaultRegionOption}
            />
          </div>
          <div className={styles['search-box__filter']}>
            <CustomSelect
              value={searchCandidateCityFilter}
              onChange={onCityChangeHandler}
              selectOptions={citiesOptions}
              icon="location"
              defaultValue={defaultCityOption}
            />
          </div>
          <div className={styles['search-box__filter']}>
            <CustomSelect
              value={searchCandidateByProjectType}
              onChange={onProjectTypeChangeHandler}
              selectOptions={projectTypesOptions}
              icon="job-type"
              defaultValue={defaultProjectTypeOption}
            />
          </div>
        </div>
      </div>
      <div className={styles['search-box__row']}>
        <div className={classNames(styles['search-box__filters'], styles[hideOnMobileClass])}>
          <div className={styles['search-box__filter']}>
            <CustomSelect
              value={searchCandidateByProjectValue}
              onChange={onProjectValueChangeHandler}
              selectOptions={projectValuesOptions}
              icon="job-type"
              defaultValue={defaultProjectValueOption}
            />
          </div>
          <div className={styles['search-box__filter']}>
            <CustomSelect
              value={searchCandidateByStatus}
              onChange={onLookingJobStatusChange}
              selectOptions={lookingForJobStatus}
              icon="job-type"
              defaultValue={lookingForJobStatus[0]}
            />
          </div>
          <div
            ref={wrapperRef}
            onClick={toggleDropdownVisibility}
            className={styles['search-box__salary-label']}
          >
            <Icon className={styles['search-box__salary-icon']} name="pocket" />
            <p className={styles['search-box__salary']}>{salary || 'Salary'}</p>
            <Icon className={styles['search-box__arrow-down']} name="chevron-right" />
            <SalaryDropdown
              withAmount={false}
              className={styles['search-box__dropdown']}
              visible={dropdownVisibility}
              setSalary={setSalaryHandler}
            />
          </div>
          <div className={styles['search-box__location-filter']}>
            <CustomAvailabilitySelect
              onChange={onAvailabilityChangeHandler}
              options={availabilityOptions}
              icon="calendar"
            />
          </div>
          <button className={styles['search-box__clear-btn']} onClick={handleClear}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
});
