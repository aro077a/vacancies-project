import React, { memo, useCallback, useState } from 'react';

import {
  getLiveJob,
  setSelectedLiveJob,
  toggleJobModalVisibility,
} from '~/modules/adminLiveJobs/actions';
import { useDispatch } from '~/store';
import { Icon } from '~/view/components/icon';
import { useOutsideClick } from '~/view/hooks/useOutsideClick';

import styles from './styles.scss';

export type DropdownType = {
  id: number;
  title: string;
};

type Props = {
  items: DropdownType[];
  columnId: number;
  cardId: number;
  index: number;
  jobId: number;
};

export const PipelineStatusDropdown: React.FC<Props> = memo(function PipelineStatusDropdown({
  jobId,
}) {
  const dispatch = useDispatch();
  const [dropdownVisibility, setDropdownVisibility] = useState(false);

  const toggleDropdownVisibility = useCallback(() => {
    setDropdownVisibility(prevValue => !prevValue);
  }, []);

  const dropdownRef = useOutsideClick<HTMLDivElement>({
    handler: useCallback(() => {
      if (dropdownVisibility) {
        setDropdownVisibility(false);
      }
    }, [dropdownVisibility]),
  });

  const openJobModalClick = useCallback(() => {
    dispatch(
      getLiveJob.request({
        jobId,
        cb: job => {
          dispatch(setSelectedLiveJob(job));
          dispatch(toggleJobModalVisibility());
          toggleDropdownVisibility();
        },
      }),
    );
  }, [jobId, dispatch, toggleDropdownVisibility]);

  return (
    <div ref={dropdownRef} className={styles['dropdown']}>
      <button onClick={toggleDropdownVisibility} className={styles['dropdown__dots']}>
        <Icon width="3px" height="15px" name="vertical-dots" />
      </button>
      {dropdownVisibility && (
        <div className={styles['dropdown__content']}>
          <p className={styles['dropdown__header']}>Options</p>
          <button onClick={openJobModalClick} className={styles['dropdown__open-btn']}>
            Open job
          </button>
        </div>
      )}
    </div>
  );
});
