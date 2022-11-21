import React, { memo } from 'react';

import buildingWithBackground from '~/view/assets/icons/building-with-background.svg';
import userOutline from '~/view/assets/icons/user-outline.svg';

type Props = {
  type: 'company' | 'candidate';
  className: string;
  src: string | null | undefined;
  alt: string;
};

export const Image: React.FC<Props> = memo(function Image({ type, className, src, alt }) {
  const defaultImage = type === 'candidate' ? userOutline : buildingWithBackground;

  return <img className={className} src={src || defaultImage} alt={alt} />;
});
