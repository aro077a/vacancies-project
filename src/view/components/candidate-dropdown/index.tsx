import classNames from 'classnames';
import React, { Fragment, memo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { MyJob } from '~/models/company';
import { setSelectedCompanyCandidate } from '~/modules/companyCandidates/actions';
import { RootState } from '~/store/types';
import { Icon } from '~/view/components/icon';
import { RadioButton } from '~/view/components/radio-button';
import { useOutsideClick } from '~/view/hooks/useOutsideClick';

import styles from './styles.scss';

type Props = {
  items: MyJob[];
  className?: string;
  onChange: (selectedItem: MyJob) => void;
};

export const CandidateDropdown: React.FC<Props> = memo(function CandidateDropdown({
  items,
  className,
  onChange,
}) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { selectedCandidate } = useSelector((state: RootState) => state.companyCandidates);
  const dispatch = useDispatch();
  const wrapperRef = useOutsideClick<HTMLDivElement>({
    handler: useCallback(() => {
      if (dropdownVisible) {
        setDropdownVisible(false);
      }
    }, [dropdownVisible]),
  });

  const showDropdown = useCallback(() => {
    setDropdownVisible(prevValue => !prevValue);
  }, []);

  const handleSelectedItemChange = useCallback(
    (item: MyJob) => {
      onChange(item);
      dispatch(setSelectedCompanyCandidate.request(selectedCandidate!.id));
      setDropdownVisible(false);
    },
    [dispatch, onChange, selectedCandidate],
  );

  return (
    <div
      ref={wrapperRef}
      className={classNames(styles['candidate-wrapper'], className)}
      onClick={showDropdown}
    >
      <div className={styles['candidate-wrapper__label-wrapper']}>
        <p className={styles['candidate-wrapper__label']}>
          {selectedCandidate?.interested ? 'Interested' : 'Mark as interested'}
        </p>
        <Icon
          name="chevron-down"
          className={
            dropdownVisible
              ? styles['candidate-wrapper__chevron-icon']
              : styles['candidate-wrapper__chevron-icon-visible']
          }
        />
      </div>
      {dropdownVisible && (
        <div className={styles['candidate-wrapper__dropdown']}>
          <p className={styles['candidate-wrapper__text']}>I’m interested in candidate as:</p>
          {items.map((item, index) => (
            <Fragment key={item.id}>
              <div
                onClick={() => handleSelectedItemChange(item)}
                className={styles['candidate-wrapper__item-box']}
              >
                <RadioButton checked={selectedCandidate?.interestedId === item?.id} />
                <button className={classNames(styles['candidate-wrapper__dropdown-item'])}>
                  {item.positionName}
                </button>
              </div>
              {index !== items.length - 1 && (
                <div className={styles['candidate-wrapper__separator']} />
              )}
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
});
