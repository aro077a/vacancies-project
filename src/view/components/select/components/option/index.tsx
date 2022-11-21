import React, { memo } from 'react';
import { GroupTypeBase, OptionProps } from 'react-select';

import { Image } from '~/view/components/image';
import { SelectOption } from '~/view/components/select';

import styles from './styles.scss';

export const Option: React.FC<OptionProps<SelectOption, boolean, GroupTypeBase<SelectOption>>> =
  memo(function Option(props) {
    return (
      <div ref={props.innerRef} style={props.getStyles('option', props)} {...props.innerProps}>
        {props.data.image !== undefined && (
          <Image
            type="company"
            className={styles['option__image']}
            src={props.data.image}
            alt="icon"
          />
        )}
        {props.children}
      </div>
    );
  });
