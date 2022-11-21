import React, { memo, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { assignCompaniesAndRegionsToAdmin } from '~/modules/manageAdmins/actions';
import {
  adminPositionsAsSelectOptionsSelector,
  adminRegionsAsSelectOptionsSelector,
} from '~/modules/manageAdmins/selectors';
import { useDispatch, useSelector } from '~/store';
import { RootState } from '~/store/types';
import { AssignCompaniesAndRegionsFormValues } from '~/types/formValues';
import { Button } from '~/view/components/button';
import { CenterModal } from '~/view/components/modals';
import { SelectOption } from '~/view/components/select';

import { CustomSelect } from './custom-select';
import styles from './styles.scss';

interface AssignToAdminProps {
  visible: boolean;
  onClose: () => void;
}

export const AssignToAdminModal: React.FC<AssignToAdminProps> = memo(function AssignToAdminModal({
  visible,
  onClose,
}) {
  const adminPositionsAsSelectOptions = useSelector(adminPositionsAsSelectOptionsSelector);
  const adminRegionsAsSelectOptions = useSelector(adminRegionsAsSelectOptionsSelector);
  const { loadingAssignCompaniesAndRegions } = useSelector(
    (state: RootState) => state.manageAdmins,
  );
  const dispatch = useDispatch();

  const { handleSubmit, setValue, watch } = useForm<AssignCompaniesAndRegionsFormValues>({
    defaultValues: {
      positions: [],
      regions: [],
    },
  });

  const positionsOptions = watch('positions');
  const regionOptions = watch('regions');

  useEffect(() => {
    const filteredPositions = adminPositionsAsSelectOptions
      .filter((item: SelectOption) => item.isSelected === true)
      .map((item: SelectOption) => item.value);

    setValue('positions', filteredPositions, {
      shouldValidate: true,
    });
    const filteredRegions = adminRegionsAsSelectOptions
      .filter((item: SelectOption) => item.isSelected === true)
      .map((item: SelectOption) => item.value);

    setValue('regions', filteredRegions, {
      shouldValidate: true,
    });
  }, [adminPositionsAsSelectOptions, adminRegionsAsSelectOptions, setValue]);

  const onPositionChange = useCallback(
    (selectedPositions: SelectOption[]) => {
      const positions = selectedPositions.map((position: SelectOption) => position.value);
      setValue('positions', positions, {
        shouldValidate: true,
      });
    },
    [setValue],
  );

  const onRegionsChange = useCallback(
    (selectedRegions: SelectOption[]) => {
      const companies = selectedRegions.map((region: SelectOption) => region.value);
      setValue('regions', companies, {
        shouldValidate: true,
      });
    },
    [setValue],
  );

  const onSubmit = useCallback(
    (values: AssignCompaniesAndRegionsFormValues) => {
      dispatch(
        assignCompaniesAndRegionsToAdmin.request({
          formValues: values,
          onSuccess: () => {
            onClose();
          },
        }),
      );
    },
    [dispatch, onClose],
  );

  return (
    <CenterModal
      title="Assign to admin"
      className={styles['modal-assign-admin']}
      visible={visible}
      onClose={onClose}
    >
      <div className={styles['modal-assign-admin__body']}>
        <CustomSelect
          label="Select Positions"
          onChange={onPositionChange}
          options={adminPositionsAsSelectOptions}
          placeholder="Choose positions"
          positionsOptions={positionsOptions}
        />
        <CustomSelect
          label="Select regions"
          onChange={onRegionsChange}
          options={adminRegionsAsSelectOptions}
          placeholder="Choose regions"
          regionOptions={regionOptions}
        />
        <Button
          variant="accent"
          title="Confirm and assign"
          className={styles['modal-assign-admin__button']}
          onClick={handleSubmit(onSubmit)}
          loading={loadingAssignCompaniesAndRegions}
        />
      </div>
    </CenterModal>
  );
});
