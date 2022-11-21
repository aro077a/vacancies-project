let counter = 0;

export function uniqueId(prefix: string): string;
export function uniqueId(): number;
export function uniqueId(prefix?: string): number | string {
  counter += 1;
  return prefix === undefined ? counter : `${prefix}${counter}`;
}
