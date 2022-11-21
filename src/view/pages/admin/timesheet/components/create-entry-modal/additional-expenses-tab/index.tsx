import classNames from 'classnames';
import React, { memo, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Control, UseFormRegister, UseFormSetValue, UseFormWatch, useWatch } from 'react-hook-form';

import { CreateEntryFormValues } from '~/types/formValues';
import { convertBytesToMegabytes, getFileTypeFromName } from '~/utils/helpers';
import { Icon } from '~/view/components/icon';
import { Input } from '~/view/components/input';

import styles from './styles.scss';

interface AdditionalExpensesTabProps {
  rowCount: number;
  control: Control<CreateEntryFormValues>;
  remove: (arg0: number) => void;
  index: number;
  watch: UseFormWatch<CreateEntryFormValues>;
  setValue: UseFormSetValue<CreateEntryFormValues>;
  register: UseFormRegister<CreateEntryFormValues>;
}
export const AdditionalExpensesTab: React.FC<AdditionalExpensesTabProps> = memo(
  function AdditionalExpensesTab({ rowCount, control, index, remove, setValue, register }) {
    const uploadedFiles = useWatch({
      control,
      name: `additionalExpenses.${index}.attachments`,
    });

    useEffect(() => {
      if (!uploadedFiles) {
        setValue(`additionalExpenses.${index}.attachments`, [], {
          shouldValidate: true,
        });
      }
    }, [setValue, uploadedFiles, index]);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: '.png, .jpg, .jpeg, .pdf, .doc, .docx',
      maxSize: 20971520,
      maxFiles: 10,
      onDrop: useCallback(
        (acceptedFiles: File[]) => {
          const acceptedFilesToUpload: File[] = [];

          acceptedFiles.forEach(acceptedFile => {
            const fileAlreadyUploaded = uploadedFiles?.find(
              (uploadedFile: File) =>
                uploadedFile.name === acceptedFile.name && uploadedFile.size === acceptedFile.size,
            );
            if (
              !fileAlreadyUploaded &&
              uploadedFiles?.length + acceptedFilesToUpload?.length < 10
            ) {
              acceptedFilesToUpload.push(acceptedFile);
              setValue(
                `additionalExpenses.${index}.attachments`,
                [...uploadedFiles, ...acceptedFiles],
                {
                  shouldValidate: true,
                },
              );
            }
          });
        },
        [setValue, index, uploadedFiles],
      ),
    });

    const removeUploadedFile = useCallback(
      (file: File) => {
        const filteredUploadedFiles = uploadedFiles?.filter(
          (uploadedFile: File) => uploadedFile !== file,
        );
        setValue(`additionalExpenses.${index}.attachments`, filteredUploadedFiles, {
          shouldValidate: true,
        });
      },
      [setValue, uploadedFiles, index],
    );
    const getUploadedFileTypeWrapperAdditionalStyle = useCallback((uploadedFile: File) => {
      const fileType = getFileTypeFromName(uploadedFile)?.toLowerCase();

      return {
        [styles['page__uploaded-file-type-wrapper--doc']]:
          fileType === 'doc' || fileType === 'docx',
        [styles['page__uploaded-file-type-wrapper--jpg']]:
          fileType === 'jpg' || fileType === 'jpeg',
        [styles['page__uploaded-file-type-wrapper--png']]: fileType === 'png',
      };
    }, []);

    return (
      <div className={styles['additional-tab']}>
        <div className={styles['additional-tab-row']}>
          <span>{rowCount}</span>
        </div>
        <div className={styles['additional-tab-fields']}>
          {index > 0 ? (
            <>
              <div className={styles['additional-tab-fields-line']} />
              <div className={styles['additional-tab-fields-remove']} onClick={() => remove(index)}>
                <Icon name="close" className={styles['additional-tab-fields-remove-icon']} />
                <span className={styles['additional-tab-fields-remove-text']}>Remove</span>
              </div>
            </>
          ) : (
            <></>
          )}
          <Input
            type="text"
            placeholder=""
            label="Expense Name:"
            className={styles['additional-tab-input']}
            control={control}
            {...register(`additionalExpenses.${index}.name` as const)}
          />
          <Input
            placeholder=""
            mask="$ ****"
            label="Price:"
            className={styles['additional-tab-input']}
            control={control}
            {...register(`additionalExpenses.${index}.price` as const)}
          />
          <div className={styles['additional-tab__attachments']}>
            <p className={styles['additional-tab__attachments-label']}>Attachments: </p>
            <div
              {...getRootProps({
                className: classNames(styles['additional-tab__attachments-upload-box'], {
                  [styles['page__attachments-upload-box--active']]: isDragActive,
                  [styles['page__attachments-upload-box--hidden']]: uploadedFiles?.length > 0,
                }),
              })}
            >
              <input {...getInputProps()} />
              <div className={styles['additional-tab__add-attachments']}>
                <p className={styles['additional-tab__add-attachments-text']}>
                  Click to upload attachments
                </p>
              </div>
            </div>
          </div>
          {uploadedFiles?.length > 0 && (
            <div>
              <>
                {uploadedFiles?.map((uploadedFile: File) => (
                  <div
                    key={`${uploadedFile.name}-${uploadedFile.size}`}
                    className={styles['additional-tab__uploaded-file-card']}
                  >
                    <div className={styles['additional-tab__uploaded-file']}>
                      <div
                        className={classNames(
                          styles['additional-tab__uploaded-file-type-wrapper'],
                          getUploadedFileTypeWrapperAdditionalStyle(uploadedFile),
                        )}
                      >
                        <p className={styles['additional-tab__uploaded-file-type']}>
                          {getFileTypeFromName(uploadedFile)?.toUpperCase()}
                        </p>
                      </div>
                      <div className={styles['additional-tab__uploaded-file-info-wrapper']}>
                        <p className={styles['additional-tab__uploaded-file-name']}>
                          {uploadedFile.name}
                        </p>
                        <p className={styles['additional-tab__uploaded-file-size']}>
                          {convertBytesToMegabytes(uploadedFile.size)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      className={styles['additional-tab__remove-uploaded-file-button']}
                      onClick={() => removeUploadedFile(uploadedFile)}
                    >
                      <Icon
                        name="trash"
                        className={styles['additional-tab__remove-uploaded-file-icon']}
                      />
                    </button>
                  </div>
                ))}
              </>
            </div>
          )}
        </div>
      </div>
    );
  },
);
