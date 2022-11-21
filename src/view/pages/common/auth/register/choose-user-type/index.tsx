import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, RouteComponentProps } from 'react-router-dom';

import { UserType } from '~/models/common';
import { setUserType } from '~/modules/registration/actions';
import { useDispatch } from '~/store';
import { CommonRouter } from '~/utils/router';
import { ChooseUserTypePageFormValidation } from '~/utils/validations';
import { Button } from '~/view/components/button';
import { Checkbox } from '~/view/components/checkbox';
import { Icon } from '~/view/components/icon';
import { RadioButton } from '~/view/components/radio-button';

import styles from './styles.scss';

type UserTypeToChoose = {
  type: UserType;
  setupPagesCount: number;
};

const userTypes: UserTypeToChoose[] = [
  { type: UserType.COMPANY, setupPagesCount: 3 },
  { type: UserType.CANDIDATE, setupPagesCount: 6 },
];

export const ChooseUserTypePage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const [selectedUserType, setSelectedUserType] = useState(userTypes[0]);
  const { control, formState, handleSubmit } = useForm<{
    agreed: boolean;
  }>({
    defaultValues: {
      agreed: false,
    },
    resolver: yupResolver(ChooseUserTypePageFormValidation),
  });

  const handleUserTypeSelect = useCallback(
    (userType: UserTypeToChoose) => {
      if (selectedUserType.type !== userType.type) {
        setSelectedUserType(userType);
      }
    },
    [selectedUserType.type],
  );

  const onSubmit = useCallback(() => {
    dispatch(
      setUserType({
        type: selectedUserType.type,
        setupPagesCount: selectedUserType.setupPagesCount,
      }),
    );
  }, [dispatch, selectedUserType.setupPagesCount, selectedUserType.type]);

  return (
    <div className={styles['page']}>
      <div className={styles['page__header-wrapper']}>
        <h1 className={styles['page__title']}>Create your profile</h1>
        <p className={styles['page__order-number']}>
          1<span>/{selectedUserType.setupPagesCount}</span>
        </p>
      </div>
      <p className={styles['page__subtitle']}>
        Input the basic information and your account manager will be in touch to complete your
        profile.
      </p>
      <div className={styles['page__user-types-wrapper']}>
        <div
          className={styles['page__user-type-card']}
          onClick={() => handleUserTypeSelect(userTypes[0])}
        >
          <div
            className={classNames(
              styles['page__user-type-icon-wrapper'],
              styles['page__user-type-icon-wrapper--hiring-company'],
            )}
          >
            <Icon
              name="building"
              className={classNames(
                styles['page__user-type-icon'],
                styles['page__user-type-icon--hiring-company'],
              )}
            />
          </div>
          <div className={styles['page__user-type-card-title-wrapper']}>
            <h3 className={styles['page__user-type-card-title']}>I am a hiring company</h3>
            <RadioButton checked={selectedUserType.type === 'company'} />
          </div>
        </div>
        <div
          className={styles['page__user-type-card']}
          onClick={() => handleUserTypeSelect(userTypes[1])}
        >
          <div
            className={classNames(
              styles['page__user-type-icon-wrapper'],
              styles['page__user-type-icon-wrapper--candidate'],
            )}
          >
            <Icon
              name="user"
              className={classNames(
                styles['page__user-type-icon'],
                styles['page__user-type-icon--candidate'],
              )}
            />
          </div>
          <div className={styles['page__user-type-card-title-wrapper']}>
            <h3 className={styles['page__user-type-card-title']}>I am a candidate</h3>
            <RadioButton checked={selectedUserType.type === 'candidate'} />
          </div>
        </div>
      </div>
      <div className={styles['page__footer']}>
        <div className={styles['page__terms-checkbox-wrapper']}>
          <Checkbox name="agreed" control={control} />
          <p
            className={classNames(styles['page__terms-checkbox-label'], {
              [styles['page__terms-checkbox-label--error']]: formState.errors.agreed,
            })}
          >
            I agree to{' '}
            <Link
              className={classNames(styles['page__terms-checkbox-link'], {
                [styles['page__terms-checkbox-link--error']]: formState.errors.agreed,
              })}
              to={CommonRouter.termsPage}
            >
              Terms & Conditions
            </Link>{' '}
            and{' '}
            <Link
              className={classNames(styles['page__terms-checkbox-link'], {
                [styles['page__terms-checkbox-link--error']]: formState.errors.agreed,
              })}
              to={CommonRouter.privacyPage}
            >
              Policy Privacy
            </Link>
          </p>
        </div>
        <Button
          title="Next"
          className={styles['page__next-button']}
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </div>
  );
};
