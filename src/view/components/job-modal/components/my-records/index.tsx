import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import React, { memo, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';

import { CandidateRecord } from '~/models/admin';
import {
  addLiveJobRecord,
  setRecordEditMode,
  setSelectedRecordId,
  updateLiveJobRecord,
} from '~/modules/adminLiveJobs/actions';
import { useDispatch, useSelector } from '~/store';
import { RecordFormValues } from '~/types/formValues';
import { LiveJobRecordFormValidation } from '~/utils/validations';
import { Icon } from '~/view/components/icon';
import { Loader } from '~/view/components/loader';

import { RecordCard } from './record-card';
import styles from './styles.scss';

export const MyRecords: React.FC = memo(function MyRecords() {
  const dispatch = useDispatch();
  const { liveJobsRecords, editMode, loadingLiveJobsRecord } = useSelector(
    state => state.adminLiveJobs,
  );
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const {
    formState: { errors },
    register,
    setValue,
    handleSubmit,
  } = useForm<RecordFormValues>({
    defaultValues: {
      record: null,
    },
    resolver: yupResolver(LiveJobRecordFormValidation),
  });

  const createRecord = useCallback(
    (values: { record: string }) => {
      if (editMode) {
        dispatch(updateLiveJobRecord.request({ text: values.record }));
        dispatch(setRecordEditMode({ editMode: false }));
      } else {
        dispatch(addLiveJobRecord.request({ text: values.record }));
      }

      setValue('record', '');
    },
    [dispatch, setValue, editMode],
  );

  const handleRecordFocus = useCallback(() => {
    textareaRef.current?.focus();
  }, []);

  const setRecordForEdit = useCallback(
    (id: number) => {
      dispatch(setSelectedRecordId({ selectedRecordId: id }));
      const recordForEdit = liveJobsRecords.find((item: CandidateRecord) => item.id === id);
      handleRecordFocus();
      dispatch(setRecordEditMode({ editMode: true }));
      if (recordForEdit) {
        setValue('record', recordForEdit?.text);
      }
    },
    [dispatch, liveJobsRecords, setValue, handleRecordFocus],
  );

  const { ref: textareaFormRef, ...textareaProps } = register('record');

  return (
    <div className={styles['my-records']}>
      {loadingLiveJobsRecord ? (
        <Loader loading />
      ) : (
        <>
          {!liveJobsRecords.length ? (
            <p className={styles['my-records-empty']}>No records</p>
          ) : (
            <div className={styles['my-records__body']}>
              {liveJobsRecords?.map((record: CandidateRecord) => (
                <RecordCard record={record} key={record.id} setRecordForEdit={setRecordForEdit} />
              ))}
            </div>
          )}
          <div className={styles['my-records__footer']}>
            <textarea
              ref={ref => {
                textareaRef.current = ref;
                textareaFormRef(ref);
              }}
              className={classNames(styles['my-records__input'], {
                [styles['my-records__input--error']]: errors.record,
              })}
              placeholder="Add record..."
              onFocus={handleRecordFocus}
              {...textareaProps}
            />
            <button
              className={styles['my-records__save-record-button']}
              onClick={handleSubmit(createRecord)}
            >
              <Icon name="send" className={styles['my-records__save-record-icon']} />
            </button>
          </div>
          {errors.record && (
            <p className={styles['my-records__error-message']}>{errors.record.message}</p>
          )}
        </>
      )}
    </div>
  );
});
