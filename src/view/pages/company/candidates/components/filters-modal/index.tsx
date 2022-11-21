import classNames from 'classnames';
import React, { memo, useCallback, useState } from 'react';

import {
  citiesAsSelectOptionsSelector,
  jobPositionsAsSelectOptionsSelector,
  projectTypesAsSelectOptionsSelector,
  statesAsSelectOptionsSelector,
} from '~/modules/common/selectors';
import {
  getCompanyCandidates,
  resetFilters,
  setAvailability,
  setCity,
  setJobTitle,
  setProjectType,
  setRegion,
  setSalary,
} from '~/modules/companyCandidates/actions';
import { useDispatch, useSelector } from '~/store';
import { SalaryRangeFormValues } from '~/types/formValues';
import { Button } from '~/view/components/button';
import { Icon } from '~/view/components/icon';
import { RightModal } from '~/view/components/modals';
import { SalaryDropdown } from '~/view/components/salary-dropdown';
import { SelectOption } from '~/view/components/select';
import { useOutsideClick } from '~/view/hooks/useOutsideClick';

import { CustomAvailabilitySelect } from './components/custom-availability-select';
import { CustomSelect } from './components/custom-select';
import styles from './styles.scss';

type Props = {
  onClose: () => void;
  visible: boolean;
};

const availabilityOptions = [
  { value: 0, label: 'Immediate', isSelected: false },
  { value: 1, label: '1 week', isSelected: false },
  { value: 2, label: '2 weeks ', isSelected: false },
  { value: 3, label: '3 weeks  ', isSelected: false },
  { value: 4, label: '4 weeks or longer', isSelected: false },
];

export const FilterModal: React.FC<Props> = memo(function FilterModal({ onClose, visible }) {
  const dispatch = useDispatch();
  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  const citiesAsSelectOptions = useSelector(citiesAsSelectOptionsSelector);
  const statesAsSelectOptions = useSelector(statesAsSelectOptionsSelector);
  const jobPositionsAsSelectOptions = useSelector(jobPositionsAsSelectOptionsSelector);
  const projectTypesAsSelectOptions = useSelector(projectTypesAsSelectOptionsSelector);
  const {
    searchCandidateRegionFilter,
    searchCandidateCityFilter,
    searchCandidateJobType,
    searchCandidateSalaryGte,
    searchCandidateSalaryLte,
    searchCandidateByProjectType,
  } = useSelector(state => state.companyCandidates);
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const onRegionChangeHandler = useCallback(
    (option: SelectOption) => {
      dispatch(setRegion(option));
    },
    [dispatch],
  );

  const onCityChangeHandler = useCallback(
    (option: SelectOption) => {
      dispatch(setCity(option));
    },
    [dispatch],
  );

  const toggleDropdownVisibility = (): void => {
    setDropdownVisibility(prevValue => !prevValue);
  };

  const onJobTitleChangeHandler = useCallback(
    (option: SelectOption) => {
      dispatch(setJobTitle(option));
    },
    [dispatch],
  );

  const onProjectTypeChangeHandler = useCallback(
    (option: SelectOption) => {
      dispatch(setProjectType(option));
    },
    [dispatch],
  );

  const onAvailabilityChangeHandler = useCallback(
    (option: SelectOption[]) => {
      dispatch(setAvailability(option));
    },
    [dispatch],
  );

  const onSubmit = useCallback(() => {
    dispatch(getCompanyCandidates.request(1));
    onClose();
  }, [dispatch, onClose]);

  const onReset = useCallback(() => {
    dispatch(resetFilters());
    dispatch(getCompanyCandidates.request(1));
    onClose();
  }, [dispatch, onClose]);

  const setSalaryHandler = useCallback(
    (values: SalaryRangeFormValues) => {
      dispatch(setSalary({ salaryGte: values.salaryGte, salaryLte: values.salaryLte }));
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

  const regionDefaultValue = searchCandidateRegionFilter.value ? searchCandidateRegionFilter : null;
  const cityDefaultValueDefaultValue = searchCandidateCityFilter.value
    ? searchCandidateCityFilter
    : null;
  const jobTitleDefaultValue = searchCandidateJobType.value ? searchCandidateJobType : null;
  const projectTypeDefaultValue = searchCandidateByProjectType.value
    ? searchCandidateByProjectType
    : null;

  const salary =
    searchCandidateSalaryGte && searchCandidateSalaryLte
      ? `${searchCandidateSalaryGte} - ${searchCandidateSalaryLte}`
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
        label="Region"
        onChange={onRegionChangeHandler}
        options={statesAsSelectOptions}
        icon="location"
        placeholder="Choose region"
        defaultValue={regionDefaultValue}
      />
      <CustomSelect
        label="City"
        onChange={onCityChangeHandler}
        options={citiesAsSelectOptions}
        icon="location"
        placeholder="Choose city"
        defaultValue={cityDefaultValueDefaultValue}
      />
      <CustomSelect
        label="Job title"
        onChange={onJobTitleChangeHandler}
        options={jobPositionsAsSelectOptions}
        icon="job-type"
        placeholder="Choose job title"
        defaultValue={jobTitleDefaultValue}
      />
      <CustomSelect
        label="Project type"
        onChange={onProjectTypeChangeHandler}
        options={projectTypesAsSelectOptions}
        icon="job-type"
        placeholder="Choose job type"
        defaultValue={projectTypeDefaultValue}
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
          withAmount={false}
        />
      </div>
      <CustomAvailabilitySelect
        label="Availability"
        onChange={onAvailabilityChangeHandler}
        icon="calendar"
        options={availabilityOptions}
      />
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
