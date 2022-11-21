import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import React, { memo, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';

import { UploadCandidateLicensesFormValues } from '~/types/formValues';
import { UploadLicenseValidation } from '~/utils/validations';
import { CenterModal } from '~/view/components//modals';
import { Button } from '~/view/components/button';
import { DatePicker } from '~/view/components/date-picker';

import styles from './styles.scss';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  uploadedFiles: UploadCandidateLicensesFormValues[];
  setUploadedFiles: (arg0: UploadCandidateLicensesFormValues[]) => void;
  setResizable: (arg0: boolean) => void;
  resizable: boolean;
};

export const UploadLicenseModal: React.FC<Props> = memo(function CandidateModal({
  visible,
  onClose,
  title,
  resizable,
  uploadedFiles,
  setUploadedFiles,
  setResizable,
}) {
  const { reset, watch, setValue, control, handleSubmit } =
    useForm<UploadCandidateLicensesFormValues>({
      defaultValues: {
        file: null,
        expirationDate: new Date(),
      },
      resolver: yupResolver(UploadLicenseValidation),
    });

  useEffect(() => {
    if (!visible) {
      reset();
    }
  }, [visible, reset]);

  const file = watch('file');

  const { getRootProps, getInputProps } = useDropzone({
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

  const onSubmit = useCallback(
    (values: UploadCandidateLicensesFormValues) => {
      const formattedFiles = uploadedFiles.filter(
        (item: UploadCandidateLicensesFormValues) => item?.file?.name !== values?.file?.name,
      );
      setUploadedFiles([...formattedFiles, values]);
      onClose();
      reset();
    },
    [uploadedFiles, setUploadedFiles, onClose, reset],
  );

  return (
    <CenterModal
      className={classNames(styles['modal-license'], {
        [styles['modal-license--resizable']]: resizable,
      })}
      onClose={onClose}
      visible={visible}
      title={title}
    >
      <p className={styles['modal-license--upload-label']}>Upload file</p>
      <div
        {...getRootProps({
          className: classNames(styles['modal-license__box']),
        })}
      >
        <input {...getInputProps()} />
        <input
          type="text"
          name="fileName"
          placeholder="Select file..."
          value={file?.name || ''}
          onChange={() => null}
          className={styles['modal-license__input']}
        />
        {!file ? <p>Add file</p> : <p>Change</p>}
      </div>
      <DatePicker
        className={styles['modal-license__date-picker']}
        label="Expiry date"
        name="expirationDate"
        placeholder="Choose a date"
        control={control}
        setResizable={setResizable}
      />
      <Button
        variant="accent"
        title="Upload"
        className={styles['modal-license__upload-btn']}
        onClick={handleSubmit(onSubmit)}
      />
    </CenterModal>
  );
});
