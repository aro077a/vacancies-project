import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Common } from '~/services/api/Common';
import { ContactUsFormValues } from '~/types/formValues';
import { ContactUsValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { Input } from '~/view/components/input';
import { Textarea } from '~/view/components/textarea';

import styles from './styles.scss';

const sendContactUsForm = async (values: ContactUsFormValues): Promise<void> => {
  await Common.sendContactUsForm(values);
};

export const ContactForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, reset } = useForm<ContactUsFormValues>({
    defaultValues: {
      name: '',
      email: '',
      comment: '',
    },
    resolver: yupResolver(ContactUsValidation),
  });

  const onSubmit = (values: ContactUsFormValues): void => {
    setLoading(true);
    sendContactUsForm(values)
      .then(() => {
        setLoading(false);
        reset();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <h2 className={styles['form__title']}>Send us a message</h2>
      <Input
        className={styles['form__input']}
        placeholder="Your name"
        name="name"
        control={control}
        label="Name"
      />
      <Input
        className={styles['form__input']}
        placeholder="Your email"
        name="email"
        control={control}
        label="Email"
      />
      <Textarea
        maxLength={1000}
        placeholder="Write your comment here..."
        name="comment"
        control={control}
        label="Comment"
      />
      <Button
        onClick={handleSubmit(onSubmit)}
        className={styles['form__btn']}
        variant="accent"
        title="Send message"
        loading={loading}
      />
    </>
  );
};
