import React, { memo, useCallback } from 'react';

import { DashboardPaymentReports } from '~/models/admin';
import {
  getAdminDashboardPaymentReports,
  setDashboardBillingRange,
  setDashboardBillingRangeName,
} from '~/modules/adminDashboard/actions';
import { useDispatch, useSelector } from '~/store';
import { RootState } from '~/store/types';
import { Loader } from '~/view/components/loader';
import { SelectOption } from '~/view/components/select';
import { usePaginatedDataScrollList } from '~/view/hooks/usePaginatedDataScrollList';

import { CustomSelect } from './custom-select';
import { PaymentCard } from './payment-card';
import styles from './styles.scss';

const billingRanges: SelectOption[] = [
  { label: 'All billed', value: 0 },
  { label: 'Billed monthly', value: 1 },
  { label: 'Billed yearly', value: 2 },
];

export const PaymentReport: React.FC = memo(function PaymentReport() {
  const { dashboardPaymentReports, loadingDashboardPaymentReports } = useSelector(
    (state: RootState) => state.adminDashboard,
  );

  const dispatch = useDispatch();
  const { scrollListRef } = usePaginatedDataScrollList<HTMLTableRowElement>({
    useWindowScroll: true,
    loadingData: loadingDashboardPaymentReports,
    fetchDataFn: useCallback(
      initialFetch => {
        dispatch(getAdminDashboardPaymentReports.init({ initialFetch }));
      },
      [dispatch],
    ),
  });

  const billingRangeHandler = useCallback(
    (e: SelectOption) => {
      if (e.value === 0) {
        dispatch(setDashboardBillingRange({ externalStatus: '' }));
        dispatch(setDashboardBillingRangeName({ dashboardBillingRangeName: billingRanges[0] }));
      } else {
        dispatch(setDashboardBillingRange({ externalStatus: e.value.toString() }));
        dispatch(setDashboardBillingRangeName({ dashboardBillingRangeName: e }));
      }
    },
    [dispatch],
  );

  return (
    <div className={styles['payment-report']}>
      <div className={styles['payment-report__header']}>
        <h3 className={styles['payment-report__header-title']}>Report</h3>
        <CustomSelect
          options={billingRanges}
          onChange={billingRangeHandler}
          defaultValue={billingRanges[0]}
        />
      </div>
      <div className={styles['payment-report__table']}>
        <div className={styles['payment-report__table-header']}>
          <div className={styles['payment-report__table-header-customer']}>
            <p>Customer</p>
          </div>
          <div className={styles['payment-report__table-header-invoice']}>
            <p>Last Invoice sent</p>
          </div>
          <div className={styles['payment-report__table-header-total']}>
            <p>Total</p>
          </div>
          <div className={styles['payment-report__table-header-status']}>
            <p>Status</p>
          </div>
        </div>
        <div className={styles['payment-report__table-content']}>
          {!loadingDashboardPaymentReports && !dashboardPaymentReports.results.length ? (
            <div ref={scrollListRef} className={styles['payment-report__table-content-not-found']}>
              No payment reports found
            </div>
          ) : (
            <div ref={scrollListRef} className={styles['payment-report__table-content-items']}>
              {dashboardPaymentReports.results.map((paymentReports: DashboardPaymentReports) => (
                <PaymentCard key={paymentReports.id} paymentReports={paymentReports} />
              ))}
              {loadingDashboardPaymentReports && (
                <div className={styles['payment-report__table-content-items-loader']}>
                  <Loader loading={loadingDashboardPaymentReports} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
