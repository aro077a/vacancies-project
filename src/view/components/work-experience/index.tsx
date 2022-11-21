import React, { memo, useCallback, useRef, useState } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';

import { CreateCandidateProfessionalDetailsFormValues } from '~/types/formValues';
import { Icon } from '~/view/components/icon';

import { WorkExperienceCard } from './components/work-experience-card';
import { WorkExperienceModal } from './components/work-experience-modal';

type Props = {
  className: string;
  titleClassName: string;
  addButtonClassName: string;
  addButtonIconClassName: string;
  errorMessageClassName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & UseControllerProps<any>;

export const WorkExperience: React.FC<Props> = memo(function WorkExperience({
  className,
  titleClassName,
  addButtonClassName,
  addButtonIconClassName,
  errorMessageClassName,
  ...controllerProps
}) {
  const [workExperienceModalVisible, setWorkExperienceModalVisible] = useState(false);
  const workExperienceToEdit = useRef<
    CreateCandidateProfessionalDetailsFormValues['workExps'][number] | null
  >(null);

  const {
    field: { value: workExperiences, onChange },
    fieldState: { error },
  } = useController(
    controllerProps as UseControllerProps<
      Record<string, CreateCandidateProfessionalDetailsFormValues['workExps']>
    >,
  );
  const toggleWorkExperienceModalVisibility = useCallback(() => {
    setWorkExperienceModalVisible(prevValue => !prevValue);
  }, []);

  const addNewWorkExperience = useCallback(() => {
    workExperienceToEdit.current = null;
    toggleWorkExperienceModalVisibility();
  }, [toggleWorkExperienceModalVisibility]);

  const editWorkExperience = useCallback(
    (workExperience: CreateCandidateProfessionalDetailsFormValues['workExps'][number]) => {
      workExperienceToEdit.current = workExperience;
      toggleWorkExperienceModalVisibility();
    },
    [toggleWorkExperienceModalVisibility],
  );

  const handleWorkExperienceSave = useCallback(
    (newWorkExperience: CreateCandidateProfessionalDetailsFormValues['workExps'][number]) => {
      if (workExperienceToEdit.current) {
        onChange(
          (workExperiences as CreateCandidateProfessionalDetailsFormValues['workExps']).map(
            workExperience => {
              if (workExperience.id === newWorkExperience.id) {
                return newWorkExperience;
              }

              return workExperience;
            },
          ),
        );
      } else {
        onChange([
          ...(workExperiences as CreateCandidateProfessionalDetailsFormValues['workExps']),
          newWorkExperience,
        ]);
      }

      toggleWorkExperienceModalVisibility();
    },
    [onChange, toggleWorkExperienceModalVisibility, workExperiences],
  );

  const handleWorkExperienceDelete = useCallback(
    (id: number) => {
      onChange(
        (workExperiences as CreateCandidateProfessionalDetailsFormValues['workExps']).filter(
          workExperience => workExperience.id !== id,
        ),
      );

      toggleWorkExperienceModalVisibility();
    },
    [onChange, toggleWorkExperienceModalVisibility, workExperiences],
  );
  return (
    <>
      <div className={className}>
        <h2 className={titleClassName}>Work experience</h2>
        {(workExperiences as CreateCandidateProfessionalDetailsFormValues['workExps']).map(
          workExperience => (
            <WorkExperienceCard
              key={workExperience.id}
              workExperience={workExperience}
              onEdit={editWorkExperience}
            />
          ),
        )}
        <button className={addButtonClassName} onClick={addNewWorkExperience}>
          Add new work experience <Icon name="plus" className={addButtonIconClassName} />
        </button>
        {error && <p className={errorMessageClassName}>{error.message}</p>}
      </div>
      {workExperienceModalVisible && (
        <WorkExperienceModal
          workExperienceToEdit={workExperienceToEdit.current}
          visible={workExperienceModalVisible}
          onClose={toggleWorkExperienceModalVisibility}
          onSave={handleWorkExperienceSave}
          onDelete={handleWorkExperienceDelete}
        />
      )}
    </>
  );
});
