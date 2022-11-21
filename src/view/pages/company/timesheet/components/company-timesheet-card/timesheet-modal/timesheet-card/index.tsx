import { addDays, format, startOfISOWeek } from 'date-fns';
import React, { Fragment, useMemo } from 'react';

import {
  AttachmentsType,
  CompanyTimesheetById,
  FormattedDateType,
  TimesheetExpenses,
  TimesheetRows,
} from '~/models/company';
import { generateUuid } from '~/utils/helpers';
import { Icon } from '~/view/components/icon';
import { Loader } from '~/view/components/loader';

import { FilesCard } from './file-card';
import styles from './styles.scss';

type Props = {
  companyTimesheet: CompanyTimesheetById | null;
  loadingCompanyTimesheet: boolean;
};

export const TimesheetCard: React.FC<Props> = ({ companyTimesheet, loadingCompanyTimesheet }) => {
  const firstDOW = useMemo(
    () => companyTimesheet?.week && startOfISOWeek(new Date(companyTimesheet.week)),
    [companyTimesheet?.week],
  );

  const shortWeekDaysArray = useMemo(
    () => Array.from(Array(7)).map((e, i) => firstDOW && format(addDays(firstDOW, i), 'EEE dd')),
    [firstDOW],
  );

  return (
    <div className={styles['timesheet-card']}>
      {loadingCompanyTimesheet ? (
        <Loader loading={loadingCompanyTimesheet} />
      ) : (
        <>
          {companyTimesheet?.rows.map((item: TimesheetRows) => {
            const formattedData = {
              ...item,
              id: item.id,
              name: item.name,
              description: item.description,
              days: item?.days?.map((el: number | boolean, index: number) => {
                return {
                  id: generateUuid(),
                  day: el,
                  week: shortWeekDaysArray[index],
                };
              }),
              hours: item?.hours?.map((el: number, index: number) => {
                return {
                  id: generateUuid(),
                  hour: el,
                  week: shortWeekDaysArray[index],
                };
              }),
            };
            return (
              <Fragment key={item.id}>
                <div className={styles['timesheet-card__info']}>
                  <p className={styles['timesheet-card__info-name']}>
                    Project Name: <span>{item.name}</span>
                  </p>
                  <p className={styles['timesheet-card__info-desc']}>
                    Work description: <span>{item.description}</span>
                  </p>
                </div>
                <div className={styles['timesheet-card__hours']}>
                  {companyTimesheet?.contractType === 'hour' &&
                    formattedData?.hours?.map((hour: FormattedDateType) => (
                      <div className={styles['timesheet-card__hours-items']} key={hour.id}>
                        <p className={styles['timesheet-card__hours-items-day']}>{hour.week}</p>
                        <p className={styles['timesheet-card__hours-items-hour']}>{hour.hour}h</p>
                      </div>
                    ))}
                </div>
                <div className={styles['timesheet-card__days']}>
                  {companyTimesheet?.contractType === 'day' &&
                    formattedData?.days?.map((day: FormattedDateType) => (
                      <div className={styles['timesheet-card__days-items']} key={day.id}>
                        <p className={styles['timesheet-card__days-items-day']}>{day.week}</p>
                        <p className={styles['timesheet-card__days-items-hour']}>
                          {day.day === true ? <Icon name="checkmark" /> : <></>}
                        </p>
                      </div>
                    ))}
                </div>
              </Fragment>
            );
          })}
          {companyTimesheet?.additionalExpenses.map((expenses: TimesheetExpenses) => (
            <div className={styles['timesheet-card__expenses']} key={expenses.id}>
              <p className={styles['timesheet-card__expenses-name']}>
                Expense Name: <span>{expenses.name}</span>
              </p>
              <p className={styles['timesheet-card__expenses-price']}>
                Price: <span>${expenses.price}</span>
              </p>
              <div className={styles['timesheet-card__expenses-attachments']}>
                <p className={styles['timesheet-card__expenses-attachments-info']}>Attachments:</p>
                {expenses.attachments.map((attachment: AttachmentsType) => (
                  <div
                    key={attachment.id}
                    className={styles['timesheet-card__expenses-attachments-file']}
                  >
                    <FilesCard {...attachment} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
