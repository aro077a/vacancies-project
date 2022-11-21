import classNames from 'classnames';
import React, { memo, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useController, UseControllerProps } from 'react-hook-form';

import { getPrefillData } from '~/modules/createCandidate/actions';
import { useDispatch } from '~/store';
import { convertBytesToMegabytes } from '~/utils/helpers';
import linkedinLogo from '~/view/assets/images/linkedin-logo.svg';
import { Icon } from '~/view/components/icon';

import styles from './styles.scss';

type Props = {
  fileSize?: string | null;
  fileName?: string | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ResumeUploader: React.FC<UseControllerProps<any> & Props> = memo(
  function ResumeUploader(props) {
    const dispatch = useDispatch();
    const {
      field: { value, onChange },
    } = useController(props as UseControllerProps<Record<string, File | null>>);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      multiple: false,
      accept: '.pdf',
      maxSize: 20971520,
      onDrop: useCallback(
        (acceptedFiles: File[]) => {
          onChange(acceptedFiles[0]);
        },
        [onChange],
      ),
    });

    useEffect(() => {
      if (value) {
        dispatch(getPrefillData.request(value));
      }
    }, [value, dispatch]);

    const handleUploadedFileDelete = useCallback(() => {
      onChange(null);
    }, [onChange]);

    const fileSize =
      value instanceof File
        ? `${convertBytesToMegabytes((value as File).size)} MB`
        : props.fileSize;

    const fileName = value instanceof File ? value.name : props.fileName;

    return (
      <div className={styles['field']}>
        {value ? (
          <div className={styles['field__uploaded-file-card']}>
            <div className={styles['field__uploaded-file-wrapper']}>
              <div className={styles['field__uploaded-file-type-wrapper']}>
                <p className={styles['field__uploaded-file-type']}>PDF</p>
              </div>
              <div className={styles['field__uploaded-file-info-wrapper']}>
                <p className={styles['field__uploaded-file-name']}>{fileName}</p>
                <p className={styles['field__uploaded-file-size']}>{fileSize}</p>
              </div>
            </div>
            <button className={styles['field__trash-button']} onClick={handleUploadedFileDelete}>
              <Icon name="trash" className={styles['field__trash-icon']} />
            </button>
          </div>
        ) : (
          <>
            <div
              {...getRootProps({
                className: classNames(styles['field__upload-box'], {
                  [styles['field__upload-box--active']]: isDragActive,
                }),
              })}
            >
              <input {...getInputProps()} />
              <img className={styles['field__linkedin-logo']} src={linkedinLogo} alt="linkedin" />
              <p className={styles['field__upload-text']}>
                Upload LinkedIn Resume to prefill details
              </p>
            </div>
            <p className={styles['field__upload-tutorial']}>
              <span>View tutorial</span> on how to upload your linkedIn Resume
            </p>
          </>
        )}
      </div>
    );
  },
);
