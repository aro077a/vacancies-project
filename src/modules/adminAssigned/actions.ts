import { createAction } from 'deox';

export const assignToMe = createAction(
  'adminAssigned/ASSIGN_TO_ME',
  resolve => (payload: boolean) => resolve(payload),
);
