import { RefObject, useEffect, useRef } from 'react';

export const useAutoScroll = <T extends HTMLElement>(): RefObject<T> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (ref.current) {
        const { scrollWidth, offsetWidth, scrollLeft } = ref.current;
        const nextScrollLeft = scrollWidth > offsetWidth + scrollLeft ? scrollLeft + 1 : 0;

        ref.current.scroll(nextScrollLeft, 0);
      }
    }, 20);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return ref;
};
