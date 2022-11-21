import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import React, { memo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { MyJob } from '~/models/company';
import {
  setSelectedCompanyCandidate,
  setSelectedInterestedJob,
  toggleInterestedJobSuccessModalVisibility,
} from '~/modules/companyCandidates/actions';
import { setSelectedJob, updateInterestedCandidateStatus } from '~/modules/companyJobs/actions';
import { useSelector } from '~/store';
import { RootState } from '~/store/types';
import { projectValueOptions } from '~/utils/staticData';
import { DiscloseInfoValidation } from '~/utils/validations';
import { CandidateDropdown } from '~/view/components/candidate-dropdown';
import { Checkbox } from '~/view/components/checkbox';
import { KeyProjectCard } from '~/view/components/key-project-card';
import { LicenseCard } from '~/view/components/license-card';
import { Loader } from '~/view/components/loader';
import { Tag } from '~/view/components/tag';

import { Card } from './components/Card';
import styles from './styles.scss';

type OverviewProps = {
  handleClose: () => void;
};

export const Overview: React.FC<OverviewProps> = memo(function Overview({ handleClose }) {
  const selectedCandidate = useSelector(state => state.companyCandidates.selectedCandidate);
  const loadingCandidates = useSelector(state => state.companyCandidates.loadingCandidates);
  const { jobs } = useSelector((state: RootState) => state.companyJobs);
  const dispatch = useDispatch();
  const {
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      disclose: selectedCandidate?.interested,
    },
    resolver: yupResolver(DiscloseInfoValidation),
  });

  const handleInterestedCandidateChange = useCallback(
    (dropdownItem: MyJob) => {
      if (selectedCandidate!.interestedId === dropdownItem.id) {
        dispatch(
          updateInterestedCandidateStatus.request({
            formValues: { status: false, job: dropdownItem.id, candidate: selectedCandidate!.id },
            cb: () => {
              dispatch(setSelectedJob.request(dropdownItem));
              dispatch(setSelectedCompanyCandidate.request(selectedCandidate!.id));
            },
            onSuccess: () => {
              handleClose();
              dispatch(toggleInterestedJobSuccessModalVisibility());
            },
          }),
        );
      } else if (selectedCandidate!.interestedId !== dropdownItem.id) {
        dispatch(setSelectedInterestedJob(dropdownItem?.positionName));
        dispatch(
          updateInterestedCandidateStatus.request({
            formValues: {
              status: true,
              job: dropdownItem.id,
              candidate: selectedCandidate!.id,
            },
            cb: () => {
              dispatch(setSelectedJob.request(dropdownItem));
              dispatch(setSelectedCompanyCandidate.request(selectedCandidate!.id));
            },
            onSuccess: () => {
              handleClose();
              dispatch(toggleInterestedJobSuccessModalVisibility());
            },
          }),
        );
      }
    },
    [dispatch, selectedCandidate, handleClose],
  );

  const availability = selectedCandidate?.availability
    ? selectedCandidate.availability > 1
      ? `${selectedCandidate.availability} weeks`
      : `${selectedCandidate.availability} week`
    : 'N/A';

  const additionalInfo = selectedCandidate?.additionalInformation
    ? selectedCandidate.additionalInformation === 'null'
      ? 'No additional information'
      : selectedCandidate.additionalInformation
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
          {loadingCandidates && <Loader loading />}
          <div className={styles['card__user-tags']}>
            {selectedCandidate?.projectTypes.map(tag => (
              <Tag key={tag} text={tag} variant="primary" />
            ))}
          </div>
        </div>
      </div>
      <div className={styles['overview__work-experience']}>
        <h4 className={styles['overview__block-title']}>Work experience</h4>
        <div className={styles['overview__experience-list']}>
          {loadingCandidates && <Loader loading />}
          {selectedCandidate?.workExps?.map(exp => (
            <Card key={exp.id} {...exp} />
          ))}
        </div>
      </div>
      <div className={styles['overview__projects']}>
        <h4 className={styles['overview__block-title']}>Key projects</h4>
        <div className={styles['overview__project-list']}>
          {loadingCandidates && <Loader loading />}
          {selectedCandidate?.keyProjects?.map(project => {
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
          {selectedCandidate?.license.map(license => (
            <LicenseCard
              key={license.id}
              size={license.size}
              file={license.file}
              name={license.name}
              fullWidth
            />
          ))}
        </div>
      </div>
      <div className={styles['modal__footer']}>
        <div className={styles['modal__footer-disclose']}>
          <div className={styles['checkbox-container']}>
            <Checkbox control={control} name="disclose" />
            <p
              className={classNames(styles['modal__footer-disclose-label'], {
                [styles['modal__disclose-error-warning']]: errors.disclose,
              })}
            >
              Disclose my identity
            </p>
          </div>
          <CandidateDropdown items={jobs.results} onChange={handleInterestedCandidateChange} />
        </div>
      </div>
    </div>
  );
});
