import React, { memo } from 'react';

import { useSelector } from '~/store';
import { projectValueOptions } from '~/utils/staticData';
import { KeyProjectCard } from '~/view/components/key-project-card';
import { LicenseCard } from '~/view/components/license-card';
import { Loader } from '~/view/components/loader';
import { Tag } from '~/view/components/tag';

import { Card } from './components/card';
import styles from './styles.scss';

export const Overview: React.FC = memo(function Overview() {
  const candidateOverview = useSelector(state => state.companyInterviews.matchedCandidateOverview);
  const overviewLoading = useSelector(
    state => state.companyInterviews.loadingMatchedCandidateDetail,
  );

  const availability = candidateOverview?.availability
    ? candidateOverview.availability > 1
      ? `${candidateOverview.availability} weeks`
      : `${candidateOverview.availability} week`
    : 'N/A';

  const additionalInfo = candidateOverview?.additionalInformation
    ? candidateOverview.additionalInformation === 'null'
      ? 'No additional information'
      : candidateOverview.additionalInformation
    : 'No additional information';

  return (
    <div className={styles['overview']}>
      <div className={styles['overview__projects']}>
        <p className={styles['overview__additional-info']}>{additionalInfo}</p>
        <div className={styles['overview__availability']}>
          Available from: <span>{availability}</span>
        </div>
      </div>
      <div className={styles['overview__projects']}>
        <h4 className={styles['overview__block-title']}>Preferable project types</h4>
        <div className={styles['overview__project-list']}>
          {overviewLoading && <Loader loading />}
          <div className={styles['card__user-tags']}>
            {candidateOverview?.projectTypes.map(tag => (
              <Tag key={tag} text={tag} variant="primary" />
            ))}
          </div>
        </div>
      </div>
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
          {candidateOverview?.keyProjects?.map(project => {
            const selectedValue = projectValueOptions.find(
              (item: Record<string, unknown>) => item.value === project.value,
            );

            return <KeyProjectCard {...project} key={project.id} value={selectedValue?.label} />;
          })}
        </div>
      </div>
      <div className={styles['overview__details-block']}>
        <h4 className={styles['overview__block-title-details']}>Qualifications to licenses</h4>
        <div>
          {candidateOverview?.license.map(license => (
            <LicenseCard
              key={license.id}
              size={license.size}
              file={license.file}
              name={license.name}
              expirationDate={license.expirationDate}
              fullWidth
            />
          ))}
        </div>
      </div>
      <div className={styles['overview__block']}>
        <h4 className={styles['overview__block-title']}>Branded CV</h4>
        <div className={styles['overview__cv-wrapper']}>
          {candidateOverview!.brandedCvUrl ? (
            <LicenseCard
              fullWidth
              file={candidateOverview!.brandedCvUrl}
              name={candidateOverview!.brandedCvName}
              size={candidateOverview!.brandedCvSize}
            />
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
});
