import classNames from 'classnames';
import dateFnsFormat from 'date-fns/format';
import React, { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { License } from '~/models/candidate';
import { uploadCandidateLicenses } from '~/modules/createCandidate/actions';
import { useDispatch, useSelector } from '~/store';
import { UploadCandidateLicensesFormValues } from '~/types/formValues';
import { convertBytesToMegabytes, getFileTypeFromName } from '~/utils/helpers';
import { Button } from '~/view/components/button';
import { Icon } from '~/view/components/icon';
import { Loader } from '~/view/components/loader';
import { UploadLicenseModal } from '~/view/components/upload-license-modal';

import styles from './styles.scss';

export const EditCandidateLicensesPage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const uploadingLicenses = useSelector(state => state.createCandidate.uploadingCandidateLicenses);
  const { editMode } = useSelector(state => state.createCandidate);
  const { candidateLicense } = useSelector(state => state.createCandidate);

  const [loading, setLoading] = useState<boolean>(false);
  const [resizable, setResizable] = useState<boolean>(false);
  const [licenseModalVisible, setLicenseModalVisible] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadCandidateLicensesFormValues[]>([]);

  const toggleLicenseModalVisibility = useCallback(() => {
    setLicenseModalVisible(prevValue => !prevValue);
  }, []);

  const convertUrlsToFiles = async (licenses: License[]): Promise<void> => {
    if (licenses.length) {
      setLoading(true);
      const promises = licenses.map(license => {
        return new Promise<File>((resolve, reject) => {
          fetch(license.file)
            .then(rawData => {
              rawData.blob().then(blob => {
                resolve(new File([blob], license.name, { type: blob.type }));
              });
            })
            .catch(error => reject(error));
        });
      });
      Promise.all(promises).then((val: File[]) => {
        setLoading(false);
        val.map((item: File) =>
          setUploadedFiles((prev: UploadCandidateLicensesFormValues[]) => [
            ...prev,
            {
              file: item,
              expirationDate: candidateLicense.find((el: License) => el.name === item.name)
                ?.expirationDate,
            },
          ]),
        );
      });
    }
  };

  useEffect(() => {
    convertUrlsToFiles(candidateLicense);
  }, [candidateLicense]);

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
    if (uploadedFiles && editMode) {
      dispatch(
        uploadCandidateLicenses.request({
          formValues: uploadedFiles,
          onSuccess: () => {
            setUploadedFiles([]);
          },
        }),
      );
    }
  }, [dispatch, uploadedFiles, editMode]);

  const getUploadedFileTypeWrapperAdditionalStyle = useCallback((uploadedFile: File | null) => {
    const fileType = uploadedFile && getFileTypeFromName(uploadedFile)?.toLowerCase();
    return {
      [styles['page__uploaded-file-type-wrapper--doc']]: fileType === 'doc' || fileType === 'docx',
      [styles['page__uploaded-file-type-wrapper--jpg']]: fileType === 'jpg' || fileType === 'jpeg',
      [styles['page__uploaded-file-type-wrapper--png']]: fileType === 'png',
    };
  }, []);

  if (loading) {
    return (
      <div className={styles['page']}>
        <div className={styles['page__header-wrapper']}>
          <h2 className={styles['page__title--edit-mode']}>Licenses</h2>
        </div>
        <Loader loading />
      </div>
    );
  }

  return (
    <div className={styles['page']}>
      <div className={styles['page__header-wrapper']}>
        <h2 className={styles['page__title--edit-mode']}>Licenses</h2>
      </div>

      {uploadedFiles.length > 0 && (
        <div>
          <>
            {uploadedFiles.map((uploadedFile, index) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={`${uploadedFile?.file?.lastModified}-${uploadedFile?.file?.size}-${index}`}
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
                      (uploadedFile?.expirationDate &&
                        dateFnsFormat(new Date(uploadedFile?.expirationDate), 'dd/MM/yyyy'))}
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
          variant="accent"
          title="Save changes"
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
