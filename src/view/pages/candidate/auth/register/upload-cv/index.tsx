import classNames from 'classnames';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { RouteComponentProps } from 'react-router-dom';

import { skipCvUpload, uploadCV } from '~/modules/candidateRegistration/actions';
import { useDispatch, useSelector } from '~/store';
import { UploadCandidateCVFormValues } from '~/types/formValues';
import { convertBytesToMegabytes } from '~/utils/helpers';
import { Button } from '~/view/components/button';
import { Icon } from '~/view/components/icon';

import styles from './styles.scss';

export const UploadCVPage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const setupPagesCount = useSelector(state => state.registration.setupPagesCount);
  const uploadingCV = useSelector(state => state.candidateRegistration.uploadingCV);
  const {
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<UploadCandidateCVFormValues>({
    defaultValues: {
      file: null,
    },
  });
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
      dispatch(uploadCV.request({ file: uploadedFile }));
    } else {
      dispatch(skipCvUpload());
    }
  }, [dispatch, uploadedFile]);

  return (
    <div className={styles['page']}>
      <div className={styles['page__header-wrapper']}>
        <h1 className={styles['page__title']}>
          Upload candidate CV <span>(optional)</span>
        </h1>
        <p className={styles['page__order-number']}>
          4<span>/{setupPagesCount}</span>
        </p>
      </div>
      <p className={styles['page__subtitle']}>
        We will keep your CV on file so you don't have to upload it each time. You can replace with
        updated file anytime you wish.
      </p>
      {uploadedFile && (
        <div>
          <div className={styles['page__uploaded-file-card']}>
            <div className={styles['page__uploaded-file']}>
              <div className={styles['page__uploaded-file-type-wrapper']}>
                <p className={styles['page__uploaded-file-type']}>
                  {uploadedFile.name.split('.').includes('docx')
                    ? uploadedFile.name.split('.')[1]
                    : uploadedFile.type.split('/')[1].toUpperCase()}
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
          title="Next"
          className={styles['page__form-footer-button']}
          loading={uploadingCV}
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </div>
  );
};
