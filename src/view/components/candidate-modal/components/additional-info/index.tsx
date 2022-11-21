import classNames from 'classnames';
import React, { memo, useEffect, useRef, useState } from 'react';

import { useSelector } from '~/store';
import { LicenseCard } from '~/view/components/license-card';
import { SelectOption } from '~/view/components/select';
import { Tag } from '~/view/components/tag';

import styles from './styles.scss';

const availabilityOptions = [
  { value: 0, label: 'Immediate', isSelected: false },
  { value: 1, label: '1 week', isSelected: false },
  { value: 2, label: '2 weeks ', isSelected: false },
  { value: 3, label: '3 weeks  ', isSelected: false },
  { value: 4, label: '4 weeks or longer', isSelected: false },
];

export const AdditionalInfo: React.FC = memo(function AdditionalInfo() {
  const additionalInfo = useSelector(state => state.adminCandidates.candidateAdditionalInfo);
  const [availability, setAvailability] = useState<string>();
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { candidateVideoInterview } = useSelector(state => state.adminCandidates);

  useEffect(() => {
    const filteredAvailability = availabilityOptions.find(
      (item: SelectOption) => item.value === Number(additionalInfo?.availability),
    );
    if (additionalInfo?.availability === filteredAvailability?.value) {
      setAvailability(filteredAvailability?.label);
    }
  }, [additionalInfo?.availability]);

  const handlePlayVideo = (): void => {
    if (videoRef.current) {
      setIsPlaying(true);
      videoRef.current.play();
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  }, []);

  if (!additionalInfo) {
    return null;
  }

  const {
    additionalInformation,
    jobPositions,
    projectTypes,
    interestedCompanies,
    notInterestedCompanies,
    relocate,
    phone,
    email,
    yearsOfExp,
    linkedInResume,
    cv,
    linkedInResumeName,
    linkedInResumeSize,
  } = additionalInfo;

  const labelFullWidthClassName = classNames(
    styles['personal-detail__label--full-width'],
    styles['personal-detail__label'],
  );

  return (
    <div className={styles['additional-info']}>
      {additionalInformation && (
        <div className={styles['additional-info__block']}>
          <p className={styles['addiitional-info__description']}>{additionalInformation}</p>
        </div>
      )}
      <div className={styles['additional-info__block']}>
        <h4 className={styles['additional-info__block-title']}>Preferable positions</h4>
        <div className={styles['additional-info__tag-list']}>
          {jobPositions.map(jobPosition => (
            <Tag
              key={jobPosition}
              className={styles['additional-info__tag-list-item']}
              text={jobPosition}
            />
          ))}
        </div>
      </div>
      <div className={styles['additional-info__block']}>
        <h4 className={styles['additional-info__block-title']}>Preferable project types</h4>
        <div className={styles['additional-info__tag-list']}>
          {projectTypes.map(projectType => (
            <Tag
              key={projectType}
              className={styles['additional-info__tag-list-item']}
              text={projectType}
              variant="secondary"
            />
          ))}
        </div>
      </div>
      <div className={styles['additional-info__block']}>
        <h4 className={styles['additional-info__block-title']}>Preferable companies</h4>
        <div className={styles['additional-info__tag-list']}>
          {interestedCompanies.map(company => (
            <Tag
              key={company}
              className={styles['additional-info__tag-list-item']}
              text={company}
            />
          ))}
        </div>
      </div>
      <div className={styles['additional-info__block']}>
        <h4 className={styles['additional-info__block-title']}>
          Companies I wouldn`t like to work at
        </h4>
        <div className={styles['additional-info__tag-list']}>
          {notInterestedCompanies.map(company => (
            <Tag
              key={company}
              className={styles['additional-info__tag-list-item']}
              text={company}
            />
          ))}
        </div>
      </div>
      <div className={styles['additional-info__block']}>
        <h4 className={styles['additional-info__block-title']}>Personal information</h4>
        <div className={styles['personal-detail']}>
          <div className={styles['personal-detail__label']}>
            <p className={styles['personal-detail__label-caption']}>Phone number:</p>
            <p className={styles['personal-detail__label-value']}>{phone || 'No'}</p>
          </div>
          <div className={styles['personal-detail__label']}>
            <p className={styles['personal-detail__label-caption']}>Ready to relocate:</p>
            <p className={styles['personal-detail__label-value']}>{relocate ? 'Yes' : 'No'}</p>
          </div>
          <div className={styles['personal-detail__label']}>
            <p className={styles['personal-detail__label-caption']}>Email address:</p>
            <p className={styles['personal-detail__label-value']}>{email || 'No'}</p>
          </div>
        </div>
      </div>
      <div className={styles['additional-info__block--duo']}>
        <div className={styles['additional-info__block-inner']}>
          <h4 className={styles['additional-info__block-title']}>Professional details</h4>
          <div className={styles['personal-detail']}>
            <div className={labelFullWidthClassName}>
              <p className={styles['personal-detail__label-caption']}>Years of experience:</p>
              <p className={styles['personal-detail__label-value']}>{yearsOfExp}</p>
            </div>
            <div className={labelFullWidthClassName}>
              <p className={styles['personal-detail__label-caption']}>Available from:</p>
              <p className={styles['personal-detail__label-value']}>{availability}</p>
            </div>
          </div>
        </div>
        <div className={styles['additional-info__block-inner']}>
          <h4 className={styles['additional-info__block-title']}>LinkedIn Resume</h4>
          {linkedInResume ? (
            <LicenseCard
              name={linkedInResumeName}
              file={linkedInResume}
              size={linkedInResumeSize}
              fullWidth
            />
          ) : (
            <p>No resume linked</p>
          )}
        </div>
      </div>
      <div className={styles['additional-info__block']}>
        <h4 className={styles['additional-info__block-title']}>Candidate CV</h4>
        <div className={styles['additional-info__tag-list']}>
          {cv ? (
            <LicenseCard fullWidth {...cv} />
          ) : (
            <span className={styles['additional-info__tag-item']}>No CV linked</span>
          )}
        </div>
      </div>
      <div className={styles['additional-info__block']}>
        <h4 className={styles['additional-info__block-title']}>Video interview</h4>
        {candidateVideoInterview ? (
          <div className={styles['additional-info__block-video']}>
            {
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video ref={videoRef} controls src={candidateVideoInterview.video} />
            }
            {!isPlaying && (
              <button onClick={handlePlayVideo} className={styles['play-btn']}>
                <span className={styles['play-btn__icon']} />
              </button>
            )}
          </div>
        ) : (
          <p>No video interview</p>
        )}
      </div>
    </div>
  );
});
