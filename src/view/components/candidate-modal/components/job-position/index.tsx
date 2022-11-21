import React, { memo, useCallback } from 'react';

import { updateCandidateJobMatched } from '~/modules/adminCandidates/actions';
import { useDispatch, useSelector } from '~/store';
import { JobModal } from '~/view/components/job-modal';
import { Tab } from '~/view/components/tabs';

import { Card } from './components/Card';
import { PotentialJobSection } from './components/potential-job-section';
import styles from './styles.scss';

const tabs: Tab[] = [
  { id: 1, label: 'Description' },
  { id: 3, label: 'Feedback' },
  { id: 4, label: 'My records' },
];

export const JobPosition: React.FC = memo(function JobPosition() {
  const dispatch = useDispatch();
  const matchedJobs = useSelector(state => state.adminCandidates.candidateJobsMatched);
  const candidateInterestedJobs = useSelector(
    state => state.adminCandidates.candidateInterestedJobs,
  );
  const showedInterestInCandidate = useSelector(
    state => state.adminCandidates.jobsInterestedInCandidate,
  );

  const handleJobMatch = useCallback(
    (jobId: number) => {
      dispatch(
        updateCandidateJobMatched.request({
          jobId,
          status: true,
        }),
      );
    },
    [dispatch],
  );

  const handleJobUnmatch = useCallback(
    (jobId: number) => {
      dispatch(
        updateCandidateJobMatched.request({
          jobId,
          status: false,
        }),
      );
    },
    [dispatch],
  );

  return (
    <div className={styles['job-position']}>
      <div className={styles['job-position__block']}>
        <h4 className={styles['job-position__block-title']}>
          Matched <span className={styles['job-position__count']}>({matchedJobs.length})</span>
        </h4>
        <div className={styles['job-position__block-list']}>
          {matchedJobs.map(job => (
            <Card
              onUnmatchClick={handleJobUnmatch}
              onMatchClick={handleJobMatch}
              {...job}
              key={job.id}
            />
          ))}
        </div>
      </div>
      <div className={styles['job-position__block']}>
        <h4 className={styles['job-position__block-title']}>
          Showed their interest{' '}
          <span className={styles['job-position__count']}>
            ({showedInterestInCandidate.length})
          </span>
        </h4>
        <div className={styles['job-position__block-list']}>
          {showedInterestInCandidate.map(job => (
            <Card
              onUnmatchClick={handleJobUnmatch}
              onMatchClick={handleJobMatch}
              key={job.id}
              {...job}
            />
          ))}
        </div>
      </div>
      <div className={styles['job-position__block']}>
        <h4 className={styles['job-position__block-title']}>
          Interested in{' '}
          <span className={styles['job-position__count']}>({candidateInterestedJobs.length})</span>
        </h4>
        <div className={styles['job-position__block-list']}>
          {candidateInterestedJobs.map(job => (
            <Card
              onUnmatchClick={handleJobUnmatch}
              onMatchClick={handleJobMatch}
              key={job.id}
              {...job}
            />
          ))}
        </div>
      </div>
      <PotentialJobSection onMatchClick={handleJobMatch} onUnmatchClick={handleJobUnmatch} />
      <JobModal tabs={tabs} />
    </div>
  );
});
