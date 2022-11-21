import React, { memo } from 'react';
import { GroupTypeBase, SingleValueProps } from 'react-select';

import { Image } from '~/view/components/image';
import { SelectOption } from '~/view/components/select';

import styles from './styles.scss';

export const SingleValue: React.FC<SingleValueProps<SelectOption, GroupTypeBase<SelectOption>>> =
  memo(function SingleValue(props) {
    return (
      <div style={props.getStyles('singleValue', props)} {...props.innerProps}>
        {props.data.image !== undefined && (
          <Image
            type="company"
            className={styles['single-value__image']}
            src={props.data.image}
            alt="icon"
          />
        )}
        {props.children}
      </div>
    );
  });
