import { formatDistanceToNow } from 'date-fns';
import React, { memo, useCallback, useMemo } from 'react';

import { CandidateRecord } from '~/models/admin';
import { deleteLiveJobRecord, setSelectedRecordId } from '~/modules/adminLiveJobs/actions';
import { useDispatch } from '~/store';
import { DotsDropdown, DropdownItem } from '~/view/components/dots-dropdown';
import { Image } from '~/view/components/image';

import styles from './styles.scss';

type RecordCardProps = {
  record: CandidateRecord;
  setRecordForEdit: (arg0: number) => void;
};

export const RecordCard: React.FC<RecordCardProps> = memo(function RecordCard({
  record,
  setRecordForEdit,
}) {
  const { id, adminName, adminPhoto, text, updatedAt } = record;
  const dispatch = useDispatch();

  const removeCandidateRecord = useCallback(() => {
    dispatch(setSelectedRecordId({ selectedRecordId: id }));
    dispatch(deleteLiveJobRecord.request({ recordId: id }));
  }, [dispatch, id]);

  const recordDropdownItems = useMemo<DropdownItem[]>(
    () => [
      {
        label: 'Edit record',
        onClick: () => setRecordForEdit(id),
      },
      {
        label: 'Delete record',
        onClick: () => removeCandidateRecord(),
      },
    ],
    [id, setRecordForEdit, removeCandidateRecord],
  );
  return (
    <div className={styles['my-records__body']}>
      <div className={styles['my-records__body-block']}>
        <div className={styles['my-records__body-block-children']}>
          <div className={styles['my-records__body-user']}>
            <div className={styles['my-records__body-user-content']}>
              <Image
                type="candidate"
                className={styles['my-records__body-user-image']}
                alt="candidate"
                src={adminPhoto}
              />
            </div>
            <div className={styles['my-records__body-user-info']}>
              <div className={styles['my-records__body-user-block']}>
                <p className={styles['my-records__body-user-name']}>{adminName}</p>
                <p className={styles['my-records__body-user-date']}>
                  {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
                </p>
              </div>
              <p className={styles['my-records__body-user-message']}>{text}</p>
            </div>
          </div>
        </div>
      </div>
      <DotsDropdown className={styles['my-records__dots-dropdown']} items={recordDropdownItems} />
    </div>
  );
});
