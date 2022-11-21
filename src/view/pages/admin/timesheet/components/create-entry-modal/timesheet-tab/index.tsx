import { format } from 'date-fns';
import React, { memo } from 'react';
import { Control, UseFormRegister } from 'react-hook-form';

import { PaymentType } from '~/models/common';
import { CreateEntryFormValues } from '~/types/formValues';
import { Icon } from '~/view/components/icon';
import { Input } from '~/view/components/input';
import { Textarea } from '~/view/components/textarea';

import styles from './styles.scss';

interface TimesheetTabProps {
  selectedDays: string[] | Date[];
  rowCount: number;
  control: Control<CreateEntryFormValues>;
  register: UseFormRegister<CreateEntryFormValues>;
  remove: (arg0: number) => void;
  index: number;
  candidatePaymentType?: number | string;
}

export const TimesheetTab: React.FC<TimesheetTabProps> = memo(function TimesheetTab({
  selectedDays,
  rowCount,
  control,
  register,
  index,
  candidatePaymentType,
  remove,
}) {
  return (
    <>
      {candidatePaymentType === PaymentType.Hourly ? (
        <div className={styles['timesheet-tab']}>
          <div className={styles['timesheet-tab-row']}>
            <span>{rowCount}</span>
          </div>
          <div className={styles['timesheet-tab-fields']}>
            {index > 0 ? (
              <>
                <div className={styles['timesheet-tab-fields-line']} />
                <div
                  className={styles['timesheet-tab-fields-remove']}
                  onClick={() => remove(index)}
                >
                  <Icon name="close" className={styles['timesheet-tab-fields-remove-icon']} />
                  <span className={styles['timesheet-tab-fields-remove-text']}>Remove</span>
                </div>
              </>
            ) : (
              <></>
            )}
            <Input
              type="text"
              placeholder=""
              label="Project Name:"
              className={styles['timesheet-tab-input']}
              control={control}
              {...register(`rows.${index}.name` as const)}
            />
            <Textarea
              placeholder=""
              maxLength={255}
              label="Work Description:"
              className={styles['timesheet-tab-textarea']}
              control={control}
              {...register(`rows.${index}.description` as const)}
            />
            <div className={styles['timesheet-tab-days']}>
              {selectedDays.map((field: string | Date, fieldId: number) => {
                return (
                  <div key={fieldId} className={styles['timesheet-tab-days-block']}>
                    <Input
                      type="number"
                      placeholder=""
                      label={format(new Date(field), 'EEE dd')}
                      maxLength={2}
                      control={control}
                      defaultValue={+0}
                      {...register(`rows.${index}.hours.${fieldId}` as const)}
                    />
                    <span className={styles['timesheet-tab-days-block-mask']}>hours</span>
                    <Icon name="clock" className={styles['timesheet-tab-days-block-icon']} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles['timesheet-hourly-tab']}>
          {index > 0 && <div className={styles['timesheet-tab-fields-hourly-line']} />}
          <div className={styles['timesheet-tab-weekdays']}>
            <div className={styles['timesheet-tab-weekdays-info']}>
              <p>{rowCount}</p>
              <p>Working days:</p>
            </div>
            <div className={styles['timesheet-tab-weekday']}>
              {selectedDays.map((selectedDay: Date | string, key: number) => {
                return (
                  <div className={styles['timesheet-tab-weekday-item']} key={key}>
                    <input
                      type="checkbox"
                      className={styles['timesheet-tab-weekday-item-input']}
                      {...register(`rows.${index}.days.${key}` as const)}
                    />
                    <p className={styles['timesheet-tab-weekday-name']}>
                      {format(new Date(selectedDay), 'EEE')}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={styles['timesheet-tab-fields']}>
            {index > 0 ? (
              <div className={styles['timesheet-tab-fields-remove']} onClick={() => remove(index)}>
                <Icon name="close" className={styles['timesheet-tab-fields-remove-icon']} />
                <span className={styles['timesheet-tab-fields-remove-text']}>Remove</span>
              </div>
            ) : (
              <></>
            )}
            <Input
              type="text"
              placeholder=""
              label="Project Name:"
              className={styles['timesheet-tab-input']}
              control={control}
              {...register(`rows.${index}.name` as const)}
            />
            <Textarea
              placeholder=""
              maxLength={255}
              label="Work Description:"
              className={styles['timesheet-tab-textarea']}
              control={control}
              {...register(`rows.${index}.description` as const)}
            />
          </div>
        </div>
      )}
    </>
  );
});
