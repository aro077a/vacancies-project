import classNames from 'classnames';
import React from 'react';

import styles from './styles.scss';

type Props = {
  title: string;
  description: string;
  list: listType[];
  additionalDesc?: string;
  link: boolean;
  listBold?: boolean;
  isAdditionalDescBold?: boolean;
  titleWrap?: boolean;
  listTypeNone?: boolean;
};

type listType = {
  id: string;
  info: string;
};

export const DescriptionCard: React.FC<Props> = ({
  title,
  description,
  list,
  link,
  additionalDesc,
  listBold,
  isAdditionalDescBold,
  titleWrap,
  listTypeNone,
}) => {
  return (
    <div className={styles['card-wrapper']}>
      {titleWrap ? (
        <h1 className={styles['card-wrapper--title']} dangerouslySetInnerHTML={{ __html: title }} />
      ) : (
        <h1 className={styles['card-wrapper--title']}>{title}</h1>
      )}

      {link ? (
        <p
          className={styles['card-wrapper--description']}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      ) : (
        <p className={styles['card-wrapper--description']}>{description}</p>
      )}
      <ul
        className={classNames(styles['card-wrapper--list'], {
          [styles['card-wrapper--list-none']]: listTypeNone,
        })}
      >
        {list.map((el: listType) => {
          return listBold ? (
            <li key={el.id} dangerouslySetInnerHTML={{ __html: el.info }} />
          ) : (
            <li key={el.id}>{el.info}</li>
          );
        })}
      </ul>
      {isAdditionalDescBold && additionalDesc ? (
        <p
          className={styles['card-wrapper--description']}
          dangerouslySetInnerHTML={{ __html: additionalDesc }}
        />
      ) : (
        <p className={styles['card-wrapper--add-description']}>{additionalDesc}</p>
      )}
    </div>
  );
};
