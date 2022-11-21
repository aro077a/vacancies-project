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

import { JobGroupPositionType, PositionType } from '~/models/common';
import {
  getLiveJobs,
  resetFilters,
  setAdmin,
  setCity,
  setPositionType,
  setRegion,
  setSalary,
  setSearchValue,
  setSelectedJob,
  setSelectedJobGrop,
} from '~/modules/adminLiveJobs/actions';
import {
  citiesAsSelectOptionsSelector,
  statesAsSelectOptionsSelector,
} from '~/modules/common/selectors';
import { getListOfAdmins } from '~/modules/manageAdmins/actions';
import { adminsAsSelectOptionsSelector } from '~/modules/manageAdmins/selectors';
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

const defaultRegionOption: SelectOption = {
  value: 0,
  label: 'Region',
};

const defaultCityOption: SelectOption = {
  value: 0,
  label: 'City',
};

const defaultFilterByAdminOption: SelectOption = {
  value: 0,
  label: 'Admin',
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

export const SearchInput: React.FC = memo(function SearchInput() {
  const dispatch = useDispatch();
  const {
    searchJobSalaryGte,
    searchJobSalaryLte,
    searchJobCityFilter,
    searchJobPositionType,
    searchJobRegionFilter,
    searchLiveJobsByAdmin,
    searchSelectedJobs,
    searchCandidateKeyWord,
    searchSelectedJobGroups,
  } = useSelector(state => state.adminLiveJobs);
  const groupData = useSelector(state => state.common.jobGroups);

  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedValue = useDebounce<string>(searchCandidateKeyWord, 200);
  const citiesAsSelectOptions = useSelector(citiesAsSelectOptionsSelector);
  const statesAsSelectOptions = useSelector(statesAsSelectOptionsSelector);
  const adminsAsSelectOptions = useSelector(adminsAsSelectOptionsSelector);
  const [dropdownVisibility, setDropdownVisibility] = useState<boolean>(false);
  const [jobDropdownMenuVisibility, setJobDropdownMenuVisibility] = useState<boolean>(false);
  const [jobDropdownSubMenuVisibility, setJobDropdownSubMenuVisibility] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState<number>(0);
  const isPermanent = searchJobPositionType.value === PositionType.PERMANENT;

  useEffect(() => {
    dispatch(getListOfAdmins.init({ initialFetch: true }));
  }, [dispatch]);

  useEffect(() => {
    if (searchCandidateKeyWord !== '') {
      dispatch(getLiveJobs.init({ initialFetch: true }));
    }
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

  const filterByAdminOptionsOptions = useMemo(() => {
    const newArr = adminsAsSelectOptions.slice();
    newArr.unshift(defaultFilterByAdminOption);
    return newArr;
  }, [adminsAsSelectOptions]);

  const onRegionChangeHandler = useCallback(
    (option: SelectOption) => {
      dispatch(setRegion(option));
      dispatch(getLiveJobs.init({ initialFetch: true }));
    },
    [dispatch],
  );

  const onCityChangeHandler = useCallback(
    (option: SelectOption) => {
      dispatch(setCity(option));
      dispatch(getLiveJobs.init({ initialFetch: true }));
    },
    [dispatch],
  );

  const onAdminChangeHandler = useCallback(
    (option: SelectOption) => {
      dispatch(setAdmin(option));
      dispatch(getLiveJobs.init({ initialFetch: true }));
    },
    [dispatch],
  );

  const setSalaryHandler = useCallback(
    (values: SalaryRangeFormValues) => {
      dispatch(setSalary(values));
      setDropdownVisibility(false);
      dispatch(getLiveJobs.init({ initialFetch: true }));
    },
    [dispatch],
  );

  const onPositionTypeChangeHandler = useCallback(
    (option: SelectOption) => {
      dispatch(setPositionType(option));
      dispatch(getLiveJobs.init({ initialFetch: true }));
    },
    [dispatch],
  );

  const toggleDropdownVisibility = useCallback(() => {
    setDropdownVisibility(prevValue => !prevValue);
  }, []);

  const toggleJobMenuDropdownVisibility = useCallback(() => {
    setJobDropdownMenuVisibility(prevValue => !prevValue);
  }, []);

  const toggleJobDropdownSubMenuVisibility = useCallback((e: BaseSyntheticEvent, id) => {
    e.stopPropagation();

    // eslint-disable-next-line no-prototype-builtins
    if (!e.target.hasOwnProperty('checked')) {
      setActiveMenu(id);

      setJobDropdownSubMenuVisibility(prevValue => !prevValue);
    }
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

  const handleClick = useCallback((e: BaseSyntheticEvent) => {
    e.stopPropagation();
  }, []);

  const wrapperRef = useOutsideClick<HTMLDivElement>({
    handler: useCallback(() => {
      if (dropdownVisibility) {
        setDropdownVisibility(false);
      }
    }, [dropdownVisibility]),
  });

  const onInputChangeHandler = (e: BaseSyntheticEvent): void => {
    if (e.target.value !== '') {
      dispatch(setSearchValue(e.target.value));
    }
  };

  const handleClearSelected = useCallback(() => {
    dispatch(setSelectedJob([]));
    dispatch(setSelectedJobGrop([]));
    dispatch(getLiveJobs.init({ initialFetch: true }));
  }, [dispatch]);

  const handleSearch = useCallback(() => {
    dispatch(getLiveJobs.init({ initialFetch: true }));
  }, [dispatch]);

  const prefix = isPermanent ? '/year' : '/hour';

  const salary =
    searchJobSalaryGte && searchJobSalaryLte
      ? `${searchJobSalaryGte} - ${searchJobSalaryLte}${searchJobPositionType.value ? prefix : ''}`
      : '';

  const hideOnMobileClass = 'search-box__filters--hide';

  const handleClear = (): void => {
    inputRef!.current!.value = '';
    dispatch(resetFilters());
    dispatch(getLiveJobs.init({ initialFetch: true }));
  };

  const dropdownRef = useOutsideClick<HTMLDivElement>({
    handler: useCallback(() => {
      if (jobDropdownMenuVisibility) {
        setJobDropdownMenuVisibility(false);
      }
    }, [jobDropdownMenuVisibility]),
  });

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
          onChange={onInputChangeHandler}
          className={styles['search-box__input']}
          placeholder="Search jobs by keywords"
          autoComplete="on"
        />
      </div>
      <div className={styles['search-box__row']}>
        <div className={classNames(styles['search-box__filters'], styles[hideOnMobileClass])}>
          <div className={styles['search-box__filter']}>
            <CustomSelect
              onChange={onAdminChangeHandler}
              selectOptions={filterByAdminOptionsOptions}
              icon="user-outline"
              defaultValue={defaultFilterByAdminOption}
              value={searchLiveJobsByAdmin}
            />
          </div>
          <div className={styles['search-box__filter']}>
            <CustomSelect
              onChange={onRegionChangeHandler}
              selectOptions={regionsOptions}
              icon="location"
              defaultValue={defaultRegionOption}
              value={searchJobRegionFilter}
            />
          </div>
          <div className={styles['search-box__filter']}>
            <CustomSelect
              onChange={onCityChangeHandler}
              selectOptions={citiesOptions}
              icon="location"
              defaultValue={defaultCityOption}
              value={searchJobCityFilter}
            />
          </div>
          <div className={styles['search-box__filter']}>
            <CustomSelect
              onChange={onPositionTypeChangeHandler}
              selectOptions={positionTypeOptions}
              icon="bag"
              defaultValue={positionTypeOptions[0]}
              value={searchJobPositionType}
            />
          </div>
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
              isJob
              handleSelectGroup={handleSelectGroup}
              selectedJobPositions={searchSelectedJobs}
              selectedJobGrous={searchSelectedJobGroups}
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
              withAmount
              className={styles['search-box__dropdown']}
              visible={dropdownVisibility}
              setSalary={setSalaryHandler}
            />
          </div>
          <button onClick={handleClear}>Clear</button>
        </div>
      </div>
    </div>
  );
});
