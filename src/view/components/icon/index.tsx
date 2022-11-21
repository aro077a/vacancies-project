import React from 'react';

interface Props {
  name: string;
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const Icon: React.FC<Props> = ({ name, className, width = '100%', height = '100%' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={width}
    height={height}
    className={className}
  >
    <use xlinkHref={`/spritemap.svg#sprite-${name}`} />
  </svg>
);
