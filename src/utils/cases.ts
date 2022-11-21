type CasesTypes = 'snakeCase' | 'camelCase';

export const camelToSnakeCase = (str: string): string =>
  str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

export const snakeToCamelCase = (str: string): string =>
  str.replace(/([-_]?[_][a-z])/g, group => group.toUpperCase().replace('-', '').replace(/_/g, ''));

const isPlainObject = <T>(arg: T): boolean =>
  Object.prototype.toString.call(arg) === '[object Object]';

export function changeDataKeysCase<T>(data: T | unknown, type: CasesTypes): T;

export function changeDataKeysCase<T>(
  data: { [key: string]: T },
  type: CasesTypes,
): { [key: string]: T };

export function changeDataKeysCase<T>(data: T, type: CasesTypes): T;

export function changeDataKeysCase<T>(data: T, type: CasesTypes): T | T[] | { [x: string]: T } {
  if (Array.isArray(data)) {
    return data.map((item: T) => changeDataKeysCase<T>(item, type));
  }

  if (isPlainObject<T>(data)) {
    return Object.entries(data).reduce((acc: { [x: string]: T }, [key, value]) => {
      const newKey = type === 'snakeCase' ? camelToSnakeCase(key) : snakeToCamelCase(key);
      acc[newKey] = changeDataKeysCase<T>(value, type);
      return acc;
    }, {});
  }

  return data;
}
