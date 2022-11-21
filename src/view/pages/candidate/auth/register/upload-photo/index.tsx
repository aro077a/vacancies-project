import './styles.css';

import classNames from 'classnames';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import ReactCrop, { Crop } from 'react-image-crop';
import { RouteComponentProps } from 'react-router-dom';

import { skipPhotoUpload, uploadPhoto } from '~/modules/candidateRegistration/actions';
import { markRegistrationFinished } from '~/modules/registration/actions';
import { logout } from '~/modules/user/actions';
import { useDispatch, useSelector } from '~/store';
import { UploadCandidatePhotoFormValues } from '~/types/formValues';
import { Button } from '~/view/components/button';
import { Icon } from '~/view/components/icon';
import { RegistrationFinishedModal } from '~/view/pages/common/auth/login/components/registration-finished-modal';

import styles from './styles.scss';

export const UploadPhotoPage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const setupPagesCount = useSelector(state => state.registration.setupPagesCount);
  const uploadingPhoto = useSelector(state => state.candidateRegistration.uploadingPhoto);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [registrationFinished, setRegistrationFinished] = useState<boolean>(false);

  const [crop, setCrop] = useState<Partial<Crop>>({});
  const loadedImage = useRef<HTMLImageElement | null>(null);
  const { watch, setValue, handleSubmit } = useForm<UploadCandidatePhotoFormValues>({
    defaultValues: {
      file: null,
    },
  });
  const uploadedFile = watch('file');
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    multiple: false,
    accept: '.png, .jpg, .jpeg',
    maxSize: 20971520,
    onDrop: useCallback(
      (acceptedFiles: File[]) => {
        setValue('file', acceptedFiles[0], { shouldValidate: true });
      },
      [setValue],
    ),
  });

  const handleCropChange = useCallback((newCrop: Partial<Crop>) => {
    setCrop(newCrop);
  }, []);

  const handleImageLoaded = useCallback((image: HTMLImageElement) => {
    loadedImage.current = image;

    setCrop({ unit: '%', aspect: 1, width: 100 });

    return false;
  }, []);

  const removeUploadedFile = useCallback(() => {
    setValue('file', null, { shouldValidate: true });
  }, [setValue]);

  const getCroppedImage = useCallback(
    async (image: HTMLImageElement, crop: Crop): Promise<Blob | null> => {
      const canvas = document.createElement('canvas');

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = crop.width;
      canvas.height = crop.height;

      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

      const pixelRatio = window.devicePixelRatio;

      canvas.width = crop.width * pixelRatio;
      canvas.height = crop.height * pixelRatio;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height,
      );

      return new Promise(resolve => {
        canvas.toBlob(
          blob => {
            resolve(blob);
          },
          'image/png',
          1,
        );
      });
    },
    [],
  );

  const handleRegistrationFinishedModalClose = useCallback(() => {
    setIsSuccessModalOpen(false);
    dispatch(markRegistrationFinished());
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (registrationFinished) {
        handleRegistrationFinishedModalClose();
      }
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [handleRegistrationFinishedModalClose, registrationFinished]);

  const onSubmit = useCallback(async () => {
    if (uploadedFile && loadedImage.current) {
      const croppedImage = await getCroppedImage(loadedImage.current, crop as Crop);

      if (croppedImage) {
        dispatch(
          uploadPhoto.request({
            formValues: {
              file: new File([croppedImage], 'photo.png', { type: 'image/png' }),
            },
            onSuccess: () => {
              setIsSuccessModalOpen(true);
              setRegistrationFinished(true);
            },
          }),
        );
      }
    } else {
      dispatch(skipPhotoUpload());
      setIsSuccessModalOpen(true);
      setRegistrationFinished(true);
    }
  }, [crop, dispatch, getCroppedImage, uploadedFile]);

  const uploadedFileUrl = useMemo(() => {
    if (uploadedFile) {
      return URL.createObjectURL(uploadedFile);
    }

    return '';
  }, [uploadedFile]);

  return (
    <div className={styles['page']}>
      <div className={styles['page__header-wrapper']}>
        <h1 className={styles['page__title']}>
          Upload your photo <span>(optional)</span>
        </h1>
        <p className={styles['page__order-number']}>
          6<span>/{setupPagesCount}</span>
        </p>
      </div>
      <p className={styles['page__subtitle']}>
        Candidate photo isn't mandatory to upload but will make your listings looking much nicer if
        you do
      </p>
      {uploadedFile && (
        <div>
          <div className={styles['page__uploaded-file-wrapper']}>
            <ReactCrop
              circularCrop
              className={styles['page__react-crop']}
              src={uploadedFileUrl}
              crop={crop}
              onChange={handleCropChange}
              onImageLoaded={handleImageLoaded}
            />
            <button
              className={styles['page__remove-uploaded-file-button']}
              onClick={removeUploadedFile}
            >
              <Icon name="trash" className={styles['page__remove-uploaded-file-icon']} />
            </button>
          </div>
          <button className={styles['page__upload-other-file-button']} onClick={open}>
            Upload another photo
          </button>
        </div>
      )}
      <div
        {...getRootProps({
          className: classNames(styles['page__photo-upload-box'], {
            [styles['page__photo-upload-box--active']]: isDragActive,
            [styles['page__photo-upload-box--hidden']]: uploadedFile,
          }),
        })}
      >
        <input {...getInputProps()} />
        <Icon name="upload" className={styles['page__upload-icon']} />
        <p className={styles['page__upload-label']}>
          <span>Drag & drop a photo here or</span> <span>Browse</span> your files
        </p>
      </div>
      <p
        className={classNames(styles['page__upload-hint-message'], {
          [styles['page__upload-hint-message--expansed']]: uploadedFile,
        })}
      >
        Supported formats are PNG, JPG, JPEG. Max file size is 20 MB
      </p>
      <div className={styles['page__form-footer']}>
        <Button
          type="submit"
          title="Next"
          className={styles['page__form-footer-button']}
          loading={uploadingPhoto}
          onClick={handleSubmit(onSubmit)}
        />
      </div>
      <RegistrationFinishedModal
        visible={isSuccessModalOpen}
        onClose={handleRegistrationFinishedModalClose}
      />
    </div>
  );
};
