import axios from 'axios';
import * as dateFns from 'date-fns';
import dateFnsFormat from 'date-fns/format';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';

import { License } from '~/models/candidate';
import { CV, DatePattern } from '~/models/common';

import { camelToSnakeCase } from './cases';

export const serializeParams = (params: Record<string, unknown>): string => {
  const serializedParams = Object.entries(params).map(
    paramEntry => `${paramEntry[0]}=${paramEntry[1]}`,
  );
  return serializedParams.join('&');
};

export const convertBytesToMegabytes = (
  bytes: number | undefined,
  numbersAfterDecimal = 1,
): string | 0 | undefined => {
  const megabyte = bytes && (bytes / 1048576).toFixed(numbersAfterDecimal);

  if (megabyte && !/[1-9]/g.test(megabyte)) {
    return convertBytesToMegabytes(bytes, numbersAfterDecimal + 1);
  }

  return megabyte;
};

export const convertBytesToKilobytes = (
  bytes: number | undefined,
  numbersAfterDecimal = 1,
): string | 0 | undefined => {
  const kilobyte = bytes && (bytes / 1024).toFixed(numbersAfterDecimal);

  if (kilobyte && !/[1-9]/g.test(kilobyte)) {
    return convertBytesToMegabytes(bytes, numbersAfterDecimal + 1);
  }

  return kilobyte;
};

export const getFileTypeFromName = (file: File | CV | License | null): string | undefined => {
  return file?.name?.slice(file?.name.lastIndexOf('.') + 1);
};

export const appendToFormData = (formData: FormData, data: any, parentDataKey = ''): void => {
  if (data?.constructor === Object) {
    Object.keys(data).forEach(objectKey => {
      appendToFormData(
        formData,
        data[objectKey],
        `${
          parentDataKey ? `${parentDataKey}${parentDataKey.endsWith(']') ? '' : '.'}` : ''
        }${camelToSnakeCase(objectKey)}`,
      );
    });
  } else if (Array.isArray(data)) {
    if (data.every(arrayItem => typeof arrayItem === 'string')) {
      formData.append(parentDataKey, JSON.stringify(data));
    } else if (data.every(arrayItem => typeof arrayItem === 'number')) {
      data.forEach(arrayItem => formData.append(parentDataKey, arrayItem));
    } else {
      data.forEach((arrayItem, index) => {
        appendToFormData(formData, arrayItem, `${parentDataKey}[${index}]`);
      });
    }
  } else if (data !== undefined) {
    formData.append(parentDataKey, data);
  }
};

export const formatDate = (workStart: Date, workEnd: Date, pattern: DatePattern): string => {
  return `${dateFnsFormat(new Date(workStart), pattern)} - ${dateFnsFormat(
    new Date(workEnd),
    pattern,
  )} (${formatDistanceStrict(new Date(workStart), new Date(workEnd))})`;
};

export function getDifferenceBetweenDates(startDate: Date, endDate: Date): string {
  const duration = dateFns.intervalToDuration({
    start: new Date(startDate),
    end: new Date(endDate),
  });

  let [years, months, days] = ['', '', ''];

  if (duration.years && duration.years > 0) {
    years = duration.years === 1 ? '1 year' : `${duration.years} years`;
  }
  if (duration.months && duration.months > 0) {
    months = duration.months === 1 ? '1 month' : `${duration.months} months`;
  }
  if (duration.days && duration.days > 0) {
    days = duration.days === 1 ? '1 day' : `${duration.days} days`;
  }

  const response = [years, months, days].filter(Boolean);

  switch (response.length) {
    case 3:
      response[0] += ',';
      response.pop();
      break;
    case 2:
      response[0] += ' and';
      break;
    default:
      break;
  }

  return response.join(' ');
}

export const dateOrString = (value: string | Date): string => {
  if (value instanceof Date) {
    return value.toJSON().split('T')[0];
  }

  if (value.includes('T')) {
    return value.split('T')[0];
  }

  return value;
};

export const timeConversionSlicker = (s: string): number => {
  const AMPM = s.slice(-2);
  const timeArr = s.slice(0, -2).split(':');
  if (AMPM === 'AM' && timeArr[0] === '12') {
    // catching edge-case of 12AM
    timeArr[0] = '00';
  } else if (AMPM === 'PM') {
    // everything with PM can just be mod'd and added with 12 - the max will be 23
    timeArr[0] = String((+timeArr[0] % 12) + 12);
  }
  timeArr.join(':');
  const formatedDate = new Date();

  return formatedDate.setHours(+timeArr[0], +timeArr[1]);
};

export const download = (url: string, name: string): void => {
  axios({
    url,
    method: 'GET',
    responseType: 'blob',
  }).then(response => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', name);
    link.click();
  });
};

export const generateUuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const getFileFormatFromUrl = (str: string): string => {
  return str.split('.').reverse()[0];
};

export const numberWithCommas = (x: number): string => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const getFirstDayOfTheWeek = (date: Date): Date => {
  const currentDate = new Date(date);
  const day = currentDate.getDay();

  const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);

  return new Date(currentDate.setDate(diff));
};
