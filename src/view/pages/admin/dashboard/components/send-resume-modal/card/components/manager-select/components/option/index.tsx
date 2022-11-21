import React, { memo } from 'react';
import { components, GroupTypeBase, OptionProps } from 'react-select';

import { SelectOption } from '~/view/components/select';

import styles from './styles.scss';

export const Option: React.FC<OptionProps<SelectOption, boolean, GroupTypeBase<SelectOption>>> =
  memo(function Option(props) {
    return (
      <div className={styles['select-option']} ref={props.innerRef} {...props.innerProps}>
        <components.Option {...props}>
          <input
            type="checkbox"
            checked={props.isSelected}
            className={styles['select-option__input']}
            onChange={() => null}
          />
          <div className={styles['select-option__name']}>{props.data.label}</div>
        </components.Option>
      </div>
    );
  });
