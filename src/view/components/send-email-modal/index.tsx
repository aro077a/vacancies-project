import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import React, { memo, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';

import { sendEmail } from '~/modules/adminMessaging/actions';
import { useDispatch, useSelector } from '~/store';
import { SendEmailFormValues } from '~/types/formValues';
import { generateUuid } from '~/utils/helpers';
import { SendEmailFormValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { Icon } from '~/view/components/icon';
import { Image } from '~/view/components/image';
import { Input } from '~/view/components/input';
import { CenterModal } from '~/view/components/modals';
import { Textarea } from '~/view/components/textarea';
import { Video } from '~/view/components/video';

import styles from './styles.scss';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const SendEmailModal: React.FC<Props> = memo(function SendEmailModal({ onClose, visible }) {
  const dispatch = useDispatch();
  const { sendingMessage, receiver } = useSelector(state => state.adminMessaging);

  const { control, handleSubmit, setValue, watch } = useForm<
    SendEmailFormValues & { files: File[] }
  >({
    defaultValues: {
      to: receiver || '',
      subject: '',
      messageText: '',
      files: [],
    },
    resolver: yupResolver(SendEmailFormValidation),
  });

  const uploadedFiles = watch('files');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: '.png, .jpg, .jpeg, .mp4, .gif, .pdf, .doc, .docx',
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

  const closeHandler = useCallback(() => {
    onClose();
  }, [onClose]);

  const onSubmit = useCallback(
    values => {
      dispatch(sendEmail.request({ formValues: values, cb: onClose }));
    },
    [dispatch, onClose],
  );

  const files = useMemo(() => {
    return uploadedFiles.map(uploadedFile => {
      const fileFormat = uploadedFile.name.split('.').reverse()[0];
      switch (fileFormat) {
        case 'mp4':
          return (
            <div className={styles['modal-message__body-image-content']} key={generateUuid()}>
              <Video
                url={URL.createObjectURL(uploadedFile)}
                onDeleteClick={() => removeUploadedFile(uploadedFile)}
                key={generateUuid()}
                className={styles['modal__company-video']}
                withDelete={false}
              />
              <div onClick={() => removeUploadedFile(uploadedFile)} key={uploadedFile.name}>
                <Icon name="close" />
              </div>
            </div>
          );
        case 'doc':
          return (
            <div className={styles['modal-message__body-image-content']} key={generateUuid()}>
              <div
                className={classNames(
                  styles['modal__company-image--no-preview'],
                  styles[`modal__company-image--${fileFormat}`],
                )}
              >
                {fileFormat}
              </div>
              <div onClick={() => removeUploadedFile(uploadedFile)} key={uploadedFile.name}>
                <Icon name="close" />
              </div>
            </div>
          );
        case 'docx':
          return (
            <div className={styles['modal-message__body-image-content']} key={generateUuid()}>
              <div
                className={classNames(
                  styles['modal__company-image--no-preview'],
                  styles[`modal__company-image--${fileFormat}`],
                )}
              >
                {fileFormat}
              </div>
              <div onClick={() => removeUploadedFile(uploadedFile)} key={uploadedFile.name}>
                <Icon name="close" />
              </div>
            </div>
          );
        case 'pdf':
          return (
            <div className={styles['modal-message__body-image-content']} key={generateUuid()}>
              <div
                className={classNames(
                  styles['modal__company-image--no-preview'],
                  styles[`modal__company-image--${fileFormat}`],
                )}
              >
                {fileFormat}
              </div>
              <div onClick={() => removeUploadedFile(uploadedFile)} key={uploadedFile.name}>
                <Icon name="close" />
              </div>
            </div>
          );
        default:
          return (
            <div className={styles['modal-message__body-image-content']} key={generateUuid()}>
              <Image
                type="company"
                className={styles['modal__company-image']}
                src={URL.createObjectURL(uploadedFile)}
                alt="company"
              />
              <div onClick={() => removeUploadedFile(uploadedFile)} key={uploadedFile.name}>
                <Icon name="close" />
              </div>
            </div>
          );
      }
    });
  }, [uploadedFiles, removeUploadedFile]);

  return (
    <CenterModal
      className={styles['modal']}
      title="Send email"
      visible={visible}
      onClose={closeHandler}
    >
      <Input
        hintMessage="Add comma to separate receivers email"
        control={control}
        name="to"
        placeholder="Type receiver`s email"
        label="To:"
        defaultValue={receiver}
      />
      <Input
        className={styles['modal__input']}
        control={control}
        name="subject"
        placeholder="Type subject"
        label="Subject:"
      />
      <div className={styles['modal__message-header']}>
        <p className={styles['modal__message-label']}>Your message</p>
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
        className={styles['modal__textarea-wrapper']}
        textAreaClassName={styles['modal__textarea']}
        control={control}
        maxLength={2000}
        name="messageText"
        placeholder="Your message"
      />
      <div className={styles['modal-message__body-image-wrapper']}>{files}</div>
      <Button
        className={styles['modal__submit-btn']}
        onClick={handleSubmit(onSubmit)}
        title="Send"
        variant="accent"
        loading={sendingMessage}
      />
    </CenterModal>
  );
});
