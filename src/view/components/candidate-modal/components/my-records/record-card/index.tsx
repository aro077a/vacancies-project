import { formatDistanceToNow } from 'date-fns';
import React, { memo, useCallback, useMemo } from 'react';

import { CandidateRecord } from '~/models/admin';
import { deleteCandidateRecord, setSelectedRecordId } from '~/modules/adminCandidates/actions';
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
    dispatch(deleteCandidateRecord.request({ recordId: id }));
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
    <div className={styles['my-records__body-content']}>
      <div className={styles['my-records__body-content-block']}>
        <div className={styles['my-records__body-content-block-children']}>
          <div className={styles['my-records__body-content-user']}>
            <div className={styles['my-records__body-content-user-content']}>
              <Image
                type="candidate"
                className={styles['my-records__body-content-user-image']}
                alt="candidate"
                src={adminPhoto}
              />
            </div>
            <div className={styles['my-records__body-content-user-info']}>
              <div className={styles['my-records__body-content-user-block']}>
                <p className={styles['my-records__body-content-user-name']}>{adminName}</p>
                <p className={styles['my-records__body-content-user-date']}>
                  {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
                </p>
              </div>
              <p className={styles['my-records__body-content-user-message']}>{text}</p>
            </div>
          </div>
        </div>
      </div>
      <DotsDropdown className={styles['my-records__dots-dropdown']} items={recordDropdownItems} />
    </div>
  );
});
