import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { RouteComponentProps } from 'react-router-dom';

import { License } from '~/models/candidate';
import { uploadCandidateDocuments } from '~/modules/createCandidate/actions';
import { useDispatch, useSelector } from '~/store';
import { UploadCandidateDocumentsFormValues } from '~/types/formValues';
import { convertBytesToMegabytes, getFileTypeFromName } from '~/utils/helpers';
import { Button } from '~/view/components/button';
import { Icon } from '~/view/components/icon';
import { Loader } from '~/view/components/loader';

import styles from './styles.scss';

export const EditCandidateDocuments: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const { uploadingDocuments } = useSelector(state => state.createCandidate);
  const { canidateDocuments } = useSelector(state => state.createCandidate);

  const [loading, setLoading] = useState(false);
  const { watch, setValue, handleSubmit, reset } = useForm<UploadCandidateDocumentsFormValues>({
    defaultValues: {
      files: [],
    },
  });

  const convertUrlsToFiles = async (licenses: License[]): Promise<void> => {
    if (licenses.length) {
      setLoading(true);
      const promises = licenses.map(license => {
        return new Promise((resolve, reject) => {
          fetch(license.file)
            .then(rawData => {
              rawData.blob().then(blob => {
                resolve(new File([blob], license.name, { type: blob.type }));
              });
            })
            .catch(error => reject(error));
        });
      });
      Promise.all(promises).then(val => {
        setLoading(false);
        setValue('files', val as File[]);
      });
    }
  };

  useEffect(() => {
    convertUrlsToFiles(canidateDocuments);
  }, [canidateDocuments]);

  const uploadedFiles = watch('files');
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: '.pdf, .doc, .docx',
    maxSize: 20971520,
    maxFiles: 10,
    onDrop: useCallback(
      (acceptedFiles: File[]) => {
        const acceptedFilesToUpload: File[] = [];

        acceptedFiles.forEach(acceptedFile => {
          const fileAlreadyUploaded = uploadedFiles.find(
            uploadedFile =>
              uploadedFile.name === acceptedFile.name && uploadedFile.size === acceptedFile.size,
          );

          if (!fileAlreadyUploaded) {
            if (uploadedFiles.length + acceptedFilesToUpload.length < 10) {
              acceptedFilesToUpload.push(acceptedFile);
            }
          }
        });

        setValue('files', [...uploadedFiles, ...acceptedFilesToUpload], { shouldValidate: true });
      },
      [setValue, uploadedFiles],
    ),
  });

  const removeUploadedFile = useCallback(
    (file: File) => {
      const filteredUploadedFiles = uploadedFiles.filter(uploadedFile => uploadedFile !== file);

      setValue('files', filteredUploadedFiles, { shouldValidate: true });
    },
    [setValue, uploadedFiles],
  );

  const onSubmit = useCallback(() => {
    dispatch(
      uploadCandidateDocuments.request({
        formValues: { files: uploadedFiles },
        onSuccess: () => {
          reset({ files: uploadedFiles });
        },
      }),
    );
  }, [dispatch, uploadedFiles, reset]);

  const handleDownload = (file: File): void => {
    const localUrl = URL.createObjectURL(file);

    const link = document.createElement('a');
    link.href = localUrl;
    link.setAttribute('download', file.name);
    link.click();
  };

  const getUploadedFileTypeWrapperAdditionalStyle = useCallback((uploadedFile: File) => {
    const fileType = getFileTypeFromName(uploadedFile)?.toLowerCase();

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
          <h2 className={styles['page__title--edit-mode']}>Documents</h2>
        </div>
        <Loader loading />
      </div>
    );
  }

  return (
    <div className={styles['page']}>
      <div className={styles['page__header-wrapper']}>
        <h2 className={styles['page__title--edit-mode']}>Documents</h2>
      </div>
      {uploadedFiles.length > 0 && (
        <div>
          <>
            {uploadedFiles.map((uploadedFile, index) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={`${uploadedFile.lastModified}-${uploadedFile.size}-${index}`}
                className={styles['page__uploaded-file-card']}
              >
                <div className={styles['page__uploaded-file']}>
                  <div
                    className={classNames(
                      styles['page__uploaded-file-type-wrapper'],
                      getUploadedFileTypeWrapperAdditionalStyle(uploadedFile),
                    )}
                  >
                    <p className={styles['page__uploaded-file-type']}>
                      {getFileTypeFromName(uploadedFile)?.toUpperCase()}
                    </p>
                  </div>
                  <div className={styles['page__uploaded-file-info-wrapper']}>
                    <p className={styles['page__uploaded-file-name']}>{uploadedFile.name}</p>
                    <p className={styles['page__uploaded-file-size']}>
                      {convertBytesToMegabytes(uploadedFile.size)} MB
                    </p>
                  </div>
                </div>
                <button
                  className={styles['page__download-btn']}
                  onClick={() => handleDownload(uploadedFile)}
                >
                  <Icon name="download" width="17px" height="17px" />
                </button>
                <button
                  className={styles['page__remove-uploaded-file-button']}
                  onClick={() => removeUploadedFile(uploadedFile)}
                >
                  <Icon name="trash" className={styles['page__remove-uploaded-file-icon']} />
                </button>
              </div>
            ))}
          </>
          {uploadedFiles.length < 10 && (
            <button className={styles['page__upload-other-file-button']} onClick={open}>
              Upload more files
            </button>
          )}
        </div>
      )}
      <div
        {...getRootProps({
          className: classNames(styles['page__licenses-upload-box'], {
            [styles['page__licenses-upload-box--active']]: isDragActive,
            [styles['page__licenses-upload-box--hidden']]: uploadedFiles.length > 0,
          }),
        })}
      >
        <input {...getInputProps()} />
        <Icon name="upload" className={styles['page__upload-icon']} />
        <p className={styles['page__upload-label']}>
          <span>Drag & drop a CV here or</span> <span>Browse</span> your files
        </p>
      </div>
      <p
        className={classNames(styles['page__upload-hint-message'], {
          [styles['page__upload-hint-message--expansed']]: uploadedFiles.length > 0,
        })}
      >
        Supported formats are DOC, DOCX, PDF. Max file size is 20 MB
      </p>
      <div className={styles['page__form-footer']}>
        <Button
          type="submit"
          variant="accent"
          title="Save changes"
          className={styles['page__form-footer-button']}
          loading={uploadingDocuments}
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </div>
  );
};
