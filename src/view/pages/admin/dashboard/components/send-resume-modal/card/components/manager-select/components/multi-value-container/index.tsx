import React from 'react';
import { components, GroupTypeBase, ValueContainerProps } from 'react-select';

import { SelectOption } from '~/view/components/select';

export const ValueContainer: React.VFC<
  ValueContainerProps<any, boolean, GroupTypeBase<SelectOption>>
> = ({ children, ...props }): React.ReactElement => {
  const managersCount = props.getValue().length;

  if (!managersCount) {
    return <components.ValueContainer {...props}>{children}</components.ValueContainer>;
  }

  return (
    <components.ValueContainer {...props}>{`${managersCount} managers`}</components.ValueContainer>
  );
};
