import classNames from 'classnames';
import React, { memo, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';

import { SendMessageFormValues } from '~/types/formValues';
import { generateUuid } from '~/utils/helpers';
import { Button } from '~/view/components/button';
import { Icon } from '~/view/components/icon';
import { Image } from '~/view/components/image';
import { CenterModal } from '~/view/components/modals';
import { Textarea } from '~/view/components/textarea';
import { Video } from '~/view/components/video';

import styles from './styles.scss';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const SendMessageModal: React.FC<Props> = memo(function SendMessageModal({
  visible,
  onClose,
}) {
  const { control, watch, setValue } = useForm<SendMessageFormValues>({
    defaultValues: {
      additionalInformation: '',
      files: [],
    },
  });
  const uploadedFiles = watch('files');
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: '.png, .jpg, .jpeg, .mp4, .doc, .docx, .pdf',
    maxSize: 20971520,
    maxFiles: 10,
    onDrop: useCallback(
      (acceptedFiles: File[]) => {
        const acceptedFilesToUpload: File[] = [];

        acceptedFiles.forEach(acceptedFile => {
          const fileAlreadyUploaded = uploadedFiles.find(
            (uploadedFile: File) =>
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
      const filteredUploadedFiles = uploadedFiles.filter(
        (uploadedFile: File) => uploadedFile !== file,
      );

      setValue('files', filteredUploadedFiles, { shouldValidate: true });
    },
    [setValue, uploadedFiles],
  );

  return (
    <CenterModal
      title="Send Message"
      className={styles['modal-message']}
      visible={visible}
      onClose={onClose}
    >
      <div className={styles['modal-message__body']}>
        <div className={styles['modal-message__body-header']}>
          <p className={styles['modal-message__body-header-label']}>Your message</p>
          <div
            {...getRootProps({
              className: classNames(styles['page__cv-upload-box'], {
                [styles['page__cv-upload-box--active']]: isDragActive,
              }),
            })}
          >
            <input {...getInputProps()} />
            <p className={styles['modal-message__body-header-add']}>
              Add attachment <span>+</span>
            </p>
          </div>
        </div>

        <Textarea
          className={styles['modal-message__body-textarea']}
          name="additionalInformation"
          maxLength={1000}
          label=""
          placeholder=""
          control={control}
        />
        <div className={styles['modal-message__body-image-wrapper']}>
          {uploadedFiles.map((uploadedFile: any) => (
            <div className={styles['modal-message__body-image-content']} key={generateUuid()}>
              {uploadedFile.name.endsWith('mp4') ? (
                <Video
                  withDelete={false}
                  url={uploadedFile}
                  onDeleteClick={() => removeUploadedFile(uploadedFile)}
                  key={generateUuid()}
                  className={styles['modal__company-video']}
                />
              ) : (
                <Image
                  type="company"
                  className={styles['modal__company-image']}
                  src={URL.createObjectURL(uploadedFile)}
                  alt="company"
                />
              )}
              <div onClick={() => removeUploadedFile(uploadedFile)} key={uploadedFile.name}>
                <Icon name="close" />
              </div>
            </div>
          ))}
        </div>
        <Button variant="accent" title="Send" className={styles['modal-message__body-send']} />
      </div>
    </CenterModal>
  );
});
