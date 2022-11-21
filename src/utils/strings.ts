export const trimSpaces = (text: string): string => text.replace(/ /g, '');

export const formatByMask = (text: string, mask: string): string => {
  const spaceIndexesInMask: number[] = [];
  const newValue: string[] = [];
  let additionalIndexesCountToSkip = 0;

  // take space indexes in mask
  mask.split('').forEach((char, charIndex) => {
    if (char === ' ') {
      spaceIndexesInMask.push(charIndex);
    }
  });

  // format text by mask
  for (let charIndex = 0; charIndex < text.length; charIndex++) {
    if (spaceIndexesInMask.includes(charIndex + additionalIndexesCountToSkip)) {
      additionalIndexesCountToSkip++;
      newValue.push(' ', text[charIndex]);
    } else {
      newValue.push(text[charIndex]);
    }
  }

  return newValue.join('');
};

export const getStaticCharsInMask = (mask: string): string => {
  const staticChars: string[] = [];

  for (let charIndex = 0; charIndex < mask.length; charIndex++) {
    if (mask[charIndex] === ' ' || mask[charIndex] === '*') {
      break;
    }

    staticChars.push(mask[charIndex]);
  }

  return staticChars.join('');
};

export const formatSalary = (salary: number | undefined | null): string | undefined => {
  if (salary !== undefined && salary !== null) {
    return `$${salary.toLocaleString('en-AU')}`;
  }

  return undefined;
};

export const formatAddedDate = (date: string | null): string | undefined => {
  if (date !== null) {
    return `${date} ago`;
  }

  return undefined;
};

export const transformSalaryFromStringToNumber = (salary: string): number => {
  return Number.parseFloat(salary.replaceAll('$', '').replace(',', '.'));
};

export const transformPercentFromStringToNumber = (percent: string): number => {
  return Number.parseFloat(percent.replace('%', ''));
};
