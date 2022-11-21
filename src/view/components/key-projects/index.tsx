import React, { memo, useCallback, useRef, useState } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';

import { CreateCandidateProfessionalDetailsFormValues } from '~/types/formValues';
import { Icon } from '~/view/components/icon';

import { KeyProjectCard } from './components/key-project-card';
import { KeyProjectModal } from './components/key-project-modal';

type Props = {
  className: string;
  titleClassName: string;
  addButtonClassName: string;
  addButtonIconClassName: string;
  errorMessageClassName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & UseControllerProps<any>;

export const KeyProjects: React.FC<Props> = memo(function KeyProjects({
  className,
  titleClassName,
  addButtonClassName,
  addButtonIconClassName,
  errorMessageClassName,
  ...controllerProps
}) {
  const [keyProjectModalVisible, setKeyProjectModalVisible] = useState(false);
  const keyProjectToEdit = useRef<
    CreateCandidateProfessionalDetailsFormValues['keyProjects'][number] | null
  >(null);
  const {
    field: { value: keyProjects, onChange },
    fieldState: { error },
  } = useController(
    controllerProps as UseControllerProps<
      Record<string, CreateCandidateProfessionalDetailsFormValues['keyProjects']>
    >,
  );

  const toggleKeyProjectModalVisibility = useCallback(() => {
    setKeyProjectModalVisible(prevValue => !prevValue);
  }, []);

  const addNewKeyProject = useCallback(() => {
    keyProjectToEdit.current = null;
    toggleKeyProjectModalVisibility();
  }, [toggleKeyProjectModalVisibility]);

  const editKeyProject = useCallback(
    (keyProject: CreateCandidateProfessionalDetailsFormValues['keyProjects'][number]) => {
      keyProjectToEdit.current = keyProject;
      toggleKeyProjectModalVisibility();
    },
    [toggleKeyProjectModalVisibility],
  );

  const handleKeyProjectSave = useCallback(
    (newKeyProject: CreateCandidateProfessionalDetailsFormValues['keyProjects'][number]) => {
      if (keyProjectToEdit.current) {
        onChange(
          (keyProjects as CreateCandidateProfessionalDetailsFormValues['keyProjects']).map(
            keyProject => {
              if (keyProject.id === newKeyProject.id) {
                return newKeyProject;
              }

              return keyProject;
            },
          ),
        );
      } else {
        onChange([
          ...(keyProjects as CreateCandidateProfessionalDetailsFormValues['keyProjects']),
          newKeyProject,
        ]);
      }

      toggleKeyProjectModalVisibility();
    },
    [keyProjects, onChange, toggleKeyProjectModalVisibility],
  );

  const handleKeyProjectDelete = useCallback(
    (id: number) => {
      onChange(
        (keyProjects as CreateCandidateProfessionalDetailsFormValues['keyProjects']).filter(
          keyProject => keyProject.id !== id,
        ),
      );

      toggleKeyProjectModalVisibility();
    },
    [onChange, toggleKeyProjectModalVisibility, keyProjects],
  );

  return (
    <>
      <div className={className}>
        <h2 className={titleClassName}>Key Projects</h2>
        {(keyProjects as CreateCandidateProfessionalDetailsFormValues['keyProjects']).map(
          keyProject => (
            <KeyProjectCard key={keyProject.id} keyProject={keyProject} onEdit={editKeyProject} />
          ),
        )}
        <button className={addButtonClassName} onClick={addNewKeyProject}>
          Add new key project <Icon name="plus" className={addButtonIconClassName} />
        </button>
        {error && <p className={errorMessageClassName}>{error.message}</p>}
      </div>
      {keyProjectModalVisible && (
        <KeyProjectModal
          keyProjectToEdit={keyProjectToEdit.current}
          visible={keyProjectModalVisible}
          onClose={toggleKeyProjectModalVisibility}
          onSave={handleKeyProjectSave}
          onDelete={handleKeyProjectDelete}
        />
      )}
    </>
  );
});
