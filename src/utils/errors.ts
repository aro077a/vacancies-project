import { AxiosError } from 'axios';

import { ErrorResponse } from '~/types/responses';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const getErrorDetailsFromResponse = (error: any): ErrorResponse['detail'] | null => {
  if (error.isAxiosError) {
    const { response } = error as AxiosError<ErrorResponse>;

    if (response) {
      return response.data.detail;
    }
  }

  return null;
};

export const iterateOverErrorDetailsEachKey = <Key extends string>(
  details: ErrorResponse['detail'],
  callback: (key: Key, value: string) => void,
  parentKey = '',
): void => {
  if (typeof details !== 'string') {
    Object.keys(details).forEach(key => {
      if (details[key]?.constructor === Object) {
        iterateOverErrorDetailsEachKey(
          details[key] as ErrorResponse['detail'],
          callback,
          `${parentKey}${key}.`,
        );
      } else {
        callback(`${parentKey}${key}` as Key, (details[key] as string[])[0]);
      }
    });
  }
};
