import React, { memo, useCallback, useState } from 'react';

import { updateEmailSignature } from '~/modules/adminMessaging/actions';
import { useDispatch, useSelector } from '~/store';
import { Button } from '~/view/components/button';
import { CenterModal } from '~/view/components/modals';

import styles from './styles.scss';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const SignatureModal: React.FC<Props> = memo(function SignatureModal({ visible, onClose }) {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');
  const updating = useSelector(state => state.adminMessaging.updatingEmailSignature);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSave = useCallback(() => {
    dispatch(updateEmailSignature.request(inputValue));
  }, [dispatch, inputValue]);

  return (
    <CenterModal
      onClose={handleClose}
      visible={visible}
      title="Change email signature"
      className={styles['modal']}
    >
      <input
        placeholder="Your signature"
        onChange={e => setInputValue(e.target.value)}
        className={styles['modal__input']}
      />
      <div className={styles['modal__footer']}>
        <Button onClick={handleClose} size="medium" title="Cancel" variant="secondary" />
        <Button
          loading={updating}
          onClick={handleSave}
          size="medium"
          title="Save"
          variant="accent"
        />
      </div>
    </CenterModal>
  );
});
