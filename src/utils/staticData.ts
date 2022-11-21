import { SelectOption } from '~/view/components/select';

export const availabilityOptions: SelectOption[] = [
  { value: 0, label: 'Immediate' },
  { value: 1, label: '1 week' },
  { value: 2, label: '2 weeks' },
  { value: 3, label: '3 weeks' },
  { value: 4, label: '4 weeks or longer' },
];

export const projectValueOptions: SelectOption[] = [
  { value: 1, label: 'N/A' },
  { value: 2, label: '<1m' },
  { value: 3, label: '$1m - $10m' },
  { value: 4, label: '$10m - $25m' },
  { value: 5, label: '$25m - $50m' },
  { value: 6, label: '$50m - $100m' },
  { value: 7, label: '$100m +' },
];
