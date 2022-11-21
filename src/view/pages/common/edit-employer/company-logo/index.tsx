import './styles.css';

import classNames from 'classnames';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import ReactCrop, { Crop } from 'react-image-crop';

import { deleteEmployerLogo, updateEmployerLogo } from '~/modules/createEmployer/actions';
import { useDispatch, useSelector } from '~/store';
import { UploadCompanyLogoFormValues } from '~/types/formValues';
import { Button } from '~/view/components/button';
import { Icon } from '~/view/components/icon';
import { Loader } from '~/view/components/loader';

import styles from './styles.scss';

export const EditEmployerLogoPage: React.FC = () => {
  const dispatch = useDispatch();
  const { employerLogo, updatingEmployerLogo } = useSelector(state => state.createEmployer);
  const [crop, setCrop] = useState<Partial<Crop>>({});
  const [loading, setLoading] = useState(false);
  const loadedImage = useRef<HTMLImageElement | null>(null);
  const { watch, setValue, handleSubmit } = useForm<UploadCompanyLogoFormValues>({
    defaultValues: {
      file: null,
    },
  });

  useEffect(() => {
    convertUrlToFile(employerLogo?.file as string);
  }, [employerLogo]);

  const convertUrlToFile = async (url: string): Promise<void> => {
    if (employerLogo) {
      setLoading(true);
      const blobFromUrl = await fetch(url, { cache: 'no-cache' }).then(rawData => rawData.blob());
      const file = new File([blobFromUrl], employerLogo.file, { type: blobFromUrl.type });
      setValue('file', file);
      setLoading(false);
    }
  };
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

  const onSubmit = useCallback(async () => {
    if (uploadedFile && loadedImage.current) {
      const croppedImage = await getCroppedImage(loadedImage.current, crop as Crop);

      if (croppedImage) {
        dispatch(
          updateEmployerLogo.request({
            formValues: {
              file: new File([croppedImage], 'photo.png', { type: 'image/png' }),
            },
          }),
        );
      }
    } else if (uploadedFile === null) {
      dispatch(deleteEmployerLogo.request());
    }
  }, [crop, dispatch, getCroppedImage, uploadedFile]);

  const uploadedFileUrl = useMemo(() => {
    if (uploadedFile) {
      return URL.createObjectURL(uploadedFile);
    }

    return '';
  }, [uploadedFile]);

  if (loading) {
    return (
      <div className={styles['page']}>
        <div className={styles['page__header-wrapper']}>
          <h2 className={styles['page__title--edit-mode']}>Photo</h2>
        </div>
        <Loader loading />
      </div>
    );
  }

  return (
    <div className={styles['page']}>
      <div className={styles['page__header-wrapper']}>
        <h2 className={styles['page__title--edit-mode']}>Upload Company Logo</h2>
      </div>
      <>
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
            variant="accent"
            title="Save changes"
            className={styles['page__form-footer-button']}
            loading={updatingEmployerLogo}
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </>
    </div>
  );
};
