import { yupResolver } from '@hookform/resolvers/yup';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { CompanyHiringManger } from '~/models/company';
import {
  createContract,
  downloadGeneratedContract,
  sendContract,
  toggleContractModalVisibility,
} from '~/modules/adminPipeline/actions';
import { Company } from '~/services/api/Company';
import { useDispatch, useSelector } from '~/store';
import {
  CreateJobContractFormValues,
  SendJobContractAdditionalMessageFormValues,
} from '~/types/formValues';
import { getContractFormValues } from '~/utils/initialFormValues';
import {
  CreateJobContractValidation,
  SendAdditionalMessageForContractValidation,
} from '~/utils/validations';
import { Button } from '~/view/components/button';
import { DatePicker } from '~/view/components/date-picker';
import { Input } from '~/view/components/input';
import { CenterModal } from '~/view/components/modals';
import { PaymentTypeComponent } from '~/view/components/payment-type';
import { Select, SelectOption } from '~/view/components/select';
import { Textarea } from '~/view/components/textarea';

import { PayOptionComponent } from './components';
import styles from './styles.scss';

export const ContractModal: React.FC = memo(function ContractModal() {
  const dispatch = useDispatch();
  const [hrManagers, setHrManagers] = useState<SelectOption[]>([]);
  const {
    selectedMatchedJob,
    contractModalVisibility,
    creatingContract,
    isContractGenerated,
    sendingContract,
  } = useSelector(state => state.adminMatchedJobsPipeline);

  const { control, handleSubmit } = useForm<CreateJobContractFormValues>({
    defaultValues: getContractFormValues(selectedMatchedJob!.contract),
    resolver: yupResolver(CreateJobContractValidation),
  });

  const { control: sendControl, handleSubmit: handleSendSubmit } =
    useForm<SendJobContractAdditionalMessageFormValues>({
      defaultValues: {
        message: '',
      },
      resolver: yupResolver(SendAdditionalMessageForContractValidation),
    });

  useEffect(() => {
    if (selectedMatchedJob) {
      const loadHiringManagers = async (): Promise<void> => {
        const {
          data: {
            data: { results },
          },
        } = await Company.getCompanyHiringManager(selectedMatchedJob.companyId, {
          limit: 20,
          offset: 0,
        });

        const managers = results.map(({ id, lastName, firstName }: CompanyHiringManger) => ({
          label: `${firstName} ${lastName}`,
          value: id,
        }));

        setHrManagers(managers);
      };

      loadHiringManagers();
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    dispatch(toggleContractModalVisibility());
  }, [dispatch]);

  const handleContractDownload = useCallback(
    (isCandidate: boolean) => {
      dispatch(downloadGeneratedContract.request({ isCandidate }));
    },
    [dispatch],
  );

  const handleSendContract = useCallback(
    ({ message }: SendJobContractAdditionalMessageFormValues) => {
      dispatch(sendContract.request({ message, index: selectedMatchedJob?.index as number }));
    },
    [dispatch, selectedMatchedJob],
  );

  const onSubmit = useCallback(
    values => {
      if (selectedMatchedJob) {
        dispatch(
          createContract.request({
            formValues: { ...values, matched: selectedMatchedJob.id },
          }),
        );
      }
    },
    [selectedMatchedJob, dispatch],
  );

  return (
    <CenterModal
      className={styles['modal']}
      onClose={handleCloseModal}
      visible={contractModalVisibility}
      title="Send Temporary Job contract"
    >
      <p className={styles['modal__description']}>
        Look at you placing another candidate, amazing work! Who is next?
      </p>
      <PaymentTypeComponent
        className={styles['modal__field']}
        name="paymentType"
        control={control}
      />
      <div className={styles['modal__row']}>
        <DatePicker
          label="Choose an agreement date"
          className={styles['modal__row-input']}
          placeholder="Choose a date"
          name="agreementDate"
          control={control}
        />
        <DatePicker
          label="Choose a commencement date"
          className={styles['modal__row-input']}
          placeholder="Choose a date"
          name="commencementDate"
          control={control}
        />
      </div>
      <Select
        label="Select a supervisor"
        className={styles['modal__field']}
        name="supervisor"
        placeholder="Select a supervisor"
        options={hrManagers}
        control={control}
      />
      <Input
        className={styles['modal__field']}
        control={control}
        name="hoursOfWork"
        placeholder="Hours of work"
        label="Hours of work"
      />
      <div className={styles['modal__row']}>
        <Input
          className={styles['modal__row-input']}
          name="candidateRate"
          control={control}
          placeholder="$ 0.00"
          mask="$ ****"
          label="Candidate rate"
        />
        <Input
          className={styles['modal__row-input']}
          name="companyRate"
          control={control}
          placeholder="$ 0.00"
          mask="$ ****"
          label="Company rate"
        />
      </div>
      <Input
        className={styles['modal__field']}
        name="timesheetDeadline"
        control={control}
        placeholder="Timesheet deadline"
        label="Timesheet deadline"
      />
      <PayOptionComponent name="payOption" control={control} className={styles['modal__field']} />
      <Button
        className={styles['modal__generate-btn']}
        title="Generate contract"
        variant="primary"
        loading={creatingContract}
        onClick={handleSubmit(onSubmit)}
      />
      {isContractGenerated && (
        <div className={styles['modal__btns']}>
          <Button
            variant="secondary"
            title="Download for candidate"
            className={styles['modal__btn']}
            onClick={() => handleContractDownload(true)}
          />
          <Button
            variant="secondary"
            title="Download for company"
            className={styles['modal__btn']}
            onClick={() => handleContractDownload(false)}
          />
        </div>
      )}
      {isContractGenerated && (
        <>
          <p className={styles['modal__caption']}>
            This contract will be send to both candidate and hiring company for approval
          </p>
          <Textarea
            maxLength={1000}
            name="message"
            label="Message (optional)"
            placeholder="Your message"
            control={sendControl}
            className={styles['modal__message']}
          />
          <Button
            onClick={handleSendSubmit(handleSendContract)}
            className={styles['modal__submit-btn']}
            title="Send contracts"
            variant="accent"
            loading={sendingContract}
          />
        </>
      )}
    </CenterModal>
  );
});
