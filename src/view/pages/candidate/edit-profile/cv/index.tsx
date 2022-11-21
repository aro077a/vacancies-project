import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { RouteComponentProps } from 'react-router-dom';

import { uploadCandidateCV } from '~/modules/createCandidate/actions';
import { useDispatch, useSelector } from '~/store';
import { UploadCandidateCVFormValues } from '~/types/formValues';
import { convertBytesToMegabytes, getFileTypeFromName } from '~/utils/helpers';
import { Button } from '~/view/components/button';
import { Icon } from '~/view/components/icon';
import { Loader } from '~/view/components/loader';

import styles from './styles.scss';

export const EditCandidateCVPage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const uploadingCV = useSelector(state => state.createCandidate.uploadingCandidateCV);
  const [loading, setLoading] = useState(false);
  const CV = useSelector(state => state.createCandidate.candidateCVUploaded);
  const {
    watch,
    setValue,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm<UploadCandidateCVFormValues>({
    defaultValues: {
      file: null,
    },
  });

  const convertUrlToFile = async (url: string): Promise<void> => {
    if (CV?.file) {
      setLoading(true);
      const blobFromUrl = await fetch(url).then(rawData => rawData.blob());
      const file = new File([blobFromUrl], CV.name, { type: blobFromUrl.type });
      setValue('file', file);
      setLoading(false);
    }
  };

  useEffect(() => {
    convertUrlToFile(CV?.file as string);
  }, [CV]);

  const uploadedFile = watch('file');

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    multiple: false,
    accept: '.png, .jpg, .jpeg, .pdf, .doc, .docx',
    maxSize: 20971520,
    onDrop: useCallback(
      (acceptedFiles: File[]) => {
        setValue('file', acceptedFiles[0], { shouldValidate: true });
      },
      [setValue],
    ),
  });

  const removeUploadedFile = useCallback(() => {
    setValue('file', null, { shouldValidate: true });
  }, [setValue]);

  const onSubmit = useCallback(() => {
    if (uploadedFile) {
      dispatch(
        uploadCandidateCV.request({
          formValue: { file: uploadedFile },
          onSuccess: () => null,
        }),
      );
    } else {
      setError('file', { message: 'CV is required!' });
    }
  }, [dispatch, setError, uploadedFile]);

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
          <h2 className={styles['page__title--edit-mode']}>Candidate CV</h2>
        </div>
        <Loader loading />
      </div>
    );
  }

  return (
    <div className={styles['page']}>
      <div className={styles['page__header-wrapper']}>
        <h2 className={styles['page__title--edit-mode']}>Candidate CV</h2>
      </div>
      {uploadedFile && (
        <div>
          <div className={styles['page__uploaded-file-card']}>
            <div className={styles['page__uploaded-file']}>
              <div
                className={classNames(
                  styles['page__uploaded-file-type-wrapper'],
                  getUploadedFileTypeWrapperAdditionalStyle(uploadedFile),
                )}
              >
                <p className={styles['page__uploaded-file-type']}>
                  {uploadedFile.name.split('.').includes('docx')
                    ? uploadedFile.name.split('.')[1]
                    : uploadedFile.type.split('/')[1].toUpperCase()}
                </p>
              </div>
              <div className={styles['page__uploaded-file-info-wrapper']}>
                <p className={styles['page__uploaded-file-name']}>{uploadedFile.name}</p>
                <p className={styles['page__uploaded-file-size']}>
                  {CV ? CV.size : `${convertBytesToMegabytes(uploadedFile.size)} MB`}
                </p>
              </div>
            </div>
            <button
              className={styles['page__remove-uploaded-file-button']}
              onClick={removeUploadedFile}
            >
              <Icon name="trash" className={styles['page__remove-uploaded-file-icon']} />
            </button>
          </div>
          <button className={styles['page__upload-other-file-button']} onClick={open}>
            Upload another file
          </button>
        </div>
      )}
      <div
        {...getRootProps({
          className: classNames(styles['page__cv-upload-box'], {
            [styles['page__cv-upload-box--active']]: isDragActive,
            [styles['page__cv-upload-box--error']]: errors.file,
            [styles['page__cv-upload-box--hidden']]: uploadedFile,
          }),
        })}
      >
        <input {...getInputProps()} />
        <Icon name="upload" className={styles['page__upload-icon']} />
        <p className={styles['page__upload-label']}>
          <span>Drag & drop a CV here or</span> <span>Browse</span> your files
        </p>
      </div>
      {errors.file && (
        <p className={styles['page__upload-box-error-message']}>{errors.file.message}</p>
      )}
      <p
        className={classNames(styles['page__upload-hint-message'], {
          [styles['page__upload-hint-message--expansed']]: uploadedFile,
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
          loading={uploadingCV}
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </div>
  );
};
