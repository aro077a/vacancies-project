import classNames from 'classnames';
import React, { memo, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useController, UseControllerProps } from 'react-hook-form';

import styles from './styles.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LogoUploader: React.FC<UseControllerProps<any>> = memo(function LogoUploader(props) {
  const {
    field: { value, onChange, name },
    fieldState: { error },
  } = useController(props as UseControllerProps<Record<string, File | null>>);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: 'image/*',
    maxSize: 20971520,
    onDrop: useCallback(
      (acceptedFiles: File[]) => {
        onChange(acceptedFiles[0]);
      },
      [onChange],
    ),
  });

  return (
    <div className={styles['logo-uploader']}>
      <div
        {...getRootProps({
          className: classNames(styles['logo-uploader__upload-box'], {
            [styles['logo-uploader__upload-box--active']]: isDragActive,
            [styles['logo-uploader__upload-box--error']]: error,
          }),
        })}
      >
        <input {...getInputProps({ name })} />
        {value ? (
          <img
            className={styles['logo-uploader__logo']}
            src={URL.createObjectURL(value)}
            alt="logo"
          />
        ) : (
          <p className={styles['logo-uploader__placeholder']}>Logo</p>
        )}
      </div>
      {error && <p className={styles['logo-uploader__error-message']}>{error.message}</p>}
    </div>
  );
});
