import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { setFindJobInterest, setSelectedFindJob } from '~/modules/candidateFindJobs/actions';
import { useDispatch, useSelector } from '~/store';
import { DiscloseInfoValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { Checkbox } from '~/view/components/checkbox';
import { Image } from '~/view/components/image';
import { RightModal } from '~/view/components/modals';
import { SuccessModal } from '~/view/components/success-modal';

import { Overview } from './components/overview';
import styles from './styles.scss';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const JobModal: React.FC<Props> = memo(function MatchedJobModal({ onClose, visible }) {
  const dispatch = useDispatch();
  const [successModalVisible, setSuccessModalVisible] = useState<boolean>(false);
  const { jobDescription, settingJobInterest, loadingJobDescription } = useSelector(
    state => state.candidateFindJobs,
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      disclose: false,
    },
    resolver: yupResolver(DiscloseInfoValidation),
  });

  useEffect(() => {
    if (jobDescription) {
      setValue('disclose', jobDescription.interested);
    }
  }, [jobDescription, setValue]);

  useEffect(() => {
    if (!visible) {
      dispatch(setSelectedFindJob(null));
    }
  }, [visible, dispatch]);

  const handleModalClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const toggleSuccessModalVisibility = useCallback(() => {
    setSuccessModalVisible(prevValue => !prevValue);
  }, []);

  const onSubmit = useCallback(() => {
    if (jobDescription) {
      dispatch(
        setFindJobInterest.request({
          interested: !jobDescription.interested,
          onSuccess: () => {
            toggleSuccessModalVisibility();
          },
        }),
      );
    }
  }, [dispatch, jobDescription, toggleSuccessModalVisibility]);

  return (
    <>
      <RightModal
        onClose={handleModalClose}
        visible={visible}
        className={styles['modal']}
        backTitle="< Back"
      >
        <div className={styles['modal__header']}>
          <Image
            className={styles['modal__company-logo']}
            src={jobDescription?.companyLogo || null}
            type="company"
            alt="Company's logo"
          />
          <div className={styles['modal__job-info']}>
            <p className={styles['modal__job-position']}>{jobDescription?.positionName}</p>
            <div>
              <p className={styles['modal__company-site']}>
                {jobDescription?.companySite?.replace(/^https?:\/\//, '')}
              </p>
              <p className={styles['modal__header--company']}>{jobDescription?.companyName}</p>
            </div>
          </div>
          <div className={styles['modal__job-match']}>{jobDescription?.match}% Match</div>
        </div>
        <Overview />
        <div className={styles['modal__footer']}>
          <div className={styles['modal__footer-disclose']}>
            <Checkbox control={control} name="disclose" />
            <p
              className={classNames(styles['modal__footer-disclose-label'], {
                [styles['modal__disclose-error-warning']]: errors.disclose,
              })}
            >
              Disclose my personal info
            </p>
          </div>
          <Button
            className={classNames(styles['modal__action-btn'], {
              [styles['modal__action-btn--completed']]: jobDescription?.interested,
            })}
            title={loadingJobDescription ? '...' : 'Interested'}
            size="medium"
            variant="accent"
            loading={settingJobInterest}
            onClick={handleSubmit(onSubmit)}
            inlineIcon={jobDescription?.interested ? 'checkmark' : ''}
            inlineIconClassName={styles['modal__checkmark-icon']}
            disabled={!!jobDescription?.interested}
          />
        </div>
      </RightModal>
      <SuccessModal
        visible={successModalVisible}
        onClose={toggleSuccessModalVisibility}
        title="You have shown interest in"
        description={jobDescription?.positionName}
      />
    </>
  );
});
