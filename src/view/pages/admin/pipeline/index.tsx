import React, { useCallback, useEffect, useMemo } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { PositionType } from '~/models/common';
import {
  resetFilters,
  setAdmin,
  setCity,
  setCompany,
  setContractType,
  setRegion,
} from '~/modules/adminPipeline/actions';
import {
  citiesAsSelectOptionsSelector,
  statesAsSelectOptionsSelector,
} from '~/modules/common/selectors';
import { companiesAsSelectOptionsSelector } from '~/modules/companies/selectors';
import { getListOfAdmins } from '~/modules/manageAdmins/actions';
import { adminsAsSelectOptionsSelector } from '~/modules/manageAdmins/selectors';
import { useDispatch, useSelector } from '~/store';
import { Button } from '~/view/components/button';
import { SelectOption } from '~/view/components/select';

import { Board } from './components/board';
import { CustomSelect } from './components/custom-select';
import styles from './styles.scss';

const positionType: SelectOption[] = [
  {
    value: 0,
    label: 'Contract type',
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

export const PipelinePage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const { searchByCity, searchByCompany, searchByContractType, searchByRegion, searchByAdmin } =
    useSelector(state => state.adminMatchedJobsPipeline);

  useEffect(() => {
    dispatch(getListOfAdmins.init({ initialFetch: true }));
  }, [dispatch]);

  const citiesAsSelectOptions = useSelector(citiesAsSelectOptionsSelector);
  const regionsAsSelectOptions = useSelector(statesAsSelectOptionsSelector);
  const companiesAsSelectOptions = useSelector(companiesAsSelectOptionsSelector);
  const adminsAsSelectOptions = useSelector(adminsAsSelectOptionsSelector);

  const citiesOptions = useMemo(() => {
    const newArr = citiesAsSelectOptions.slice();
    newArr.unshift({ value: 0, label: 'City' });
    return newArr;
  }, [citiesAsSelectOptions]);

  const regionsOptions = useMemo(() => {
    const newArr = regionsAsSelectOptions.slice();
    newArr.unshift({ value: 0, label: 'Region' });
    return newArr;
  }, [regionsAsSelectOptions]);

  const companiesOptions = useMemo(() => {
    const newArr = companiesAsSelectOptions.slice();
    newArr.unshift({ value: 0, label: 'Company' });
    return newArr;
  }, [companiesAsSelectOptions]);

  const handleCompanyChange = useCallback(
    option => {
      dispatch(setCompany(option));
    },
    [dispatch],
  );

  const handleRegionChange = useCallback(
    option => {
      dispatch(setRegion(option));
    },
    [dispatch],
  );

  const handleCityChange = useCallback(
    option => {
      dispatch(setCity(option));
    },
    [dispatch],
  );

  const handleContractTypeChange = useCallback(
    option => {
      dispatch(setContractType(option));
    },
    [dispatch],
  );

  const handleAdminChange = useCallback(
    option => {
      dispatch(setAdmin(option));
    },
    [dispatch],
  );

  const handleReset = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  return (
    <div className={styles['page']}>
      <div className={styles['page__title-wrapper']}>
        <h1 className={styles['page__title']}>Pipeline</h1>
      </div>
      <div className={styles['page__filters']}>
        <CustomSelect
          selectOptions={adminsAsSelectOptions}
          value={searchByAdmin}
          onChange={handleAdminChange}
          icon="user"
        />
        <CustomSelect
          selectOptions={companiesOptions}
          value={searchByCompany}
          onChange={handleCompanyChange}
          icon="building"
        />
        <CustomSelect
          selectOptions={regionsOptions}
          value={searchByRegion}
          onChange={handleRegionChange}
          icon="location"
        />
        <CustomSelect
          selectOptions={citiesOptions}
          value={searchByCity}
          onChange={handleCityChange}
          icon="location"
        />
        <CustomSelect
          value={searchByContractType}
          selectOptions={positionType}
          onChange={handleContractTypeChange}
          icon="bag"
        />
        <Button
          onClick={handleReset}
          className={styles['page__reset-btn']}
          title="Clear"
          variant="secondary"
        />
      </div>
      <Board />
    </div>
  );
};
