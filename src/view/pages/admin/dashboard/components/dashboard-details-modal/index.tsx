import classNames from 'classnames';
import React, { memo, useCallback, useMemo } from 'react';

import {
  Scoreboard,
  ScoreboardInterview,
  ScoreboardJob,
  ScoreboardPlacement,
  ScoreboardRevenue,
  ScoreboardTempWork,
} from '~/models/admin';
import { getScoreboardDetails } from '~/modules/adminDashboard/actions';
import { useDispatch, useSelector } from '~/store';
import { Loader } from '~/view/components/loader';
import { CenterModal } from '~/view/components/modals';
import { usePaginatedDataScrollList } from '~/view/hooks/usePaginatedDataScrollList';

import { ScoreboardInterviewCard } from './components/interview-card';
import { ScoreboardJobCard } from './components/job-card';
import { ScoreboardPlacementCard } from './components/placement-card';
import { ScoreboardRevenueCard } from './components/revenue-card';
import { ScoreboardTempWorkCard } from './components/temp-work-card';
import styles from './styles.scss';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const titles = {
  1: 'Jobs added details',
  2: 'Interviews arranged details',
  3: 'Placements made details',
  4: 'Revenue generated details',
  5: 'Temp working details',
};

const labels = {
  1: ['Company', 'Job position', 'Admin', 'Manager', 'Added'],
  2: ['Company', 'Job position', 'Admin', 'Manager', 'Candidate', 'Time', 'Arranged'],
  3: [
    'Company',
    'Job position',
    'Admin',
    'Manager',
    'Candidate',
    'Job created',
    'Invoice generated',
  ],
  4: ['Company', 'Job position', 'Admin', 'Job type', 'Candidate', 'Amount', 'Invoice sent'],
  5: ['Company', 'Job position', 'Admin', 'Candidate', 'Total', 'Time'],
};

export const DashboardDetailsModal: React.FC<Props> = memo(function DashboardDetailsModal({
  visible,
  onClose,
}) {
  const dispatch = useDispatch();
  const { loadingScoreboardDetails, scoreboardItem } = useSelector(state => state.adminDashboard);
  const results = useSelector(state => state.adminDashboard.scoreboardDetails.results);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const { scrollListRef } = usePaginatedDataScrollList<HTMLUListElement>({
    fetchDataFn: useCallback(
      (initialFetch: boolean) => {
        dispatch(getScoreboardDetails.init({ initialFetch }));
      },
      [dispatch],
    ),
    loadingData: loadingScoreboardDetails,
  });

  const modalTitle = titles[scoreboardItem];

  const items = useMemo(() => {
    switch (scoreboardItem) {
      case Scoreboard.Jobs: {
        const jobs = results as ScoreboardJob[];
        return jobs.map((job: ScoreboardJob) => (
          <ScoreboardJobCard
            key={job.id}
            job={job}
            className={classNames(styles['modal__list-item'], styles['modal__list-item--jobs'])}
          />
        ));
      }
      case Scoreboard.Interviews: {
        const interviews = results as ScoreboardInterview[];
        return interviews.map(interview => (
          <ScoreboardInterviewCard
            interview={interview}
            key={interview.id}
            className={classNames(
              styles['modal__list-item'],
              styles['modal__list-item--interviews'],
            )}
          />
        ));
      }
      case Scoreboard.Placements: {
        const placements = results as ScoreboardPlacement[];
        return placements.map(placement => (
          <ScoreboardPlacementCard
            key={placement.id}
            className={classNames(
              styles['modal__list-item'],
              styles['modal__list-item--placements'],
            )}
            placement={placement}
          />
        ));
      }
      case Scoreboard.Revenues: {
        const revenues = results as ScoreboardRevenue[];
        return revenues.map(revenue => (
          <ScoreboardRevenueCard
            key={revenue.id}
            className={classNames(styles['modal__list-item'], styles['modal__list-item--revenues'])}
            revenue={revenue}
          />
        ));
      }
      case Scoreboard.TempWorks: {
        const tempWorks = results as ScoreboardTempWork[];
        return tempWorks.map(tempWork => (
          <ScoreboardTempWorkCard
            key={tempWork.id}
            className={classNames(
              styles['modal__list-item'],
              styles['modal__list-item--temp-works'],
            )}
            tempWork={tempWork}
          />
        ));
      }
      default:
        return null;
    }
  }, [results, scoreboardItem]);

  return (
    <CenterModal
      onClose={handleClose}
      visible={visible}
      className={styles['modal']}
      title={modalTitle}
    >
      <div
        className={classNames(styles['modal__labels'], {
          [styles['modal__labels--jobs']]: scoreboardItem === Scoreboard.Jobs,
          [styles['modal__labels--interviews']]: scoreboardItem === Scoreboard.Interviews,
          [styles['modal__labels--placements']]: scoreboardItem === Scoreboard.Placements,
          [styles['modal__labels--revenues']]: scoreboardItem === Scoreboard.Revenues,
          [styles['modal__labels--temp-works']]: scoreboardItem === Scoreboard.TempWorks,
        })}
      >
        {labels[scoreboardItem].map(label => (
          <span className={styles['modal__label']} key={label}>
            {label}
          </span>
        ))}
      </div>
      <ul ref={scrollListRef} className={styles['modal__list']}>
        {items}
        {loadingScoreboardDetails && (
          <div className={styles['modal__loader']}>
            <Loader loading />
          </div>
        )}
      </ul>
    </CenterModal>
  );
});
