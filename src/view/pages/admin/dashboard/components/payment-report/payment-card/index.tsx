import classNames from 'classnames';
import { format } from 'date-fns';
import React, { memo } from 'react';

import { DashboardPaymentReports } from '~/models/admin';

import styles from './styles.scss';

type Props = {
  paymentReports: DashboardPaymentReports;
};

export const PaymentCard: React.FC<Props> = memo(function PaymentCard({ paymentReports }) {
  return (
    <div className={styles['payment-report__table-content-item']}>
      <div className={styles['payment-report__table-content-item-customer']}>
        <p className={styles['payment-report__table-content-item-customer--company']}>
          {paymentReports.companyName}
        </p>
        <p className={styles['payment-report__table-content-item-customer--location']}>
          {paymentReports.location}
        </p>
      </div>
      <p className={styles['payment-report__table-content-item-invoice']}>
        {format(new Date(paymentReports?.createdAt), 'dd/MM/yyyy')}
      </p>
      <p className={styles['payment-report__table-content-item-total']}>
        ${Number(paymentReports.total).toFixed(0)}
      </p>
      <p
        className={classNames(
          styles['payment-report__table-content-item-status'],
          paymentReports.externalStatus === 'Paid'
            ? styles['payment-report__table-content-item-status--paid']
            : styles['payment-report__table-content-item-status--unpaid'],
        )}
      >
        {paymentReports.externalStatus}
      </p>
    </div>
  );
});
