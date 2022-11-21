/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import React, { BaseSyntheticEvent, Fragment, memo } from 'react';

import { JobGroup, JobGroupPositionType } from '~/models/common';
import { Button } from '~/view/components/button';
import { Icon } from '~/view/components/icon';

import styles from './styles.scss';

type Props = {
  isMenuOpen: boolean;
  isSubMenuOpen: boolean;
  groupData: JobGroup[];
  openSubMenu: (e: BaseSyntheticEvent, id: number) => void;
  activeMenu: number;
  handleSelect: (id: number) => void;
  handleClear: () => void;
  handleSearch: () => void;
  className?: string;
  isJob: boolean;
  handleClick: (e: BaseSyntheticEvent) => void;
  selectedJobPositions: number[];
  selectedJobGrous: number[];
  handleSelectGroup: (e: BaseSyntheticEvent, id: number, items: JobGroupPositionType[]) => void;
};

export const JobDropdown: React.FC<Props> = memo(function JobDropdown({
  isMenuOpen,
  isSubMenuOpen,
  openSubMenu,
  groupData,
  activeMenu,
  handleClear,
  handleSelect,
  handleSearch,
  className,
  handleClick,
  isJob,
  selectedJobGrous,
  selectedJobPositions,
  handleSelectGroup,
}) {
  return (
    <>
      <div
        className={classNames(styles['job-dropdown'], className, {
          [styles['job-dropdown--show']]: isMenuOpen,
        })}
      >
        <ul className={styles['job-dropdown__primary']}>
          {groupData.map((item: JobGroup) => (
            <Fragment key={item.id}>
              <li
                className={styles['job-dropdown__primary-item']}
                onClick={e => openSubMenu(e, item.id)}
                role="presentation"
              >
                <p className={styles['job-dropdown__primary-item--name']}>{item.name}</p>
                <div
                  className={classNames(
                    styles['select-option'],
                    styles['select-option--accordion'],
                  )}
                >
                  <input
                    checked={Boolean(selectedJobGrous.find(num => num === item.id))}
                    onChange={e => handleSelectGroup(e, item.id, item.positions)}
                    type="checkbox"
                    className={styles['select-option__input']}
                  />
                </div>
                <div className={styles['job-dropdown__primary-item-body']}>
                  <span>{isJob ? item.jobsCount : item.candidatesCount}</span>
                  <Icon name="chevron-down" />
                </div>
              </li>

              <ul
                className={classNames(styles['job-dropdown__primary-child'], {
                  [styles['job-dropdown__primary-child--show']]:
                    isSubMenuOpen && item.id === activeMenu,
                })}
              >
                {item.positions.map((position: JobGroupPositionType) => (
                  <label
                    onClick={handleClick}
                    className={styles['job-dropdown__primary-child-item']}
                    key={position.id}
                    role="presentation"
                  >
                    <p className={styles['job-dropdown__primary-child-item--name']}>
                      {position.name}
                    </p>
                    <div className={styles['job-dropdown__primary-child-item-body']}>
                      <span>{isJob ? position.jobsCount : position.candidatesCount}</span>
                      <div className={styles['select-option']}>
                        <input
                          checked={Boolean(selectedJobPositions.find(num => num === position.id))}
                          onChange={() => handleSelect(position.id)}
                          type="checkbox"
                          className={styles['select-option__input']}
                        />
                      </div>
                    </div>
                  </label>
                ))}
              </ul>
            </Fragment>
          ))}
        </ul>
        <div className={styles['job-dropdown__buttons']}>
          <Button
            onClick={handleClear}
            variant="danger"
            title="Clear all"
            className={styles['modal-cancel__body-buttons-button']}
          />
          <Button
            onClick={handleSearch}
            variant="accent"
            title="Select filters"
            className={styles['modal-cancel__body-buttons-button']}
          />
        </div>
      </div>
    </>
  );
});
