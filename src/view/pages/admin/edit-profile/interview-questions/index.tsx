import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useEffect } from 'react';
import { FieldPath, useForm } from 'react-hook-form';

import { editInterviewQuestions, getInterviewQuestions } from '~/modules/adminEditProfile/actions';
import { useDispatch, useSelector } from '~/store';
import { InterviewQuestionsFormValues } from '~/types/formValues';
import { iterateOverErrorDetailsEachKey } from '~/utils/errors';
import { InterviewQuestionsValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { Loader } from '~/view/components/loader';
import { Textarea } from '~/view/components/textarea';

import styles from './styles.scss';

export const InterviewQuestionsPage: React.FC = () => {
  const {
    interviewQuestions,
    gettingInterviewQuestionsLoading,
    editingInterviewQuestionsLoading,
    interviewQuestionsEditErrors,
  } = useSelector(state => state.adminProfile);
  const dispatch = useDispatch();
  const { control, setValue, handleSubmit, setError } = useForm<InterviewQuestionsFormValues>({
    defaultValues: {
      questionOne: '',
      questionTwo: '',
      questionThree: '',
      questionFour: '',
      explanation: '',
    },
    resolver: yupResolver(InterviewQuestionsValidation),
  });

  useEffect(() => {
    if (interviewQuestions !== null) {
      // eslint-disable-next-line camelcase
      const { question_1, question_2, question_3, question_4, explanation } = interviewQuestions;
      setValue('explanation', explanation);
      setValue('questionOne', question_1);
      setValue('questionTwo', question_2);
      setValue('questionThree', question_3);
      setValue('questionFour', question_4);
    }
  }, [interviewQuestions, setValue]);

  useEffect(() => {
    dispatch(getInterviewQuestions.request());
  }, [dispatch]);

  useEffect(() => {
    if (interviewQuestionsEditErrors) {
      iterateOverErrorDetailsEachKey<FieldPath<InterviewQuestionsFormValues>>(
        interviewQuestionsEditErrors,
        (key, value) => {
          setError(key, { type: 'validate', message: value });
        },
      );
    }
  }, [interviewQuestionsEditErrors, setError]);

  const onSubmit = useCallback(
    (values: InterviewQuestionsFormValues) => {
      dispatch(
        editInterviewQuestions.request({
          formValues: values,
        }),
      );
    },
    [dispatch],
  );

  return (
    <div className={styles['page']}>
      <div className={styles['page__header-wrapper']}>
        <h1 className={styles['page__title']}>Manage Interview Questions</h1>
      </div>
      <p className={styles['page__subtitle']}>
        Really get to know our candidates and take the time to figure out how we can help smash some
        career goals.
      </p>
      {gettingInterviewQuestionsLoading ? (
        <Loader loading />
      ) : (
        <>
          <div className={styles['page__form-rows']}>
            <Textarea
              name="explanation"
              placeholder=""
              label="Explanation"
              className={styles['page__form-rows-textarea']}
              control={control}
              maxLength={255}
            />
            <Textarea
              name="questionOne"
              placeholder=""
              label="Question 1"
              className={styles['page__form-rows-textarea']}
              control={control}
              maxLength={255}
            />
            <Textarea
              name="questionTwo"
              placeholder=""
              label="Question 2"
              className={styles['page__form-rows-textarea']}
              maxLength={255}
              control={control}
            />
            <Textarea
              name="questionThree"
              placeholder=""
              label="Question 3"
              className={styles['page__form-rows-textarea']}
              control={control}
              maxLength={255}
            />
            <Textarea
              name="questionFour"
              placeholder=""
              label="Question 4"
              className={styles['page__form-rows-textarea']}
              control={control}
              maxLength={255}
            />
          </div>
          <div className={styles['page__form-footer']}>
            <Button
              type="submit"
              title="Save changes"
              variant="accent"
              className={styles['page__form-footer-button']}
              loading={editingInterviewQuestionsLoading}
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </>
      )}
    </div>
  );
};
