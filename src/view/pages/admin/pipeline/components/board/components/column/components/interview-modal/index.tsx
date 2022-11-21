import { yupResolver } from '@hookform/resolvers/yup';
import { differenceInCalendarDays, differenceInMinutes } from 'date-fns';
import React, { memo, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { MatchedJobSteps } from '~/models/common';
import {
  arrangeInterview,
  setColumns,
  toggleInterviewModalVisibility,
  toggleSuccessModalVisibility,
} from '~/modules/adminPipeline/actions';
import { adminsAsSelectOptionsSelector } from '~/modules/manageAdmins/selectors';
import { Admin } from '~/services/api/Admin';
import { useDispatch, useSelector } from '~/store';
import { ArrangeInterviewFormValues } from '~/types/formValues';
import { getArrangeInterviewFormValues } from '~/utils/initialFormValues';
import { ArrangeInterviewValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { DatePicker } from '~/view/components/date-picker';
import { Image } from '~/view/components/image';
import { Input } from '~/view/components/input';
import { CenterModal } from '~/view/components/modals';
import { Select, SelectOption } from '~/view/components/select';
import { Textarea } from '~/view/components/textarea';
import { TimePicker } from '~/view/components/time-picker';

import styles from './styles.scss';

const emptyOptions: SelectOption[] = [];

export const InterviewModal: React.FC = memo(function InterviewModal() {
  const dispatch = useDispatch();
  const modalVisibility = useSelector(
    state => state.adminMatchedJobsPipeline.interviewModalVisibility,
  );
  const { selectedMatchedJob, editInterviewMode } = useSelector(
    state => state.adminMatchedJobsPipeline,
  );
  const adminsAsSelectOptions = useSelector(adminsAsSelectOptionsSelector);
  const columns = useSelector(state => state.adminMatchedJobsPipeline.initialColumns);
  const updatingStatus = useSelector(state => state.adminMatchedJobsPipeline.arrangingInterview);
  const matchedInterview = useSelector(
    state => state.adminMatchedJobsPipeline.selectedMatchedJob?.interview,
  );

  const interview = matchedInterview || null;

  const { control, handleSubmit, watch, setError, setValue } = useForm<ArrangeInterviewFormValues>({
    defaultValues: getArrangeInterviewFormValues(interview),
    resolver: yupResolver(ArrangeInterviewValidation),
  });

  const selectedAdmin = watch('admin') as unknown as number;

  const handleCloseModal = useCallback(() => {
    dispatch(toggleInterviewModalVisibility());
  }, [dispatch]);

  const loadAdmins = useCallback(
    async (value): Promise<SelectOption[]> => {
      const {
        data: { data },
      } = await Admin.getAllAdmins({
        offset: 0,
        limit: 10,
        search: value,
      });

      const admins = data.results.map(admin => ({
        value: admin.id,
        label: `${admin.firstName} ${admin.lastName}`,
      }));

      setValue('admin', admins.find(admn => admn.value === selectedAdmin) as SelectOption);

      return admins;
    },
    [selectedAdmin, setValue],
  );

  const time = watch('time');
  const date = watch('date');
  const checkIsTimePast = differenceInMinutes(new Date(time), new Date());
  const checkIsDatePast = differenceInCalendarDays(new Date(date), new Date());

  useEffect(() => {
    if (checkIsDatePast <= 0 && checkIsTimePast && checkIsTimePast <= 0) {
      setError('time', { type: 'error', message: 'Chosen time is passed!' });
    } else {
      setError('time', {});
    }
  }, [checkIsTimePast, setError, time, checkIsDatePast]);

  const onSubmit = useCallback(
    values => {
      if (!time) {
        setError('time', { type: 'warning', message: 'Time is Required!' });
      }
      if (selectedMatchedJob) {
        const sourceColumn = columns[4];
        const destColumn = columns[5];
        const sourceItems = [...sourceColumn.items];
        const destItems = [...destColumn.items];
        if (editInterviewMode) {
          destItems.splice(selectedMatchedJob?.index as number, 1);
          dispatch(
            arrangeInterview.request({
              formValues: { ...values, matched: selectedMatchedJob.id },
              cb: interview => {
                dispatch(
                  setColumns({
                    ...columns,
                    5: {
                      ...destColumn,
                      items: [
                        {
                          ...selectedMatchedJob,
                          interview,
                          step: MatchedJobSteps.InterviewArranged,
                        },
                        ...destItems,
                      ],
                    },
                  }),
                );
              },
              onSuccess: () => {
                dispatch(toggleInterviewModalVisibility());
                dispatch(toggleSuccessModalVisibility());
              },
            }),
          );
        } else {
          sourceItems.splice(selectedMatchedJob?.index as number, 1);
          dispatch(
            arrangeInterview.request({
              formValues: { ...values, matched: selectedMatchedJob.id },
              cb: interview => {
                dispatch(
                  setColumns({
                    ...columns,
                    4: {
                      ...sourceColumn,
                      items: sourceItems,
                    },
                    5: {
                      ...destColumn,
                      items: [
                        {
                          ...selectedMatchedJob,
                          interview,
                          step: MatchedJobSteps.InterviewArranged,
                        },
                        ...destItems,
                      ],
                    },
                  }),
                );
              },
              onSuccess: () => {
                dispatch(toggleInterviewModalVisibility());
                dispatch(toggleSuccessModalVisibility());
              },
            }),
          );
        }
      }
    },
    [selectedMatchedJob, dispatch, columns, editInterviewMode, time, setError],
  );

  return (
    <CenterModal
      onClose={handleCloseModal}
      visible={modalVisibility}
      title="Arrange interview"
      className={styles['modal']}
    >
      <DatePicker
        className={styles['modal__field']}
        label="Date"
        name="date"
        placeholder="Choose a date"
        control={control}
      />
      <TimePicker
        placeholder="Choose a time"
        name="time"
        control={control}
        label="Time"
        className={styles['modal__field']}
      />
      <Select
        loadOptions={value => loadAdmins(value)}
        async
        searchable
        label="Assign admin"
        placeholder="Select"
        name="admin"
        control={control}
        options={adminsAsSelectOptions}
        className={styles['modal__field']}
      />
      <Select
        className={styles['modal__field']}
        searchable
        multiSelect
        creatable
        options={emptyOptions}
        name="participants"
        label="Participants"
        placeholder="Add guests"
        control={control}
        max={5}
        dropdownIndicatorStyles={{ display: 'none' }}
      />
      <Textarea
        className={styles['modal__field']}
        maxLength={500}
        name="message"
        placeholder="Your message..."
        label="Message"
        control={control}
      />
      <div className={styles['modal__participants']}>
        <div className={styles['modal__participant']}>
          <Image
            className={styles['modal__participant-photo']}
            alt={selectedMatchedJob?.candidateName || 'Candidate name'}
            src={selectedMatchedJob?.avatar || null}
            type="candidate"
          />
          <span className={styles['modal__participant-name']}>
            {selectedMatchedJob?.candidateName}
          </span>
        </div>
        <div className={styles['modal__participant']}>
          <Image
            className={styles['modal__participant-photo']}
            alt="Company name"
            src={null}
            type="company"
          />
          <span className={styles['modal__participant-name']}>
            {selectedMatchedJob?.managerName || 'No HR manager'}
          </span>
        </div>
      </div>
      <Input
        className={styles['modal__field']}
        placeholder="Location or link to meeting"
        name="location"
        label="Add location or meeting link"
        control={control}
      />
      <Button
        onClick={handleSubmit(onSubmit)}
        title="Send request"
        variant="accent"
        className={styles['modal__submit-btn']}
        loading={updatingStatus}
      />
    </CenterModal>
  );
});
