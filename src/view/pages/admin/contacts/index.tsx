import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { PermissionType } from '~/models/common';
import { navigateFromContacts } from '~/modules/adminCandidates/actions';
import {
  getContactCompanies,
  resetContactSearchFilters,
  setCity,
  setCompany,
  setContactCandidateSearchWithFilters,
  setContactCompanySearchWithFilters,
  setPosition,
  setPositionType,
  setProjectType,
} from '~/modules/adminContacts/actions';
import {
  citiesAsSelectOptionsSelector,
  hiringManagerJobPositionsAsSelectOptionsSelector,
  hiringManagerProjectTypesAsSelectOptionsSelector,
} from '~/modules/common/selectors';
import { companiesAsSelectOptionsSelector } from '~/modules/companies/selectors';
import { useDispatch, useSelector } from '~/store';
import { Button } from '~/view/components/button';
import { SearchInput } from '~/view/components/search-input';
import { SelectOption } from '~/view/components/select';
import useDebounce from '~/view/hooks/useDebounce';

import { CandidateTab } from './components/candidate-tab';
import { CompanyTab } from './components/company-tab';
import { CustomSelect } from './components/custom-select';
import { NewContactModal } from './components/new-contact-modal';
import styles from './styles.scss';

const defaultCityOption: SelectOption = {
  value: 0,
  label: 'City',
};

const defaultJobTypeOption: SelectOption = {
  value: 0,
  label: 'Job position',
};

const defaultProjectTypeOption: SelectOption = {
  value: 0,
  label: 'Project type',
};

const defaultCompanyOption: SelectOption = {
  value: 0,
  label: 'Company',
};

const positionTypeOptions: SelectOption[] = [
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

export const ContactPage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const [newContactModalVisible, setNewContactModalVisible] = useState(false);
  const [companySearchValue, setCompanySearchValue] = useState('');
  const [candidateSearchValue, setCandidateSearchValue] = useState('');
  const [tabName, setTabName] = useState<string>('Companies');
  const { navigateFromContactsToCandidates } = useSelector(state => state.adminCandidates);
  const jobTypesAsSelectOptions = useSelector(hiringManagerJobPositionsAsSelectOptionsSelector);
  const citiesAsSelectOptions = useSelector(citiesAsSelectOptionsSelector);
  const companiesAsSelectOptions = useSelector(companiesAsSelectOptionsSelector);
  const projectTypesAsSelectOptions = useSelector(hiringManagerProjectTypesAsSelectOptionsSelector);
  const isCompany = tabName === 'Companies';
  const debouncedCompanyValue = useDebounce<string>(companySearchValue, 200);
  const debouncedCandidateValue = useDebounce<string>(candidateSearchValue, 200);
  const {
    searchManagerCityFilter,
    searchManagerByPosition,
    searchManagerByProjectType,
    searchManagerByCompany,
    companies,
    candidates,
    searchManagerByPositionType,
  } = useSelector(state => state.adminContacts);

  useEffect(() => {
    return () => {
      dispatch(resetContactSearchFilters());
    };
  }, []);

  useEffect(() => {
    dispatch(
      setContactCompanySearchWithFilters({
        keyWord: debouncedCompanyValue,
      }),
    );
  }, [debouncedCompanyValue, dispatch]);

  useEffect(() => {
    dispatch(
      setContactCandidateSearchWithFilters({
        keyWord: debouncedCandidateValue,
      }),
    );
  }, [debouncedCandidateValue, dispatch]);

  const citiesOptions = useMemo(() => {
    const newArr = citiesAsSelectOptions.slice();
    newArr.unshift({ value: 0, label: 'City' });
    return newArr;
  }, [citiesAsSelectOptions]);

  const jobTypesOptions = useMemo(() => {
    const newArr = jobTypesAsSelectOptions.slice();
    newArr.unshift(defaultJobTypeOption);
    return newArr;
  }, [jobTypesAsSelectOptions]);

  const projectTypesOptions = useMemo(() => {
    const newArr = projectTypesAsSelectOptions.slice();
    newArr.unshift(defaultProjectTypeOption);
    return newArr;
  }, [projectTypesAsSelectOptions]);

  const companiesOptions = useMemo(() => {
    const newArr = companiesAsSelectOptions.slice();
    newArr.unshift(defaultCompanyOption);
    return newArr;
  }, [companiesAsSelectOptions]);

  const toggleNewContactModalVisibility = useCallback(() => {
    setNewContactModalVisible(prevValue => !prevValue);
  }, []);

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    e => {
      if (isCompany) {
        setCompanySearchValue(e.target.value);
      } else {
        setCandidateSearchValue(e.target.value);
      }
    },
    [isCompany],
  );

  const onCityChangeHandler = useCallback(
    (option: SelectOption) => {
      dispatch(setCity(option));
      dispatch(
        setContactCompanySearchWithFilters({
          keyWord: companySearchValue,
        }),
      );
    },
    [dispatch, companySearchValue],
  );

  const onJobPositionChangeHandler = useCallback(
    (option: SelectOption) => {
      dispatch(setPosition(option));
      dispatch(
        setContactCompanySearchWithFilters({
          keyWord: companySearchValue,
        }),
      );
    },
    [dispatch, companySearchValue],
  );

  const onProjectTypeChangeHandler = useCallback(
    (option: SelectOption) => {
      dispatch(setProjectType(option));
      dispatch(
        setContactCompanySearchWithFilters({
          keyWord: companySearchValue,
        }),
      );
    },
    [dispatch, companySearchValue],
  );

  const onCompanChangeHanlder = useCallback(
    (option: SelectOption) => {
      dispatch(setCompany(option));
      dispatch(
        setContactCompanySearchWithFilters({
          keyWord: companySearchValue,
        }),
      );
    },
    [dispatch, companySearchValue],
  );

  const onPositionTypeChangeHandler = useCallback(
    (option: SelectOption) => {
      dispatch(setPositionType(option));
      dispatch(
        setContactCompanySearchWithFilters({
          keyWord: companySearchValue,
        }),
      );
    },
    [dispatch, companySearchValue],
  );

  const handleClear = (): void => {
    dispatch(resetContactSearchFilters());
    dispatch(getContactCompanies.init({ initialFetch: true }));
  };

  useEffect(() => {
    if (navigateFromContactsToCandidates && isCompany) {
      setTabName('Candidates');
    }
    dispatch(navigateFromContacts(false));
  }, [dispatch, navigateFromContactsToCandidates, isCompany]);

  return (
    <>
      <div className={styles['page']}>
        <div className={styles['page__title-wrapper']}>
          <h1 className={styles['page__title']}>Contacts</h1>
          <Button
            variant="accent"
            title="+ Add new contact"
            onClick={toggleNewContactModalVisibility}
          />
        </div>
        <SearchInput
          className={styles['page__input']}
          hideIcon
          placeholder="Search by keywords"
          value={isCompany ? companySearchValue : candidateSearchValue}
          onChange={handleInputChange}
        />
        {isCompany ? (
          <div className={styles['search-box__row']}>
            <div className={styles['search-box__filters']}>
              <div className={styles['search-box__filter']}>
                <CustomSelect
                  onChange={onCompanChangeHanlder}
                  selectOptions={companiesOptions}
                  icon="building"
                  defaultValue={defaultCompanyOption}
                  value={searchManagerByCompany}
                />
              </div>
              <div className={styles['search-box__filter']}>
                <CustomSelect
                  onChange={onJobPositionChangeHandler}
                  selectOptions={jobTypesOptions}
                  icon="job-type"
                  defaultValue={defaultJobTypeOption}
                  value={searchManagerByPosition}
                />
              </div>
              <div className={styles['search-box__filter']}>
                <CustomSelect
                  onChange={onCityChangeHandler}
                  selectOptions={citiesOptions}
                  icon="location"
                  defaultValue={defaultCityOption}
                  value={searchManagerCityFilter}
                />
              </div>
              <div className={styles['search-box__filter']}>
                <CustomSelect
                  onChange={onProjectTypeChangeHandler}
                  selectOptions={projectTypesOptions}
                  icon="job-type"
                  defaultValue={defaultProjectTypeOption}
                  value={searchManagerByProjectType}
                />
              </div>
              <div className={styles['search-box__filter']}>
                <CustomSelect
                  onChange={onPositionTypeChangeHandler}
                  selectOptions={positionTypeOptions}
                  icon="bag"
                  defaultValue={positionTypeOptions[0]}
                  value={searchManagerByPositionType}
                />
              </div>
              <button onClick={handleClear} className={styles['search-box__clear-btn']}>
                Clear
              </button>
            </div>
          </div>
        ) : (
          <div className={styles['placeholder']} />
        )}
        <p className={styles['page__result-count']}>
          {isCompany ? companies.count : candidates.count} results found
        </p>
        <div className={styles['page__content-wrapper']}>
          <div className={styles['page__content-tabs']}>
            <div
              onClick={() => setTabName('Companies')}
              className={
                styles[
                  tabName === 'Companies' ? 'page__content-tabs-active' : 'page__content-tabs-child'
                ]
              }
            >
              Hiring managers
            </div>
            <div
              onClick={() => setTabName('Candidates')}
              className={
                styles[
                  tabName === 'Candidates'
                    ? 'page__content-tabs-active'
                    : 'page__content-tabs-child'
                ]
              }
            >
              Candidates
            </div>
          </div>

          {isCompany ? <CompanyTab /> : <CandidateTab />}
        </div>
      </div>
      <NewContactModal visible={newContactModalVisible} onClose={toggleNewContactModalVisibility} />
    </>
  );
};
