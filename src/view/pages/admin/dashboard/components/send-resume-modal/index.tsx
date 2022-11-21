import { yupResolver } from '@hookform/resolvers/yup';
import { convertToHTML } from 'draft-convert';
import { convertFromRaw } from 'draft-js';
import React, { memo, useCallback, useEffect, useRef } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { ReceiverType } from '~/models/admin';
import { getCandidates } from '~/modules/adminCandidates/actions';
import { candidatesAsSelectOptionsSelector } from '~/modules/adminCandidates/selectors';
import { sendResume } from '~/modules/adminDashboard/actions';
import { jobPositionsAsSelectOptionsSelector } from '~/modules/common/selectors';
import { Admin } from '~/services/api/Admin';
import { useDispatch, useSelector } from '~/store';
import { RootState } from '~/store/types';
import { SendResumeFormValues } from '~/types/formValues';
import { SendResumeFormValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { Editor } from '~/view/components/editor';
import { Input } from '~/view/components/input';
import { CenterModal } from '~/view/components/modals';
import { RadioButton } from '~/view/components/radio-button';
import { Select, SelectOption } from '~/view/components/select';

import { Card } from './card';
import styles from './styles.scss';

interface SendResumeModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SendResumeModal: React.FC<SendResumeModalProps> = memo(function SendResumeModal({
  visible,
  onClose,
}) {
  const jobPositions = useSelector(jobPositionsAsSelectOptionsSelector);
  const candidatesAsSelectOptions = useSelector(candidatesAsSelectOptionsSelector);
  const { createResumeErrors, loadingSendResume } = useSelector(
    (state: RootState) => state.adminDashboard,
  );
  const editorRef = useRef<React.ElementRef<typeof Editor>>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCandidates.init({ initialFetch: true, status: 2 }));
  }, [dispatch]);

  const { control, handleSubmit, setValue, reset, watch } = useForm<SendResumeFormValues>({
    defaultValues: {
      candidate: null,
      jobPosition: null,
      subject: '',
      receiverType: ReceiverType.Company,
      companies: [
        {
          hiringManagers: [],
        },
      ],
    },
    resolver: yupResolver(SendResumeFormValidation),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'companies',
  });

  const selectedReceiverType = watch('receiverType');

  const loadCandidates = useCallback(async (value: string): Promise<SelectOption[]> => {
    const {
      data: { data },
    } = await Admin.getCandidates({
      offset: 0,
      limit: 10,
      search: value,
    });

    return data.results.map(candidate => ({
      value: candidate.id,
      label: candidate.name,
      image: candidate.avatar,
    }));
  }, []);

  const onSubmit = useCallback(
    (values: SendResumeFormValues) => {
      if (editorRef.current) {
        values.description = convertToHTML(
          convertFromRaw(JSON.parse(editorRef.current.getRawValue())),
        );
      }

      if (selectedReceiverType === ReceiverType.Company) {
        const onlyCompany = values.companies.map(company => ({
          id: company.id!.value,
          hiringManagers: [],
        }));

        const convertedValues = {
          ...values,
          companies: onlyCompany,
        };

        dispatch(
          sendResume.request({
            formValues: convertedValues,
            onSuccess: () => {
              onClose();
              reset();
            },
          }),
        );
      } else {
        const onlyManagers = values.companies.map(company => ({
          hiringManagers: company.hiringManagers.map(manager => manager.value),
        }));

        const convertedValues = {
          ...values,
          companies: onlyManagers,
        };

        dispatch(
          sendResume.request({
            formValues: convertedValues,
            onSuccess: () => {
              onClose();
              reset();
            },
          }),
        );
      }
    },
    [dispatch, onClose, reset, selectedReceiverType],
  );

  const handleRadioButtonChange = useCallback(
    (type: ReceiverType, selectedItem: ReceiverType) => {
      if (type !== selectedItem) {
        setValue('receiverType', type, { shouldDirty: true });
      }
    },
    [setValue],
  );

  const handleRemove = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove],
  );

  return (
    <CenterModal
      title="Send resume"
      className={styles['modal-send-resume']}
      visible={visible}
      onClose={onClose}
    >
      <div className={styles['modal-send-resume__body']}>
        <div className={styles['modal-send-resume__body-header']}>
          <Select
            async
            clearable
            searchable
            name="candidate"
            label="Select candidate"
            placeholder="Select"
            className={styles['modal-send-resume__body-header--select']}
            options={candidatesAsSelectOptions}
            control={control}
            loadOptions={value => loadCandidates(value)}
          />
          <Select
            searchable
            name="jobPosition"
            label="Select job"
            placeholder="Select"
            className={styles['modal-send-resume__body-header--select']}
            options={jobPositions}
            control={control}
          />
        </div>
        <div className={styles['modal-send-resume__body-content']}>
          <div className={styles['page__field']}>
            <p className={styles['page__field-label']}>Send to:</p>
            <div className={styles['page__position-types-wrapper']}>
              <div
                className={styles['page__position-type']}
                onClick={() => handleRadioButtonChange(ReceiverType.Company, selectedReceiverType)}
              >
                <RadioButton checked={selectedReceiverType === ReceiverType.Company} />
                <p className={styles['page__position-type-label']}>Companies only</p>
              </div>
              <div
                className={styles['page__position-type']}
                onClick={() =>
                  handleRadioButtonChange(ReceiverType.HiringManager, selectedReceiverType)
                }
              >
                <RadioButton checked={selectedReceiverType === ReceiverType.HiringManager} />
                <p className={styles['page__position-type-label']}>Hiring managers</p>
              </div>
            </div>
          </div>
          <p className={styles['modal-send-resume__body-content--title']}>Choose companies</p>
          {fields.map((field, index: number) => {
            return (
              <Card
                handleRemove={() => handleRemove(index)}
                key={`${index} + ${field.id}`}
                control={control}
                index={index}
              />
            );
          })}
          <div
            className={styles['modal-send-resume__body-content-add']}
            onClick={() =>
              append({
                hiringManagers: [],
                id: undefined,
              })
            }
          >
            <p>+ Add Company</p>
          </div>
        </div>
        <Input
          name="subject"
          label="Subject"
          placeholder=""
          className={styles['modal-send-resume__input']}
          control={control}
          maxLength={100}
        />
        <Editor
          ref={editorRef}
          label="Description"
          className={styles['modal-send-resume__textarea']}
          maxLimit={1023}
        />
        <p className={styles['modal-send-resume__error']}>
          {createResumeErrors && Object.values(createResumeErrors)[0]}
        </p>
        <Button
          variant="accent"
          title="Send Candidates Resume"
          className={styles['modal-send-resume__body-button']}
          onClick={handleSubmit(onSubmit)}
          loading={loadingSendResume}
        />
      </div>
    </CenterModal>
  );
});
