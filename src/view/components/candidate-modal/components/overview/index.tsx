import React, { memo } from 'react';

import { useSelector } from '~/store';
import { LicenseCard } from '~/view/components/license-card';
import { Loader } from '~/view/components/loader';

import { Card } from './components/Card';
import styles from './styles.scss';

export const Overview: React.FC = memo(function Overview() {
  const candidateOverview = useSelector(state => state.adminCandidates.candidateOverview);
  const overviewLoading = useSelector(state => state.adminCandidates.loadingCandidateOverview);

  return (
    <div className={styles['overview']}>
      <div className={styles['overview__work-experience']}>
        <h4 className={styles['overview__block-title']}>Work experience</h4>
        <div className={styles['overview__experience-list']}>
          {overviewLoading && <Loader loading />}
          {candidateOverview?.workExps?.map(exp => (
            <Card key={exp.id} {...exp} />
          ))}
        </div>
      </div>
      <div className={styles['overview__projects']}>
        <h4 className={styles['overview__block-title']}>Key projects</h4>
        <div className={styles['overview__project-list']}>
          {overviewLoading && <Loader loading />}
          {candidateOverview?.keyProjects?.map(project => (
            <Card logo={null} key={project.id} {...project} />
          ))}
        </div>
      </div>
      <div className={styles['overview__licenses']}>
        <h4 className={styles['overview__block-title']}>Candidate Licenses</h4>
        <div className={styles['overview__license-list']}>
          {overviewLoading && <Loader loading />}
          {candidateOverview?.license?.map(licen => (
            <LicenseCard {...licen} key={licen.id} />
          ))}
        </div>
      </div>
    </div>
  );
});
