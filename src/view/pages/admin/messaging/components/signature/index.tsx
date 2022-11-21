import React, { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { getEmailSignature } from '~/modules/adminMessaging/actions';
import { useDispatch, useSelector } from '~/store';
import { Button } from '~/view/components/button';
import { Loader } from '~/view/components/loader';

import { SignatureModal } from './components/signature-modal';
import styles from './styles.scss';

export const EmailSignature: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const { loadingEmailSignature, emailSignature } = useSelector(state => state.adminMessaging);
  const [modalVisibility, setModalVisibility] = useState(false);

  useEffect(() => {
    dispatch(getEmailSignature.request());
  }, [dispatch]);

  const toggleModalVisibility = useCallback(() => {
    setModalVisibility(prevValue => !prevValue);
  }, []);

  return (
    <div className={styles['content']}>
      <h2 className={styles['content__title']}>Email signature</h2>
      {loadingEmailSignature ? (
        <Loader loading />
      ) : (
        <div className={styles['content__signature-wrapper']}>
          <div
            className={styles['content__signature']}
            dangerouslySetInnerHTML={{ __html: emailSignature! }}
          />
          <Button
            onClick={toggleModalVisibility}
            className={styles['content__btn']}
            variant="accent"
            title="Change signature"
          />
        </div>
      )}
      <SignatureModal onClose={toggleModalVisibility} visible={modalVisibility} />
    </div>
  );
};
