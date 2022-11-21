import { yupResolver } from '@hookform/resolvers/yup';
import React, { memo, useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { MatchedJobSteps } from '~/models/common';
import {
  createInvoice,
  setColumns,
  toggleInvoiceModalVisibility,
} from '~/modules/adminPipeline/actions';
import { useDispatch, useSelector } from '~/store';
import { CreateInvoiceFormValues } from '~/types/formValues';
import { CreateInvoiceValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { DatePicker } from '~/view/components/date-picker';
import { Input } from '~/view/components/input';
import { CenterModal } from '~/view/components/modals';
import { Textarea } from '~/view/components/textarea';

import styles from './styles.scss';

export const InvoiceModal: React.FC = memo(function InvoiceModal() {
  const dispatch = useDispatch();
  const modalVisibility = useSelector(
    state => state.adminMatchedJobsPipeline.invoiceModalVisibility,
  );
  const { selectedMatchedJob } = useSelector(state => state.adminMatchedJobsPipeline);
  const updatingStatus = useSelector(state => state.adminMatchedJobsPipeline.creatingInvoice);
  const columns = useSelector(state => state.adminMatchedJobsPipeline.initialColumns);

  const { control, handleSubmit } = useForm<CreateInvoiceFormValues>({
    defaultValues: {
      salary: '',
      percent: '',
      startDate: new Date(),
      flatFee: '',
      flatFeeDescription: '',
    },
    resolver: yupResolver(CreateInvoiceValidation),
  });

  const handleCloseModal = useCallback(() => {
    dispatch(toggleInvoiceModalVisibility());
  }, [dispatch]);

  const onSubmit = useCallback(
    values => {
      if (selectedMatchedJob) {
        dispatch(
          createInvoice.request({
            formValues: { ...values, matched: selectedMatchedJob.id },
            cb: invoice => {
              const sourceColumn = columns[MatchedJobSteps.PlacementApproved];
              const sourceItems = [...sourceColumn.items];
              const destColumn = columns[MatchedJobSteps.Completed];
              const destItems = [...destColumn.items];
              sourceItems.splice(selectedMatchedJob?.index, 1);
              dispatch(
                setColumns({
                  ...columns,
                  6: {
                    ...sourceColumn,
                    items: [...sourceItems],
                  },
                  7: {
                    ...destColumn,
                    items: [
                      { ...selectedMatchedJob, invoice, step: MatchedJobSteps.Completed },
                      ...destItems,
                    ],
                  },
                }),
              );
              dispatch(toggleInvoiceModalVisibility());
            },
          }),
        );
      }
    },
    [dispatch, selectedMatchedJob, columns],
  );

  return (
    <CenterModal
      className={styles['modal']}
      onClose={handleCloseModal}
      visible={modalVisibility}
      title="Create invoice"
    >
      <p className={styles['modal__description']}>
        Look at you placing another candidate, amazing work! Who is next?{' '}
      </p>
      <DatePicker
        placeholder="Choose date"
        name="startDate"
        control={control}
        label="Start date"
        hintMessage="Please select a date agreed with the candidate by an employer"
        className={styles['modal__field']}
      />
      <Input
        control={control}
        placeholder="$ 0.00"
        name="salary"
        label="Annual salary"
        mask="$ ****"
        hintMessage="Fill in the candidate annual salary on that position"
        className={styles['modal__field']}
      />
      <Input
        control={control}
        placeholder="% 0"
        name="percent"
        label="Introductory fee percentage to client"
        mask="% ****"
        className={styles['modal__field']}
      />
      <Input
        control={control}
        placeholder="$ 0"
        name="flatFee"
        label="Flat fee (optional)"
        mask="$ ****"
        className={styles['modal__field']}
      />
      <Textarea
        label="Flat fee description (optional)"
        control={control}
        maxLength={500}
        placeholder="Description..."
        name="flatFeeDescription"
        className={styles['modal__field']}
      />
      <p className={styles['modal__caption']}>
        Download and send this document to stuart@recruiterslife.com
      </p>
      <Button
        onClick={handleSubmit(onSubmit)}
        variant="accent"
        title="Create invoice"
        className={styles['modal__submit-btn']}
        loading={updatingStatus}
      />
    </CenterModal>
  );
});
