import React, { memo } from 'react';

import { UnmatchedJob } from '~/models/admin';
import { MatchedJobSteps } from '~/models/common';
import { Image } from '~/view/components/image';

import { DropdownType, PipelineStatusDropdown } from './components/dots-dropdown';
import styles from './styles.scss';

type Props = {
  index: number;
  columnId: MatchedJobSteps;
};

const dropdownItems: DropdownType[] = [
  {
    id: 1,
    title: 'Candidate is matched',
  },
  {
    id: 2,
    title: 'Candidate agreed to submittal',
  },
  {
    id: 3,
    title: 'CV is sent',
  },
  {
    id: 4,
    title: 'Employer accepted the candidate',
  },
  {
    id: 5,
    title: 'Interview arranged',
  },
  {
    id: 6,
    title: 'Placement approved',
  },
];

export const ColumnCardNonInteractive: React.FC<UnmatchedJob & Props> = memo(function ColumnCard(
  props,
) {
  const { id, index, positionName, salary, location, columnId, companyName, companyLogo } = props;

  return (
    <div className={styles['card']}>
      <div className={styles['card__body']}>
        <div className={styles['card__job-info']}>
          <h4 className={styles['card__job-name']}>{positionName}</h4>
          <span className={styles['card__job-location']}>{location}</span> |{' '}
          <span className={styles['card__job-salary']}>${salary}</span>
        </div>
        <div className={styles['card__candidate-info']}>
          <Image
            className={styles['card__candidate-photo']}
            type="company"
            src={companyLogo}
            alt={`${companyName}'s logo`}
          />
          <p className={styles['card__candidate-name']}>{companyName}</p>
        </div>
      </div>
      <PipelineStatusDropdown
        jobId={id}
        cardId={id}
        index={index}
        columnId={columnId}
        items={dropdownItems}
      />
    </div>
  );
});
