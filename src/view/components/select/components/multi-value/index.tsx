import React, { memo } from 'react';
import { GroupTypeBase, MultiValueProps } from 'react-select';

import { Icon } from '~/view/components/icon';
import { Image } from '~/view/components/image';
import { SelectOption } from '~/view/components/select';

import styles from './styles.scss';

export const MultiValue: React.FC<MultiValueProps<SelectOption, GroupTypeBase<SelectOption>>> =
  memo(function MultiValue(props) {
    return (
      <div
        style={props.getStyles('multiValue', props)}
        className={styles['multi-value']}
        {...props.removeProps}
      >
        <div style={props.getStyles('multiValueLabel', props)}>
          {props.data.image !== undefined && (
            <Image
              type="company"
              className={styles['multi-value__image']}
              src={props.data.image}
              alt="icon"
            />
          )}
          {props.children}
        </div>
        <button style={props.getStyles('multiValueRemove', props)}>
          <Icon name="close" className={styles['multi-value__close-icon']} />
        </button>
      </div>
    );
  });
