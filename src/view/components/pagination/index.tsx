import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

import { Icon } from '~/view/components/icon';

import styles from './styles.scss';

type Props = {
  itemsCount: number;
  className?: string;
  itemsPerPage: number;
  currentPage: number | string;
  setCurrentPage: (page: number | string) => void;
};

export const Pagination: React.FC<Props> = ({
  itemsCount,
  className,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}) => {
  const pages = Math.ceil(itemsCount / itemsPerPage);

  const numberOfPages: number[] = [];
  for (let i = 1; i <= pages; i++) {
    numberOfPages.push(i);
  }

  const [arrOfCurrButtons, setArrOfCurrButtons] = useState<(string | number)[]>([]);

  useEffect(() => {
    let tempNumberOfPages: (string | number)[] = [...arrOfCurrButtons];

    const dotsInitial = '...';
    const dotsLeft = '... ';
    const dotsRight = ' ...';

    if (numberOfPages.length < 6) {
      tempNumberOfPages = numberOfPages;
    } else if (currentPage >= 1 && currentPage <= 3) {
      tempNumberOfPages = [1, 2, 3, 4, dotsInitial, numberOfPages.length];
    } else if (currentPage === 4) {
      const sliced = numberOfPages.slice(0, 5);
      tempNumberOfPages = [...sliced, dotsInitial, numberOfPages.length];
    } else if (currentPage > 4 && currentPage < numberOfPages.length - 2) {
      const sliced1 = numberOfPages.slice(Number(currentPage) - 2, Number(currentPage));
      const sliced2 = numberOfPages.slice(Number(currentPage), Number(currentPage) + 1);
      tempNumberOfPages = [1, dotsLeft, ...sliced1, ...sliced2, dotsRight, numberOfPages.length];
    } else if (currentPage > numberOfPages.length - 3) {
      const sliced = numberOfPages.slice(numberOfPages.length - 4);
      tempNumberOfPages = [1, dotsLeft, ...sliced];
    } else if (currentPage === dotsInitial) {
      setCurrentPage(Number(arrOfCurrButtons[arrOfCurrButtons.length - 3]) + 1);
    } else if (currentPage === dotsRight) {
      setCurrentPage(Number(arrOfCurrButtons[3]) + 2);
    } else if (currentPage === dotsLeft) {
      setCurrentPage(Number(arrOfCurrButtons[3]) - 2);
    }

    setArrOfCurrButtons(tempNumberOfPages);
  }, [currentPage]);

  const prevHandler = (): void => {
    if (currentPage <= 1) {
      setCurrentPage(currentPage);
    } else {
      setCurrentPage(Number(currentPage) - 1);
    }
  };

  const nextHandler = (): void => {
    if (currentPage >= numberOfPages.length) {
      setCurrentPage(currentPage);
    } else {
      setCurrentPage(Number(currentPage) + 1);
    }
  };

  const wrapperClassName = classNames(className, styles['pagination-wrapper']);

  return (
    <div className={wrapperClassName}>
      <button className={styles['pagination__prev-btn']} onClick={prevHandler}>
        <Icon className={styles['pagination__left-arrow']} name="chevron-right" />
      </button>
      <ul className={styles['pagination__page-list']}>
        {arrOfCurrButtons.map(item => {
          return (
            <button
              key={item}
              className={classNames(styles['pagination__page-item'], {
                [styles['pagination__page-item--active']]: item === currentPage,
              })}
              onClick={() => setCurrentPage(item)}
            >
              {item}
            </button>
          );
        })}
      </ul>
      <button className={styles['pagination__next-btn']} onClick={nextHandler}>
        <Icon className={styles['pagination__right-arrow']} name="chevron-right" />
      </button>
    </div>
  );
};
