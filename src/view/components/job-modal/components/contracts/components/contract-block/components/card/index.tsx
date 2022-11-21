import React, { memo, useCallback, useMemo } from 'react';

import { setContractStatus } from '~/modules/adminPipeline/actions';
import { useDispatch } from '~/store';
import { Button } from '~/view/components/button';
import { Image } from '~/view/components/image';

import styles from './styles.scss';

type Props = {
  id: number;
  img: null | string;
  status: boolean | null;
  name: string;
  location: string;
  isCompany: boolean;
};

export const Card: React.FC<Props> = memo(function Card({
  status,
  name,
  location,
  img,
  isCompany,
  id,
}) {
  const dispatch = useDispatch();
  const button = useMemo(() => {
    switch (status) {
      case null:
        return (
          <Button
            className={styles['card__btn--waiting']}
            title="Waiting approval"
            variant="accent"
          />
        );
      case true:
        return (
          <Button className={styles['card__btn--approved']} title="Approved" variant="primary" />
        );
      case false:
        return (
          <Button className={styles['card__btn--rejected']} title="Rejected" variant="danger" />
        );
      default:
        return null;
    }
  }, [status]);

  const isShowActionButton = status === true || status === false;

  const handleSetStatus = useCallback(
    (status: boolean) => {
      dispatch(setContractStatus.request({ isCompany, status, contractId: id }));
    },
    [dispatch, id, isCompany],
  );

  return (
    <div className={styles['card']}>
      <div className={styles['card__body']}>
        <div className={styles['card__info']}>
          <Image
            className={styles['card__user-img']}
            src={img}
            type={isCompany ? 'company' : 'candidate'}
            alt={`${name}'s photo`}
          />
          <div className={styles['card__user-info']}>
            <h4 className={styles['card__user-name']}>{name}</h4>
            <span className={styles['card__user-location']}>{location}</span>
          </div>
        </div>
        {button}
      </div>
      {!isShowActionButton && (
        <div className={styles['card__footer']}>
          <Button
            onClick={() => handleSetStatus(false)}
            variant="danger"
            className={styles['btn']}
            title="Reject"
          />
          <Button
            onClick={() => handleSetStatus(true)}
            variant="accent"
            className={styles['btn']}
            title="Approve contract"
          />
        </div>
      )}
    </div>
  );
});
