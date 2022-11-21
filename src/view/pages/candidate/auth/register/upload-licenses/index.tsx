import classNames from 'classnames';
import dateFnsFormat from 'date-fns/format';
import React, { useCallback, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { skipLicensesUpload, uploadLicenses } from '~/modules/candidateRegistration/actions';
import { useDispatch, useSelector } from '~/store';
import { UploadCandidateLicensesFormValues } from '~/types/formValues';
import { convertBytesToMegabytes, getFileTypeFromName } from '~/utils/helpers';
import { Button } from '~/view/components/button';
import { Icon } from '~/view/components/icon';
import { UploadLicenseModal } from '~/view/components/upload-license-modal';

import styles from './styles.scss';

export const UploadLicensesPage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const setupPagesCount = useSelector(state => state.registration.setupPagesCount);
  const uploadingLicenses = useSelector(state => state.candidateRegistration.uploadingLicenses);

  const [licenseModalVisible, setLicenseModalVisible] = useState<boolean>(false);
  const [resizable, setResizable] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadCandidateLicensesFormValues[]>([]);

  const toggleLicenseModalVisibility = useCallback(() => {
    setLicenseModalVisible(prevValue => !prevValue);
  }, []);

  const removeUploadedFile = useCallback(
    (file: File | null) => {
      const filteredUploadedFiles = uploadedFiles.filter(
        (uploadedFile: UploadCandidateLicensesFormValues) => uploadedFile?.file !== file,
      );
      setUploadedFiles(filteredUploadedFiles);
    },
    [uploadedFiles],
  );

  const onSubmit = useCallback(() => {
    if (uploadedFiles?.length > 0) {
      dispatch(uploadLicenses.request({ formValues: uploadedFiles }));
    } else {
      dispatch(skipLicensesUpload());
    }
  }, [dispatch, uploadedFiles]);

  const getUploadedFileTypeWrapperAdditionalStyle = useCallback((uploadedFile: File | null) => {
    const fileType = uploadedFile && getFileTypeFromName(uploadedFile)?.toLowerCase();

    return {
      [styles['page__uploaded-file-type-wrapper--doc']]: fileType === 'doc' || fileType === 'docx',
      [styles['page__uploaded-file-type-wrapper--jpg']]: fileType === 'jpg' || fileType === 'jpeg',
      [styles['page__uploaded-file-type-wrapper--png']]: fileType === 'png',
    };
  }, []);

  return (
    <div className={styles['page']}>
      <div className={styles['page__header-wrapper']}>
        <h1 className={styles['page__title']}>
          Upload licenses <span>(optional)</span>
        </h1>
        <p className={styles['page__order-number']}>
          5<span>/{setupPagesCount}</span>
        </p>
      </div>
      <p className={styles['page__subtitle']}>
        We will keep your licenses on file so you don't have to upload it each time. You can replace
        with updated file anytime you wish. You can upload up to 10 licenses
      </p>
      {uploadedFiles.length > 0 && (
        <div>
          <>
            {uploadedFiles.map(uploadedFile => (
              <div
                key={`${uploadedFile?.file?.name}-${uploadedFile?.file?.size}`}
                className={styles['page__uploaded-file-card']}
              >
                <div className={styles['page__uploaded-file']}>
                  <div
                    className={classNames(
                      styles['page__uploaded-file-type-wrapper'],
                      getUploadedFileTypeWrapperAdditionalStyle(uploadedFile?.file),
                    )}
                  >
                    <p className={styles['page__uploaded-file-type']}>
                      {getFileTypeFromName(uploadedFile?.file)?.toUpperCase()}
                    </p>
                  </div>
                  <div className={styles['page__uploaded-file-info-wrapper']}>
                    <p className={styles['page__uploaded-file-name']}>{uploadedFile?.file?.name}</p>
                    <p className={styles['page__uploaded-file-size']}>
                      {convertBytesToMegabytes(uploadedFile?.file?.size)} MB
                    </p>
                  </div>
                </div>
                <div className={styles['page__uploaded-file-expiration']}>
                  <p className={styles['page__uploaded-file-expiration-label']}>
                    Expiry date:&nbsp;
                  </p>
                  <p className={styles['page__uploaded-file-expiration-date']}>
                    {(typeof uploadedFile?.expirationDate !== 'string' &&
                      uploadedFile?.expirationDate &&
                      dateFnsFormat(uploadedFile?.expirationDate, 'dd/MM/yyyy')) ||
                      dateFnsFormat(new Date(), 'dd/MM/yyyy')}
                  </p>
                  <button
                    className={styles['page__remove-uploaded-file-button']}
                    onClick={() => removeUploadedFile(uploadedFile?.file)}
                  >
                    <Icon name="close" className={styles['page__remove-uploaded-file-icon']} />
                  </button>
                </div>
              </div>
            ))}
          </>
          {uploadedFiles.length < 10 && (
            <button
              className={styles['page__upload-other-file-button']}
              onClick={toggleLicenseModalVisibility}
            >
              Upload more files
            </button>
          )}
        </div>
      )}
      <div
        onClick={toggleLicenseModalVisibility}
        className={classNames(styles['page__licenses-upload-box'], {
          [styles['page__licenses-upload-box--hidden']]: uploadedFiles.length > 0,
        })}
      >
        <Icon name="upload" className={styles['page__upload-icon']} />
        <p className={styles['page__upload-label']}>
          <span>Browse</span> your files
        </p>
      </div>
      <p
        className={classNames(styles['page__upload-hint-message'], {
          [styles['page__upload-hint-message--expansed']]: uploadedFiles.length > 0,
        })}
      >
        Supported formats are PNG, JPG, JPEG, PDF, DOC. Max file size is 20 MB
      </p>
      <div className={styles['page__form-footer']}>
        <Button
          type="submit"
          title="Next"
          className={styles['page__form-footer-button']}
          loading={uploadingLicenses}
          onClick={onSubmit}
        />
      </div>
      <UploadLicenseModal
        title="Upload license"
        visible={licenseModalVisible}
        onClose={toggleLicenseModalVisibility}
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
        setResizable={setResizable}
        resizable={resizable}
      />
    </div>
  );
};
