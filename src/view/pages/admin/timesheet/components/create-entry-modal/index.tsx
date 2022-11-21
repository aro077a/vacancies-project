import { yupResolver } from '@hookform/resolvers/yup';
import { addDays, format, startOfISOWeek } from 'date-fns';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { FieldPath, useFieldArray, useForm } from 'react-hook-form';

import { CustomSelectValueType, ExpensesTabType, TimeSheetTabType } from '~/models/candidate';
import { PaymentType } from '~/models/common';
import {
  createAdminEntry,
  getAdminTimesheet,
  setSelectedCandidate,
  setSelectedCompany,
} from '~/modules/adminTimesheet/actions';
import { getCandidatePipeline } from '~/modules/adminTimesheet/actions';
import { companiesAndPositionsAsSelectOptionsSelector } from '~/modules/adminTimesheet/selectors';
import { useDispatch, useSelector } from '~/store';
import { CreateEntryFormValues } from '~/types/formValues';
import { CreateTimesheetEntryRequestParams } from '~/types/requests';
import { iterateOverErrorDetailsEachKey } from '~/utils/errors';
import { CreateCandidateTimesheetFormValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { Icon } from '~/view/components/icon';
import { CenterModal } from '~/view/components/modals';
import { SelectOption } from '~/view/components/select';
import { Tab, Tabs } from '~/view/components/tabs';
import { WeekPicker } from '~/view/components/week-picker';

import { AdditionalExpensesTab } from './additional-expenses-tab';
import { CustomSelect } from './custom-select';
import styles from './styles.scss';
import { TimesheetTab } from './timesheet-tab';

interface CreateEntryModalProps {
  visible: boolean;
  onClose: () => void;
  openSubmitModal: () => void;
}

const tabs: Tab[] = [
  { id: 1, label: 'Timesheet' },
  { id: 2, label: 'Additional expenses' },
];

type priceType = {
  name: string;
  price: string;
  attachments: File[];
};

export const CreateEntryModal: React.FC<CreateEntryModalProps> = memo(function CreateEntryModal({
  visible,
  openSubmitModal,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [candidatePaymentType, setCandidatePaymentType] = useState<number>(0);
  const [candidateHourlyRate, setCandidateHourlyRate] = useState<number>(0);
  const [candidateDailyRate, setCandidateDailyRate] = useState<number>(0);
  const [hourlyTotalSummary, setHourlyTotalSummary] = useState<number>(1);
  const [dailyTotalSummary, setDailyTotalSummary] = useState<number>(0);
  const [totalHours, setTotalHours] = useState<number>(0);
  const [totalDays, setTotalDays] = useState<number>(0);
  const dispatch = useDispatch();

  const companiesAndPositionsAsSelectOptions = useSelector(
    companiesAndPositionsAsSelectOptionsSelector,
  );

  const {
    createAdminEntryErrors,
    creatingAdminEntry,
    candidatesWithTimesheet,
    selectedCandidate,
    selectedCompany,
  } = useSelector(state => state.adminTimesheet);

  const companyValue = selectedCompany.value ? selectedCompany : null;
  const candidateValue = selectedCandidate.value ? selectedCandidate : null;

  const selectedWeek = useMemo(() => {
    if (selectedDays.length === 7) {
      return `${format(new Date(selectedDays[0]), 'dd/MM/yy')} – ${format(
        new Date(selectedDays[6]),
        'dd/MM/yy',
      )}`;
    }
    return '';
  }, [selectedDays]);

  const { control, handleSubmit, register, watch, setValue, setError, reset } =
    useForm<CreateEntryFormValues>({
      defaultValues: {
        rows: [
          {
            name: '',
            description: '',
            days: [],
            hours: [],
          },
        ],
        additionalExpenses: [
          {
            attachments: [],
            name: '',
            price: '',
          },
        ],
        week: '',
        matched: null,
      },
      resolver: yupResolver(CreateCandidateTimesheetFormValidation),
    });

  const {
    fields: timesheetRowFields,
    append: timesheetRowAppend,
    remove: timesheetRowRemove,
  } = useFieldArray({ control, name: 'rows' });

  const {
    fields: expensesFields,
    append: expenseAppend,
    remove: expenseRemove,
  } = useFieldArray({ control, name: 'additionalExpenses' });

  useEffect(() => {
    const weekStart = startOfISOWeek(new Date());

    const days = [];
    for (let i = 0; i <= 6; i++) {
      days.push(addDays(weekStart, i));
    }
    setSelectedDays(days);
    dispatch(getCandidatePipeline.init({ initialFetch: true }));
  }, [dispatch]);

  const handleActiveTabChange = useCallback((tabId: number) => {
    setActiveTab(tabId);
  }, []);

  const openWeek = useCallback(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    const startWeek = startOfISOWeek(new Date());
    const formattedStartWeek = format(new Date(startWeek), 'yyyy-MM-dd');
    setValue('week', formattedStartWeek);
  });

  useEffect(() => {
    if (createAdminEntryErrors) {
      iterateOverErrorDetailsEachKey<FieldPath<CreateEntryFormValues>>(
        createAdminEntryErrors,
        (key, value) => {
          setError(key, { type: 'validate', message: value });
        },
      );
    }
  }, [createAdminEntryErrors, setError]);

  const onSubmit = useCallback(
    (values: CreateTimesheetEntryRequestParams) => {
      dispatch(
        createAdminEntry.request({
          formValues: values,
          onSuccess: () => {
            onClose();
            openSubmitModal();
            reset();
            dispatch(getAdminTimesheet.init({ initialFetch: true }));
          },
        }),
      );
    },
    [dispatch, onClose, openSubmitModal, reset],
  );

  const onCandidateChangeHandler = useCallback(
    (e: CustomSelectValueType) => {
      dispatch(setSelectedCompany(e));
      setValue('matched', e.matched);
      if (PaymentType.Hourly === e?.paymentType) {
        setCandidatePaymentType(PaymentType.Hourly);
        setCandidateHourlyRate(+e.contractPrice);
      } else {
        setCandidatePaymentType(PaymentType.Daily);
        setCandidateDailyRate(+e.contractPrice);
        setDailyTotalSummary(+e.contractPrice);
      }
    },
    [setValue, dispatch],
  );

  const rows = watch('rows');
  const price = watch('additionalExpenses');

  useEffect(() => {
    if (rows?.length) {
      const total = rows?.reduce((acc, nestedArr) => {
        nestedArr?.hours?.forEach(hour => {
          acc += +hour;
        });
        return acc;
      }, 0);
      const additionalPriceForHours = price
        .map((item: priceType) => item.price)
        .reduce((acc, curr) => acc + Number(curr.slice(1)), 0);
      setTotalHours(total);
      setHourlyTotalSummary(additionalPriceForHours + total * candidateHourlyRate);
    }
  }, [rows, candidateHourlyRate, price]);

  useEffect(() => {
    if (rows?.length) {
      const total = rows?.reduce((acc, nestedArr) => {
        nestedArr?.days?.forEach(day => {
          acc += Number(day);
        });
        return acc;
      }, 0);
      const additionalPriceForDays = price
        .map((item: priceType) => item.price)
        .reduce((acc, curr) => acc + Number(curr.slice(1)), 0);
      setTotalDays(total);
      if (totalDays) {
        setDailyTotalSummary(additionalPriceForDays + totalDays * candidateDailyRate);
      }
    }
  }, [rows, candidateDailyRate, totalDays, price]);

  const onMatchedCandidateChangeHandler = useCallback(
    (option: SelectOption) => {
      dispatch(setSelectedCandidate(option));
      dispatch(getCandidatePipeline.init({ initialFetch: true }));
    },
    [dispatch],
  );

  return (
    <CenterModal
      title="Create an entry"
      className={styles['modal-entry']}
      visible={visible}
      onClose={onClose}
    >
      <div className={styles['modal-entry__container']}>
        <div className={styles['modal-entry__container-header']}>
          <div className={styles['modal-entry__selects']}>
            <CustomSelect
              placeholder="Select"
              onChange={onMatchedCandidateChangeHandler}
              value={candidateValue}
              options={candidatesWithTimesheet}
              label="Select a candidate"
            />
            <CustomSelect
              value={companyValue}
              label="Select Company and position"
              onChange={(e: CustomSelectValueType) => onCandidateChangeHandler(e)}
              options={companiesAndPositionsAsSelectOptions}
              placeholder="Select Company and position"
            />
          </div>
          <div className={styles['modal-entry__container-weeks']}>
            {open ? (
              <WeekPicker
                name="week-picker"
                selectedDays={selectedDays}
                setSelectedDays={setSelectedDays}
                setOpen={setOpen}
              />
            ) : (
              <>
                <p className={styles['modal-entry__container-weeks-label']}>Select Week:</p>
                <Icon
                  name="calendar"
                  className={styles['modal-entry__container-weeks-input--icon']}
                />
                <input
                  type="text"
                  name="week"
                  placeholder=""
                  className={styles['modal-entry__container-weeks-input']}
                  onFocus={openWeek}
                  defaultValue={selectedWeek}
                  onBlur={() => setOpen(false)}
                />
              </>
            )}
          </div>
        </div>
        <div className={styles['modal-entry__container-tab']}>
          <Tabs
            className={styles['page__tabs']}
            tabs={tabs}
            activeTabId={activeTab}
            onChange={handleActiveTabChange}
          />
          {activeTab === 1 && (
            <>
              {timesheetRowFields.map((field: TimeSheetTabType, index: number) => {
                return (
                  <TimesheetTab
                    key={field.id}
                    index={index}
                    selectedDays={selectedDays}
                    candidatePaymentType={candidatePaymentType}
                    rowCount={index + 1}
                    register={register}
                    remove={timesheetRowRemove}
                    control={control}
                  />
                );
              })}
            </>
          )}
          {activeTab === 2 && (
            <>
              {expensesFields.map((field: ExpensesTabType, index: number) => {
                return (
                  <AdditionalExpensesTab
                    key={field.id}
                    index={index}
                    rowCount={index + 1}
                    remove={expenseRemove}
                    control={control}
                    watch={watch}
                    setValue={setValue}
                    register={register}
                  />
                );
              })}
            </>
          )}
        </div>
        <div className={styles['modal-entry__container-footer']}>
          {activeTab === 1 ? (
            <div
              className={styles['modal-entry__container-footer-add']}
              onClick={() =>
                timesheetRowAppend({
                  name: '',
                  description: '',
                  days: [],
                  hours: [],
                })
              }
            >
              Add new row <span>+</span>
            </div>
          ) : (
            <div
              className={styles['modal-entry__container-footer-add']}
              onClick={() =>
                expenseAppend({
                  name: '',
                  price: '',
                  attachments: [],
                })
              }
            >
              Add new expense <span>+</span>
            </div>
          )}
          <div className={styles['modal-entry__container-footer-summary']}>
            {candidatePaymentType === PaymentType.Hourly ? (
              <p className={styles['modal-entry__container-footer-summary-total']}>
                Total summary: <span>${hourlyTotalSummary}</span>
              </p>
            ) : (
              <p className={styles['modal-entry__container-footer-summary-total']}>
                Total summary: <span>${dailyTotalSummary}</span>
              </p>
            )}
            {candidatePaymentType === PaymentType.Hourly && (
              <p className={styles['modal-entry__container-footer-summary-time']}>
                Total time: <span>{totalHours}h</span>
              </p>
            )}
            <Button
              variant="accent"
              title="Submit for approval"
              className={styles['modal-manager__body-button']}
              onClick={handleSubmit(onSubmit)}
              loading={creatingAdminEntry}
            />
          </div>
        </div>
      </div>
    </CenterModal>
  );
});
