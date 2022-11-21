import classNames from 'classnames';
import React, { memo, useState } from 'react';

import { EmailPart } from '~/models/admin';
import { downloadMailAttachment } from '~/modules/adminMessaging/actions';
import { useDispatch } from '~/store';
import { Icon } from '~/view/components/icon';
import { Image } from '~/view/components/image';

import { Dropdown } from './components/dropdown';
import styles from './styles.scss';

export type CardProps = {
  id: string;
  from: string;
  to: string;
  time: string;
  text: string;
  subject: string;
  parts?: EmailPart[];
};

export const Card: React.FC<CardProps> = memo(function Card({ from, text, time, to, parts, id }) {
  const dispatch = useDispatch();
  const [dropdownVisibility, setDropdownVisibility] = useState(false);

  const toggleDropdownVisibility = (): void => {
    setDropdownVisibility(prevValue => !prevValue);
  };

  const downloadAttachment = (id: string, fileName: string, attachmentId: string): void => {
    dispatch(downloadMailAttachment({ messageId: id, fileName, attachmentId }));
  };

  const receivers = to.split(',');
  const partiallyShowedReceivers = `${receivers[0]}, ${receivers[1]} and `;

  return (
    <div className={styles['card']}>
      <div className={styles['card__header']}>
        <Image className={styles['card__img']} type="company" src={null} alt="badge" />
        <div className={styles['card__mail-info']}>
          <p className={styles['card__mail-sender']}>{from}</p>
          <div className={styles['card__mail-receiver']}>
            <span className={styles['card__mail-to']}>To:</span>
            {receivers.length > 2 ? (
              <div className={styles['card__mail-receivers']}>
                <p className={styles['card__mail-receivers-showed']}>{partiallyShowedReceivers}</p>
                <button onClick={toggleDropdownVisibility} className={styles['modal__more-btn']}>
                  {receivers.length - 2} more
                  <Icon
                    className={styles['modal__arrow-down']}
                    name="chevron-down"
                    width={12}
                    height={6}
                  />
                </button>
              </div>
            ) : (
              <div className={styles['card__mail-receivers']}>
                {receivers[0]},{receivers[1]}
              </div>
            )}
          </div>
        </div>
        <time className={styles['card__time']}>{time}</time>
      </div>
      {dropdownVisibility && <Dropdown items={receivers} date={time} />}
      <p className={styles['card__body']} dangerouslySetInnerHTML={{ __html: text }} />
      {parts?.length !== 0 && (
        <div className={styles['card__attachments']}>
          {parts?.map(part => {
            return (
              <div
                key={part.filename}
                className={classNames(
                  styles['card__attachment'],
                  styles[`card__attachment--${part.mimeType}`],
                )}
                onClick={() => downloadAttachment(id, part.filename, part.body.attachmentId)}
              >
                {part.mimeType}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});
