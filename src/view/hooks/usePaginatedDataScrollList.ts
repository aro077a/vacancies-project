import { RefObject, useCallback, useEffect, useRef } from 'react';

type Params = {
  loadingData: boolean;
  useWindowScroll?: boolean;
  fetchDataFn: (initialFetch: boolean) => void;
};

type Return<T> = {
  scrollListRef: RefObject<T>;
};

export const usePaginatedDataScrollList = <T extends HTMLElement>({
  loadingData,
  useWindowScroll = false,
  fetchDataFn,
}: Params): Return<T> => {
  const listRef = useRef<T>(null);
  const scrolledToBottom = useRef(false);
  const initialDataFetched = useRef(false);
  const listHeightCheckingEffectActivated = useRef(false);

  const getTargetScrollElementInfo = useCallback(
    (listElement: T) => {
      if (useWindowScroll) {
        return {
          offsetHeight: window.innerHeight,
          scrollHeight: document.documentElement.scrollHeight,
          scrollTop: document.documentElement.scrollTop + 100,
        };
      }

      return {
        offsetHeight: listElement.offsetHeight,
        scrollHeight: listElement.scrollHeight,
        scrollTop: listElement.scrollTop + 100,
      };
    },
    [useWindowScroll],
  );

  useEffect(() => {
    initialDataFetched.current = true;

    fetchDataFn(true);
  }, [fetchDataFn]);

  useEffect(() => {
    if (!loadingData && initialDataFetched.current) {
      if (listHeightCheckingEffectActivated.current) {
        const listElement = listRef.current;

        if (listElement) {
          const { offsetHeight, scrollHeight } = getTargetScrollElementInfo(listElement);

          if (offsetHeight === scrollHeight) {
            fetchDataFn(false);
          }
        }
      } else {
        listHeightCheckingEffectActivated.current = true;
      }
    }
  }, [fetchDataFn, getTargetScrollElementInfo, loadingData]);

  useEffect(() => {
    const listElement = listRef.current;

    const handleScroll = (): void => {
      if (listElement) {
        const { scrollHeight, offsetHeight, scrollTop } = getTargetScrollElementInfo(listElement);

        if (offsetHeight + scrollTop >= scrollHeight) {
          if (!scrolledToBottom.current) {
            scrolledToBottom.current = true;
            fetchDataFn(false);
          }
        } else {
          scrolledToBottom.current = false;
        }
      }
    };

    if (useWindowScroll) {
      window.addEventListener('scroll', handleScroll);
    } else {
      listElement?.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (useWindowScroll) {
        window.removeEventListener('scroll', handleScroll);
      } else {
        listElement?.removeEventListener('scroll', handleScroll);
      }
    };
  }, [useWindowScroll, fetchDataFn, getTargetScrollElementInfo]);

  return { scrollListRef: listRef };
};
