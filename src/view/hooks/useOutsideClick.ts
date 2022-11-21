import { RefObject, useEffect, useRef } from 'react';

type Params = {
  handler: (event: MouseEvent | TouchEvent) => void;
};

export const useOutsideClick = <T extends HTMLElement>({ handler }: Params): RefObject<T> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent): void => {
      if (!ref.current) {
        return;
      }

      if (event.target === ref.current) {
        return;
      }

      if (ref.current.contains(event.target as Node | null)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler]);

  return ref;
};
