import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import React, { memo, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';

import { CandidateRecord } from '~/models/admin';
import {
  addCandidateRecord,
  setRecordEditMode,
  setSelectedRecordId,
  updateCandidateRecord,
} from '~/modules/adminCandidates/actions';
import { useDispatch, useSelector } from '~/store';
import { RecordFormValues } from '~/types/formValues';
import { CandidateRecordFormValidation } from '~/utils/validations';
import { Icon } from '~/view/components/icon';
import { Loader } from '~/view/components/loader';

import { RecordCard } from './record-card';
import styles from './styles.scss';

export const MyRecords: React.FC = memo(function MyRecords() {
  const dispatch = useDispatch();
  const { candidateRecords, editMode, loadingCandidateRecord } = useSelector(
    state => state.adminCandidates,
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
    resolver: yupResolver(CandidateRecordFormValidation),
  });

  const createRecord = useCallback(
    (values: { record: string }) => {
      if (editMode) {
        dispatch(updateCandidateRecord.request({ text: values.record }));
        dispatch(setRecordEditMode({ editMode: false }));
      } else {
        dispatch(addCandidateRecord.request({ text: values.record }));
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
      const recordForEdit = candidateRecords.find((item: CandidateRecord) => item.id === id);
      handleRecordFocus();
      dispatch(setRecordEditMode({ editMode: true }));
      if (recordForEdit) {
        setValue('record', recordForEdit?.text);
      }
    },
    [dispatch, candidateRecords, setValue, handleRecordFocus],
  );

  const { ref: textareaFormRef, ...textareaProps } = register('record');

  return (
    <div className={styles['my-records']}>
      {loadingCandidateRecord ? (
        <Loader loading />
      ) : (
        <>
          {!candidateRecords.length ? (
            <p className={styles['my-records-empty']}>No records</p>
          ) : (
            <div className={styles['my-records__body']}>
              {candidateRecords?.map((record: CandidateRecord) => (
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
