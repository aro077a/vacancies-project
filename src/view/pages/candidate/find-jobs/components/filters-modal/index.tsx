import classNames from 'classnames';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { PositionType } from '~/models/common';
import {
  getCompaniesWithJobs,
  getFindJobs,
  resetFilters,
  setCompany,
  setLocation,
  setPosition,
  setPositionType,
  setSalary,
} from '~/modules/candidateFindJobs/actions';
import {
  citiesAsSelectOptionsSelector,
  jobPositionsAsSelectOptionsSelector,
} from '~/modules/common/selectors';
import { useDispatch, useSelector } from '~/store';
import { SalaryRangeFormValues } from '~/types/formValues';
import { Button } from '~/view/components/button';
import { Icon } from '~/view/components/icon';
import { RightModal } from '~/view/components/modals';
import { SalaryDropdown } from '~/view/components/salary-dropdown';
import { SelectOption } from '~/view/components/select';
import { useOutsideClick } from '~/view/hooks/useOutsideClick';

import { CustomSelect } from './components';
import styles from './styles.scss';

type Props = {
  onClose: () => void;
  visible: boolean;
};

const positionTypeOptions: SelectOption[] = [
  {
    value: PositionType.PERMANENT,
    label: 'Permanent',
  },
  {
    value: PositionType.TEMPORARY,
    label: 'Temporary',
  },
];

export const FilterModal: React.FC<Props> = memo(function FilterModal({ onClose, visible }) {
  const dispatch = useDispatch();
  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  const locationsAsSelectOptions = useSelector(citiesAsSelectOptionsSelector);
  const jobPositionsAsSelectOptions = useSelector(jobPositionsAsSelectOptionsSelector);
  const {
    searchJobByLocationFilter,
    searchJobByJobType,
    searchJobByPositionType,
    searchJobBySalaryGte,
    searchJobBySalaryLte,
    searchJobByCompany,
    companiesWithJobs,
  } = useSelector(state => state.candidateFindJobs);
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    dispatch(getCompaniesWithJobs.init({ initialFetch: true, noLimit: true }));
  }, [dispatch]);

  const onLocationChangeHandler = useCallback(
    (option: SelectOption) => {
      dispatch(setLocation(option));
    },
    [dispatch],
  );

  const toggleDropdownVisibility = (): void => {
    setDropdownVisibility(prevValue => !prevValue);
  };

  const onJobPositionChangeHandler = useCallback(
    (option: SelectOption) => {
      dispatch(setPosition(option));
    },
    [dispatch],
  );

  const onPositionTypeChangeHandler = useCallback(
    (option: SelectOption) => {
      dispatch(setPositionType(option));
    },
    [dispatch],
  );

  const onCompanyChangeHandler = useCallback(
    (option: SelectOption) => {
      dispatch(setCompany(option));
    },
    [dispatch],
  );

  const onSubmit = useCallback(() => {
    dispatch(getFindJobs.init({ initialFetch: true }));
    onClose();
  }, [dispatch, onClose]);

  const onReset = useCallback(() => {
    dispatch(resetFilters());
    dispatch(getFindJobs.init({ initialFetch: true }));
    onClose();
  }, [dispatch, onClose]);

  const companySelectOptions = useMemo(() => {
    return companiesWithJobs.results.map(company => ({ value: company.id, label: company.name }));
  }, [companiesWithJobs]);

  const setSalaryHandler = useCallback(
    (values: SalaryRangeFormValues) => {
      dispatch(
        setSalary({
          salaryGte: values.salaryGte,
          salaryLte: values.salaryLte,
          withAmount: values.withAmount,
        }),
      );
      setDropdownVisibility(false);
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

  const locationDefaultValue = searchJobByLocationFilter.value ? searchJobByLocationFilter : null;
  const jobTypeDefaultValue = searchJobByJobType.value ? searchJobByJobType : null;
  const jobPositionTypeDefaultValue = searchJobByPositionType.value
    ? searchJobByPositionType
    : null;
  const companyDefaultValue = searchJobByCompany.value ? searchJobByCompany : null;

  const isPermanent = searchJobByPositionType.value === PositionType.PERMANENT;

  const prefix = isPermanent ? '/year' : '/hour';

  const salary =
    searchJobBySalaryGte && searchJobBySalaryLte
      ? `${searchJobBySalaryGte} - ${searchJobBySalaryLte}${
          searchJobByPositionType.value ? prefix : ''
        }`
      : '';

  return (
    <RightModal
      className={styles['modal']}
      visible={visible}
      onClose={handleClose}
      backTitle="< Back"
    >
      <h4 className={styles['modal__title']}>Filter</h4>
      <CustomSelect
        label="State/Territory"
        onChange={onLocationChangeHandler}
        options={locationsAsSelectOptions}
        icon="location"
        placeholder="Choose state"
        defaultValue={locationDefaultValue}
      />
      <CustomSelect
        label="Job type"
        onChange={onJobPositionChangeHandler}
        options={jobPositionsAsSelectOptions}
        icon="job-type"
        placeholder="Choose job type"
        defaultValue={jobTypeDefaultValue}
      />
      <CustomSelect
        label="Position type"
        onChange={onPositionTypeChangeHandler}
        options={positionTypeOptions}
        icon="bag"
        placeholder="Choose position type"
        defaultValue={jobPositionTypeDefaultValue}
      />
      <CustomSelect
        label="Company"
        onChange={onCompanyChangeHandler}
        options={companySelectOptions}
        icon="building"
        placeholder="Choose company"
        defaultValue={companyDefaultValue}
      />
      <div
        onClick={toggleDropdownVisibility}
        ref={wrapperRef}
        className={styles['modal__salary-wrapper']}
      >
        <p className={styles['modal__salary-label']}>Approx. Annual Salary</p>
        <div className={styles['modal__salary-select']}>
          <Icon className={styles['modal__pocket-icon']} name="pocket" />
          <p
            className={classNames(styles['modal__salary'], {
              [styles['modal__salary--active']]: salary,
            })}
          >
            {salary || 'Choose salary'}
          </p>
          <Icon className={styles['modal__arrow-down']} name="chevron-right" />
        </div>
        <SalaryDropdown
          className={styles['modal__salary-dropdown']}
          visible={dropdownVisibility}
          setSalary={setSalaryHandler}
          withAmount
        />
      </div>
      <div className={styles['modal__btns']}>
        <Button
          onClick={onSubmit}
          title="Save changes"
          variant="accent"
          className={styles['modal__save-btn']}
        />
        <Button
          onClick={onReset}
          title="Reset filters"
          variant="secondary"
          className={styles['modal__reset-btn']}
        />
      </div>
    </RightModal>
  );
});
